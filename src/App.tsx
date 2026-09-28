import { useEffect, useRef, useState, type MouseEvent } from 'react'
import Lenis from 'lenis'
import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  Code2,
  Copy,
  Database,
  Download,
  ExternalLink,
  FolderKanban,
  GitBranch,
  Home,
  Mail,
  MapPin,
  MonitorSmartphone,
  PencilLine,
  Sparkles,
  TestTube2,
  Wrench,
} from 'lucide-react'

const assetPath = (fileName: string) => `${import.meta.env.BASE_URL}${fileName}`
const githubAvatarUrl = 'https://avatars.githubusercontent.com/u/125168781?s=800'
const avatarRefreshInterval = 5 * 60 * 1000

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'about', label: 'Education', icon: BriefcaseBusiness },
  { id: 'tools', label: 'Tools', icon: Wrench },
  { id: 'contact', label: 'Contact', icon: PencilLine },
] as const

type NavItem = (typeof navItems)[number]['id']

const projects = [
  {
    number: '01',
    title: 'Chronos',
    kind: 'Automated university class scheduling',
    summary: 'ARM-guided genetic scheduling with tested APIs and AI-assisted Jira/GitHub MCP ticketing.',
    stack: 'Python · FastAPI · PostgreSQL · React · TypeScript · DEAP · Mlxtend',
    href: 'https://github.com/saiimonn/Chronos',
    visual: 'chronos',
  },
  {
    number: '02',
    title: 'Caledoro',
    kind: 'Offline-first mobile productivity',
    summary: 'Tasks, focus sessions, calendar tools, widgets, and AI-assisted task breakdown.',
    stack: 'Flutter · Dart · Riverpod · Hive · Gemini API',
    href: 'https://github.com/choonhows/Caledoro',
    visual: 'caledoro',
  },
  {
    number: '03',
    title: 'NitPicker',
    kind: 'PhilNITS FE preparation platform',
    summary: 'Mock exams, explanations, analytics, and previous-exam browsing.',
    stack: 'React · TypeScript · Vite · Tailwind CSS',
    href: 'https://nitpicker.dcism.org',
    visual: 'nitpicker',
  },
] as const

const education = [
  {
    date: 'APR 2026',
    label: 'Certification',
    title: 'PhilNITS FE Passer',
    place: 'Fundamental Information Technology Engineers Examination',
    description: 'A formal foundation across computing, systems, software, and information technology.',
  },
  {
    date: '2024 - PRESENT',
    label: 'Undergraduate',
    title: 'BS Computer Science',
    place: 'University of San Carlos',
    description: 'Third-year Computer Science student in Cebu City, with graduation expected in 2027.',
  },
  {
    date: '2022 - 2024',
    label: 'Senior High School',
    title: 'TVL - ICT',
    place: 'University of San Jose-Recoletos',
    description: 'Technical-Vocational-Livelihood studies in Information and Communication Technology.',
  },
] as const

const tools = [
  { title: 'Flutter + Dart', description: 'Mobile and offline-first apps', icon: MonitorSmartphone },
  { title: 'React + TypeScript', description: 'Frontend web development', icon: Code2 },
  { title: 'FastAPI + PostgreSQL', description: 'SQLAlchemy APIs', icon: Database },
  { title: 'GitHub + Jira', description: 'Version control and ticketing', icon: GitBranch },
  { title: 'Pytest + Vitest', description: 'Unit and integration testing', icon: TestTube2 },
  { title: 'OpenCode + MCP', description: 'AI-assisted delivery workflows', icon: Sparkles },
] as const

const workingNotes = [
  {
    title: 'Build with the user in mind',
    description: 'Responsive behavior, useful feedback, sensible defaults, and clear interaction states are treated as part of implementation rather than final decoration.',
    meta: 'UI implementation · usability',
  },
  {
    title: 'Test beyond the happy path',
    description: 'I review functionality, interaction, persistence, and edge cases while refining software so that the final experience is more dependable.',
    meta: 'Functional testing · debugging',
  },
  {
    title: 'Keep delivery traceable',
    description: 'I use AI-assisted MCP workflows to connect Jira tickets with GitHub branches, pull requests, review, CI checks, and completion while keeping every change open to deliberate human review.',
    meta: 'OpenCode · Jira/GitHub MCP',
  },
] as const

function SplitHeading({ id, first, second }: { id: string; first: string; second: string }) {
  return (
    <h2 className="split-heading" id={id}>
      <span>{first}</span>
      <span>{second}</span>
    </h2>
  )
}

function ProjectPreview({ visual, title }: { visual: (typeof projects)[number]['visual']; title: string }) {
  if (visual === 'chronos') {
    return (
      <div className="project-preview chronos-preview" aria-hidden="true">
        <span className="chronos-brand">
          <strong>Chronos</strong>
          <small>USC DCISM Command</small>
        </span>
      </div>
    )
  }

  return (
    <div className={`project-preview ${visual}-preview`}>
      <img
        src={assetPath(visual === 'caledoro' ? 'caledoro-logo.png' : 'nitpicker-logo.svg')}
        alt={`${title} logo`}
        loading="lazy"
      />
    </div>
  )
}

