import { useEffect, useMemo, useState } from 'react'
import { loadModuleSections, saveModuleSections } from '../../lib/progress'
import { ArrayVisualizer } from './ArrayVisualizer'
import { CodeChallenge } from '../../components/CodeChallenge'
import { LessonSection } from '../../components/LessonSection'
import { MultipleChoiceQuestion } from '../../components/MultipleChoiceQuestion'
import { challenges, complexityQuestions, mixedQuestions, patternQuestions, predictionQuestions } from './content'

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

export function ArraysModule() {
  const [completed, setCompleted] = useState<string[]>(() => {
    try {
      return loadModuleSections('arrays', 'pattern-lab-arrays-progress')
    } catch {
      return []
    }
  })
  const [activeSection, setActiveSection] = useState('intro')

  useEffect(() => {
    saveModuleSections('arrays', completed)
  }, [completed])

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

  const clueChips = useMemo(() => [
    ['known index', 'direct array access'],
    ['every element', 'traversal'],
    ['contiguous', 'window / range thinking'],
    ['sorted input', 'binary search or pointers'],
    ['fast lookup', 'hash structure'],
    ['pair of values', 'two pointers / hash map'],
    ['most recent item', 'stack'],
  ], [])

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#/">
          <span className="brand-mark">P</span>
          <span>Pattern Lab</span>
          <span className="brand-tag">DSA</span>
        </a>
        <div className="top-progress">
          <div className="top-progress-label"><span>Arrays</span><span>{completed.length} / {sections.length} sections</span></div>
          <div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
        </div>
        <button className="quiet-button" onClick={() => {
          setCompleted([])
          sections.forEach(() => {})
        }}>Reset progress</button>
      </header>

      <div className="page-grid" id="top">
        <aside className="sidebar">
          <div className="sidebar-sticky">
            <div className="course-meta">
              <span className="course-kicker">Essential DSA · 01</span>
              <h1>Arrays</h1>
              <p>Build the instinct to see indexed, sequential data — and know when a simple pass is enough.</p>
              <div className="time-chip">~35–45 min</div>
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
            <h2>Learn arrays as a <em>problem-solving primitive</em>, not a definition.</h2>
            <p>By the end, you should be able to look at a problem and decide whether indexed sequential storage, a one-pass traversal, or a different pattern is the right starting point.</p>
            <div className="hero-path">
              {['Learn', 'Recognise', 'Predict', 'Code', 'Test', 'Explain', 'Mix'].map((item, i) => (
                <div key={item} className="path-item"><span>{String(i + 1).padStart(2, '0')}</span>{item}</div>
              ))}
            </div>
          </div>

          <LessonSection id="intro" number={1} eyebrow="Learn" title="What is an array, really?" description="Start with the intuition: ordered slots you can address directly." complete={isComplete('intro')} onToggleComplete={() => toggle('intro')}>
            <div className="split-grid">
              <div className="prose-card">
                <p className="lead">An array is a row of values where each position has an address: its <strong>index</strong>.</p>
                <p>If you already know the index, you can jump straight to that value. That is the superpower. Arrays exist because programs constantly need an efficient way to keep ordered collections and revisit positions predictably.</p>
                <div className="use-cases">
                  <div><span>01</span><strong>Ordered data</strong><p>scores, prices, pixels, events</p></div>
                  <div><span>02</span><strong>Repeated scanning</strong><p>totals, min/max, transforms</p></div>
                  <div><span>03</span><strong>Position matters</strong><p>neighbours, ranges, windows</p></div>
                </div>
              </div>
              <div className="concept-visual">
                <div className="index-label-row">{[0,1,2,3,4].map(i => <span key={i}>{i}</span>)}</div>
                <div className="big-array">{['12','7','31','4','19'].map((v,i) => <div key={i} className={i===2 ? 'highlighted' : ''}>{v}</div>)}</div>
                <div className="pointer-label">index 2 → value 31</div>
                <div className="visual-caption">You do not search through 12 and 7 first. The index identifies the slot directly.</div>
              </div>
            </div>
            <div className="interview-note"><strong>Why interviews care:</strong> arrays are the surface on which many other patterns operate — two pointers, sliding windows, prefix sums, binary search, sorting, dynamic programming and more.</div>
          </LessonSection>

          <LessonSection id="mental-model" number={2} eyebrow="Understand" title="The smallest useful mental model" description="Think in operations and trade-offs, not memorised definitions." complete={isComplete('mental-model')} onToggleComplete={() => toggle('mental-model')}>
            <div className="mental-model-grid">
              <div className="model-card primary-model"><span className="model-label">Core picture</span><h3>Ordered slots + direct indexing</h3><p>Great when you care about position, neighbours, ranges, or scanning values in order.</p></div>
              <div className="operation-card"><span className="complexity-badge fast">O(1)</span><h3>Read / write by index</h3><p><code>nums[i]</code> when you already know <code>i</code>.</p></div>
              <div className="operation-card"><span className="complexity-badge fast">O(1)*</span><h3>Append at end</h3><p><code>push()</code> is typically amortised constant time.</p></div>
              <div className="operation-card"><span className="complexity-badge medium">O(n)</span><h3>Search unsorted values</h3><p>You may have to inspect every element.</p></div>
              <div className="operation-card"><span className="complexity-badge medium">O(n)</span><h3>Insert / remove near front</h3><p>Other values may need to shift indices.</p></div>
              <div className="operation-card"><span className="complexity-badge medium">O(n)</span><h3>Copy / transform</h3><p>Building another array usually touches every item and uses output space.</p></div>
            </div>
            <div className="rule-strip"><strong>Interview rule:</strong><span>Before reaching for a clever technique, ask: “Can I solve this with one clean pass and a small amount of state?”</span></div>
          </LessonSection>

          <LessonSection id="visual" number={3} eyebrow="Explore" title="See the trade-off" description="Direct access is cheap. Creating space in the middle is not." complete={isComplete('visual')} onToggleComplete={() => toggle('visual')}>
            <ArrayVisualizer />
          </LessonSection>

          <LessonSection id="spot-pattern" number={4} eyebrow="Recognise" title="Spot the pattern" description="Read the clues first. Do not assume this lesson’s topic is always the answer." complete={isComplete('spot-pattern')} onToggleComplete={() => toggle('spot-pattern')}>
            <div className="clue-board">
              <div className="clue-board-title">Build these reflexes</div>
              <div className="clue-chip-grid">
                {clueChips.map(([clue, thought]) => <div className="clue-chip" key={clue}><code>“{clue}”</code><span>→</span><strong>{thought}</strong></div>)}
              </div>
            </div>
            <div className="question-stack">{patternQuestions.map(q => <MultipleChoiceQuestion key={q.id} question={q} />)}</div>
          </LessonSection>

          <LessonSection id="predict" number={5} eyebrow="Predict" title="Commit before you reveal" description="Tiny questions force you to model what the array operation is actually doing." complete={isComplete('predict')} onToggleComplete={() => toggle('predict')}>
            <div className="two-column-questions">{predictionQuestions.map(q => <MultipleChoiceQuestion compact key={q.id} question={q} />)}</div>
          </LessonSection>

          <LessonSection id="guided" number={6} eyebrow="Code → Test → Explain" title="Guided coding challenge" description="Start simple: one traversal, one piece of state, clear complexity." complete={isComplete('guided')} onToggleComplete={() => toggle('guided')}>
            <CodeChallenge challenge={challenges[0]} />
          </LessonSection>

          <LessonSection id="independent" number={7} eyebrow="Practice" title="Independent challenges" description="Slightly less guidance. One challenge deliberately asks you to beat the obvious sorting approach." complete={isComplete('independent')} onToggleComplete={() => toggle('independent')}>
            <div className="challenge-stack">{challenges.slice(1).map(challenge => <CodeChallenge key={challenge.id} challenge={challenge} />)}</div>
          </LessonSection>

          <LessonSection id="complexity" number={8} eyebrow="Reason" title="Complexity intuition" description="Treat Big-O as a scaling question: what work grows when n grows?" complete={isComplete('complexity')} onToggleComplete={() => toggle('complexity')}>
            <div className="growth-race">
              <div><span className="complexity-badge fast">O(1)</span><p>Same amount of work</p></div>
              <div><span className="complexity-badge log">O(log n)</span><p>Grows very slowly</p></div>
              <div><span className="complexity-badge medium">O(n)</span><p>Work grows with input</p></div>
              <div><span className="complexity-badge sort">O(n log n)</span><p>Common efficient sorting</p></div>
              <div><span className="complexity-badge slow">O(n²)</span><p>Pairwise work gets expensive</p></div>
            </div>
            <div className="question-stack">{complexityQuestions.map(q => <MultipleChoiceQuestion compact key={q.id} question={q} />)}</div>
          </LessonSection>

          <LessonSection id="mixed" number={9} eyebrow="Diagnose" title="Pattern recognition challenge" description="The topic label is gone now. Diagnose the problem from its signals." complete={isComplete('mixed')} onToggleComplete={() => toggle('mixed')}>
            <div className="diagnosis-banner"><strong>Your process</strong><span>What is the input structure?</span><b>→</b><span>What clue constrains the problem?</span><b>→</b><span>What pattern exploits that clue?</span></div>
            <div className="question-stack">{mixedQuestions.map(q => <MultipleChoiceQuestion key={q.id} question={q} />)}</div>
          </LessonSection>

          <LessonSection id="revision" number={10} eyebrow="Interview card" title="Arrays — the 60-second revision" description="The compact mental model to revisit before practice or an interview." complete={isComplete('revision')} onToggleComplete={() => toggle('revision')}>
            <div className="revision-card">
              <div className="revision-header"><div><span>ESSENTIAL DSA · ARRAYS</span><h3>Think arrays when position and order matter.</h3></div><span className="revision-number">01</span></div>
              <div className="revision-grid">
                <div><h4>Think arrays when…</h4><ul><li>You need indexed access.</li><li>You need to traverse ordered values.</li><li>You care about neighbours or contiguous ranges.</li><li>A one-pass aggregate may be enough.</li></ul></div>
                <div><h4>Common clues</h4><div className="tag-cloud"><code>index</code><code>contiguous</code><code>subarray</code><code>in-place</code><code>left → right</code><code>sorted</code></div><h4 className="spaced">Important complexity</h4><p><b>Read by index:</b> O(1)<br/><b>Unsorted scan:</b> O(n)<br/><b>Front/middle insert:</b> O(n)</p></div>
                <div><h4>Common mistakes</h4><ul><li>Sorting when one pass is enough.</li><li>Using 0 as an initial max when values can be negative.</li><li>Forgetting mutation vs new-array space cost.</li><li>Off-by-one index errors.</li></ul></div>
                <div><h4>Classic problems</h4><ul><li>Min / max / running totals</li><li>Remove or transform elements</li><li>Second-largest value</li><li>Two Sum <span className="muted">(with hash map)</span></li><li>Fixed windows <span className="muted">(next pattern)</span></li></ul></div>
              </div>
              <div className="one-sentence"><span>One sentence to remember</span><strong>“An array is cheap to jump around in, but expensive to reshape in the middle.”</strong></div>
            </div>
            <div className="finish-panel">
              <div><span className="eyebrow">Next step</span><h3>Don’t memorise “arrays”. Mix them.</h3><p>The skill becomes durable when you solve problems where the pattern is hidden. Revisit the final diagnosis set after learning hash maps, two pointers and sliding windows.</p></div>
              <button className="primary-button" onClick={() => jumpTo('spot-pattern')}>Repeat pattern drills</button>
            </div>
          </LessonSection>

          <footer className="footer-note">Pattern Lab · Arrays module · Progress and editor code persist locally in your browser.</footer>
        </main>
      </div>
    </div>
  )
}

export default ArraysModule
