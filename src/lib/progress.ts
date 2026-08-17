export type ModuleProgress = {
  completedSections: string[]
  updatedAt: string
}

export type PatternLabProgress = {
  version: 1
  modules: Record<string, ModuleProgress>
}

const STORAGE_KEY = 'dsa-pattern-lab:progress:v1'
const PROGRESS_EVENT = 'dsa-pattern-lab:progress-changed'

const emptyState = (): PatternLabProgress => ({ version: 1, modules: {} })

export function loadProgress(): PatternLabProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyState()
    const parsed = JSON.parse(raw) as PatternLabProgress
    if (parsed.version !== 1 || typeof parsed.modules !== 'object') return emptyState()
    return parsed
  } catch {
    return emptyState()
  }
}

export function loadModuleSections(moduleId: string, legacyKey?: string): string[] {
  const state = loadProgress()
  const current = state.modules[moduleId]?.completedSections
  if (current) return current

  if (legacyKey) {
    try {
      const legacy = JSON.parse(localStorage.getItem(legacyKey) ?? '[]')
      if (Array.isArray(legacy) && legacy.every((item) => typeof item === 'string')) {
        if (legacy.length > 0) saveModuleSections(moduleId, legacy)
        return legacy
      }
    } catch {
      // Ignore malformed legacy state.
    }
  }

  return []
}

export function saveModuleSections(moduleId: string, completedSections: string[]) {
  const state = loadProgress()
  state.modules[moduleId] = {
    completedSections,
    updatedAt: new Date().toISOString(),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  window.dispatchEvent(new CustomEvent(PROGRESS_EVENT, { detail: { moduleId } }))
}

export function moduleProgressPercent(moduleId: string, totalSections: number): number {
  if (totalSections <= 0) return 0
  const completed = loadProgress().modules[moduleId]?.completedSections.length ?? 0
  return Math.min(100, Math.round((completed / totalSections) * 100))
}

export function subscribeToProgress(callback: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) callback()
  }
  window.addEventListener('storage', onStorage)
  window.addEventListener(PROGRESS_EVENT, callback)
  return () => {
    window.removeEventListener('storage', onStorage)
    window.removeEventListener(PROGRESS_EVENT, callback)
  }
}
