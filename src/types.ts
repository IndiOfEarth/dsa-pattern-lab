export type ChoiceQuestion = {
  id: string
  prompt: string
  choices: string[]
  answer: string
  explanation: string
  signal?: string
  tempting?: string
}

export type TestCase = {
  label: string
  args: unknown[]
  expected: unknown
}

export type CodeChallengeData = {
  id: string
  eyebrow: string
  title: string
  difficulty: 'Guided' | 'Independent'
  description: string
  examples: string[]
  constraints: string[]
  starter: string
  functionName: string
  tests: TestCase[]
  hints: string[]
  solution: string
  solutionExplanation: string
  time: string
  space: string
  remember: string
}
