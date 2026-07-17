import { AnimatePresence, motion } from 'framer-motion'
import {
  Bot,
  CheckCircle2,
  Download,
  FileDown,
  FileSearch,
  Moon,
  Palette,
  Plus,
  RotateCcw,
  Sparkles,
  Sun,
  Trash2,
  Upload,
  WandSparkles,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { resumeSeed } from './data/resumeSeed.js'
import { analyzeResume, comma, lines, matchJob } from './utils/resumeTools.js'

const storageKey = 'ai-resume-builder-v2'
const panels = ['edit', 'preview', 'coach']
const accents = ['#2563eb', '#0f766e', '#b45309', '#be123c', '#4f46e5']

function toHref(value = '') {
  const trimmed = value.trim()
  if (!trimmed) return ''
  if (/^(mailto:|tel:|https?:\/\/)/i.test(trimmed)) return trimmed
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return `mailto:${trimmed}`
  if (/^\+?[\d\s()-]{7,}$/.test(trimmed)) return `tel:${trimmed.replace(/[^\d+]/g, '')}`
  return `https://${trimmed}`
}

function splitLinks(value = '') {
  return String(value)
    .split('|')
    .map((item) => item.trim())
    .filter(Boolean)
}

function improvementPlan(resume, analysis, jobMatch) {
  const suggestions = []

  if (!resume.profile.links.trim()) {
    suggestions.push('Add LinkedIn, GitHub, and portfolio links so recruiters can verify your work quickly.')
  }

  if (analysis.scores.impact < 55) {
    suggestions.push('Add numbers to bullets: users, percentage improvement, load-time gain, project count, or reduced bugs.')
  }

  if (analysis.scores.clarity < 70) {
    suggestions.push('Start weak bullets with action verbs like Built, Implemented, Optimized, Integrated, or Delivered.')
  }

  if (analysis.scores.keywords < 75) {
    suggestions.push('Add more frontend keywords naturally: React, TypeScript, APIs, accessibility, performance, responsive design.')
  }

  if (resume.projects.length < 2) {
    suggestions.push('Add at least two strong projects with GitHub/demo links and 2-3 impact bullets each.')
  }

  if (jobMatch.missing.length > 0) {
    const missingKeywords = jobMatch.missing.slice(0, 6)
    suggestions.push(`Job match gap: add honest missing keywords where relevant: ${missingKeywords.join(', ')}.`)
    suggestions.push(`Add these missing job terms into the right place: skills for tools, project bullets for proof, and summary only for your strongest experience.`)
    suggestions.push(`Customize one project bullet to mirror the job description using 1-2 missing terms plus a measurable result.`)
  } else if (jobMatch.percent > 0) {
    suggestions.push('Job match looks strong. Fine-tune the first summary line and top project to mirror the job title and main frontend skill.')
  } else {
    suggestions.push('Paste a job description to get role-specific missing keyword suggestions inside this Improve CV section.')
  }

  if (!suggestions.length) {
    suggestions.push('Your CV is in solid shape. Next improvement: customize the summary and first project for each job post.')
  }

  return suggestions
}

function loadResume() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || resumeSeed
  } catch {
    return resumeSeed
  }
}

