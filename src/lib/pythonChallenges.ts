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
  'strings-guided-count-vowels': {
    functionName: 'count_vowels',
    starter: `def count_vowels(s: str) -> int:\n    # One pass. What tiny piece of state do you need?\n    return 0`,
    solution: `def count_vowels(s: str) -> int:\n    vowels = set('aeiou')\n    count = 0\n\n    for char in s.lower():\n        if char in vowels:\n            count += 1\n\n    return count`,
    examples: ['count_vowels("Pattern Lab") → 3', 'count_vowels("rhythm") → 0'],
  },
  'strings-independent-reverse-words': {
    functionName: 'reverse_words',
    starter: `def reverse_words(s: str) -> str:\n    # Your solution\n    return ''`,
    solution: `def reverse_words(s: str) -> str:\n    if not s:\n        return ''\n    return ' '.join(reversed(s.split(' ')))`,
    examples: ['reverse_words("build pattern instincts") → "instincts pattern build"'],
  },
  'strings-independent-longest-word': {
    functionName: 'longest_word',
    starter: `def longest_word(s: str) -> str:\n    # Your solution\n    return ''`,
    solution: `def longest_word(s: str) -> str:\n    words = s.split(' ')\n    best = words[0]\n\n    for word in words[1:]:\n        if len(word) > len(best):\n            best = word\n\n    return best`,
    examples: ['longest_word("learn patterns not tricks") → "patterns"'],
  },
  'hash-guided-has-duplicate': {
    functionName: 'has_duplicate',
    starter: `def has_duplicate(nums: list[int]) -> bool:\n    # What information would stop you rescanning earlier values?\n    return False`,
    solution: `def has_duplicate(nums: list[int]) -> bool:\n    seen = set()\n\n    for num in nums:\n        if num in seen:\n            return True\n        seen.add(num)\n\n    return False`,
    examples: ['has_duplicate([1, 2, 3, 2]) → True', 'has_duplicate([1, 2, 3]) → False'],
  },
  'hash-independent-first-repeated': {
    functionName: 'first_repeated',
    starter: `def first_repeated(nums: list[int]):\n    # Your solution\n    return None`,
    solution: `def first_repeated(nums: list[int]):\n    seen = set()\n\n    for num in nums:\n        if num in seen:\n            return num\n        seen.add(num)\n\n    return None`,
    examples: ['first_repeated([4, 2, 7, 2, 4]) → 2'],
  },
  'hash-independent-two-sum': {
    functionName: 'two_sum',
    starter: `def two_sum(nums: list[int], target: int) -> list[int]:\n    # Your solution\n    return []`,
    solution: `def two_sum(nums: list[int], target: int) -> list[int]:\n    index_by_value = {}\n\n    for i, num in enumerate(nums):\n        need = target - num\n        if need in index_by_value:\n            return [index_by_value[need], i]\n        index_by_value[num] = i\n\n    return []`,
    examples: ['two_sum([2, 7, 11, 15], 9) → [0, 1]'],
  },
  'two-pointers-guided-pair-sum': {
    functionName: 'has_pair_with_sum',
    starter: `def has_pair_with_sum(nums: list[int], target: int) -> bool:\n    left = 0\n    right = len(nums) - 1\n\n    # Move the correct pointer based on the current sum.\n    return False`,
    solution: `def has_pair_with_sum(nums: list[int], target: int) -> bool:\n    left = 0\n    right = len(nums) - 1\n\n    while left < right:\n        current = nums[left] + nums[right]\n        if current == target:\n            return True\n        if current < target:\n            left += 1\n        else:\n            right -= 1\n\n    return False`,
    examples: ['has_pair_with_sum([1, 2, 4, 7, 11], 9) → True'],
  },
  'two-pointers-independent-palindrome': {
    functionName: 'is_palindrome',
    starter: `def is_palindrome(s: str) -> bool:\n    # Your solution\n    return False`,
    solution: `def is_palindrome(s: str) -> bool:\n    left = 0\n    right = len(s) - 1\n\n    while left < right:\n        if s[left] != s[right]:\n            return False\n        left += 1\n        right -= 1\n\n    return True`,
    examples: ['is_palindrome("racecar") → True', 'is_palindrome("pattern") → False'],
  },
  'two-pointers-independent-unique-sorted': {
    functionName: 'unique_sorted',
    starter: `def unique_sorted(nums: list[int]) -> list[int]:\n    # Think slow/fast: what did the last accepted value look like?\n    return []`,
    solution: `def unique_sorted(nums: list[int]) -> list[int]:\n    if not nums:\n        return []\n\n    result = [nums[0]]\n    for fast in range(1, len(nums)):\n        if nums[fast] != result[-1]:\n            result.append(nums[fast])\n\n    return result`,
    examples: ['unique_sorted([1, 1, 2, 2, 2, 5]) → [1, 2, 5]'],
  },
  'sliding-window-guided-max-sum-k': {
    functionName: 'max_window_sum',
    starter: `def max_window_sum(nums: list[int], k: int) -> int:\n    # 1. Build the first window sum.\n    # 2. Slide by removing the outgoing value and adding the incoming value.\n    return 0`,
    solution: `def max_window_sum(nums: list[int], k: int) -> int:\n    window_sum = sum(nums[:k])\n    best = window_sum\n\n    for right in range(k, len(nums)):\n        window_sum += nums[right]\n        window_sum -= nums[right - k]\n        best = max(best, window_sum)\n\n    return best`,
    examples: ['max_window_sum([2, 1, 5, 1, 3, 2], 3) → 9', 'max_window_sum([1, 9, -1, -2, 7, 3, -1, 2], 4) → 13'],
  },
  'sliding-window-independent-longest-unique': {
    functionName: 'longest_unique_substring_length',
    starter: `def longest_unique_substring_length(s: str) -> int:\n    # What state tells you whether the current window is valid?\n    return 0`,
    solution: `def longest_unique_substring_length(s: str) -> int:\n    seen = set()\n    left = 0\n    best = 0\n\n    for right, char in enumerate(s):\n        while char in seen:\n            seen.remove(s[left])\n            left += 1\n\n        seen.add(char)\n        best = max(best, right - left + 1)\n\n    return best`,
    examples: ['longest_unique_substring_length("abcabcbb") → 3', 'longest_unique_substring_length("pwwkew") → 3'],
  },
  'sliding-window-independent-min-length': {
    functionName: 'min_subarray_len',
    starter: `def min_subarray_len(target: int, nums: list[int]) -> int:\n    # Expand until valid. Then ask: can the window become smaller and stay valid?\n    return 0`,
    solution: `def min_subarray_len(target: int, nums: list[int]) -> int:\n    left = 0\n    window_sum = 0\n    best = float('inf')\n\n    for right, num in enumerate(nums):\n        window_sum += num\n\n        while window_sum >= target:\n            best = min(best, right - left + 1)\n            window_sum -= nums[left]\n            left += 1\n\n    return 0 if best == float('inf') else int(best)`,
    examples: ['min_subarray_len(7, [2, 3, 1, 2, 4, 3]) → 2', 'min_subarray_len(11, [1, 1, 1, 1, 1, 1, 1, 1]) → 0'],
  },
}
