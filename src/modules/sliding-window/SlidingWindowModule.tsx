import { ConceptPatternModule, type ConceptPatternModuleConfig } from '../../components/ConceptPatternModule'
import { challenges, complexityQuestions, mixedQuestions, patternQuestions, predictionQuestions } from './content'

const config: ConceptPatternModuleConfig = {
  id: 'sliding-window',
  order: 5,
  title: 'Sliding Window',
  subtitle: 'Maintain a changing contiguous range',
  duration: '40–45 min',
  heroTitle: 'Sliding window turns repeated work over contiguous ranges into one moving piece of state.',
  heroDescription: 'Learn the two shapes that matter most — fixed-size windows and variable-size windows — then practise recognising when a problem is really asking you to maintain a valid contiguous range instead of recomputing every range from scratch.',
  introLead: 'A sliding window represents one contiguous range using a left boundary, a right boundary, and just enough state to describe what is currently inside the range.',
  introBody: 'The key idea is reuse. When the window moves, most of its contents are unchanged, so you update the state by adding what entered and removing what left. Fixed windows keep a constant width. Variable windows expand and shrink to preserve a condition.',
  useCases: [
    { title: 'Fixed-size windows', detail: 'maximum or average over every block of exactly k adjacent values' },
    { title: 'Variable-size windows', detail: 'longest or shortest contiguous range satisfying a constraint' },
    { title: 'Window state', detail: 'sum, frequency map, set, count, or another compact description of the current range' },
  ],
  corePicture: 'Expand right → update state → repair from left → record the answer',
  coreDetail: 'The window is useful when the answer is about contiguous elements and the validity of the current range can be updated incrementally. The invariant is usually: after any necessary shrinking, the current window satisfies the condition you care about.',
  operations: [
    { complexity: 'O(n)', title: 'Fixed-size scan', detail: 'Each new element enters once and each old element leaves once.', tone: 'medium' },
    { complexity: 'O(n)', title: 'Variable-size scan', detail: 'Although there may be a while-loop, left and right each move forward at most n times.', tone: 'medium' },
    { complexity: 'O(1)–O(k)', title: 'Window state', detail: 'A running sum may be constant space; frequency tracking grows with values inside the window.', tone: 'fast' },
    { complexity: 'contiguous', title: 'The structural clue', detail: 'Sliding window is for adjacent ranges, not arbitrary subsets or pairs.', tone: 'log' },
  ],
  rule: 'Before using sliding window, name the window state, the validity condition, and exactly when the left boundary must move.',
  visualItems: ['2', '1', '5', '1', '3', '2', '6'],
  visualHighlights: [1, 2, 3],
  visualPointer: 'left = 1 · right = 3 · window = [1, 5, 1] · sum = 7',
  visualCaption: 'If this is a fixed window of length 3, the next move removes 1 from the left and adds 3 on the right. You reuse the sum instead of recomputing the next block from scratch.',
  clueChips: [
    ['contiguous + exactly k', 'fixed sliding window'],
    ['longest substring / subarray', 'variable sliding window'],
    ['shortest range satisfying...', 'expand then shrink'],
    ['at most k distinct', 'window + frequency map'],
    ['range sum queries', 'prefix sums'],
    ['sorted pair target', 'two pointers'],
    ['arbitrary subset', 'not sliding window'],
  ],
  patternQuestions,
  predictionQuestions,
  challenges,
  complexityQuestions,
  mixedQuestions,
  revision: {
    headline: 'Keep one contiguous range alive and update only what changes at its edges.',
    thinkWhen: [
      'The problem asks about a contiguous subarray or substring.',
      'You need the best range of a fixed length k.',
      'You need the longest or shortest range satisfying a monotonic-style constraint.',
      'You can update the window state when one item enters or leaves.',
    ],
    clues: ['contiguous', 'substring', 'subarray', 'length k', 'longest', 'shortest', 'at most k'],
    complexity: ['Typical scan: O(n)', 'Both boundaries only move forward', 'State: O(1) to O(k/distinct)'],
    mistakes: [
      'Using a window for non-contiguous choices.',
      'Shrinking only once when the window may still be invalid.',
      'Updating the answer before the window is valid when validity matters.',
      'Forgetting to remove outgoing values from the running state.',
    ],
    problems: ['Maximum sum subarray of size k', 'Longest substring without repeats', 'At most K distinct', 'Minimum-size subarray sum', 'Character replacement-style windows'],
    sentence: 'Sliding window works when a contiguous answer can be maintained by changing only the two edges.',
  },
  nextStep: 'Prefix sums also optimise contiguous-range work, but in a different way: they precompute cumulative information so many range queries can be answered quickly without maintaining one live moving window.',
}

export function SlidingWindowModule() {
  return <ConceptPatternModule config={config} />
}

export default SlidingWindowModule