export default function App() {
  const [resume, setResume] = useState(loadResume)
  const [activePanel, setActivePanel] = useState('edit')
  const [theme, setTheme] = useState('light')
  const [jobDescription, setJobDescription] = useState('')
  const [coachNote, setCoachNote] = useState('Paste a job description or use a smart action to improve weak sections.')
  const [selectedSmartAction, setSelectedSmartAction] = useState('')
  const [smartResult, setSmartResult] = useState({
    title: 'No smart action yet',
    body: 'Use one of the buttons below and the generated content will appear here.',
    items: [],
  })

  const analysis = useMemo(() => analyzeResume(resume), [resume])
  const jobMatch = useMemo(() => matchJob(resume, jobDescription), [resume, jobDescription])
  const cvPlan = useMemo(() => improvementPlan(resume, analysis, jobMatch), [resume, analysis, jobMatch])

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(resume))
  }, [resume])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  function updateProfile(field, value) {
    setResume((current) => ({
      ...current,
      profile: { ...current.profile, [field]: value },
    }))
  }

  function updateRoot(field, value) {
    setResume((current) => ({ ...current, [field]: value }))
  }

  function updateSettings(field, value) {
    setResume((current) => ({
      ...current,
      settings: { ...current.settings, [field]: value },
    }))
  }

  function updateItem(collection, index, field, value) {
    setResume((current) => ({
      ...current,
      [collection]: current[collection].map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }))
  }

  function addItem(collection) {
    const blank = {
      experience: { title: '', company: '', location: '', dates: '', bullets: '' },
      projects: { name: '', stack: '', link: '', bullets: '' },
      education: { degree: '', school: '', location: '', dates: '', details: '' },
    }

    setResume((current) => ({
      ...current,
      [collection]: [...current[collection], blank[collection]],
    }))
  }

  function removeItem(collection, index) {
    setResume((current) => ({
      ...current,
      [collection]: current[collection].filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  function improveSummary() {
    setSelectedSmartAction('summary')
    const skills = comma(resume.skills).slice(0, 5).join(', ') || 'React, JavaScript, and CSS'
    const summary = `${resume.profile.role || 'Frontend Developer'} focused on building accessible, responsive, and high-performance web applications using ${skills}. Strong at creating reusable UI components, integrating APIs, improving performance, and delivering polished product experiences across devices.`
    setResume((current) => ({
      ...current,
      profile: {
        ...current.profile,
        summary,
      },
    }))
    setCoachNote('Summary improved with recruiter-friendly frontend keywords and stronger positioning.')
    setSmartResult({
      title: 'Summary applied',
      body: summary,
      items: [],
    })
  }

  function generateBullets() {
    setSelectedSmartAction('bullets')
    const bulletList = [
      'Built a responsive product workflow with reusable components, clean state updates, and mobile-first layouts.',
      'Integrated loading, empty, and error states to make the interface feel production-ready.',
      'Improved usability with accessible labels, keyboard-friendly controls, and clear visual hierarchy.',
    ]
    const bullets = bulletList.join('\n')

    setResume((current) => ({
      ...current,
      projects: current.projects.length
        ? current.projects.map((project, index) => (index === 0 ? { ...project, bullets } : project))
        : [{ name: 'AI Resume Builder', stack: 'React, Vite, Framer Motion', link: '', bullets }],
    }))
    setCoachNote('Impact bullets generated. Add real numbers from your work before finalizing.')
    setSmartResult({
      title: 'Project bullets applied',
      body: 'Updated the first project with stronger frontend-focused impact bullets.',
      items: bulletList,
    })
  }

  function applyJobKeywords() {
    setSelectedSmartAction('keywords')
    if (!jobDescription.trim()) {
      setCoachNote('Paste a job description first, then click Apply job keywords.')
      setSmartResult({
        title: 'Need a job description',
        body: 'Paste a frontend job description in the matcher box so the app can find missing keywords.',
        items: [],
      })
      return
    }

    const missing = jobMatch.missing.slice(0, 5)

    if (!missing.length) {
      setCoachNote('Your resume already covers the strongest detected job keywords.')
      setSmartResult({
        title: 'No major keyword gaps',
        body: 'The pasted job description already matches your resume well.',
        items: [],
      })
      return
    }

    setResume((current) => {
      const existingSkills = comma(current.skills)
      const nextSkills = [...existingSkills]

      missing.forEach((keyword) => {
        const alreadyExists = nextSkills.some((skill) => skill.toLowerCase() === keyword.toLowerCase())
        if (!alreadyExists) nextSkills.push(keyword)
      })

      return {
        ...current,
        skills: nextSkills.join(', '),
      }
    })
    setCoachNote('Missing job keywords were added to your skills section. Keep only the ones you can honestly discuss.')
    setSmartResult({
      title: 'Job keywords applied',
      body: 'Added the strongest missing keywords to the Skills section.',
      items: missing,
    })
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(resume, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'resume-data.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  async function importJson(file) {
    if (!file) return
    try {
      setResume(JSON.parse(await file.text()))
      setCoachNote('Resume data imported successfully.')
    } catch {
      setCoachNote('Import failed. Choose a valid JSON file exported from this app.')
    }
  }

  return (
    <div className="app">
      <Topbar
        activePanel={activePanel}
        exportJson={exportJson}
        importJson={importJson}
        setActivePanel={setActivePanel}
        setTheme={setTheme}
        theme={theme}
          reset={() => {
            setResume(resumeSeed)
            setCoachNote('Sample data restored. Replace it with your own details.')
            setSmartResult({
              title: 'Sample restored',
              body: 'You are back to the original demo resume.',
              items: [],
            })
          }}
      />

      <main className={`workspace workspace-${activePanel}`}>
        <motion.div
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="view-shell"
          initial={{ opacity: 0, scale: 0.985, y: 16 }}
          key={activePanel}
          transition={{ duration: 0.22, ease: 'easeOut' }}
        >
          {activePanel === 'edit' && (
            <Editor
              activePanel={activePanel}
              addItem={addItem}
              removeItem={removeItem}
              resume={resume}
              updateItem={updateItem}
              updateProfile={updateProfile}
              updateRoot={updateRoot}
            />
          )}
          {activePanel === 'preview' && (
            <Preview
              activePanel={activePanel}
              resume={resume}
              updateSettings={updateSettings}
            />
          )}
          {activePanel === 'coach' && (
            <Coach
              activePanel={activePanel}
              analysis={analysis}
              applyJobKeywords={applyJobKeywords}
              coachNote={coachNote}
              cvPlan={cvPlan}
              generateBullets={generateBullets}
              improveSummary={improveSummary}
              jobDescription={jobDescription}
              jobMatch={jobMatch}
              selectedSmartAction={selectedSmartAction}
              setJobDescription={setJobDescription}
              smartResult={smartResult}
            />
          )}
        </motion.div>
      </main>
    </div>
  )
}

function Topbar({ activePanel, exportJson, importJson, reset, setActivePanel, setTheme, theme }) {
  return (
    <motion.header className="topbar" initial={{ y: -18, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
      <div className="brand">
        <div className="brand-mark">
          <Sparkles size={22} />
        </div>
        <div>
          <h1>AI Resume Builder</h1>
        </div>
      </div>

      <nav className="panel-tabs" aria-label="Resume builder sections">
        {panels.map((panel) => (
          <button key={panel} type="button" aria-pressed={activePanel === panel} onClick={() => setActivePanel(panel)}>
            {activePanel === panel && <motion.span className="tab-glow" layoutId="activeTab" />}
            <span className="tab-label">{panel}</span>
          </button>
        ))}
      </nav>

      <div className="actions">
        <button type="button" onClick={reset}>
          <RotateCcw size={16} />
          Sample
        </button>
        <button type="button" onClick={() => setTheme((value) => (value === 'light' ? 'dark' : 'light'))}>
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          Theme
        </button>
        <button type="button" onClick={exportJson}>
          <Download size={16} />
          Export
        </button>
        <label className="file-action">
          <Upload size={16} />
          Import
          <input type="file" accept="application/json" onChange={(event) => importJson(event.target.files?.[0])} />
        </label>
        <button className="primary" type="button" onClick={() => window.print()}>
          <FileDown size={16} />
          Save PDF
        </button>
      </div>
    </motion.header>
  )
}

function Editor({ activePanel, addItem, removeItem, resume, updateItem, updateProfile, updateRoot }) {
  return (
    <Panel className="editor" hiddenOnMobile={activePanel !== 'edit'} title="Build content" eyebrow="Step 1">
      <Section title="Profile">
        <div className="grid">
          {[
            ['name', 'Full name'],
            ['role', 'Target role'],
            ['email', 'Email'],
            ['phone', 'Phone'],
            ['location', 'Location'],
            ['links', 'Links'],
          ].map(([field, label]) => (
            <Field key={field} label={label} value={resume.profile[field]} onChange={(value) => updateProfile(field, value)} />
          ))}
          <Field area wide label="Professional summary" value={resume.profile.summary} onChange={(value) => updateProfile('summary', value)} />
        </div>
      </Section>

      <Collection name="experience" title="Experience" items={resume.experience} addItem={addItem} removeItem={removeItem} updateItem={updateItem} />
      <Collection name="projects" title="Projects" items={resume.projects} addItem={addItem} removeItem={removeItem} updateItem={updateItem} />
      <Collection name="education" title="Education" items={resume.education} addItem={addItem} removeItem={removeItem} updateItem={updateItem} />

      <Section title="Skills and extras">
        <Field area label="Skills" value={resume.skills} onChange={(value) => updateRoot('skills', value)} />
        <Field area label="Certifications" value={resume.certifications} onChange={(value) => updateRoot('certifications', value)} />
        <Field area label="Achievements" value={resume.achievements} onChange={(value) => updateRoot('achievements', value)} />
      </Section>
    </Panel>
  )
}

function Collection({ addItem, items, name, removeItem, title, updateItem }) {
  const fields = {
    experience: [
      ['title', 'Title'],
      ['company', 'Company'],
      ['location', 'Location'],
      ['dates', 'Dates'],
    ],
    projects: [
      ['name', 'Project name'],
      ['stack', 'Tech stack'],
      ['link', 'GitHub / demo link'],
    ],
    education: [
      ['degree', 'Degree'],
      ['school', 'School'],
      ['location', 'Location'],
      ['dates', 'Dates'],
    ],
  }
  const notes = name === 'education' ? ['details', 'Details'] : ['bullets', 'Bullets']

  return (
    <Section
      title={title}
      action={
        <button className="small-button" type="button" onClick={() => addItem(name)}>
          <Plus size={15} />
          Add
        </button>
      }
    >
      <AnimatePresence initial={false}>
        {items.map((item, index) => (
          <motion.article
            className="edit-card"
            key={`${name}-${index}`}
            layout
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
          >
            <div className="card-top">
              <strong>
                {title} {index + 1}
              </strong>
              <button className="icon danger" type="button" onClick={() => removeItem(name, index)} aria-label={`Remove ${title}`}>
                <Trash2 size={16} />
              </button>
            </div>
            <div className="grid">
              {fields[name].map(([field, label]) => (
                <Field key={field} label={label} value={item[field]} onChange={(value) => updateItem(name, index, field, value)} />
              ))}
              <Field area wide label={notes[1]} value={item[notes[0]]} onChange={(value) => updateItem(name, index, notes[0], value)} />
            </div>
          </motion.article>
        ))}
      </AnimatePresence>
    </Section>
  )
}

function Preview({ activePanel, resume, updateSettings }) {
  return (
    <motion.section
      className={`preview-col ${activePanel !== 'preview' ? 'mobile-hidden' : ''}`}
      initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -18, filter: 'blur(8px)' }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
    >
      <motion.div className="preview-tools glass" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <span className="eyebrow">Step 2</span>
          <h2>Live preview</h2>
        </div>
        <div className="template-row">
          {['modern', 'classic', 'compact'].map((template) => (
            <button
              key={template}
              type="button"
              aria-pressed={resume.settings.template === template}
              onClick={() => updateSettings('template', template)}
            >
              {template}
            </button>
          ))}
        </div>
        <div className="swatches">
          <Palette size={17} />
          {accents.map((accent) => (
            <button
              key={accent}
              style={{ '--swatch': accent }}
              className="swatch"
              type="button"
              aria-label={`Use ${accent}`}
              aria-pressed={resume.settings.accent === accent}
              onClick={() => updateSettings('accent', accent)}
            />
          ))}
        </div>
      </motion.div>

      <motion.article
        className={`resume ${resume.settings.template}`}
        style={{ '--resume-accent': resume.settings.accent }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
      >
        <header className="resume-head">
          <div>
            <h2>{resume.profile.name || 'Your Name'}</h2>
            <p>{resume.profile.role || 'Target Role'}</p>
          </div>
          <div className="contact">
            {resume.profile.email && <span>{resume.profile.email}</span>}
            {resume.profile.phone && <span>{resume.profile.phone}</span>}
            {resume.profile.location && <span>{resume.profile.location}</span>}
            {splitLinks(resume.profile.links).map((link) => (
              <PreviewLink key={link} value={link} />
            ))}
          </div>
        </header>
        <ResumeSection title="Summary">{resume.profile.summary && <p>{resume.profile.summary}</p>}</ResumeSection>
        <ResumeSection title="Experience">{resume.experience.map((item, index) => <Entry key={index} title={`${item.title} - ${item.company}`} meta={item.dates} sub={item.location} bullets={item.bullets} />)}</ResumeSection>
        <ResumeSection title="Projects">{resume.projects.map((item, index) => <Entry key={index} title={item.name} meta={item.link} metaIsLink sub={item.stack} bullets={item.bullets} />)}</ResumeSection>
        <ResumeSection title="Education">{resume.education.map((item, index) => <Entry key={index} title={item.degree} meta={item.dates} sub={`${item.school} - ${item.location}`} details={item.details} />)}</ResumeSection>
        <ResumeSection title="Skills"><div className="skills">{comma(resume.skills).map((skill) => <span key={skill}>{skill}</span>)}</div></ResumeSection>
        <ResumeSection title="Certifications"><List value={resume.certifications} /></ResumeSection>
        <ResumeSection title="Achievements"><List value={resume.achievements} /></ResumeSection>
      </motion.article>
    </motion.section>
  )
}

function Coach({
  activePanel,
  analysis,
  applyJobKeywords,
  coachNote,
  cvPlan,
  generateBullets,
  improveSummary,
  jobDescription,
  jobMatch,
  selectedSmartAction,
  setJobDescription,
  smartResult,
}) {
  return (
    <Panel className="coach" hiddenOnMobile={activePanel !== 'coach'} title="AI coach" eyebrow="Step 3">
      <motion.div className="score-card" initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <div className="score-ring" style={{ '--score': `${analysis.total * 3.6}deg` }}>
          <strong>{analysis.total}</strong>
        </div>
        <div>
          <h3>Interview readiness</h3>
          <p>Checks structure, keywords, metrics, and action verbs.</p>
        </div>
      </motion.div>

      <div className="meters">
        {Object.entries(analysis.scores).map(([key, value]) => (
          <div className="meter" key={key}>
            <div><span>{key}</span><strong>{value}%</strong></div>
            <div className="bar"><motion.span initial={{ width: 0 }} animate={{ width: `${value}%` }} /></div>
          </div>
        ))}
      </div>

      <Section title="Job matcher">
        <textarea className="job-text" value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} placeholder="Paste frontend job description here..." />
        <div className="match-pill"><strong>{jobMatch.percent}% match</strong><span>{jobMatch.missing.length} missing keywords</span></div>
        <KeywordCloud title="Matched" words={jobMatch.matched} />
        <KeywordCloud missing title="Missing" words={jobMatch.missing} />
      </Section>

      <Section title="Smart actions">
        <div className="smart-actions">
          <button className={selectedSmartAction === 'summary' ? 'primary' : ''} type="button" onClick={improveSummary}><WandSparkles size={16} /> Improve summary</button>
          <button className={selectedSmartAction === 'bullets' ? 'primary' : ''} type="button" onClick={generateBullets}><Bot size={16} /> Generate bullets</button>
          <button className={selectedSmartAction === 'keywords' ? 'primary' : ''} type="button" onClick={applyJobKeywords}><FileSearch size={16} /> Apply job keywords</button>
        </div>
        <p className="note">{coachNote}</p>
        <motion.div
          className="smart-result"
          key={`${smartResult.title}-${smartResult.body}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <strong>{smartResult.title}</strong>
          <p>{smartResult.body}</p>
          {smartResult.items.length > 0 && (
            <ul>
              {smartResult.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </motion.div>
      </Section>

      <Section title="Improve CV">
        <div className="improvement-list">
          {cvPlan.map((item) => (
            <div key={item}>
              <CheckCircle2 size={16} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Checklist">
        <div className="checklist">
          {analysis.checklist.map(([label, done]) => (
            <div key={label} className={done ? 'done' : ''}>
              <CheckCircle2 size={16} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </Section>
    </Panel>
  )
}

function Panel({ children, className = '', eyebrow, hiddenOnMobile, title }) {
  return (
    <motion.section
      className={`panel glass ${className} ${hiddenOnMobile ? 'mobile-hidden' : ''}`}
      initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -18, filter: 'blur(8px)' }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
    >
      <div className="panel-head">
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      <div className="panel-body">{children}</div>
    </motion.section>
  )
}

function Section({ action, children, title }) {
  return (
    <section className="section">
      <div className="section-head">
        <h3>{title}</h3>
        {action}
      </div>
      {children}
    </section>
  )
}

function Field({ area, label, onChange, value, wide }) {
  return (
    <label className={`field ${wide ? 'wide' : ''}`}>
      <span>{label}</span>
      {area ? <textarea value={value} onChange={(event) => onChange(event.target.value)} /> : <input value={value} onChange={(event) => onChange(event.target.value)} />}
    </label>
  )
}

function ResumeSection({ children, title }) {
  if (!children) return null
  return (
    <section className="resume-section">
      <h3>{title}</h3>
      {children}
    </section>
  )
}

function PreviewLink({ value }) {
  const href = toHref(value)

  return (
    <a href={href} rel="noreferrer" target="_blank">
      {value}
    </a>
  )
}

function Entry({ bullets, details, meta, metaIsLink, sub, title }) {
  return (
    <div className="entry">
      <div className="entry-top">
        <strong>{title}</strong>
        {metaIsLink && meta ? <PreviewLink value={meta} /> : <span>{meta}</span>}
      </div>
      {sub && <p className="entry-sub">{sub}</p>}
      {details && <p>{details}</p>}
      {bullets && <List value={bullets} />}
    </div>
  )
}

function List({ value }) {
  return (
    <ul>
      {lines(value).map((line) => (
        <li key={line}>{line}</li>
      ))}
    </ul>
  )
}

function KeywordCloud({ missing, title, words }) {
  return (
    <div className="keyword-cloud">
      <p>{title}</p>
      <div>{words.length ? words.map((word) => <span className={missing ? 'missing' : ''} key={word}>{word}</span>) : <em>No keywords yet</em>}</div>
    </div>
  )
}
