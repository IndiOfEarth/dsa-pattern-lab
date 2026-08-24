import { useEffect, useState } from 'react'
import type { ChoiceQuestion } from '../../types'
import { loadModuleSections, saveModuleSections } from '../../lib/progress'
import { LessonSection } from '../../components/LessonSection'
import { MultipleChoiceQuestion } from '../../components/MultipleChoiceQuestion'

export type SystemDesignModuleConfig = {
  id: string
  order: number
  title: string
  subtitle: string
  duration: string
  heroTitle: string
  heroDescription: string
  introLead: string
  introBody: string
  keyIdeas: Array<{ label: string; title: string; detail: string }>
  rule: string
  flowTitle: string
  flow: Array<{ title: string; detail: string }>
  flowTakeaway: string
  clues: Array<[string, string]>
  recognitionQuestions: ChoiceQuestion[]
  scenarioQuestions: ChoiceQuestion[]
  explainPrompt: string
  explainChecklist: string[]
  modelAnswer: string
  pactTitle: string
  pactBody: string
  pactSteps: string[]
  revision: {
    headline: string
    thinkWhen: string[]
    vocabulary: string[]
    mistakes: string[]
    interviewQuestions: string[]
    sentence: string
  }
}

const sections = [
  ['intro', 'Introduction'],
  ['mental-model', 'Mental model'],
  ['trace', 'Trace the flow'],
  ['recognise', 'Recognise'],
  ['scenarios', 'Choose & predict'],
  ['explain', 'Explain it'],
  ['pact-journey', 'pact.me journey'],
  ['revision', 'Revision card'],
] as const

function FlowDiagram({ title, steps, takeaway }: { title: string; steps: SystemDesignModuleConfig['flow']; takeaway: string }) {
  return (
    <div className="concept-visual">
      <span className="model-label">TRACE</span>
      <h3 style={{ margin: '10px 0 22px', fontSize: 20, letterSpacing: '-.03em' }}>{title}</h3>
      <div style={{ display: 'grid', gap: 8 }}>
        {steps.map((step, index) => (
          <div key={step.title} style={{ display: 'grid', gridTemplateColumns: '34px 1fr', gap: 12, alignItems: 'start', padding: 14, border: '1px solid var(--line)', borderRadius: 10, background: '#fafbfc' }}>
            <span className="nav-number" style={{ width: 28, height: 28 }}>{index + 1}</span>
            <div><strong style={{ display: 'block', fontSize: 13, marginBottom: 4 }}>{step.title}</strong><span style={{ color: 'var(--muted)', fontSize: 12, lineHeight: 1.55 }}>{step.detail}</span></div>
          </div>
        ))}
      </div>
      <div className="visual-caption" style={{ textAlign: 'left' }}>{takeaway}</div>
    </div>
  )
}

