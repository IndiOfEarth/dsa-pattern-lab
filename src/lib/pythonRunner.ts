import type { TestCase } from '../types'

export type PythonTestResult = {
  label: string
  passed: boolean
  expected: unknown
  actual?: unknown
  error?: string
}

type PendingRun = {
  resolve: (results: PythonTestResult[]) => void
  timeout: number
}

const PYODIDE_VERSION = '0.28.2'
const PYODIDE_BASE = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`

let worker: Worker | null = null
let readyPromise: Promise<Worker> | null = null
let pendingRuns = new Map<string, PendingRun>()

function resetWorker(message = 'Python runner restarted.') {
  worker?.terminate()
  worker = null
  readyPromise = null

  for (const pending of pendingRuns.values()) {
    window.clearTimeout(pending.timeout)
    pending.resolve([{ label: 'Python runner', passed: false, expected: 'Successful execution', error: message }])
  }
  pendingRuns = new Map()
}

function createPythonWorker(): Promise<Worker> {
  if (worker) return Promise.resolve(worker)
  if (readyPromise) return readyPromise

  const source = `
const PYODIDE_BASE = ${JSON.stringify(PYODIDE_BASE)};
let pyodidePromise;

async function getPyodide() {
  if (!pyodidePromise) {
    importScripts(PYODIDE_BASE + 'pyodide.js');
    pyodidePromise = loadPyodide({ indexURL: PYODIDE_BASE });
  }
  return pyodidePromise;
}

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

self.onmessage = async (event) => {
  const { requestId, code, functionName, tests } = event.data;
  try {
    const pyodide = await getPyodide();
    await pyodide.runPythonAsync(code);

    const results = [];
    for (const test of tests) {
      try {
        pyodide.globals.set('__pattern_function_name', functionName);
        pyodide.globals.set('__pattern_args_json', JSON.stringify(test.args));
        const payload = await pyodide.runPythonAsync(\`
import json
_args = json.loads(__pattern_args_json)
_fn = globals().get(__pattern_function_name)
if not callable(_fn):
    raise NameError(f'Could not find function "{__pattern_function_name}". Keep the starter function name unchanged.')
_actual = _fn(*_args)
json.dumps(_actual)
\`);
        const actual = JSON.parse(payload);
        results.push({ label: test.label, passed: same(actual, test.expected), expected: test.expected, actual });
      } catch (error) {
        results.push({ label: test.label, passed: false, expected: test.expected, error: error instanceof Error ? error.message : String(error) });
      }
    }

    self.postMessage({ requestId, ok: true, results });
  } catch (error) {
    self.postMessage({ requestId, ok: false, error: error instanceof Error ? error.message : String(error) });
  }
};
`

  readyPromise = new Promise((resolve, reject) => {
    const blob = new Blob([source], { type: 'text/javascript' })
    const url = URL.createObjectURL(blob)
    const nextWorker = new Worker(url)
    URL.revokeObjectURL(url)

    nextWorker.onmessage = (event) => {
      const data = event.data
      const pending = pendingRuns.get(data.requestId)
      if (!pending) return

      window.clearTimeout(pending.timeout)
      pendingRuns.delete(data.requestId)
      pending.resolve(data.ok ? data.results : [{
        label: 'Python compile / runtime',
        passed: false,
        expected: 'Valid Python solution',
        error: data.error,
      }])
    }

    nextWorker.onerror = (event) => {
      reject(new Error(event.message || 'Unable to initialise Python.'))
      resetWorker(event.message || 'Python runner failed.')
    }

    worker = nextWorker
    resolve(nextWorker)
  })

  return readyPromise
}

export async function runPythonTests(code: string, functionName: string, tests: TestCase[]): Promise<PythonTestResult[]> {
  try {
    const pythonWorker = await createPythonWorker()
    const requestId = crypto.randomUUID()

    return await new Promise((resolve) => {
      const timeout = window.setTimeout(() => {
        pendingRuns.delete(requestId)
        resetWorker('Execution timed out. Check for an infinite loop. The Python runtime will reload on your next run.')
        resolve([{ label: 'Execution', passed: false, expected: 'Finish within 10s', error: 'Python execution timed out.' }])
      }, 10000)

      pendingRuns.set(requestId, { resolve, timeout })
      pythonWorker.postMessage({ requestId, code, functionName, tests })
    })
  } catch (error) {
    return [{
      label: 'Python runner',
      passed: false,
      expected: 'Python runtime available',
      error: error instanceof Error ? error.message : String(error),
    }]
  }
}
