import { ConceptPatternModule, type ConceptPatternModuleConfig } from '../../components/ConceptPatternModule'
import { challenges, complexityQuestions, mixedQuestions, patternQuestions, predictionQuestions } from './content'

const config: ConceptPatternModuleConfig = {
  id: 'hash-maps-sets',
  order: 3,
  title: 'Hash Maps & Sets',
  subtitle: 'Fast lookup, counting and membership',
  duration: '40–45 min',
  heroTitle: 'Use memory deliberately: remember what you have seen so you do not search for it again.',
  heroDescription: 'Hash maps and sets are among the most powerful interview tools because they trade extra space for fast average lookup. Learn to recognise membership, frequency, complement and association problems instantly.',
  introLead: 'A set answers “does this key exist?” A map answers “what information is associated with this key?”',
  introBody: 'Both use hashing to make lookup, insertion and deletion fast on average. Their real value is algorithmic: they let a one-pass solution remember earlier information instead of repeatedly rescanning the input.',
  useCases: [
    { title: 'Membership', detail: 'duplicates, seen-before checks, uniqueness' },
    { title: 'Frequency', detail: 'counts by character, word, ID or value' },
    { title: 'Association', detail: 'value → index, ID → object, key → state' },
  ],
  corePicture: 'A fast lookup table keyed by what matters',
  coreDetail: 'Use a Set when existence is enough. Use a Map when each key needs attached information such as a count, index, object, or latest position.',
  operations: [
    { complexity: 'O(1)*', title: 'Lookup', detail: 'Ask whether a key exists or retrieve its associated value.', tone: 'fast' },
    { complexity: 'O(1)*', title: 'Insert / update', detail: 'Remember a value, count, index, or state while scanning.', tone: 'fast' },
    { complexity: 'O(n)', title: 'Build from n items', detail: 'One expected constant-time operation per input item.', tone: 'medium' },
    { complexity: 'O(n)', title: 'Extra space', detail: 'You may store up to one entry per distinct input value.', tone: 'medium' },
  ],
  rule: 'When you catch yourself searching earlier input again, ask what tiny piece of information a set or map could remember instead.',
  visualItems: ['amy→2', 'lee→1', 'sam→3', 'zoe→1'],
  visualHighlights: [2],
  visualPointer: 'key "sam" → count 3',
  visualCaption: 'The key gives you a direct conceptual route to the information you care about. You do not scan every earlier item to recover it.',
  clueChips: [
    ['seen before?', 'hash set'],
    ['how many times?', 'frequency map'],
    ['value → index', 'hash map'],
    ['find complement', 'hash map / set'],
    ['unique values', 'hash set'],
    ['sorted + pair', 'two pointers may be better'],
    ['many range sums', 'prefix sum, not hashing'],
  ],
  patternQuestions,
  predictionQuestions,
  challenges,
  complexityQuestions,
  mixedQuestions,
  revision: {
    headline: 'Spend memory to make earlier information instantly available.',
    thinkWhen: [
      'You ask whether something has appeared before.',
      'You need counts or frequencies by key.',
      'You need value → index or ID → data association.',
      'An unsorted pair/complement problem needs faster lookup.',
    ],
    clues: ['seen', 'duplicate', 'frequency', 'count', 'lookup', 'complement'],
    complexity: ['Lookup/insert: O(1) average', 'One pass: O(n) expected', 'Storage: O(n)'],
    mistakes: [
      'Using a Map when a Set expresses membership more clearly.',
      'Forgetting the O(n) memory trade-off.',
      'Sorting and destroying original order unnecessarily.',
      'Calling hash operations O(1) worst-case instead of average/expected.',
    ],
    problems: ['Contains Duplicate', 'Two Sum', 'Anagram counts', 'First repeated value', 'Most frequent element'],
    sentence: 'If repeated searching is the bottleneck, remember the answer to the search.',
  },
  nextStep: 'Two pointers is the perfect contrast: sometimes sorted order gives enough structure to avoid a hash map entirely and solve pair or comparison problems with O(1) extra space.',
}

export function HashMapsSetsModule() {
  return <ConceptPatternModule config={config} />
}

export default HashMapsSetsModule
