import { useEffect, useMemo, useState } from 'react'
import * as ts from 'typescript'
import type { CodeChallengeData, TestCase } from '../types'
import { pythonChallenges } from '../lib/pythonChallenges'
import { runPythonTests } from '../lib/pythonRunner'
import { CodeEditor, type EditorLanguage } from './CodeEditor'

type TestResult = {
  label: string
  passed: boolean
  expected: unknown
  actual?: unknown
  error?: string
}

const LANGUAGE_KEY = 'dsa-pattern-lab:preferred-language'

function runTypeScriptTests(code: string, functionName: string, tests: TestCase[]): Promise<TestResult[]> {
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

function storageKey(challengeId: string, language: EditorLanguage) {
  return `pattern-lab-code-${challengeId}:${language}`
}

function initialLanguage(challengeId: string): EditorLanguage {
  const preferred = localStorage.getItem(LANGUAGE_KEY)
  return preferred === 'python' && pythonChallenges[challengeId] ? 'python' : 'typescript'
}

function initialCode(challenge: CodeChallengeData, language: EditorLanguage) {
  const saved = localStorage.getItem(storageKey(challenge.id, language))
  if (saved != null) return saved

  if (language === 'typescript') {
    const legacy = localStorage.getItem(`pattern-lab-code-${challenge.id}`)
    if (legacy != null) return legacy
    return challenge.starter
  }

  return pythonChallenges[challenge.id]?.starter ?? challenge.starter
}

export function CodeChallenge({ challenge }: { challenge: CodeChallengeData }) {
  const python = pythonChallenges[challenge.id]
  const firstLanguage = initialLanguage(challenge.id)
  const [language, setLanguage] = useState<EditorLanguage>(firstLanguage)
  const [code, setCode] = useState(() => initialCode(challenge, firstLanguage))
  const [results, setResults] = useState<TestResult[] | null>(null)
  const [running, setRunning] = useState(false)
  const [hintCount, setHintCount] = useState(0)
  const [solutionVisible, setSolutionVisible] = useState(false)

  useEffect(() => {
    localStorage.setItem(storageKey(challenge.id, language), code)
  }, [challenge.id, code, language])

  const config = useMemo(() => {
    if (language === 'python' && python) {
      return {
        functionName: python.functionName,
        starter: python.starter,
        solution: python.solution,
        examples: python.examples ?? challenge.examples,
      }
    }

    return {
      functionName: challenge.functionName,
      starter: challenge.starter,
      solution: challenge.solution,
      examples: challenge.examples,
    }
  }, [challenge, language, python])

  const passedCount = results?.filter((r) => r.passed).length ?? 0

  const runTests = async () => {
    setRunning(true)
    const next = language === 'python'
      ? await runPythonTests(code, config.functionName, challenge.tests)
      : await runTypeScriptTests(code, config.functionName, challenge.tests)
    setResults(next)
    setRunning(false)
  }

  const reset = () => {
    setCode(config.starter)
    setResults(null)
    setHintCount(0)
    setSolutionVisible(false)
  }

  const changeLanguage = (next: EditorLanguage) => {
    if (next === language || (next === 'python' && !python)) return
    localStorage.setItem(storageKey(challenge.id, language), code)
    localStorage.setItem(LANGUAGE_KEY, next)
    setLanguage(next)
    setCode(initialCode(challenge, next))
    setResults(null)
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
          {config.examples.map((example) => <code key={example}>{example}</code>)}
        </div>
        <div className="mini-panel">
          <span className="mini-label">Constraints</span>
          {challenge.constraints.map((constraint) => <div key={constraint}>{constraint}</div>)}
        </div>
      </div>

      <div className="editor-shell">
        <div className="editor-toolbar">
          <div className="editor-title"><span className="status-dot" /> {language === 'python' ? 'solution.py' : 'solution.ts'}</div>
          <div className="editor-actions">
            <select
              className="language-select"
              aria-label="Challenge language"
              value={language}
              onChange={(event) => changeLanguage(event.target.value as EditorLanguage)}
            >
              <option value="typescript">TypeScript</option>
              {python && <option value="python">Python</option>}
            </select>
            <button className="icon-text-button" onClick={reset}>Reset</button>
            <button className="icon-text-button" onClick={() => setHintCount((n) => Math.min(n + 1, challenge.hints.length))}>Hint {hintCount < challenge.hints.length ? `(${hintCount + 1})` : ''}</button>
            <button className="icon-text-button" onClick={() => setSolutionVisible((v) => !v)}>{solutionVisible ? 'Hide solution' : 'Show solution'}</button>
          </div>
        </div>

        <CodeEditor
          ariaLabel={`${language === 'python' ? 'Python' : 'TypeScript'} editor for ${challenge.title}`}
          value={code}
          onChange={setCode}
          language={language}
        />

        <div className="editor-footer">
          <span>{language === 'python' ? 'Python · Pyodide browser runtime · first run loads Python' : 'TypeScript · isolated local runner · 1.5s limit'}</span>
          <button className="run-button" onClick={runTests} disabled={running}>{running ? (language === 'python' ? 'Loading / running Python…' : 'Running…') : '▶ Run tests'}</button>
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
          <div className="solution-heading"><span>Reference solution · {language === 'python' ? 'Python' : 'TypeScript'}</span><div><b>{challenge.time}</b> time · <b>{challenge.space}</b> space</div></div>
          <pre><code>{config.solution}</code></pre>
          <p>{challenge.solutionExplanation}</p>
          <div className="remember-line"><strong>Pattern to remember:</strong> {challenge.remember}</div>
        </div>
      )}
    </article>
  )
}
