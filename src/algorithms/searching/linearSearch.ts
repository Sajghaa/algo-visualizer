import type { AlgorithmStep, SortingAlgorithm } from '../types';

export const linearSearch: SortingAlgorithm = {
  slug: 'linear-search',
  name: 'Linear Search',
  description: 'Scans each element from left to right until the target is found.',
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(1)',
  stable: false,
  category: 'searching',

  keyIdeas: [
    'Examines elements one at a time from the start',
    'Works on unsorted arrays — no preprocessing needed',
    'Simple but slow for large arrays',
    'Best case finds the target immediately; worst case scans everything',
  ],

  whenToUse: 'Small arrays, or unsorted data where sorting would cost more than searching.',

  pseudocode: [
    'linearSearch(array, target):',
    '  for i from 0 to n-1:',
    '    if array[i] == target:',
    '      return i',
    '  return -1',
  ],

  generateSteps(input: number[], target?: number): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];
    const array = [...input];
    const n = array.length;

    // If no target given, pick one that exists (guaranteed found)
    const searchFor = target ?? array[Math.floor(Math.random() * n)];
    let foundIndex = -1;

    steps.push({
      array: [...array],
      highlighted: [],
      sorted: [],
      target: searchFor,
      description: `Looking for ${searchFor} in the array`,
      explanation: 'Linear search checks each element in order until it finds the target.',
      concept: 'done',
    });

    for (let i = 0; i < n; i++) {
     
      steps.push({
        array: [...array],
        highlighted: [i],
        sorted: [],
        target: searchFor,
        pointers: { i },
        description: `Comparing array[${i}] = ${array[i]} with target ${searchFor}`,
        explanation:
          array[i] === searchFor
            ? `Match! ${array[i]} equals the target.`
            : `${array[i]} ≠ ${searchFor}, moving on.`,
        concept: 'compare',
        lineOfCode: 2,
      });

      if (array[i] === searchFor) {
        foundIndex = i;
        steps.push({
          array: [...array],
          highlighted: [i],
          sorted: [i],
          target: searchFor,
          pointers: { found: i },
          description: `Found ${searchFor} at index ${i}`,
          explanation: `Return ${i}. Total comparisons: ${i + 1}.`,
          concept: 'mark',
          lineOfCode: 3,
        });
        break;
      }
    }

    if (foundIndex === -1) {
      steps.push({
        array: [...array],
        highlighted: [],
        sorted: [],
        target: searchFor,
        description: `Target ${searchFor} not found`,
        explanation: `Scanned all ${n} elements without finding ${searchFor}. Return -1.`,
        concept: 'done',
        lineOfCode: 4,
      });
    }

    return steps;
  },
};