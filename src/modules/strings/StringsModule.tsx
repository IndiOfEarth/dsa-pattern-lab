import { ConceptPatternModule, type ConceptPatternModuleConfig } from '../../components/ConceptPatternModule'
import { challenges, complexityQuestions, mixedQuestions, patternQuestions, predictionQuestions } from './content'

const config: ConceptPatternModuleConfig = {
  id: 'strings',
  order: 2,
  title: 'Strings',
  subtitle: 'Character sequences, scanning and parsing',
  duration: '35–45 min',
  heroTitle: 'Treat strings as structured sequences — then decide whether you need a scan, counts, pointers, or a window.',
  heroDescription: 'The goal is not to memorise string methods. It is to recognise what the characters represent, what boundaries matter, and which pattern removes repeated work.',
  introLead: 'A string is an ordered sequence of characters. Most string problems are really sequence problems with extra meaning attached to the symbols.',
  introBody: 'You can index and scan a string like an array, but strings are usually immutable: transformations create new strings. The important question is whether you care about individual characters, delimited pieces, mirrored positions, frequencies, or a contiguous substring.',
  useCases: [
    { title: 'Character scanning', detail: 'validation, counting, normalisation' },
    { title: 'Parsing', detail: 'delimiters, tokens, fields and words' },
    { title: 'Sequence patterns', detail: 'palindromes, substrings and matching' },
  ],
  corePicture: 'An immutable array-like sequence of characters',
  coreDetail: 'Index when position matters, scan when every character matters, and switch patterns when the problem asks about counts, opposite ends, or changing substrings.',
  operations: [
    { complexity: 'O(1)', title: 'Read by index', detail: 'Access a known character position directly.', tone: 'fast' },
    { complexity: 'O(n)', title: 'Scan all characters', detail: 'Counting or validating may inspect every character.', tone: 'medium' },
    { complexity: 'O(n)', title: 'Build transformed output', detail: 'A new string usually scales with the amount of output.', tone: 'medium' },
    { complexity: 'pattern', title: 'Substring problems', detail: 'Often point to sliding window, two pointers, or hashing rather than plain scanning.', tone: 'log' },
  ],
  rule: 'Before coding, name the unit you care about: character, word/token, mirrored pair, frequency, or contiguous substring.',
  visualItems: ['p', 'a', 't', 't', 'e', 'r', 'n'],
  visualHighlights: [2, 3],
  visualPointer: 'indices 2–3 → repeated "tt"',
  visualCaption: 'Indexing tells you where a character lives. The problem statement tells you whether positions, repetitions, boundaries, or ranges are important.',
  clueChips: [
    ['every character', 'one string scan'],
    ['same character counts', 'frequency map'],
    ['reads the same backwards', 'two pointers'],
    ['longest substring', 'sliding window'],
    ['delimiter / token', 'parsing'],
    ['seen this character?', 'hash set'],
    ['sorted words + target', 'binary search'],
  ],
  patternQuestions,
  predictionQuestions,
  challenges,
  complexityQuestions,
  mixedQuestions,
  revision: {
    headline: 'First identify the unit: characters, tokens, mirrored positions, counts, or a substring.',
    thinkWhen: [
      'The input is text or a character sequence.',
      'You need to validate, count, transform, or parse characters.',
      'Boundaries or delimiters carry meaning.',
      'A substring or mirrored comparison creates a stronger pattern clue.',
    ],
    clues: ['character', 'substring', 'palindrome', 'delimiter', 'frequency', 'parse'],
    complexity: ['Index: O(1)', 'Full scan: O(n)', 'New output: often O(n) space'],
    mistakes: [
      'Assuming a plain scan solves every substring problem.',
      'Forgetting strings are immutable in JavaScript/Python.',
      'Confusing substring (contiguous) with subsequence.',
      'Sorting when linear counting would be enough.',
    ],
    problems: ['Character counts', 'Parsing tokens', 'Anagrams', 'Palindromes', 'Longest unique substring'],
    sentence: 'Strings are sequences first; their meaning tells you which sequence pattern to use.',
  },
  nextStep: 'Hash maps and sets are the natural next tool because many string problems become easy once you can remember frequencies or whether a character has appeared before.',
}

export function StringsModule() {
  return <ConceptPatternModule config={config} />
}

export default StringsModule
