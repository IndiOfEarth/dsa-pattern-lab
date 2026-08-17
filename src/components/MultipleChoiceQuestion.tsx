import { useState } from 'react'
import type { ChoiceQuestion } from '../types'

type Props = {
  question: ChoiceQuestion
  compact?: boolean
}

export function MultipleChoiceQuestion({ question, compact = false }: Props) {
  const [selected, setSelected] = useState<string>('')
  const [submitted, setSubmitted] = useState(false)
  const correct = submitted && selected === question.answer

  const retry = () => {
    setSelected('')
    setSubmitted(false)
  }

  return (
    <article className={compact ? 'question-card compact' : 'question-card'}>
      <div className="question-prompt"><code>{question.prompt}</code></div>
      <div className="choice-grid">
        {question.choices.map((choice) => {
          const state = submitted
            ? choice === question.answer
              ? 'correct'
              : choice === selected
                ? 'wrong'
                : ''
            : selected === choice
              ? 'selected'
              : ''
          return (
            <button
              key={choice}
              className={`choice ${state}`}
              onClick={() => !submitted && setSelected(choice)}
              disabled={submitted}
            >
              <span className="choice-dot" />
              {choice}
            </button>
          )
        })}
      </div>
      {!submitted ? (
        <button className="primary-button small" disabled={!selected} onClick={() => setSubmitted(true)}>
          Check answer
        </button>
      ) : (
        <div className={`feedback ${correct ? 'success' : 'error'}`}>
          <div className="feedback-title">{correct ? 'Correct' : `Not quite — ${question.answer}`}</div>
          {question.signal && (
            <div className="signal-line"><strong>Signal</strong><span>→</span><span>{question.signal}</span></div>
          )}
          <p>{question.explanation}</p>
          {question.tempting && <p className="muted"><strong>Tempting alternative:</strong> {question.tempting}</p>}
          {!correct && <button className="text-button" onClick={retry}>Retry</button>}
        </div>
      )}
    </article>
  )
}