export function SystemDesignModule({ config }: { config: SystemDesignModuleConfig }) {
  const [completed, setCompleted] = useState<string[]>(() => loadModuleSections(config.id))
  const [activeSection, setActiveSection] = useState('intro')
  const [explanation, setExplanation] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)

  useEffect(() => saveModuleSections(config.id, completed), [completed, config.id])

  useEffect(() => {
    const observers = sections.map(([id]) => {
      const element = document.getElementById(id)
      if (!element) return null
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) setActiveSection(id)
      }, { rootMargin: '-25% 0px -60% 0px', threshold: 0.01 })
      observer.observe(element)
      return observer
    })
    return () => observers.forEach((observer) => observer?.disconnect())
  }, [])

  const progress = Math.round((completed.length / sections.length) * 100)
  const toggle = (id: string) => setCompleted((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  const isComplete = (id: string) => completed.includes(id)
  const jumpTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#/"><span className="brand-mark">P</span><span>Pattern Lab</span><span className="brand-tag">SYS</span></a>
        <div className="top-progress">
          <div className="top-progress-label"><span>{config.title}</span><span>{completed.length} / {sections.length} sections</span></div>
          <div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
        </div>
        <button className="quiet-button" onClick={() => setCompleted([])}>Reset progress</button>
      </header>

      <div className="page-grid" id="top">
        <aside className="sidebar">
          <div className="sidebar-sticky">
            <div className="course-meta">
              <span className="course-kicker">Networking Fundamentals · {String(config.order).padStart(2, '0')}</span>
              <h1>{config.title}</h1><p>{config.subtitle}</p><div className="time-chip">~{config.duration}</div>
            </div>
            <nav className="lesson-nav" aria-label="Lesson sections">
              {sections.map(([id, label], index) => (
                <button key={id} className={activeSection === id ? 'active' : ''} onClick={() => jumpTo(id)}>
                  <span className={isComplete(id) ? 'nav-number done' : 'nav-number'}>{isComplete(id) ? '✓' : index + 1}</span><span>{label}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <main className="lesson-main">
          <div className="hero">
            <div className="hero-kicker">Learn → trace → recognise → choose → explain → connect</div>
            <h2>{config.heroTitle}</h2><p>{config.heroDescription}</p>
            <div className="hero-path" style={{ gridTemplateColumns: 'repeat(6,1fr)' }}>
              {['Learn', 'Trace', 'Recognise', 'Choose', 'Explain', 'Connect'].map((item, index) => <div key={item} className="path-item"><span>{String(index + 1).padStart(2, '0')}</span>{item}</div>)}
            </div>
          </div>

          <LessonSection id="intro" number={1} eyebrow="Learn" title={`What is ${config.title}, really?`} description="Build the smallest useful model before adding terminology." complete={isComplete('intro')} onToggleComplete={() => toggle('intro')}>
            <div className="prose-card"><p className="lead">{config.introLead}</p><p>{config.introBody}</p></div>
          </LessonSection>

          <LessonSection id="mental-model" number={2} eyebrow="Understand" title="The mental model" description="Keep each protocol responsible for one clear job." complete={isComplete('mental-model')} onToggleComplete={() => toggle('mental-model')}>
            <div className="mental-model-grid">
              <div className="model-card primary-model"><span className="model-label">CORE QUESTION</span><h3>What job is this layer doing?</h3><p>System design gets easier when “the internet” stops being one blob and each layer has a clear responsibility.</p></div>
              {config.keyIdeas.map((idea) => <div className="operation-card" key={idea.title}><span className="complexity-badge log">{idea.label}</span><h3>{idea.title}</h3><p>{idea.detail}</p></div>)}
            </div>
            <div className="rule-strip"><strong>Pattern rule:</strong><span>{config.rule}</span></div>
          </LessonSection>

          <LessonSection id="trace" number={3} eyebrow="Trace" title="Follow the data" description="Narrate the request in order instead of memorising disconnected facts." complete={isComplete('trace')} onToggleComplete={() => toggle('trace')}>
            <FlowDiagram title={config.flowTitle} steps={config.flow} takeaway={config.flowTakeaway} />
          </LessonSection>

          <LessonSection id="recognise" number={4} eyebrow="Recognise" title="Spot the networking clue" description="Train the phrase → concept reflex." complete={isComplete('recognise')} onToggleComplete={() => toggle('recognise')}>
            <div className="clue-board"><div className="clue-board-title">Build these reflexes</div><div className="clue-chip-grid">{config.clues.map(([clue, thought]) => <div className="clue-chip" key={clue}><code>“{clue}”</code><span>→</span><strong>{thought}</strong></div>)}</div></div>
            <div className="question-stack">{config.recognitionQuestions.map((question) => <MultipleChoiceQuestion key={question.id} question={question} />)}</div>
          </LessonSection>

          <LessonSection id="scenarios" number={5} eyebrow="Choose → Predict" title="Make the engineering choice" description="Use the requirement in the scenario, then predict what the protocol will do." complete={isComplete('scenarios')} onToggleComplete={() => toggle('scenarios')}>
            <div className="question-stack">{config.scenarioQuestions.map((question) => <MultipleChoiceQuestion key={question.id} question={question} />)}</div>
          </LessonSection>

          <LessonSection id="explain" number={6} eyebrow="Explain" title="Say it in your own words" description="The goal is to explain clearly without hiding behind jargon." complete={isComplete('explain')} onToggleComplete={() => toggle('explain')}>
            <div className="challenge-card" style={{ padding: 24 }}>
              <span className="eyebrow">Whiteboard / interview prompt</span>
              <h3 style={{ margin: '10px 0 8px', fontSize: 20, letterSpacing: '-.03em' }}>{config.explainPrompt}</h3>
              <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.6 }}>Write the explanation you would actually give aloud. Aim for 4–8 sentences.</p>
              <textarea value={explanation} onChange={(event) => setExplanation(event.target.value)} placeholder="Explain it here before revealing the model answer…" style={{ width: '100%', minHeight: 180, resize: 'vertical', marginTop: 12, border: '1px solid var(--line)', borderRadius: 10, padding: 14, background: '#fafbfc', color: 'var(--ink)', lineHeight: 1.6 }} />
              <div className="button-row"><button className="secondary-button" onClick={() => setExplanation('')}>Clear</button><button className="primary-button" onClick={() => setShowAnswer((value) => !value)}>{showAnswer ? 'Hide model answer' : 'Reveal model answer'}</button></div>
              <div className="use-cases" style={{ marginTop: 22 }}>{config.explainChecklist.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item}</strong></div>)}</div>
              {showAnswer && <div className="interview-note" style={{ marginTop: 20 }}><strong>Model answer:</strong> {config.modelAnswer}</div>}
            </div>
          </LessonSection>

          <LessonSection id="pact-journey" number={7} eyebrow="Connect" title={config.pactTitle} description="Build one cumulative mental model around a real system." complete={isComplete('pact-journey')} onToggleComplete={() => toggle('pact-journey')}>
            <div className="split-grid">
              <div className="prose-card"><p className="lead">{config.pactBody}</p><div className="use-cases">{config.pactSteps.map((step, index) => <div key={step}><span>{String(index + 1).padStart(2, '0')}</span><strong>{step}</strong></div>)}</div></div>
              <div className="concept-visual"><span className="model-label">CURRENT NETWORK STACK</span><div style={{ display: 'grid', gap: 8, marginTop: 16 }}>{['HTTP / HTTPS', 'TLS security', 'TCP or QUIC/UDP', 'IP destination', 'DNS naming'].map((layer) => <div key={layer} style={{ padding: 15, borderRadius: 10, border: '1px solid var(--line)', background: '#fafbfc', textAlign: 'center', fontWeight: 700, fontSize: 12 }}>{layer}</div>)}</div><div className="visual-caption">Later modules will deepen TLS, IP/ports, HTTP versions, proxies and CDNs.</div></div>
            </div>
          </LessonSection>

          <LessonSection id="revision" number={8} eyebrow="Interview card" title={`${config.title} — the 60-second revision`} description="The version you should be able to reproduce from memory." complete={isComplete('revision')} onToggleComplete={() => toggle('revision')}>
            <div className="revision-card">
              <div className="revision-header"><div><span>NETWORKING FUNDAMENTALS · {config.title.toUpperCase()}</span><h3>{config.revision.headline}</h3></div><span className="revision-number">{String(config.order).padStart(2, '0')}</span></div>
              <div className="revision-grid">
                <div><h4>Think about this when…</h4><ul>{config.revision.thinkWhen.map((item) => <li key={item}>{item}</li>)}</ul></div>
                <div><h4>Vocabulary</h4><div className="tag-cloud">{config.revision.vocabulary.map((item) => <code key={item}>{item}</code>)}</div></div>
                <div><h4>Common mistakes</h4><ul>{config.revision.mistakes.map((item) => <li key={item}>{item}</li>)}</ul></div>
                <div><h4>Interview questions</h4><ul>{config.revision.interviewQuestions.map((item) => <li key={item}>{item}</li>)}</ul></div>
              </div>
              <div className="one-sentence"><span>One sentence to remember</span><strong>“{config.revision.sentence}”</strong></div>
            </div>
            <div className="finish-panel"><div><span className="eyebrow">Next step</span><h3>Re-explain the flow without looking.</h3><p>Jump back to the recognition questions or say the pact.me journey out loud.</p></div><button className="primary-button" onClick={() => jumpTo('recognise')}>Repeat recognition drills</button></div>
          </LessonSection>

          <footer className="footer-note">Pattern Lab · System Design · {config.title} · Progress persists locally in your browser.</footer>
        </main>
      </div>
    </div>
  )
}
