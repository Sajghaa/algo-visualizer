import type { AlgorithmStep, SortingAlgorithm } from '../types';

export const interpolationSearch: SortingAlgorithm = {
  slug: 'interpolation-search',
  name: 'Interpolation Search',
  description: 'Guesses the target position using linear interpolation between endpoints.',
  timeComplexity: 'O(log log n) uniform, O(n) worst',
  spaceComplexity: 'O(1)',
  stable: false,
  category: 'searching',

  keyIdeas: [
    'Requires sorted, uniformly distributed data',
    'Estimates position by linear interpolation of values',
    'Faster than binary search on uniform data (log log n)',
    'Degrades to O(n) on skewed distributions',
  ],

  whenToUse: 'Large sorted arrays where values are roughly uniform — e.g., phone numbers, IDs, timestamps.',

  pseudocode: [
    'interpolationSearch(sortedArray, target):',
    '  low = 0; high = n - 1',
    '  while low <= high and target in [arr[low], arr[high]]:',
    '    pos = low + (target - arr[low]) * (high - low) / (arr[high] - arr[low])',
    '    if arr[pos] == target: return pos',
    '    if arr[pos] < target: low = pos + 1',
    '    else: high = pos - 1',
    '  return -1',
  ],

  generateSteps(input: number[], target?: number): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];
    const array = [...input].sort((a, b) => a - b);
    const n = array.length;

    const searchFor = target ?? array[Math.floor(Math.random() * n)];
    const eliminated: number[] = [];

    steps.push({
      array: [...array],
      highlighted: [],
      sorted: [],
      eliminated: [],
      target: searchFor,
      description: `Sorted array. Searching for ${searchFor}`,
      explanation:
        'Interpolation search estimates where the target likely sits based on the values at the range ends.',
      concept: 'done',
    });

    let low = 0;
    let high = n - 1;

    while (low <= high && searchFor >= array[low] && searchFor <= array[high]) {
      // Linear interpolation formula
      const span = array[high] - array[low];
      const pos =
        span === 0
          ? low
          : Math.floor(low + ((searchFor - array[low]) * (high - low)) / span);

      
      if (pos < low || pos > high) break;

      steps.push({
        array: [...array],
        highlighted: [pos],
        sorted: [],
        eliminated: [...eliminated],
        target: searchFor,
        pointers: { low, pos, high },
        description: `Interpolated position: ${pos} (value = ${array[pos]})`,
        explanation: `Estimating: ${searchFor} is ${Math.round(((searchFor - array[low]) / (span || 1)) * 100)}% of the way between ${array[low]} and ${array[high]}.`,
        concept: 'compare',
        lineOfCode: 3,
      });

      if (array[pos] === searchFor) {
        steps.push({
          array: [...array],
          highlighted: [pos],
          sorted: [pos],
          eliminated: [...eliminated],
          target: searchFor,
          pointers: { found: pos },
          description: `Found ${searchFor} at index ${pos}`,
          explanation: `Return ${pos}. Interpolation guessed correctly.`,
          concept: 'mark',
          lineOfCode: 4,
        });
        return steps;
      }

      if (array[pos] < searchFor) {
        for (let i = low; i <= pos; i++) {
          if (!eliminated.includes(i)) eliminated.push(i);
        }
        low = pos + 1;
        steps.push({
          array: [...array],
          highlighted: [],
          sorted: [],
          eliminated: [...eliminated],
          target: searchFor,
          pointers: { low, high },
          description: `${array[pos]} < ${searchFor}. Search right.`,
          explanation: `Target must be to the right of ${pos}. New range [${low}..${high}].`,
          concept: 'done',
          lineOfCode: 5,
        });
      } else {
        for (let i = pos; i <= high; i++) {
          if (!eliminated.includes(i)) eliminated.push(i);
        }
        high = pos - 1;
        steps.push({
          array: [...array],
          highlighted: [],
          sorted: [],
          eliminated: [...eliminated],
          target: searchFor,
          pointers: { low, high },
          description: `${array[pos]} > ${searchFor}. Search left.`,
          explanation: `Target must be to the left of ${pos}. New range [${low}..${high}].`,
          concept: 'done',
          lineOfCode: 6,
        });
      }
    }

    steps.push({
      array: [...array],
      highlighted: [],
      sorted: [],
      eliminated: [...Array(n).keys()],
      target: searchFor,
      description: `Target ${searchFor} not found`,
      explanation: 'Range exhausted or target outside the value bounds. Return -1.',
      concept: 'done',
      lineOfCode: 7,
    });

    return steps;
  },
};