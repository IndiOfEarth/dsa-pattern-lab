export type PythonChallengeConfig = {
  starter: string
  functionName: string
  solution: string
  examples?: string[]
}

export const pythonChallenges: Record<string, PythonChallengeConfig> = {
  'guided-sum-positive': {
    functionName: 'sum_positive',
    starter: `def sum_positive(nums: list[int]) -> int:\n    # Think: what single piece of state do you need?\n    return 0`,
    solution: `def sum_positive(nums: list[int]) -> int:\n    total = 0\n\n    for num in nums:\n        if num > 0:\n            total += num\n\n    return total`,
    examples: ['sum_positive([-2, 5, 3, -1]) → 8', 'sum_positive([]) → 0'],
  },
  'independent-max': {
    functionName: 'find_max',
    starter: `def find_max(nums: list[int]) -> int:\n    # Your solution\n    return 0`,
    solution: `def find_max(nums: list[int]) -> int:\n    current_max = nums[0]\n\n    for num in nums[1:]:\n        if num > current_max:\n            current_max = num\n\n    return current_max`,
    examples: ['find_max([4, 1, 9, 2]) → 9', 'find_max([-8, -2, -11]) → -2'],
  },
  'independent-remove-at': {
    functionName: 'remove_at',
    starter: `def remove_at(nums: list[int], index: int) -> list[int]:\n    # Your solution\n    return []`,
    solution: `def remove_at(nums: list[int], index: int) -> list[int]:\n    result = []\n\n    for i, num in enumerate(nums):\n        if i != index:\n            result.append(num)\n\n    return result`,
    examples: ['remove_at([10, 20, 30, 40], 1) → [10, 30, 40]'],
  },
  'independent-second-largest': {
    functionName: 'second_largest',
    starter: `def second_largest(nums: list[int]) -> int:\n    # Return the second-largest distinct value.\n    return 0`,
    solution: `def second_largest(nums: list[int]) -> int:\n    first = float('-inf')\n    second = float('-inf')\n\n    for num in nums:\n        if num > first:\n            second = first\n            first = num\n        elif first > num > second:\n            second = num\n\n    return int(second)`,
    examples: ['second_largest([7, 3, 9, 5]) → 7', 'second_largest([10, 10, 8]) → 8'],
  },
}
