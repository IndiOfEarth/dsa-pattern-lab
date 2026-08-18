import { useEffect, useMemo, useState } from 'react'
import type { ChoiceQuestion, CodeChallengeData } from '../types'
import { loadModuleSections, saveModuleSections } from '../lib/progress'
import { CodeChallenge } from './CodeChallenge'
import { LessonSection } from './LessonSection'
import { MultipleChoiceQuestion } from './MultipleChoiceQuestion'

type ComplexityTone = 'fast' | 'log' | 'medium' | 'sort' | 'slow'

type Operation = {
  complexity: string
  title: string
  detail: string
  tone?: ComplexityTone
}

type Revision = {
  headline: string
  thinkWhen: string[]
  clues: string[]
  complexity: string[]
  mistakes: string[]
  problems: string[]
  sentence: string
}

export type ConceptPatternModuleConfig = {
  id: string
  order: number
  title: string
  subtitle: string
  duration: string
  heroTitle: string
  heroDescription: string
  introLead: string
  introBody: string
  useCases: Array<{ title: string; detail: string }>
  corePicture: string
  coreDetail: string
  operations: Operation[]
  rule: string
  visualItems: string[]
  visualHighlights?: number[]
  visualPointer: string
  visualCaption: string
  clueChips: Array<[string, string]>
  patternQuestions: ChoiceQuestion[]
  predictionQuestions: ChoiceQuestion[]
  challenges: CodeChallengeData[]
  complexityQuestions: ChoiceQuestion[]
  mixedQuestions: ChoiceQuestion[]
  revision: Revision
  nextStep: string
}

const sections = [
  ['intro', 'Introduction'],
  ['mental-model', 'Mental model'],
  ['visual', 'Visual exploration'],
  ['spot-pattern', 'Spot the pattern'],
  ['predict', 'Predict'],
  ['guided', 'Guided coding'],
  ['independent', 'Independent'],
  ['complexity', 'Complexity'],
  ['mixed', 'Pattern challenge'],
  ['revision', 'Revision card'],
] as const

