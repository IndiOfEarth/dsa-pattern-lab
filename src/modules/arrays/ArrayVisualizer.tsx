import { useMemo, useState } from 'react'

const initial = ['A', 'B', 'C', 'D']

type Step = {
  cells: string[]
  movingFrom?: number
  movingTo?: number
  note: string
}

export function ArrayVisualizer() {
  const [index, setIndex] = useState(1)
  const [step, setStep] = useState(0)

  const steps = useMemo<Step[]>(() => {
    const result: Step[] = [{ cells: [...initial], note: `Insert X at index ${index}. First make room.` }]
    let cells = [...initial, '·']
    for (let from = initial.length - 1; from >= index; from--) {
      cells = [...cells]
      cells[from + 1] = cells[from]
      result.push({
        cells: [...cells],
        movingFrom: from,
        movingTo: from + 1,
        note: `Shift ${cells[from]} from index ${from} to ${from + 1}.`,
      })
    }
    cells = [...cells]
    cells[index] = 'X'
    result.push({ cells, movingTo: index, note: `Place X at index ${index}. Insertion is complete.` })
    return result
  }, [index])

  const current = steps[Math.min(step, steps.length - 1)]
  const done = step >= steps.length - 1

  const changeIndex = (value: number) => {
    setIndex(value)
    setStep(0)
  }

  return (
    <div className="visualizer-shell">
      <div className="visualizer-controls">
        <div>
          <div className="eyebrow">Interactive demo</div>
          <h3>Why middle insertion costs O(n)</h3>
        </div>
        <div className="index-control">
          <label htmlFor="insert-index">Insert at index</label>
          <select id="insert-index" value={index} onChange={(e) => changeIndex(Number(e.target.value))}>
            {[0, 1, 2, 3, 4].map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
      </div>

      <div className="array-stage" aria-label="Array insertion visualization">
        {current.cells.map((value, i) => (
          <div className="array-cell-wrap" key={`${i}-${step}`}>
            <div className={`array-cell ${current.movingTo === i ? 'active' : ''} ${value === '·' ? 'empty' : ''}`}>
              {value}
            </div>
            <div className="array-index">{i}</div>
          </div>
        ))}
      </div>

      <div className="visualizer-note">
        <span className="step-pill">Step {step + 1} / {steps.length}</span>
        <p>{current.note}</p>
      </div>
      <div className="button-row">
        <button className="secondary-button" onClick={() => setStep(0)} disabled={step === 0}>Reset</button>
        <button className="primary-button" onClick={() => setStep((s) => Math.min(s + 1, steps.length - 1))} disabled={done}>
          {done ? 'Done' : 'Next step'}
        </button>
      </div>
      <div className="visualizer-takeaway">
        <strong>Intuition:</strong> the array keeps elements in indexed order. Creating a gap near the front can force many existing values to move one slot.
      </div>
    </div>
  )
}
