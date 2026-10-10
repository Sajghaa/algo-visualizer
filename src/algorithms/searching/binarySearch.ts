import type { AlgorithmStep, SortingAlgorithm } from '../types';

export const binarySearch: SortingAlgorithm = {
  slug: 'binary-search',
  name: 'Binary Search',
  description: 'Repeatedly halves a sorted array to find the target in O(log n).',
  timeComplexity: 'O(log n)',
  spaceComplexity: 'O(1)',
  stable: false,
  category: 'searching',

  keyIdeas: [
    'Requires a sorted array — sorts internally before searching',
    'Halves the search space each step — fast on large data',
    'Compares the middle element against the target',
    'Discards the half that cannot contain the target',
  ],

  whenToUse: 'Large sorted arrays where O(n) linear scan is too slow. Also the basis for binary search trees.',

  pseudocode: [
    'binarySearch(sortedArray, target):',
    '  low = 0; high = n - 1',
    '  while low <= high:',
    '    mid = (low + high) / 2',
    '    if sortedArray[mid] == target: return mid',
    '    if sortedArray[mid] < target: low = mid + 1',
    '    else: high = mid - 1',
    '  return -1',
  ],

  generateSteps(input: number[], target?: number): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];
    const array = [...input].sort((a, b) => a - b);   // sort first!
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
      explanation: 'Binary search requires sorted data. We sort internally, then halve the search space each step.',
      concept: 'done',
    });

    let low = 0;
    let high = n - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);

      // Show current range
      steps.push({
        array: [...array],
        highlighted: [mid],
        sorted: [],
        eliminated: [...eliminated],
        target: searchFor,
        pointers: { low, mid, high },
        description: `Range [${low}..${high}] → checking middle (${mid}) = ${array[mid]}`,
        explanation: `Comparing ${array[mid]} with target ${searchFor}.`,
        concept: 'compare',
        lineOfCode: 4,
      });

      if (array[mid] === searchFor) {
        steps.push({
          array: [...array],
          highlighted: [mid],
          sorted: [mid],
          eliminated: [...eliminated],
          target: searchFor,
          pointers: { found: mid },
          description: `Found ${searchFor} at index ${mid}`,
          explanation: `Return ${mid}. Took only ${Math.ceil(Math.log2(n))} comparisons in the worst case.`,
          concept: 'mark',
          lineOfCode: 4,
        });
        return steps;
      }

      if (array[mid] < searchFor) {
        // Eliminate left half including mid
        for (let i = low; i <= mid; i++) {
          if (!eliminated.includes(i)) eliminated.push(i);
        }
        low = mid + 1;
        steps.push({
          array: [...array],
          highlighted: [],
          sorted: [],
          eliminated: [...eliminated],
          target: searchFor,
          pointers: { low, high },
          description: `${array[mid]} < ${searchFor}. Eliminate left half.`,
          explanation: `Target must be to the right of ${mid}. New range [${low}..${high}].`,
          concept: 'done',
          lineOfCode: 5,
        });
      } else {
        // Eliminate right half including mid
        for (let i = mid; i <= high; i++) {
          if (!eliminated.includes(i)) eliminated.push(i);
        }
        high = mid - 1;
        steps.push({
          array: [...array],
          highlighted: [],
          sorted: [],
          eliminated: [...eliminated],
          target: searchFor,
          pointers: { low, high },
          description: `${array[mid]} > ${searchFor}. Eliminate right half.`,
          explanation: `Target must be to the left of ${mid}. New range [${low}..${high}].`,
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
      explanation: `All elements ruled out. Return -1.`,
      concept: 'done',
      lineOfCode: 7,
    });

    return steps;
  },
};