export function ConceptPatternModule({ config }: { config: ConceptPatternModuleConfig }) {
  const [completed, setCompleted] = useState<string[]>(() => {
    try {
      return loadModuleSections(config.id, `pattern-lab-${config.id}-progress`)
    } catch {
      return []
    }
  })
  const [activeSection, setActiveSection] = useState('intro')

  useEffect(() => {
    saveModuleSections(config.id, completed)
  }, [completed, config.id])

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
  const highlights = useMemo(() => new Set(config.visualHighlights ?? []), [config.visualHighlights])

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#/">
          <span className="brand-mark">P</span>
          <span>Pattern Lab</span>
          <span className="brand-tag">DSA</span>
        </a>
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
              <span className="course-kicker">Essential DSA · {String(config.order).padStart(2, '0')}</span>
              <h1>{config.title}</h1>
              <p>{config.subtitle}</p>
              <div className="time-chip">~{config.duration}</div>
            </div>
            <nav className="lesson-nav" aria-label="Lesson sections">
              {sections.map(([id, label], i) => (
                <button key={id} className={activeSection === id ? 'active' : ''} onClick={() => jumpTo(id)}>
                  <span className={isComplete(id) ? 'nav-number done' : 'nav-number'}>{isComplete(id) ? '✓' : i + 1}</span>
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <main className="lesson-main">
          <div className="hero">
            <div className="hero-kicker">Problem → clues → pattern → approach → complexity → code</div>
            <h2>{config.heroTitle}</h2>
            <p>{config.heroDescription}</p>
            <div className="hero-path">
              {['Learn', 'Recognise', 'Predict', 'Code', 'Test', 'Explain', 'Mix'].map((item, i) => (
                <div key={item} className="path-item"><span>{String(i + 1).padStart(2, '0')}</span>{item}</div>
              ))}
            </div>
          </div>

          <LessonSection id="intro" number={1} eyebrow="Learn" title={`What are ${config.title.toLowerCase()}, really?`} description="Start with the useful mental model, then connect it to problem-solving signals." complete={isComplete('intro')} onToggleComplete={() => toggle('intro')}>
            <div className="split-grid">
              <div className="prose-card">
                <p className="lead">{config.introLead}</p>
                <p>{config.introBody}</p>
                <div className="use-cases">
                  {config.useCases.map((item, index) => <div key={item.title}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item.title}</strong><p>{item.detail}</p></div>)}
                </div>
              </div>
              <div className="concept-visual">
                <div className="index-label-row">{config.visualItems.map((_, i) => <span key={i}>{i}</span>)}</div>
                <div className="big-array">{config.visualItems.map((value, i) => <div key={`${value}-${i}`} className={highlights.has(i) ? 'highlighted' : ''}>{value}</div>)}</div>
                <div className="pointer-label">{config.visualPointer}</div>
                <div className="visual-caption">{config.visualCaption}</div>
              </div>
            </div>
          </LessonSection>

          <LessonSection id="mental-model" number={2} eyebrow="Understand" title="The smallest useful mental model" description="Think in operations and trade-offs, not memorised definitions." complete={isComplete('mental-model')} onToggleComplete={() => toggle('mental-model')}>
            <div className="mental-model-grid">
              <div className="model-card primary-model"><span className="model-label">Core picture</span><h3>{config.corePicture}</h3><p>{config.coreDetail}</p></div>
              {config.operations.map((operation) => (
                <div className="operation-card" key={operation.title}>
                  <span className={`complexity-badge ${operation.tone ?? 'medium'}`}>{operation.complexity}</span>
                  <h3>{operation.title}</h3>
                  <p>{operation.detail}</p>
                </div>
              ))}
            </div>
            <div className="rule-strip"><strong>Interview rule:</strong><span>{config.rule}</span></div>
          </LessonSection>

          <LessonSection id="visual" number={3} eyebrow="Explore" title="Read the structure before the code" description="Use the picture to decide what information can move, stay fixed, or be remembered." complete={isComplete('visual')} onToggleComplete={() => toggle('visual')}>
            <div className="concept-visual">
              <div className="index-label-row">{config.visualItems.map((_, i) => <span key={i}>{i}</span>)}</div>
              <div className="big-array">{config.visualItems.map((value, i) => <div key={`${value}-${i}`} className={highlights.has(i) ? 'highlighted' : ''}>{value}</div>)}</div>
              <div className="pointer-label">{config.visualPointer}</div>
              <div className="visual-caption">{config.visualCaption}</div>
            </div>
            <div className="interview-note"><strong>Ask yourself:</strong> what part of this structure lets me avoid repeating work?</div>
          </LessonSection>

          <LessonSection id="spot-pattern" number={4} eyebrow="Recognise" title="Spot the pattern" description="Read the clues first. The current lesson is not automatically the answer." complete={isComplete('spot-pattern')} onToggleComplete={() => toggle('spot-pattern')}>
            <div className="clue-board">
              <div className="clue-board-title">Build these reflexes</div>
              <div className="clue-chip-grid">
                {config.clueChips.map(([clue, thought]) => <div className="clue-chip" key={clue}><code>“{clue}”</code><span>→</span><strong>{thought}</strong></div>)}
              </div>
            </div>
            <div className="question-stack">{config.patternQuestions.map((q) => <MultipleChoiceQuestion key={q.id} question={q} />)}</div>
          </LessonSection>

          <LessonSection id="predict" number={5} eyebrow="Predict" title="Commit before you reveal" description="Small questions make the underlying operation feel automatic." complete={isComplete('predict')} onToggleComplete={() => toggle('predict')}>
            <div className="two-column-questions">{config.predictionQuestions.map((q) => <MultipleChoiceQuestion compact key={q.id} question={q} />)}</div>
          </LessonSection>

          <LessonSection id="guided" number={6} eyebrow="Code → Test → Explain" title="Guided coding challenge" description="Use the strongest clue, keep the state minimal, then explain the complexity." complete={isComplete('guided')} onToggleComplete={() => toggle('guided')}>
            <CodeChallenge challenge={config.challenges[0]} />
          </LessonSection>

          <LessonSection id="independent" number={7} eyebrow="Practice" title="Independent challenges" description="Less scaffolding now. Diagnose the shape of the problem before you type." complete={isComplete('independent')} onToggleComplete={() => toggle('independent')}>
            <div className="challenge-stack">{config.challenges.slice(1).map((challenge) => <CodeChallenge key={challenge.id} challenge={challenge} />)}</div>
          </LessonSection>

          <LessonSection id="complexity" number={8} eyebrow="Reason" title="Complexity intuition" description="Know what work grows with input size, and what extra memory buys you." complete={isComplete('complexity')} onToggleComplete={() => toggle('complexity')}>
            <div className="growth-race">
              <div><span className="complexity-badge fast">O(1)</span><p>Constant work</p></div>
              <div><span className="complexity-badge log">O(log n)</span><p>Discard a fraction</p></div>
              <div><span className="complexity-badge medium">O(n)</span><p>One full pass</p></div>
              <div><span className="complexity-badge sort">O(n log n)</span><p>Typical efficient sort</p></div>
              <div><span className="complexity-badge slow">O(n²)</span><p>Pairwise work</p></div>
            </div>
            <div className="question-stack">{config.complexityQuestions.map((q) => <MultipleChoiceQuestion compact key={q.id} question={q} />)}</div>
          </LessonSection>

          <LessonSection id="mixed" number={9} eyebrow="Diagnose" title="Pattern recognition challenge" description="The topic label is gone. Choose the pattern from the signals in the problem." complete={isComplete('mixed')} onToggleComplete={() => toggle('mixed')}>
            <div className="diagnosis-banner"><strong>Your process</strong><span>What is the input structure?</span><b>→</b><span>What clue constrains the problem?</span><b>→</b><span>What pattern exploits that clue?</span></div>
            <div className="question-stack">{config.mixedQuestions.map((q) => <MultipleChoiceQuestion key={q.id} question={q} />)}</div>
          </LessonSection>

          <LessonSection id="revision" number={10} eyebrow="Interview card" title={`${config.title} — the 60-second revision`} description="The compact model to revisit before practice or an interview." complete={isComplete('revision')} onToggleComplete={() => toggle('revision')}>
            <div className="revision-card">
              <div className="revision-header"><div><span>ESSENTIAL DSA · {config.title.toUpperCase()}</span><h3>{config.revision.headline}</h3></div><span className="revision-number">{String(config.order).padStart(2, '0')}</span></div>
              <div className="revision-grid">
                <div><h4>Think this pattern when…</h4><ul>{config.revision.thinkWhen.map((item) => <li key={item}>{item}</li>)}</ul></div>
                <div><h4>Common clues</h4><div className="tag-cloud">{config.revision.clues.map((clue) => <code key={clue}>{clue}</code>)}</div><h4 className="spaced">Important complexity</h4><p>{config.revision.complexity.map((item) => <span key={item}>{item}<br /></span>)}</p></div>
                <div><h4>Common mistakes</h4><ul>{config.revision.mistakes.map((item) => <li key={item}>{item}</li>)}</ul></div>
                <div><h4>Classic problems</h4><ul>{config.revision.problems.map((item) => <li key={item}>{item}</li>)}</ul></div>
              </div>
              <div className="one-sentence"><span>One sentence to remember</span><strong>“{config.revision.sentence}”</strong></div>
            </div>
            <div className="finish-panel">
              <div><span className="eyebrow">Next step</span><h3>Mix this with the patterns around it.</h3><p>{config.nextStep}</p></div>
              <button className="primary-button" onClick={() => jumpTo('spot-pattern')}>Repeat pattern drills</button>
            </div>
          </LessonSection>

          <footer className="footer-note">Pattern Lab · {config.title} module · Progress and editor code persist locally in your browser.</footer>
        </main>
      </div>
    </div>
  )
}
