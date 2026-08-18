import { ConceptPatternModule, type ConceptPatternModuleConfig } from '../../components/ConceptPatternModule'
import { challenges, complexityQuestions, mixedQuestions, patternQuestions, predictionQuestions } from './content'

const config: ConceptPatternModuleConfig = {
  id: 'two-pointers',
  order: 4,
  title: 'Two Pointers',
  subtitle: 'Eliminate possibilities from two positions',
  duration: '35–45 min',
  heroTitle: 'Two pointers is not “use two variables.” It is a way to make each comparison eliminate future work.',
  heroDescription: 'Learn the two core shapes — opposite ends and fast/slow — and, more importantly, the signals that justify moving one pointer without reconsidering discarded possibilities.',
  introLead: 'Two pointers tracks two meaningful positions in the same sequence and moves them according to information revealed by the data.',
  introBody: 'The technique becomes powerful when the input has structure — often sorted order, mirrored positions, or a compaction invariant. Each pointer movement should have a reason that rules out work you never need to revisit.',
  useCases: [
    { title: 'Opposite ends', detail: 'sorted pair sums, palindromes, inward comparisons' },
    { title: 'Fast / slow', detail: 'deduplication, compaction, read/write positions' },
    { title: 'Ordered elimination', detail: 'move one boundary because the comparison proves something' },
  ],
  corePicture: 'Two positions + a rule that safely moves one of them',
  coreDetail: 'The invariant matters more than the pointers themselves. Ask what becomes impossible after each move and why you never need to move backwards.',
  operations: [
    { complexity: 'O(n)', title: 'Opposite-end scan', detail: 'Pointers move toward each other and do not revisit discarded positions.', tone: 'medium' },
    { complexity: 'O(n)', title: 'Fast / slow scan', detail: 'One pointer reads candidates while another tracks accepted or write state.', tone: 'medium' },
    { complexity: 'O(1)', title: 'Extra state', detail: 'Classic pointer solutions often need only indices and a few variables.', tone: 'fast' },
    { complexity: 'needs order', title: 'Safe movement', detail: 'Sortedness or another invariant is what makes elimination valid.', tone: 'log' },
  ],
  rule: 'Never say “two pointers” until you can explain why moving left or right cannot discard a valid answer.',
  visualItems: ['1', '3', '4', '7', '11'],
  visualHighlights: [0, 4],
  visualPointer: 'left = 1 ↔ right = 11 · sum = 12',
  visualCaption: 'On sorted input, the current sum tells you which side can move. That is the source of the speed-up — not the existence of two indices.',
  clueChips: [
    ['sorted + pair', 'opposite-end pointers'],
    ['palindrome', 'compare mirrored ends'],
    ['remove duplicates sorted', 'fast / slow'],
    ['compact in place', 'read / write pointers'],
    ['longest contiguous', 'sliding window'],
    ['unsorted complement', 'hash map'],
    ['one sorted target', 'binary search'],
  ],
  patternQuestions,
  predictionQuestions,
  challenges,
  complexityQuestions,
  mixedQuestions,
  revision: {
    headline: 'Move a pointer only when the data proves that a whole set of possibilities can be discarded.',
    thinkWhen: [
      'The input is sorted and you need a pair or comparison.',
      'You compare mirrored positions from both ends.',
      'A fast pointer scans while a slow/write pointer compacts valid values.',
      'You can state an invariant explaining safe pointer movement.',
    ],
    clues: ['sorted', 'pair', 'palindrome', 'opposite ends', 'fast / slow', 'in place'],
    complexity: ['Typical pass: O(n)', 'Classic extra space: O(1)', 'Sort first if needed: O(n log n)'],
    mistakes: [
      'Using two pointers on unsorted data with no movement rule.',
      'Moving the wrong pointer when a sum is too small or too large.',
      'Confusing every two-boundary problem with sliding window.',
      'Forgetting the left < right termination condition.',
    ],
    problems: ['Sorted Two Sum', 'Palindrome', 'Remove duplicates', 'Container-style inward scans', 'Read/write compaction'],
    sentence: 'Two pointers works when each move proves that you can forget part of the search space.',
  },
  nextStep: 'Sliding window builds on boundary movement but adds a different invariant: maintain a valid contiguous range while the right side expands and the left side repairs violations.',
}

export function TwoPointersModule() {
  return <ConceptPatternModule config={config} />
}

export default TwoPointersModule
