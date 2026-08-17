import type { ReactNode } from 'react'

type Props = {
  id: string
  number: number
  eyebrow: string
  title: string
  description?: string
  complete: boolean
  onToggleComplete: () => void
  children: ReactNode
}

export function LessonSection({ id, number, eyebrow, title, description, complete, onToggleComplete, children }: Props) {
  return (
    <section className="lesson-section" id={id}>
      <div className="section-heading">
        <div className="section-index">{String(number).padStart(2, '0')}</div>
        <div>
          <div className="eyebrow">{eyebrow}</div>
          <h2>{title}</h2>
          {description && <p className="section-description">{description}</p>}
        </div>
      </div>
      <div className="section-body">{children}</div>
      <div className="section-complete-row">
        <button className={complete ? 'complete-button complete' : 'complete-button'} onClick={onToggleComplete}>
          <span>{complete ? '✓' : '○'}</span>
          {complete ? 'Section complete' : 'Mark section complete'}
        </button>
      </div>
    </section>
  )
}