function App() {
  const [active, setActive] = useState<NavItem>('home')
  const [avatarSrc, setAvatarSrc] = useState(() => assetPath('profile.jpg'))
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    let disposed = false
    let objectUrl: string | null = null

    const refreshAvatar = async () => {
      try {
        const response = await fetch(`${githubAvatarUrl}&refresh=${Date.now()}`, {
          cache: 'no-store',
          headers: { Accept: 'image/*' },
          signal: AbortSignal.timeout(5_000),
        })

        if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) return

        const nextObjectUrl = URL.createObjectURL(await response.blob())
        if (disposed) {
          URL.revokeObjectURL(nextObjectUrl)
          return
        }

        if (objectUrl) URL.revokeObjectURL(objectUrl)
        objectUrl = nextObjectUrl
        setAvatarSrc(nextObjectUrl)
      } catch {
        // Keep the local avatar when GitHub is unavailable.
      }
    }

    refreshAvatar()
    const interval = window.setInterval(refreshAvatar, avatarRefreshInterval)

    return () => {
      disposed = true
      window.clearInterval(interval)
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [])

  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      respectReducedMotion: true,
      stopInertiaOnNavigate: true,
    })
    lenisRef.current = lenis

    return () => {
      lenisRef.current = null
      lenis.destroy()
    }
  }, [])

  const scrollToSection = (event: MouseEvent<HTMLAnchorElement>, id: NavItem) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

    const target = document.getElementById(id)
    if (!target) return

    event.preventDefault()
    setActive(id)
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, {
        offset: -90,
        duration: 0.7,
        easing: (time) => 1 - Math.pow(1 - time, 4),
      })
    } else {
      target.scrollIntoView()
    }

    const hash = `#${id}`
    if (window.location.hash !== hash) window.history.pushState(null, '', hash)
  }

  useEffect(() => {
    const sections = navItems
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section))

    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActive(visible.target.id as NavItem)
    }, { rootMargin: '-20% 0px -62% 0px', threshold: [0, 0.25, 0.6] })

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  const copyEmail = async () => {
    const email = 'cjtan2406@gmail.com'
    let copied = false

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(email)
        copied = true
      }
    } catch {
      copied = false
    }

    if (!copied) {
      const textarea = document.createElement('textarea')
      textarea.value = email
      textarea.setAttribute('readonly', '')
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      copied = document.execCommand('copy')
      textarea.remove()
    }

    setCopyStatus(copied ? 'copied' : 'failed')
  }

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('.reveal'))
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach((element) => element.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' })

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <header className="site-header">
        <nav aria-label="Primary navigation">
          {navItems.map(({ id, label, icon: Icon }) => (
            <a href={`#${id}`} onClick={(event) => scrollToSection(event, id)} className={active === id ? 'active' : ''} aria-current={active === id ? 'page' : undefined} aria-label={label} data-label={label} key={id}>
              <Icon size={21} strokeWidth={1.9} />
            </a>
          ))}
        </nav>
      </header>

      <main id="main" className="portfolio-shell">
        <aside className="profile-column">
          <article className="profile-card">
            <div className="profile-portrait">
              <img
                src={avatarSrc}
                alt="Portrait of Chrislyr John P. Tan"
                onError={(event) => {
                  event.currentTarget.onerror = null
                  event.currentTarget.src = assetPath('profile.jpg')
                }}
              />
              <span className="portrait-badge"><Code2 size={16} /></span>
            </div>
            <div className="profile-copy">
              <h1>Chrislyr John P. Tan</h1>
              <p>Computer Science student building practical mobile, web, and scheduling software with care for reliability, testing, and user experience.</p>
              <span className="profile-location"><MapPin size={14} /> Cebu City, Philippines</span>
              <div className="profile-links">
                <a href="https://github.com/choonhows" target="_blank" rel="noreferrer" aria-label="GitHub" data-label="GitHub"><GitBranch size={21} /></a>
                <a href="mailto:cjtan2406@gmail.com" aria-label="Email" data-label="Email"><Mail size={21} /></a>
                <a href={assetPath('Chrislyr-John-Tan-CV.pdf')} download aria-label="Download CV" data-label="Download CV"><Download size={21} /></a>
                <a href="#projects" onClick={(event) => scrollToSection(event, 'projects')} aria-label="View projects" data-label="Projects"><FolderKanban size={21} /></a>
              </div>
            </div>
          </article>
        </aside>

        <div className="content-column">
          <section className="hero-section page-section" id="home" aria-labelledby="hero-title">
            <SplitHeading id="hero-title" first="SOFTWARE" second="DEVELOPER" />
            <p className="hero-intro">I turn ideas into reliable mobile and web systems, from offline-first applications to tested APIs and automated scheduling workflows.</p>

            <div className="hero-stats reveal" aria-label="Portfolio highlights">
              <div><strong>03</strong><span>FEATURED<br />PROJECTS</span></div>
              <div><strong>2027</strong><span>EXPECTED<br />GRADUATION</span></div>
            </div>

            <div className="hero-cards reveal">
              <a className="hero-card hero-card-lichen" href="#projects" onClick={(event) => scrollToSection(event, 'projects')}>
                <FolderKanban size={34} strokeWidth={1.8} />
                <h3>CHRONOS, AUTOMATED UNIVERSITY SCHEDULING</h3>
                <span><ArrowRight size={20} /></span>
              </a>
              <a className="hero-card hero-card-sand" href="#projects" onClick={(event) => scrollToSection(event, 'projects')}>
                <Code2 size={34} strokeWidth={1.8} />
                <h3>FASTAPI, REACT, POSTGRESQL, GENETIC SCHEDULING</h3>
                <span><ArrowRight size={20} /></span>
              </a>
            </div>
          </section>

          <section className="projects-section page-section" id="projects" aria-labelledby="projects-title">
            <SplitHeading id="projects-title" first="RECENT" second="PROJECTS" />
            <div className="project-list reveal">
              {projects.map((project) => (
                <a className="project-row" href={project.href} target="_blank" rel="noreferrer" key={project.title}>
                  <ProjectPreview visual={project.visual} title={project.title} />
                  <div className="project-details">
                    <span>PROJECT / {project.number}</span>
                    <h3>{project.title}</h3>
                    <p>{project.kind}</p>
                    <small>{project.summary}</small>
                    <i>{project.stack}</i>
                  </div>
                  <ArrowUpRight className="row-arrow" size={19} />
                </a>
              ))}
            </div>
          </section>

          <section className="education-section page-section" id="about" aria-labelledby="education-title">
            <SplitHeading id="education-title" first="EDUCATION" second="CREDENTIALS" />
            <div className="education-list reveal">
              {education.map((item) => (
                <article className="education-row" key={item.title}>
                  <div className="education-copy">
                    <span>{item.label}</span>
                    <h3>{item.title}</h3>
                    <p>{item.place}</p>
                    <small>{item.description}</small>
                  </div>
                  <time>{item.date}</time>
                </article>
              ))}
            </div>
          </section>

          <section className="tools-section page-section" id="tools" aria-labelledby="tools-title">
            <SplitHeading id="tools-title" first="TOOLS &" second="PRACTICES" />
            <div className="tools-grid reveal">
              {tools.map(({ title, description, icon: Icon }) => (
                <article className="tool-item" key={title}>
                  <span><Icon size={29} strokeWidth={1.8} /></span>
                  <div><h3>{title}</h3><p>{description}</p></div>
                </article>
              ))}
            </div>
          </section>

          <section className="notes-section page-section" aria-labelledby="notes-title">
            <SplitHeading id="notes-title" first="HOW I" second="WORK" />
            <div className="notes-list reveal">
              {workingNotes.map((note) => (
                <article className="note-row" key={note.title}>
                  <ArrowUpRight size={18} />
                  <h3>{note.title}</h3>
                  <p>{note.description}</p>
                  <span>{note.meta}</span>
                </article>
              ))}
            </div>
          </section>

          <section className="contact-section page-section" id="contact" aria-labelledby="contact-title">
            <SplitHeading id="contact-title" first="LET'S BUILD" second="TOGETHER" />
            <address className="contact-list reveal">
              <button className="contact-row" type="button" onClick={copyEmail} aria-label="Copy cjtan2406@gmail.com to clipboard">
                <span className="contact-label">01 / EMAIL</span>
                <strong>cjtan2406@gmail.com</strong>
                <span className="contact-action" aria-live="polite">
                  {copyStatus === 'copied' ? 'COPIED' : copyStatus === 'failed' ? 'COPY FAILED' : 'COPY'}
                  {copyStatus === 'copied' ? <Check size={18} /> : <Copy size={18} />}
                </span>
              </button>
              <a className="contact-row" href="https://github.com/choonhows" target="_blank" rel="noreferrer">
                <span className="contact-label">02 / GITHUB</span><strong>github.com/choonhows</strong><span className="contact-action">OPEN <ExternalLink size={18} /></span>
              </a>
              <a className="contact-row" href={assetPath('Chrislyr-John-Tan-CV.pdf')} download>
                <span className="contact-label">03 / CURRICULUM VITAE</span><strong>Download CV</strong><span className="contact-action">DOWNLOAD <Download size={18} /></span>
              </a>
            </address>
          </section>
        </div>
      </main>

      <footer className="site-footer">
        <div><strong>CHRISLYR JOHN P. TAN</strong><span>Computer Science · Software Development</span></div>
        <a className="footer-note" href="https://github.com/choonhows" target="_blank" rel="noreferrer">Made by choonhows</a>
        <a className="footer-top" href="#home" onClick={(event) => scrollToSection(event, 'home')}>Back to top ↑</a>
      </footer>
    </>
  )
}

export default App
