#!/usr/bin/env python3
"""
Baby Monitor Video Server with Cry Detection

This server:
1. Streams video from webcam using OpenCV
2. Performs audio analysis for baby cry detection
3. Provides MJPEG streaming endpoint for video
4. Provides WebSocket endpoints for real-time alerts
"""

import io
import threading
import time
import json
import asyncio
import collections
from flask import Flask, Response, request, jsonify, render_template, render_template_string
from flask_cors import CORS
from flask_sock import Sock
import cv2
import numpy as np
import sounddevice as sd
import librosa
import warnings

# Suppress warnings
warnings.filterwarnings('ignore')

app = Flask(__name__)
CORS(app)
sock = Sock(app)

# Global state
video_frame = None
video_lock = threading.Lock()
audio_buffer = collections.deque(maxlen=1024)
is_streaming = True
cry_detected = False

# Audio parameters for cry detection
SAMPLE_RATE = 44100
BLOCK_SIZE = 2048  # 2048 samples per block
CRY_THRESHOLD = 0.6  # Sensitivity threshold for cry detection
MIN_CRY_DURATION = 0.5  # Minimum cry duration in seconds
MAX_CRY_DURATION = 5.0  # Maximum cry duration in seconds


def get_video_frame():
    """Capture a frame from the webcam."""
    global video_frame
    cap = cv2.VideoCapture(0)
    
    if not cap.isOpened():
        print("Error: Could not open webcam")
        return
    
    while is_streaming:
        ret, frame = cap.read()
        if ret:
            # Flip horizontally for natural view
            frame = cv2.flip(frame, 1)
            # Resize for performance
            frame = cv2.resize(frame, (640, 480))
            # Encode as JPEG
            ret, buffer = cv2.imencode('.jpg', frame)
            if ret:
                with video_lock:
                    video_frame = buffer.tobytes()
        else:
            time.sleep(0.03)
    
    cap.release()


def capture_audio():
    """Capture audio from microphone for cry detection."""
    global audio_buffer, is_streaming
    
    try:
        device_info = sd.query_devices(None, 'input')
        default_input = device_info['defaultInputDevice']
        
        def audio_callback(indata, frames, time_info, status):
            if status:
                print(f"Audio status: {status}")
            audio_buffer.append(indata.copy())
        
        with sd.InputStream(samplerate=SAMPLE_RATE, blocksize=BLOCK_SIZE,
                           device=default_input, callback=audio_callback):
            while is_streaming:
                time.sleep(0.1)
    except Exception as e:
        print(f"Audio capture error: {e}")


def detect_cry(audio_data):
    """
    Detect baby cry from audio data using spectral features.
    Returns True if cry is detected with confidence score.
    """
    try:
        # Convert to numpy array and flatten
        audio = np.array(audio_data).flatten()
        
        # Ensure we have enough data
        if len(audio) < BLOCK_SIZE:
            return False, 0.0
        
        # Resample if needed
        target_sr = 8000  # Lower sample rate for feature extraction
        audio_resampled = librosa.resample(audio, orig_sr=SAMPLE_RATE, target_sr=target_sr)
        
        # Extract MFCC features (Mel-frequency cepstral coefficients)
        mfccs = librosa.feature.mfcc(y=audio_resampled, sr=target_sr, n_mfcc=13)
        
        # Take mean across time dimension
        mfcc_mean = np.mean(mfccs, axis=1)
        
        # Calculate spectral centroid (brightness indicator)
        spectral_centroid = librosa.feature.spectral_centroid(y=audio_resampled, sr=target_sr)[0]
        spectral_centroid_mean = np.mean(spectral_centroid)
        
        # Calculate spectral rolloff
        spectral_rolloff = librosa.feature.spectral_rolloff(y=audio_resampled, sr=target_sr)[0]
        spectral_rolloff_mean = np.mean(spectral_rolloff)
        
        # Calculate zero crossing rate
        zcr = librosa.feature.zero_crossing_rate(audio_resampled)[0]
        zcr_mean = np.mean(zcr)
        
        # Calculate RMS energy
        rms = librosa.feature.rms(y=audio_resampled)[0]
        rms_mean = np.mean(rms)
        
        # Simple cry detection logic based on typical baby cry characteristics:
        # - Higher frequency content (spectral centroid)
        # - Moderate energy (not too quiet, not too loud)
        # - Rapid frequency changes (high ZCR)
        # - Specific MFCC patterns
        
        cry_score = 0.0
        
        # Spectral centroid: higher values indicate more high-frequency content (typical of cries)
        if spectral_centroid_mean > 2000:
            cry_score += 0.3
        
        # Zero crossing rate: cries have rapid changes
        if zcr_mean > 0.1:
            cry_score += 0.2
        
        # RMS energy: cries have moderate energy
        if 0.01 < rms_mean < 0.5:
            cry_score += 0.2
        
        # Spectral rolloff: indicates frequency distribution
        if spectral_rolloff_mean > 1500:
            cry_score += 0.2
        
        # MFCC pattern check (simplified)
        # Baby cries typically have specific MFCC patterns
        if len(mfcc_mean) > 0:
            # Check for high Mel frequencies
            if np.any(mfcc_mean[:4] > 0.5):
                cry_score += 0.1
        
        # Normalize score to 0-1 range
        cry_score = min(cry_score, 1.0)
        
        is_cry = cry_score >= CRY_THRESHOLD
        
        return is_cry, cry_score
        
    except Exception as e:
        print(f"Cry detection error: {e}")
        return False, 0.0


