import { useEffect, useMemo, useState } from 'react'
import * as ts from 'typescript'
import type { CodeChallengeData, TestCase } from '../types'

type TestResult = {
  label: string
  passed: boolean
  expected: unknown
  actual?: unknown
  error?: string
}

function runInWorker(code: string, functionName: string, tests: TestCase[]): Promise<TestResult[]> {
  const compiled = ts.transpileModule(code, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.None,
      strict: false,
    },
  }).outputText

  const workerSource = `
self.fetch = () => Promise.reject(new Error('Network access disabled in coding sandbox'));
self.XMLHttpRequest = undefined;
self.WebSocket = undefined;
self.EventSource = undefined;
self.importScripts = () => { throw new Error('importScripts disabled'); };

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
self.onmessage = (event) => {
  const { compiled, functionName, tests } = event.data;
  try {
    const factory = new Function(compiled + '\\n; return typeof ' + functionName + ' === "function" ? ' + functionName + ' : undefined;');
    const fn = factory();
    if (typeof fn !== 'function') throw new Error('Could not find function "' + functionName + '". Keep the starter function name unchanged.');

    const results = tests.map((test) => {
      try {
        const safeArgs = structuredClone(test.args);
        const actual = fn(...safeArgs);
        return { label: test.label, passed: same(actual, test.expected), expected: test.expected, actual };
      } catch (error) {
        return { label: test.label, passed: false, expected: test.expected, error: error instanceof Error ? error.message : String(error) };
      }
    });
    self.postMessage({ ok: true, results });
  } catch (error) {
    self.postMessage({ ok: false, error: error instanceof Error ? error.message : String(error) });
  }
};
  `

  return new Promise((resolve) => {
    const blob = new Blob([workerSource], { type: 'text/javascript' })
    const url = URL.createObjectURL(blob)
    const worker = new Worker(url)
    const timeout = window.setTimeout(() => {
      worker.terminate()
      URL.revokeObjectURL(url)
      resolve([{ label: 'Execution', passed: false, expected: 'Finish within 1.5s', error: 'Execution timed out. Check for an infinite loop or unexpectedly expensive code.' }])
    }, 1500)

    worker.onmessage = (event) => {
      window.clearTimeout(timeout)
      worker.terminate()
      URL.revokeObjectURL(url)
      if (event.data.ok) resolve(event.data.results)
      else resolve([{ label: 'Compile / runtime', passed: false, expected: 'Valid TypeScript solution', error: event.data.error }])
    }

    worker.onerror = (event) => {
      window.clearTimeout(timeout)
      worker.terminate()
      URL.revokeObjectURL(url)
      resolve([{ label: 'Worker', passed: false, expected: 'Valid TypeScript solution', error: event.message }])
    }

    worker.postMessage({ compiled, functionName, tests })
  })
}

export function CodeChallenge({ challenge }: { challenge: CodeChallengeData }) {
  const storageKey = `pattern-lab-code-${challenge.id}`
  const [code, setCode] = useState(() => localStorage.getItem(storageKey) ?? challenge.starter)
  const [results, setResults] = useState<TestResult[] | null>(null)
  const [running, setRunning] = useState(false)
  const [hintCount, setHintCount] = useState(0)
  const [solutionVisible, setSolutionVisible] = useState(false)

  useEffect(() => {
    localStorage.setItem(storageKey, code)
  }, [code, storageKey])

  const lineNumbers = useMemo(() => Array.from({ length: Math.max(1, code.split('\n').length) }, (_, i) => i + 1), [code])
  const passedCount = results?.filter((r) => r.passed).length ?? 0

  const runTests = async () => {
    setRunning(true)
    const next = await runInWorker(code, challenge.functionName, challenge.tests)
    setResults(next)
    setRunning(false)
  }

  const reset = () => {
    setCode(challenge.starter)
    setResults(null)
    setHintCount(0)
    setSolutionVisible(false)
  }

  return (
    <article className="challenge-card">
      <div className="challenge-topline">
        <div>
          <div className="eyebrow">{challenge.eyebrow}</div>
          <h3>{challenge.title}</h3>
        </div>
        <span className={`difficulty ${challenge.difficulty.toLowerCase()}`}>{challenge.difficulty}</span>
      </div>
      <p className="challenge-description">{challenge.description}</p>

      <div className="challenge-meta-grid">
        <div className="mini-panel">
          <span className="mini-label">Examples</span>
          {challenge.examples.map((example) => <code key={example}>{example}</code>)}
        </div>
        <div className="mini-panel">
          <span className="mini-label">Constraints</span>
          {challenge.constraints.map((constraint) => <div key={constraint}>{constraint}</div>)}
        </div>
      </div>

      <div className="editor-shell">
        <div className="editor-toolbar">
          <div className="editor-title"><span className="status-dot" /> solution.ts</div>
          <div className="editor-actions">
            <button className="icon-text-button" onClick={reset}>Reset</button>
            <button className="icon-text-button" onClick={() => setHintCount((n) => Math.min(n + 1, challenge.hints.length))}>Hint {hintCount < challenge.hints.length ? `(${hintCount + 1})` : ''}</button>
            <button className="icon-text-button" onClick={() => setSolutionVisible((v) => !v)}>{solutionVisible ? 'Hide solution' : 'Show solution'}</button>
          </div>
        </div>
        <div className="editor-body">
          <div className="line-numbers" aria-hidden="true">{lineNumbers.map((n) => <span key={n}>{n}</span>)}</div>
          <textarea
            aria-label={`TypeScript editor for ${challenge.title}`}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
          />
        </div>
        <div className="editor-footer">
          <span>TypeScript · isolated local runner · 1.5s limit</span>
          <button className="run-button" onClick={runTests} disabled={running}>{running ? 'Running…' : '▶ Run tests'}</button>
        </div>
      </div>

      {hintCount > 0 && (
        <div className="hint-stack">
          {challenge.hints.slice(0, hintCount).map((hint, i) => (
            <div className="hint-card" key={hint}><span>Hint {i + 1}</span><p>{hint}</p></div>
          ))}
        </div>
      )}

      {results && (
        <div className={`test-results ${passedCount === results.length ? 'all-pass' : ''}`}>
          <div className="test-summary">
            <strong>{passedCount === results.length ? 'All tests passed' : `${passedCount} / ${results.length} tests passed`}</strong>
            <span>{passedCount === results.length ? 'Nice — now explain the complexity before moving on.' : 'Use the failing case as a clue, then try again.'}</span>
          </div>
          <div className="test-list">
            {results.map((result, i) => (
              <div className="test-row" key={`${result.label}-${i}`}>
                <span className={result.passed ? 'test-icon pass' : 'test-icon fail'}>{result.passed ? '✓' : '×'}</span>
                <div>
                  <strong>{result.label}</strong>
                  {!result.passed && (
                    <div className="test-detail">
                      {result.error ? result.error : <>Expected <code>{JSON.stringify(result.expected)}</code>, got <code>{JSON.stringify(result.actual)}</code></>}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {solutionVisible && (
        <div className="solution-panel">
          <div className="solution-heading"><span>Reference solution</span><div><b>{challenge.time}</b> time · <b>{challenge.space}</b> space</div></div>
          <pre><code>{challenge.solution}</code></pre>
          <p>{challenge.solutionExplanation}</p>
          <div className="remember-line"><strong>Pattern to remember:</strong> {challenge.remember}</div>
        </div>
      )}
    </article>
  )
}
