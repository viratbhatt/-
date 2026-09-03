import React, { ReactNode, useState } from 'react';
import portfolioData from '../data/portfolio.json';
import './Portfolio.css';
import { useScrollBackground, useReveal } from '../hooks';
import { NavLink } from 'react-router-dom';

const { 
  personal, 
  navigation: NAV_ITEMS, 
  experiences: EXPERIENCES, 
  skillGroups: SKILL_GROUPS, 
  contact, 
  experienceSubheading, 
  skillsSubheading, 
  footer: FOOTER_TEXT 
} = portfolioData;

/* ── Reusable UI Components ────────────────────────────────── */

/** Progress bar for scroll position */
function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);
  
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const p = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(p);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1.5 bg-transparent z-[100]">
      <div 
        className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300" 
        style={{ width: `${progress}%` }} 
      />
    </div>
  );
}

/** Interactive background elements */
function InteractiveBackground({ background }: { background: any }) {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {background.orbs.map((orb: any, i: number) => (
        <div
          key={i}
          className="bg-orb absolute"
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            backgroundColor: orb.color,
            transform: `scale(${orb.scale}) translate(${background.mouseOffsetX}px, ${background.mouseOffsetY}px)`,
            transitionDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
}

/** Navigation Menu Button */
function MenuButton({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={open ? 'Close menu' : 'Open menu'}
      aria-expanded={open}
      onClick={onClick}
      className="lg:hidden flex flex-col items-center justify-center gap-1 p-2 text-gray-300 hover:text-white"
    >
      <span className={`block w-7 h-0.5 bg-current transition-all ${open ? 'rotate-45 translate-y-1.5' : ''}`} />
      <span className={`block w-7 h-0.5 bg-current transition-all ${open ? 'opacity-0' : 'opacity-100'}`} />
      <span className={`block w-7 h-0.5 bg-current transition-all ${open ? '-rotate-45 -translate-y-2' : ''}`} />
    </button>
  );
}

/* ── Section Components ────────────────────────────────── */

function HeroSection() {
  const { ref, isVisible } = useReveal();
  return (
    <section 
      ref={ref} 
      className={`min-h-[90vh] flex items-center justify-center px-4 relative transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="max-w-4xl w-full text-center">
        <p className="text-indigo-400 font-semibold tracking-widest uppercase mb-4 animate-fade-up">
          {personal.tagline}
        </p>
        <h1 className="text-6xl md:text-8xl font-extrabold text-white mb-6 tracking-tighter animate-fade-up-delay-1">
          {personal.firstName} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">{personal.lastName}</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-up-delay-2">
          {personal.title}
        </p>
        <div className="flex justify-center gap-4 animate-fade-up-delay-3">
          <a href="#contact" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-semibold transition-all">
            Get In Touch
          </a>
          <a href="#experience" className="border border-slate-700 hover:bg-slate-800 text-white px-8 py-3 rounded-full font-semibold transition-all">
            View Experience
          </a>
        </div>
      </div>
    </section>
  );
}

function ExperienceSection() {
  const { ref, isVisible } = useReveal();
  return (
    <section 
      ref={ref} 
      id="experience" 
      className={`py-24 px-4 max-w-6xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="mb-16">
        <h2 className="text-4xl font-bold text-white mb-4">Experience</h2>
        <p className="text-slate-400">{experienceSubheading}</p>
      </div>
      <div className="grid gap-12">
        {EXPERIENCES.map((exp, i) => (
          <div key={i} className="group p-8 rounded-3xl border border-slate-800 bg-slate-900/40 hover:border-indigo-500/30 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-white">{exp.title}</h3>
                <p className="text-indigo-400">{exp.company}</p>
              </div>
              <span className="text-sm text-slate-500">{exp.period}</span>
            </div>
            <p className="text-slate-300 mb-4">{exp.location}</p>
            <ul className="space-y-2">
              {exp.highlights.map((h, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-400">
                  <span className="text-indigo-500">•</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function SkillsSection() {
  const { ref, isVisible } = useReveal();
  const [activeTab, setActiveTab] = useState(SKILL_GROUPS[0].label);

  return (
    <section 
      ref={ref} 
      id="skills" 
      className={`py-24 px-4 max-w-6xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="mb-16">
        <h2 className="text-4xl font-bold text-white mb-4">Skills</h2>
        <p className="text-slate-400">{skillsSubheading}</p>
      </div>
      <div className="space-y-8">
        <div className="flex flex-wrap gap-4 border-b border-slate-800 pb-4">
          {SKILL_GROUPS.map((group) => (
            <button
              key={group.label}
              onClick={() => setActiveTab(group.label)}
              className={`pb-2 text-sm font-medium transition-all duration-300 ${
                activeTab === group.label 
                  ? 'text-indigo-400 border-b-2 border-indigo-400' 
                  : 'text-slate-400 hover:text-white border-b-2 border-transparent'
              }`}
            >
              {group.label}
            </button>
          ))}
        </div>
        <div className="min-h-[200px] animate-fade-up">
          {SKILL_GROUPS.map((group) => (
            <div
              key={group.label}
              className={activeTab === group.label ? 'block' : 'hidden'}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.skills.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-slate-800/50 border border-slate-700/50 text-slate-200 rounded-full text-sm hover:bg-slate-800 transition-colors">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection({ handleSubmit, sending, status }: any) {
  const { ref, isVisible } = useReveal();
  return (
    <section 
      ref={ref} 
      id="contact" 
      className={`py-24 px-4 max-w-4xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="bg-slate-900/60 border border-slate-800 p-8 md:p-12 rounded-3xl shadow-2xl">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-4xl font-bold text-white mb-4">{contact.heading}</h2>
            <p className="text-slate-400 mb-8">{contact.description}</p>
            <div className="space-y-4">
              <p className="text-sm text-slate-500">Email</p>
              <a href={`mailto:${contact.email.address}`} className="text-indigo-400 hover:underline">{contact.email.address}</a>
              <p className="text-sm text-slate-500">LinkedIn</p>
              <a href={contact.linkedin.url} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">linkedin.com/in/virat-bhatt6235235qd</a>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
              <input required name="name" type="text" className="w-full bg-slate-800 border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
              <input required name="email" type="email" className="w-full bg-slate-800 border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Message</label>
              <textarea required name="message" rows={4} className="w-full bg-slate-800 border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-indigo-500" />
            </div>
            <button 
              type="submit" 
              disabled={sending}
              className="w-full bg-indigo-600 py-3 rounded-lg font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {sending ? 'Sending...' : contact.submitLabel}
            </button>
            {status && <p className={status.type === 'success' ? 'text-green-400' : 'text-red-400'}>{status.message}</p>}
          </form>
        </div>
      </div>
    </section>
  );
}

const Home = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const { background } = useScrollBackground();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setStatus(null);
    try {
      const form = new FormData(e.currentTarget as HTMLFormElement);
      const payload = Object.fromEntries(form.entries());
      const endpoint = (import.meta as any).env?.VITE_CONTACT_ENDPOINT || 'http://localhost:5178/api/contact';
      
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to send');
      setStatus({ type: 'success', message: 'Thanks — your message was sent.' });
      (e.currentTarget as HTMLFormElement).reset();
    } catch (err) {
      setStatus({ type: 'error', message: 'Sending failed. Please try again later.' });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="portfolio-container relative overflow-x-hidden">
      <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30">
        <InteractiveBackground background={background} />
        <ScrollProgressBar />

        <header className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
          <nav className="navbar">

            <div>
              {NAV_ITEMS.map((n) => (
                <NavLink key={n.href} to={n.href}>
                  {n.label}
                </NavLink>
              ))}
            </div>
            <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
              <MenuButton open={menuOpen} onClick={() => setMenuOpen(false)} />
            </button>
          </nav>
        </header>

        <main className="relative z-10">
          <HeroSection />
          <ExperienceSection />
          <SkillsSection />
          <ContactSection handleSubmit={handleSubmit} sending={sending} status={status} />
        </main>

        <footer className="py-20 text-center border-t border-slate-800/50">
          <p className="text-slate-500 text-sm">
            {FOOTER_TEXT.replace('{year}', new Date().getFullYear().toString())}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Home;