def cry_detection_loop():
    """Main loop for continuous cry detection."""
    global audio_buffer, cry_detected, is_streaming
    
    cry_start_time = None
    cry_duration = 0
    
    while is_streaming:
        if len(audio_buffer) >= BLOCK_SIZE:
            # Get latest audio block
            audio_block = np.array(audio_buffer)[-BLOCK_SIZE:]
            
            # Detect cry
            is_cry, confidence = detect_cry(audio_block)
            
            if is_cry:
                if cry_start_time is None:
                    cry_start_time = time.time()
                
                cry_duration = time.time() - cry_start_time
                
                # Only alert for sustained cries (more than MIN_CRY_DURATION)
                if cry_duration >= MIN_CRY_DURATION and cry_duration <= MAX_CRY_DURATION:
                    cry_detected = True
                    print(f"🚨 Baby cry detected! Confidence: {confidence:.2f}, Duration: {cry_duration:.1f}s")
            else:
                if cry_start_time is not None:
                    # Cry ended
                    duration = time.time() - cry_start_time
                    print(f"Cry ended after {duration:.1f}s")
                
                cry_start_time = None
                cry_detected = False
        
        time.sleep(0.05)  # Process every 50ms


def generate_video_frames():
    """Generate video frames for MJPEG streaming."""
    global video_frame, is_streaming
    
    while is_streaming:
        with video_lock:
            if video_frame is not None:
                frame = video_frame
            else:
                # Return a blank frame if no video yet
                frame = b'\xff\xd8\xff\xe0\x00\x10\x4a\x46\x49\x46\x00\x01\x01\x01\x00\x48\x00\x48\x00\x00\xff\xd9'
        
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')
        time.sleep(0.033)  # ~30 FPS


@app.route('/')
def index():
    """Video streaming home page."""
    return render_template('index.html')


@app.route('/video_feed')
def video_feed():
    """Video streaming endpoint."""
    return Response(generate_video_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/detect_cry', methods=['POST'])
def detect_cry_endpoint():
    """Endpoint to check current cry detection status."""
    global cry_detected
    return jsonify({
        'cry_detected': cry_detected,
        'timestamp': time.time()
    })


clients = set()


@app.route('/status')
def status():
    """Get server status."""
    return jsonify({
        'streaming': is_streaming,
        'cry_detected': cry_detected,
        'connected_clients': len(clients)
    })


@sock.route('/ws')
def websocket(ws):
    """WebSocket endpoint for real-time cry detection updates."""
    clients.add(ws)
    try:
        while is_streaming:
            cry_status = {
                'cry_detected': cry_detected,
                'timestamp': time.time()
            }
            ws.send(json.dumps(cry_status))
            time.sleep(0.5)  # Update every 500ms
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        clients.discard(ws)


if __name__ == '__main__':
    # Start video capture thread
    video_thread = threading.Thread(target=get_video_frame, daemon=True)
    video_thread.start()
    
    # Start audio capture thread
    audio_thread = threading.Thread(target=capture_audio, daemon=True)
    audio_thread.start()
    
    # Start cry detection loop
    cry_thread = threading.Thread(target=cry_detection_loop, daemon=True)
    cry_thread.start()
    
    # Start Flask server
    print("🚀 Starting Baby Monitor Server...")
    print("   - Video stream available at: http://localhost:5000/video_feed")
    print("   - Web interface at: http://localhost:5000/")
    print("   - Cry detection API at: POST http://localhost:5000/detect_cry")
    
    app.run(host='0.0.0.0', port=5001, debug=False, threaded=True)