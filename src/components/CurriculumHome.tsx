import { useEffect, useMemo, useState } from 'react'
import { essentialCurriculum } from '../curriculum'
import { loadProgress, moduleProgressPercent, subscribeToProgress } from '../lib/progress'

export function CurriculumHome() {
  const [, refresh] = useState(0)

  useEffect(() => subscribeToProgress(() => refresh((value) => value + 1)), [])

  const state = loadProgress()
  const available = essentialCurriculum.filter((module) => module.status === 'available')
  const completedTopics = available.filter((module) => (state.modules[module.id]?.completedSections.length ?? 0) >= module.sectionCount).length
  const started = essentialCurriculum.find((module) => {
    const count = state.modules[module.id]?.completedSections.length ?? 0
    return module.status === 'available' && count > 0 && count < module.sectionCount
  }) ?? available[0]

  const overall = useMemo(() => {
    const completedSections = essentialCurriculum.reduce((sum, module) => sum + (state.modules[module.id]?.completedSections.length ?? 0), 0)
    const totalSections = essentialCurriculum.reduce((sum, module) => sum + module.sectionCount, 0)
    return Math.round((completedSections / totalSections) * 100)
  }, [state])

  return (
    <div className="curriculum-page">
      <header className="home-topbar">
        <a className="brand" href="#/"><span className="brand-mark">P</span><span>Pattern Lab</span><span className="brand-tag">DSA</span></a>
        <div className="home-progress-copy"><span>Essential curriculum</span><strong>{completedTopics} / {essentialCurriculum.length} topics complete</strong></div>
      </header>

      <main className="curriculum-main">
        <section className="curriculum-hero">
          <div className="hero-kicker">Problem → clues → pattern → approach → complexity → code</div>
          <h1>Learn to recognise algorithms,<br/><em>not memorise solutions.</em></h1>
          <p>One evolving DSA course built around diagnosis: notice the signal, choose the pattern, justify the trade-off, then implement it confidently.</p>
          <div className="overall-progress-card">
            <div><span>Your essential DSA progress</span><strong>{overall}%</strong></div>
            <div className="progress-track"><div className="progress-fill" style={{ width: `${overall}%` }} /></div>
          </div>
        </section>

        {started && (
          <section className="continue-section">
            <div className="section-kicker">Continue learning</div>
            <a className="continue-card" href={`#/modules/${started.id}`}>
              <div>
                <span className="module-number">{String(started.order).padStart(2, '0')}</span>
                <h2>{started.title}</h2>
                <p>{started.subtitle}</p>
              </div>
              <div className="continue-meta">
                <strong>{moduleProgressPercent(started.id, started.sectionCount)}%</strong>
                <span>{moduleProgressPercent(started.id, started.sectionCount) > 0 ? 'Continue module' : 'Start module'} →</span>
              </div>
            </a>
          </section>
        )}

        <section className="curriculum-section">
          <div className="curriculum-heading">
            <div><span className="section-kicker">Foundations</span><h2>Essential DSA</h2></div>
            <p>Each module uses the same Learn → Recognise → Predict → Code → Test → Explain → Mix loop.</p>
          </div>
          <div className="module-list">
            {essentialCurriculum.map((module) => {
              const percent = moduleProgressPercent(module.id, module.sectionCount)
              const availableNow = module.status === 'available'
              const body = (
                <>
                  <div className="module-index">{percent === 100 ? '✓' : String(module.order).padStart(2, '0')}</div>
                  <div className="module-copy"><h3>{module.title}</h3><p>{module.subtitle}</p><div className="signal-row">{module.signals.map((signal) => <code key={signal}>{signal}</code>)}</div></div>
                  <div className="module-status">
                    {availableNow ? <><strong>{percent}%</strong><span>{percent > 0 ? 'Continue' : 'Start'} →</span></> : <><strong>Planned</strong><span>{module.duration}</span></>}
                  </div>
                </>
              )
              return availableNow ? <a className="module-row available" href={`#/modules/${module.id}`} key={module.id}>{body}</a> : <div className="module-row" key={module.id}>{body}</div>
            })}
          </div>
        </section>

        <section className="mixed-practice-preview">
          <div><span className="section-kicker">Future mode</span><h2>Mixed Practice</h2><p>Once multiple modules are live, this is where topic labels disappear and you diagnose unfamiliar problems from their clues.</p></div>
          <div className="mixed-flow"><span>Signal</span><b>→</b><span>Pattern</span><b>→</b><span>Why</span><b>→</b><span>Code</span></div>
        </section>

        <footer className="home-footer">Pattern Lab · One application, one curriculum, one source of truth.</footer>
      </main>
    </div>
  )
}
