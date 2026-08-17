export type CurriculumModule = {
  id: string
  order: number
  title: string
  subtitle: string
  duration: string
  sectionCount: number
  status: 'available' | 'planned'
  signals: string[]
}

export const essentialCurriculum: CurriculumModule[] = [
  { id: 'arrays', order: 1, title: 'Arrays', subtitle: 'Indexed data, traversal and mutation', duration: '35–45 min', sectionCount: 10, status: 'available', signals: ['index', 'ordered data', 'one pass'] },
  { id: 'strings', order: 2, title: 'Strings', subtitle: 'Character sequences and scanning', duration: '35–45 min', sectionCount: 10, status: 'planned', signals: ['characters', 'substring', 'parsing'] },
  { id: 'hash-maps-sets', order: 3, title: 'Hash Maps & Sets', subtitle: 'Fast lookup, counting and membership', duration: '40–45 min', sectionCount: 10, status: 'planned', signals: ['fast lookup', 'frequency', 'seen before'] },
  { id: 'two-pointers', order: 4, title: 'Two Pointers', subtitle: 'Eliminate possibilities from two positions', duration: '35–45 min', sectionCount: 10, status: 'planned', signals: ['sorted', 'pair', 'opposite ends'] },
  { id: 'sliding-window', order: 5, title: 'Sliding Window', subtitle: 'Maintain a changing contiguous range', duration: '40–45 min', sectionCount: 10, status: 'planned', signals: ['contiguous', 'longest', 'fixed window'] },
  { id: 'prefix-sums', order: 6, title: 'Prefix Sums', subtitle: 'Precompute cumulative information', duration: '30–40 min', sectionCount: 10, status: 'planned', signals: ['range sum', 'many queries', 'cumulative'] },
  { id: 'sorting', order: 7, title: 'Sorting', subtitle: 'Use order to expose structure', duration: '35–45 min', sectionCount: 10, status: 'planned', signals: ['order', 'ranking', 'grouping'] },
  { id: 'binary-search', order: 8, title: 'Binary Search', subtitle: 'Discard half the search space', duration: '35–45 min', sectionCount: 10, status: 'planned', signals: ['sorted', 'monotonic', 'target'] },
  { id: 'stacks', order: 9, title: 'Stacks', subtitle: 'Last-in, first-out reasoning', duration: '30–40 min', sectionCount: 10, status: 'planned', signals: ['most recent', 'nested', 'undo'] },
  { id: 'queues', order: 10, title: 'Queues', subtitle: 'First-in, first-out processing', duration: '30–40 min', sectionCount: 10, status: 'planned', signals: ['arrival order', 'processing', 'BFS later'] },
  { id: 'linked-lists', order: 11, title: 'Linked Lists', subtitle: 'Nodes connected by references', duration: '35–45 min', sectionCount: 10, status: 'planned', signals: ['next pointer', 'insertion', 'node'] },
  { id: 'recursion', order: 12, title: 'Recursion', subtitle: 'Solve a problem through smaller copies', duration: '40–45 min', sectionCount: 10, status: 'planned', signals: ['base case', 'subproblem', 'call stack'] },
  { id: 'big-o', order: 13, title: 'Big-O', subtitle: 'Reason about growth and trade-offs', duration: '35–45 min', sectionCount: 10, status: 'planned', signals: ['scaling', 'time', 'space'] },
]

export const getCurriculumModule = (id: string) => essentialCurriculum.find((module) => module.id === id)
