import { useEffect, useRef, useState, type MouseEvent } from 'react'
import Lenis from 'lenis'
import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  ChevronLeft,
  ChevronRight,
  Code2,
  Copy,
  Database,
  Download,
  ExternalLink,
  FolderKanban,
  GitBranch,
  Home,
  Mail,
  Maximize2,
  MapPin,
  MonitorSmartphone,
  PencilLine,
  Sparkles,
  TestTube2,
  Wrench,
  X,
} from 'lucide-react'

const assetPath = (fileName: string) => `${import.meta.env.BASE_URL}${fileName}`
const githubAvatarUrl = 'https://avatars.githubusercontent.com/u/125168781?s=800'
const avatarRefreshInterval = 5 * 60 * 1000

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'about', label: 'Experience', icon: BriefcaseBusiness },
  { id: 'tools', label: 'Tools', icon: Wrench },
  { id: 'contact', label: 'Contact', icon: PencilLine },
] as const

type NavItem = (typeof navItems)[number]['id']

type Project = {
  number: string
  title: string
  kind: string
  summary: string
  about: string
  role: string
  stack: string
  visual: 'chronos' | 'bored' | 'caledoro' | 'nitpicker'
  screenshots: string[]
  links: { label: string; href: string }[]
}

const projects: Project[] = [
  {
    number: '01',
    title: 'Chronos',
    kind: 'Automated university class scheduling',
    summary: 'ARM-guided genetic scheduling with tested APIs and AI-assisted Jira/GitHub MCP ticketing.',
    about: 'A class scheduling system for USC DCISM. Association rule mining guides a genetic algorithm, while hard constraints such as room and teacher conflicts always stay enforced.',
    role: 'One of four developers. I built FastAPI and SQLAlchemy services and React workflows for sign-in, role-based access, scheduling, validation, timetable views, and CSV/XLSX export. I wrote unit and PostgreSQL integration tests and designed the Jira–GitHub workflow with AI-assisted MCP commands.',
    stack: 'Python · FastAPI · PostgreSQL · React · TypeScript · DEAP · Mlxtend',
    visual: 'chronos',
    screenshots: ['projects/chronos-1.webp', 'projects/chronos-2.webp', 'projects/chronos-3.webp', 'projects/chronos-4.webp'],
    links: [{ label: 'View repository', href: 'https://github.com/saiimonn/Chronos' }],
  },
  {
    number: '02',
    title: 'Bored',
    kind: 'Collaborative short-break game collection',
    summary: 'Built Color, Shape, and Pattern with daily challenges, local progress, accessible controls, tests, and CI/CD.',
    about: 'A live collection of 10 short word, memory, timing, and puzzle games, set on a pixel-art Japanese city map.',
    role: 'I built the Color, Shape, and Pattern daily games: deterministic daily challenges, saved first results, local progress, and keyboard and pointer controls. I also added game and persistence tests, CI/CD deployment checks, and security dependency patches.',
    stack: 'Next.js · React · TypeScript · Tailwind CSS · Node.js',
    visual: 'bored',
    screenshots: ['projects/bored-1.webp', 'projects/bored-2.webp', 'projects/bored-3.webp', 'projects/bored-4.webp'],
    links: [{ label: 'Visit live site', href: 'https://bored.dcism.org' }],
  },
  {
    number: '03',
    title: 'Caledoro',
    kind: 'Offline-first mobile productivity',
    summary: 'Tasks, focus sessions, calendar tools, widgets, and AI-assisted task breakdown.',
    about: 'An offline-first Android app that combines task management, Pomodoro focus sessions, calendar tools, and home-screen widgets.',
    role: 'One of three developers. I integrated the Gemini API for task breakdown and worked on local storage, state management, notifications, testing, debugging, and responsive layouts.',
    stack: 'Flutter · Dart · Riverpod · Hive · Gemini API',
    visual: 'caledoro',
    screenshots: ['projects/caledoro-1.webp', 'projects/caledoro-2.webp'],
    links: [{ label: 'View repository', href: 'https://github.com/choonhows/Caledoro' }],
  },
  {
    number: '04',
    title: 'NitPicker',
    kind: 'PhilNITS FE preparation platform',
    summary: 'Mock exams, explanations, analytics, and previous-exam browsing.',
    about: 'A study platform for the PhilNITS FE exam with configurable mock exams, answer explanations, performance analytics, and previous-exam browsing.',
    role: 'Contributor. I built skeleton loading states and workflow refinements, and ran functional, interaction, usability, and responsive testing.',
    stack: 'React · TypeScript · Vite · Tailwind CSS',
    visual: 'nitpicker',
    screenshots: ['projects/nitpicker-1.webp', 'projects/nitpicker-2.webp', 'projects/nitpicker-3.webp', 'projects/nitpicker-4.webp'],
    links: [{ label: 'Visit live site', href: 'https://nitpicker.dcism.org' }],
  },
]

