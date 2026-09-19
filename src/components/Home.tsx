import { useEffect, useMemo, useState } from 'react'
import portfolioData from '../data/portfolio.json'
import { projects, type Project } from '../data/projects'

const { personal, experiences: EXPERIENCES, skillGroups: SKILL_GROUPS, contact, skillsSubheading } = portfolioData

type Theme = 'light' | 'dark'

const navigationItems = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Lab', href: '#lab' },
  { label: 'Contact', href: '#contact' },
  { label: 'Pokémon', href: '/pokemon' },
]

const labCards = [
  { title: 'Local AI / Ollama', blurb: 'Exploring practical, local-first AI experiences and interface patterns.' },
  { title: 'RAG and AI assistants', blurb: 'Testing grounded responses, document retrieval, and prompt architecture.' },
  { title: 'AWS / LocalStack', blurb: 'Learning service boundaries, integration flows, and cloud-native patterns.' },
  { title: 'Spring Boot backend projects', blurb: 'Building maintainable APIs and backend systems with clear contracts.' },
  { title: 'Cybersecurity learning', blurb: 'Studying safe-by-default engineering habits and defensive system design.' },
]

const careerHighlights = [
  'Senior Software Engineer',
  'React and TypeScript',
  'Java and Spring Boot',
  'AWS and cloud development',
  'AI and RAG experimentation',
  'Frontend architecture',
  'Testing and accessibility',
]

