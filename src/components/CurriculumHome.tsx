import { useEffect, useMemo, useState } from 'react'
import { essentialCurriculum, systemDesignCurriculum, type CurriculumModule } from '../curriculum'
import { loadProgress, moduleProgressPercent, subscribeToProgress } from '../lib/progress'

function ModuleList({ modules }: { modules: CurriculumModule[] }) {
  return (
    <div className="module-list">
      {modules.map((module) => {
        const percent = moduleProgressPercent(module.id, module.sectionCount)
        const availableNow = module.status === 'available'
        const body = (
          <>
            <div className="module-index">{percent === 100 ? '✓' : String(module.order).padStart(2, '0')}</div>
            <div className="module-copy">
              <h3>{module.title}</h3>
              <p>{module.subtitle}</p>
              <div className="signal-row">{module.signals.map((signal) => <code key={signal}>{signal}</code>)}</div>
            </div>
            <div className="module-status">
              {availableNow ? <><strong>{percent}%</strong><span>{percent > 0 ? 'Continue' : 'Start'} →</span></> : <><strong>Planned</strong><span>{module.duration}</span></>}
            </div>
          </>
        )
        return availableNow ? <a className="module-row available" href={`#/modules/${module.id}`} key={module.id}>{body}</a> : <div className="module-row" key={module.id}>{body}</div>
      })}
    </div>
  )
}

export function CurriculumHome() {
  const [, refresh] = useState(0)

  useEffect(() => subscribeToProgress(() => refresh((value) => value + 1)), [])

  const state = loadProgress()
  const dsaAvailable = essentialCurriculum.filter((module) => module.status === 'available')
  const systemAvailable = systemDesignCurriculum.filter((module) => module.status === 'available')
  const allAvailable = [...dsaAvailable, ...systemAvailable]

  const dsaCompletedTopics = dsaAvailable.filter((module) => (state.modules[module.id]?.completedSections.length ?? 0) >= module.sectionCount).length
  const systemCompletedTopics = systemAvailable.filter((module) => (state.modules[module.id]?.completedSections.length ?? 0) >= module.sectionCount).length

  const started = allAvailable.find((module) => {
    const count = state.modules[module.id]?.completedSections.length ?? 0
    return count > 0 && count < module.sectionCount
  }) ?? dsaAvailable[0]

  const dsaOverall = useMemo(() => {
    const completedSections = essentialCurriculum.reduce((sum, module) => sum + (state.modules[module.id]?.completedSections.length ?? 0), 0)
    const totalSections = essentialCurriculum.reduce((sum, module) => sum + module.sectionCount, 0)
    return Math.round((completedSections / totalSections) * 100)
  }, [state])

  const systemOverall = useMemo(() => {
    const completedSections = systemDesignCurriculum.reduce((sum, module) => sum + (state.modules[module.id]?.completedSections.length ?? 0), 0)
    const totalSections = systemDesignCurriculum.reduce((sum, module) => sum + module.sectionCount, 0)
    return Math.round((completedSections / totalSections) * 100)
  }, [state])

  const startedIsSystem = started ? systemDesignCurriculum.some((module) => module.id === started.id) : false

  return (
    <div className="curriculum-page">
      <header className="home-topbar">
        <a className="brand" href="#/"><span className="brand-mark">P</span><span>Pattern Lab</span><span className="brand-tag">CS</span></a>
        <div className="home-progress-copy"><span>Learning tracks</span><strong>{dsaCompletedTopics} DSA · {systemCompletedTopics} System Design complete</strong></div>
      </header>

      <main className="curriculum-main">
        <section className="curriculum-hero">
          <div className="hero-kicker">Recognise → reason → explain → build</div>
          <h1>Learn to recognise the pattern,<br/><em>not memorise the answer.</em></h1>
          <p>One evolving Computer Science lab for DSA and system design: diagnose the clues, build the mental model, justify the trade-off, then practise until the reasoning feels natural.</p>

          <div className="overall-progress-card">
            <div><span>Your essential DSA progress</span><strong>{dsaOverall}%</strong></div>
            <div className="progress-track"><div className="progress-fill" style={{ width: `${dsaOverall}%` }} /></div>
          </div>
          <div className="overall-progress-card" style={{ marginTop: 10 }}>
            <div><span>Your System Design progress</span><strong>{systemOverall}%</strong></div>
            <div className="progress-track"><div className="progress-fill" style={{ width: `${systemOverall}%` }} /></div>
          </div>
        </section>

        {started && (
          <section className="continue-section">
            <div className="section-kicker">Continue learning · {startedIsSystem ? 'System Design' : 'DSA'}</div>
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
            <p>Learn the recurring problem shapes: clues → pattern → approach → complexity → implementation.</p>
          </div>
          <ModuleList modules={essentialCurriculum} />
        </section>

        <section className="curriculum-section">
          <div className="curriculum-heading">
            <div><span className="section-kicker">System Design · Track 01</span><h2>Networking Fundamentals</h2></div>
            <p>Learn to trace real requests through the internet: Learn → Trace → Recognise → Choose → Explain → Connect. The first three modules build toward one question: <strong>what actually happens after you type pact.me and press Enter?</strong></p>
          </div>
          <ModuleList modules={systemDesignCurriculum} />
        </section>

        <section className="mixed-practice-preview">
          <div><span className="section-kicker">Future mode</span><h2>Mixed Practice</h2><p>Eventually topic labels disappear: diagnose an unfamiliar coding problem or system scenario from its clues, then justify the pattern or architecture you choose.</p></div>
          <div className="mixed-flow"><span>Signal</span><b>→</b><span>Pattern</span><b>→</b><span>Why</span><b>→</b><span>Explain</span></div>
        </section>

        <footer className="home-footer">Pattern Lab · One application, evolving DSA + System Design curriculum, one source of truth.</footer>
      </main>
    </div>
  )
}