const education = [
  {
    date: 'NOV 2026',
    label: 'Experience · 3 days',
    title: 'iOS QA Tester',
    place: 'HagWOW',
    description: 'Tested a Philippine Grades 1–12 learning app on iPhone and filed structured bug reports with reproduction steps, expected and actual results, severity, and evidence.',
  },
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

const linkedinUrl = 'https://www.linkedin.com/in/chrislyr-tan/'

function LinkedinIcon({ size = 21 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function SplitHeading({ id, first, second }: { id: string; first: string; second: string }) {
  return (
    <h2 className="split-heading" id={id}>
      <span>{first}</span>
      <span>{second}</span>
    </h2>
  )
}

function ProjectPreview({ visual, title }: { visual: Project['visual']; title: string }) {
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

  const previewAssets = {
    bored: 'bored-logo.svg',
    caledoro: 'caledoro-logo.png',
    nitpicker: 'nitpicker-logo.svg',
  } as const

  return (
    <div className={`project-preview ${visual}-preview`}>
      <img
        src={assetPath(previewAssets[visual])}
        alt={`${title} logo`}
        loading="lazy"
      />
    </div>
  )
}

function Gallery({ title, images, expanded, onExpandedChange }: { title: string; images: string[]; expanded: boolean; onExpandedChange: (expanded: boolean) => void }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const indexRef = useRef(0)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const target = indexRef.current
    requestAnimationFrame(() => {
      track.scrollTo({ left: target * track.clientWidth, behavior: 'auto' })
      track.focus({ preventScroll: true })
    })
  }, [expanded])

  const toggleExpanded = () => onExpandedChange(!expanded)

  const go = (next: number) => {
    const track = trackRef.current
    if (!track) return
    const target = Math.max(0, Math.min(images.length - 1, next))
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    track.scrollTo({ left: target * track.clientWidth, behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  return (
    <div
      className={expanded ? 'dialog-media gallery is-expanded' : 'dialog-media gallery'}
      role="group"
      aria-roledescription="carousel"
      aria-label={`${title} screenshots`}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') { event.preventDefault(); go(index + 1) }
        if (event.key === 'ArrowLeft') { event.preventDefault(); go(index - 1) }
      }}
    >
      <div
        className="gallery-track"
        ref={trackRef}
        tabIndex={0}
        aria-label={`Screenshot ${index + 1} of ${images.length}. Use arrow keys or swipe to see more.`}
        onScroll={(event) => {
          const track = event.currentTarget
          const next = Math.round(track.scrollLeft / track.clientWidth)
          indexRef.current = next
          setIndex(next)
        }}
      >
        {images.map((src, imageIndex) => (
          <img
            src={assetPath(src)}
            alt={`${title} screenshot ${imageIndex + 1} of ${images.length}`}
            loading={imageIndex === 0 ? 'eager' : 'lazy'}
            onClick={expanded ? undefined : toggleExpanded}
            key={src}
          />
        ))}
      </div>
      <button
        type="button"
        className="gallery-expand"
        onClick={toggleExpanded}
        aria-label={expanded ? 'Exit full screen' : 'View screenshots full screen'}
      >
        {expanded ? <X size={20} /> : <Maximize2 size={18} />}
      </button>
      {images.length > 1 && (
        <>
          <button type="button" className="gallery-nav is-prev" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Previous screenshot">
            <ChevronLeft size={22} />
          </button>
          <button type="button" className="gallery-nav is-next" onClick={() => go(index + 1)} disabled={index === images.length - 1} aria-label="Next screenshot">
            <ChevronRight size={22} />
          </button>
          <div className="gallery-dots">
            {images.map((src, imageIndex) => (
              <button
                type="button"
                className={imageIndex === index ? 'is-active' : undefined}
                onClick={() => go(imageIndex)}
                aria-label={`Show screenshot ${imageIndex + 1}`}
                aria-current={imageIndex === index}
                key={src}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function ProjectDialog({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [expandedFor, setExpandedFor] = useState<string | null>(null)
  const expanded = project !== null && expandedFor === project.title

  const handleClose = () => {
    setExpandedFor(null)
    onClose()
  }

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (project && !dialog.open) dialog.showModal()
    if (!project && dialog.open) dialog.close()
  }, [project])

  return (
    <dialog
      ref={dialogRef}
      className="project-dialog"
      aria-labelledby="project-dialog-title"
      onClose={handleClose}
      onCancel={(event) => {
        if (!expanded) return
        event.preventDefault()
        setExpandedFor(null)
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) handleClose()
      }}
      data-lenis-prevent
    >
      {project && (
        <article>
          <button type="button" className="dialog-close" onClick={handleClose} aria-label="Close project details">
            <X size={20} />
          </button>
          {project.screenshots.length > 0 ? (
            <Gallery
              key={project.title}
              title={project.title}
              images={project.screenshots}
              expanded={expanded}
              onExpandedChange={(next) => setExpandedFor(next ? project.title : null)}
            />
          ) : (
            <div className="dialog-media">
              <ProjectPreview visual={project.visual} title={project.title} />
            </div>
          )}
          <div className="dialog-body">
            <span className="dialog-eyebrow">PROJECT / {project.number}</span>
            <h2 id="project-dialog-title">{project.title}</h2>
            <p className="dialog-kind">{project.kind}</p>

            <h3>What it is</h3>
            <p>{project.about}</p>

            <h3>My role</h3>
            <p>{project.role}</p>

            <h3>Built with</h3>
            <ul className="dialog-stack">
              {project.stack.split(' · ').map((tool) => <li key={tool}>{tool}</li>)}
            </ul>

            <div className="dialog-links">
              {project.links.map((link, index) => (
                <a className={index === 0 ? 'dialog-link is-primary' : 'dialog-link'} href={link.href} target="_blank" rel="noreferrer" key={link.href}>
                  {link.label} <ArrowUpRight size={17} />
                </a>
              ))}
            </div>
          </div>
        </article>
      )}
    </dialog>
  )
}

function App() {
  const [active, setActive] = useState<NavItem>('home')
  const [avatarSrc, setAvatarSrc] = useState(() => assetPath('profile.jpg'))
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const lenisRef = useRef<Lenis | null>(null)
  const [openProject, setOpenProject] = useState<Project | null>(null)

  useEffect(() => {
    if (openProject) lenisRef.current?.stop()
    else lenisRef.current?.start()
  }, [openProject])

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
                <a href={linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn" data-label="LinkedIn"><LinkedinIcon /></a>
                <a href="mailto:cjtan2406@gmail.com" aria-label="Email" data-label="Email"><Mail size={21} /></a>
                <a href={assetPath('Chrislyr-John-Tan-CV.pdf')} download aria-label="Download CV" data-label="Download CV"><Download size={21} /></a>
              </div>
            </div>
          </article>
        </aside>

        <div className="content-column">
          <section className="hero-section page-section" id="home" aria-labelledby="hero-title">
            <SplitHeading id="hero-title" first="SOFTWARE" second="DEVELOPER" />
            <p className="hero-intro">I turn ideas into reliable mobile and web systems, from offline-first applications to tested APIs and automated scheduling workflows.</p>

            <div className="hero-stats reveal" aria-label="Portfolio highlights">
              <div><strong>FE</strong><span>PHILNITS<br />PASSER</span></div>
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
                <button className="project-row" type="button" aria-haspopup="dialog" onClick={() => setOpenProject(project)} key={project.title}>
                  <ProjectPreview visual={project.visual} title={project.title} />
                  <div className="project-details">
                    <span>PROJECT / {project.number}</span>
                    <h3>{project.title}</h3>
                    <p>{project.kind}</p>
                    <small>{project.summary}</small>
                    <i>{project.stack}</i>
                  </div>
                  <ArrowRight className="row-arrow" size={19} />
                </button>
              ))}
            </div>
          </section>

          <section className="education-section page-section" id="about" aria-labelledby="education-title">
            <SplitHeading id="education-title" first="EXPERIENCE" second="EDUCATION" />
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
              <a className="contact-row" href={linkedinUrl} target="_blank" rel="noreferrer">
                <span className="contact-label">03 / LINKEDIN</span><strong>linkedin.com/in/chrislyr-tan</strong><span className="contact-action">OPEN <ExternalLink size={18} /></span>
              </a>
              <a className="contact-row" href={assetPath('Chrislyr-John-Tan-CV.pdf')} download>
                <span className="contact-label">04 / CURRICULUM VITAE</span><strong>Download CV</strong><span className="contact-action">DOWNLOAD <Download size={18} /></span>
              </a>
            </address>
          </section>
        </div>
      </main>

      <ProjectDialog project={openProject} onClose={() => setOpenProject(null)} />

      <footer className="site-footer">
        <div><strong>CHRISLYR JOHN P. TAN</strong><span>Computer Science · Software Development</span></div>
        <a className="footer-note" href="https://github.com/choonhows" target="_blank" rel="noreferrer">Made by choonhows</a>
        <a className="footer-top" href="#home" onClick={(event) => scrollToSection(event, 'home')}>Back to top ↑</a>
      </footer>
    </>
  )
}

export default App