function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light'
    const stored = window.localStorage.getItem('portfolio-theme') as Theme | null
    if (stored === 'light' || stored === 'dark') return stored
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    window.localStorage.setItem('portfolio-theme', theme)
  }, [theme])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        setSelectedProject(null)
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  useEffect(() => {
    if (!selectedProject) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [selectedProject])

  const currentYear = useMemo(() => new Date().getFullYear(), [])

  return (
    <div className="site-shell">
      <header className="topbar">
        <div className="container topbar-inner">
          <a className="brand" href="#top" aria-label="Virat Bhatt home">
            Virat Bhatt
          </a>

          <nav
            className={`nav-panel ${menuOpen ? 'is-open' : ''}`}
            aria-label="Main navigation"
            aria-expanded={menuOpen}
          >
            {navigationItems.map((item) => {
              const isRoute = item.href.startsWith('/');
              if (isRoute) {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className="nav-link"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                )
              }

              return (
                <a
                  key={item.label}
                  href={item.href}
                  className="nav-link"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              )
            })}
          </nav>

          <div className="nav-actions">
            <a className="button button-secondary" href={`mailto:${contact.email.address}?subject=${encodeURIComponent('Resume request')}`}>
              Resume
            </a>
            <button
              type="button"
              className="theme-toggle"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
            >
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
            <button
              type="button"
              className="menu-toggle"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((current) => !current)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <main id="top" className="page-shell">
        <section className="hero section">
          <div className="container hero-inner">
            <div className="hero-copy">
              <p className="eyebrow">SENIOR SOFTWARE ENGINEER</p>
              <h1>Building thoughtful digital experiences with code.</h1>
              <p className="lede">
                I&apos;m Virat Bhatt, a Senior Software Engineer focused on React, TypeScript, Java,
                Spring Boot, AWS, and AI-powered applications.
              </p>

              <div className="cta-row">
                <a href="#work" className="button button-primary">
                  View my work
                </a>
                <a
                  href={`mailto:${contact.email.address}?subject=${encodeURIComponent('Resume request')}`}
                  className="button button-secondary"
                >
                  Download resume
                </a>
              </div>

              <a href="#contact" className="mini-link" aria-label="Connect with Virat Bhatt">
                Let&apos;s connect →
              </a>
            </div>

            <div className="hero-panel" aria-label="Profile summary panel">
              <div className="profile-card">
                <div className="profile-header">
                  <span className="profile-badge">VB</span>
                  <div>
                    <strong>Virat Bhatt</strong>
                    <span>Senior Software Engineer</span>
                  </div>
                </div>
                <div className="profile-body">
                  <p>
                    Building reliable software systems, thoughtful frontend architecture, and AI-driven
                    experiences that serve people rather than distract them.
                  </p>
                </div>
                <ul className="profile-list">
                  <li>React</li>
                  <li>TypeScript</li>
                  <li>Java</li>
                  <li>Spring Boot</li>
                  <li>AWS</li>
                  <li>AI</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="work" className="section">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">Selected work</p>
              <h2>Selected work</h2>
              <p>
                A selection of projects exploring frontend architecture, cloud systems, and
                AI-powered applications.
              </p>
            </div>

            <div className="project-grid">
              {projects.map((project) => (
                <article key={project.title} className="project-card">
                  <div className="project-preview" aria-hidden="true">
                    <div className="preview-glow" />
                    <span>{project.category}</span>
                  </div>

                  <div className="project-body">
                    <div className="project-meta">
                      <span>{project.category}</span>
                    </div>
                    <h3>{project.title}</h3>
                    <p>{project.summary}</p>
                    <div className="tag-row">
                      {project.technologies.map((tech) => (
                        <span key={tech} className="tag">
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="project-actions">
                      <button type="button" className="text-link" onClick={() => setSelectedProject(project)}>
                        View case study
                      </button>
                      {project.links?.github ? (
                        <a href={project.links.github} target="_blank" rel="noreferrer">
                          GitHub
                        </a>
                      ) : (
                        <span className="muted-link">GitHub</span>
                      )}
                      {project.links?.live ? (
                        <a href={project.links.live} target="_blank" rel="noreferrer">
                          Live demo
                        </a>
                      ) : (
                        <span className="muted-link">Demo unavailable</span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="section section-alt">
          <div className="container about-grid">
            <div className="section-heading left-align">
              <p className="eyebrow">About</p>
              <h2>A little about me</h2>
            </div>

            <div className="about-copy">
              <p>
                I&apos;m a Senior Software Engineer with experience building modern web applications and
                backend services. My work spans React, TypeScript, Java, Spring Boot, AWS, and AI
                experimentation.
              </p>
              <p>
                I enjoy solving complex engineering problems, improving frontend architecture, and
                building systems that are reliable, maintainable, and easy to use.
              </p>
            </div>

            <div className="highlight-grid">
              {careerHighlights.map((item) => (
                <div key={item} className="highlight-item">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="lab" className="section">
          <div className="container">
            <div className="section-heading left-align">
              <p className="eyebrow">The Lab</p>
              <h2>The Lab</h2>
              <p>Experiments, learning projects, and ideas I&apos;m exploring outside of my day-to-day work.</p>
            </div>

            <div className="lab-grid">
              {labCards.map((lab) => (
                <article key={lab.title} className="lab-card">
                  <span className="lab-index">0{labCards.indexOf(lab) + 1}</span>
                  <h3>{lab.title}</h3>
                  <p>{lab.blurb}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="skills" className="section section-alt">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">Capabilities</p>
              <h2>Skills</h2>
              <p>{skillsSubheading}</p>
            </div>

            <div className="skills-layout">
              {SKILL_GROUPS.map((group) => (
                <div key={group.label} className="skill-group">
                  <h3>{group.label}</h3>
                  <div className="tag-row">
                    {group.skills.map((skill) => (
                      <span key={skill} className="tag tag-soft">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="section contact-section">
          <div className="container contact-shell">
            <div className="contact-copy">
              <p className="eyebrow">Contact</p>
              <h2>Let&apos;s build something meaningful.</h2>
              <p>
                Have a project, an opportunity, or an interesting engineering problem? I&apos;d love to
                connect.
              </p>
              <div className="contact-actions">
                <a href={`mailto:${contact.email.address}`} className="button button-primary">
                  Email me
                </a>
                <a href={contact.linkedin.url} target="_blank" rel="noreferrer" className="button button-secondary">
                  LinkedIn
                </a>
                <a
                  href={`mailto:${contact.email.address}?subject=${encodeURIComponent('Resume request')}`}
                  className="button button-secondary"
                >
                  Download resume
                </a>
              </div>
            </div>

            <form
              className="contact-form"
              onSubmit={(event) => {
                event.preventDefault()
                const form = event.currentTarget as HTMLFormElement
                const formData = new FormData(form)
                const name = String(formData.get('name') ?? '').trim()
                const email = String(formData.get('email') ?? '').trim()
                const message = String(formData.get('message') ?? '').trim()

                if (!name || !email || !message) {
                  window.alert('Please complete all fields before sending.')
                  return
                }

                const subject = encodeURIComponent(`Portfolio inquiry from ${name}`)
                const body = encodeURIComponent(
                  `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
                )
                window.location.href = `mailto:${contact.email.address}?subject=${subject}&body=${body}`
              }}
            >
              <label>
                <span>Name</span>
                <input type="text" name="name" placeholder="Your name" autoComplete="name" />
              </label>
              <label>
                <span>Email</span>
                <input type="email" name="email" placeholder="you@example.com" autoComplete="email" />
              </label>
              <label>
                <span>Message</span>
                <textarea name="message" rows={5} placeholder="Tell me about your project or opportunity..." />
              </label>
              <button type="submit" className="button button-primary submit-button">
                Send message
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div>
            <strong>Virat Bhatt</strong>
            <p>Senior Software Engineer</p>
          </div>
          <div className="footer-links">
            <a href={`mailto:${contact.email.address}`}>Email</a>
            <a href={contact.linkedin.url} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>
          <p>© {currentYear} Virat Bhatt</p>
        </div>
      </footer>

      {selectedProject && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="case-study-title">
          <div className="case-study-modal">
            <button type="button" className="close-modal" onClick={() => setSelectedProject(null)} aria-label="Close case study">
              ×
            </button>
            <div className="case-study-layout">
              <div className="case-study-main">
                <span className="modal-tag">{selectedProject.category}</span>
                <h3 id="case-study-title">{selectedProject.title}</h3>
                <p className="case-summary">{selectedProject.description}</p>

                <div className="meta-block">
                  <h4>Project overview</h4>
                  <p>{selectedProject.description}</p>
                </div>

                <div className="meta-block">
                  <h4>Problem</h4>
                  <p>{selectedProject.problem}</p>
                </div>

                <div className="meta-block">
                  <h4>My role</h4>
                  <p>{selectedProject.role}</p>
                </div>

                <div className="meta-block">
                  <h4>Technical approach</h4>
                  <p>{selectedProject.approach}</p>
                </div>

                <div className="meta-block">
                  <h4>Architecture</h4>
                  <p>{selectedProject.architecture}</p>
                </div>

                <div className="meta-block">
                  <h4>Key challenges</h4>
                  <ul>
                    {selectedProject.challenges.map((challenge) => (
                      <li key={challenge}>{challenge}</li>
                    ))}
                  </ul>
                </div>

                <div className="meta-block">
                  <h4>What I learned</h4>
                  <ul>
                    {selectedProject.learnings.map((learning) => (
                      <li key={learning}>{learning}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <aside className="case-study-side">
                <div className="panel-block">
                  <h4>Technologies</h4>
                  <div className="tag-row">
                    {selectedProject.technologies.map((technology) => (
                      <span key={technology} className="tag tag-soft">
                        {technology}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="panel-block">
                  <h4>Links</h4>
                  <div className="modal-links">
                    {selectedProject.links?.github ? (
                      <a href={selectedProject.links.github} target="_blank" rel="noreferrer">
                        GitHub
                      </a>
                    ) : (
                      <span>GitHub: private or unavailable</span>
                    )}
                    {selectedProject.links?.live ? (
                      <a href={selectedProject.links.live} target="_blank" rel="noreferrer">
                        Live demo
                      </a>
                    ) : (
                      <span>Live demo: not available</span>
                    )}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
