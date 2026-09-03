import express from 'express'
import cors from 'cors'
import nodemailer from 'nodemailer'
import bodyParser from 'body-parser'

const app = express()
const PORT = process.env.PORT || 5178

// Simple in-memory rate limiter per IP
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX) || 5
const RATE_LIMIT_WINDOW_SEC = Number(process.env.RATE_LIMIT_WINDOW_SEC) || 60 * 60 // 1 hour
const attempts = new Map()

app.use(cors())
app.use(bodyParser.json())

function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function pruneOld(times) {
  const cutoff = Date.now() / 1000 - RATE_LIMIT_WINDOW_SEC
  return times.filter((t) => t > cutoff)
}

app.post('/api/contact', async (req, res) => {
  try {
    const ip = (req.headers['x-forwarded-for'] as string) || req.ip || req.socket.remoteAddress || 'unknown'

    // rate limit
    const now = Date.now() / 1000
    const times = pruneOld(attempts.get(ip) || [])
    times.push(now)
    attempts.set(ip, times)
    if (times.length > RATE_LIMIT_MAX) {
      return res.status(429).json({ ok: false, error: 'Too many requests from this IP, please try again later.' })
    }

    const { name, email, message, subject, phone, hp, ...rest } = req.body || {}

    // Honeypot check (bots)
    if (hp) return res.status(400).json({ ok: false, error: 'Spam detected' })

    // Basic validation
    if (!email || !message) return res.status(400).json({ ok: false, error: 'Missing required fields: email and message' })
    if (!isValidEmail(email)) return res.status(400).json({ ok: false, error: 'Invalid email address' })
    if (typeof message !== 'string' || message.length > 5000) return res.status(400).json({ ok: false, error: 'Invalid message' })
    if (name && name.length > 200) return res.status(400).json({ ok: false, error: 'Name too long' })
    if (subject && subject.length > 200) return res.status(400).json({ ok: false, error: 'Subject too long' })
    if (phone && String(phone).length > 40) return res.status(400).json({ ok: false, error: 'Phone too long' })

    // Ensure SMTP configuration exists — this server is email-only
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.TO_EMAIL) {
      console.error('SMTP not configured')
      return res.status(500).json({ ok: false, error: 'Server email not configured' })
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })

    const mailBody = `New contact form submission\n\nName: ${name || 'N/A'}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nSubject: ${subject || 'N/A'}\nMessage:\n${message}\n\nOther fields:\n${JSON.stringify(rest, null, 2)}`

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.TO_EMAIL,
      subject: process.env.EMAIL_SUBJECT_PREFIX ? `${process.env.EMAIL_SUBJECT_PREFIX} New contact` : 'Website contact',
      text: mailBody,
    })

    return res.json({ ok: true })
  } catch (err) {
    console.error('Contact handler error', err)
    return res.status(500).json({ ok: false, error: 'Internal server error' })
  }
})

app.listen(PORT, () => {
  console.log(`Notification server (email-only) listening on http://localhost:${PORT}`)
})
