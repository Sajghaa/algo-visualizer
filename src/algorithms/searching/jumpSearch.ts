import type { AlgorithmStep, SortingAlgorithm } from '../types';

export const jumpSearch: SortingAlgorithm = {
  slug: 'jump-search',
  name: 'Jump Search',
  description: 'Jumps in blocks of √n, then linear scans within the found block.',
  timeComplexity: 'O(√n)',
  spaceComplexity: 'O(1)',
  stable: false,
  category: 'searching',

  keyIdeas: [
    'Requires sorted data — sorts internally before searching',
    'Jumps in fixed-size blocks of √n until it overshoots the target',
    'Then scans backward or forward within that single block',
    'Optimal step size is √n — balances jumps vs. within-block scans',
  ],

  whenToUse: 'Sorted arrays where jumping is cheaper than probing. A middle ground between linear and binary search.',

  pseudocode: [
    'jumpSearch(sortedArray, target):',
    '  step = floor(sqrt(n))',
    '  prev = 0',
    '  while sortedArray[min(step, n) - 1] < target:',
    '    prev = step',
    '    step += stepSize',
    '    if prev >= n: return -1',
    '  while sortedArray[prev] < target:',
    '    prev += 1',
    '    if prev == min(step, n): return -1',
    '  if sortedArray[prev] == target: return prev',
    '  return -1',
  ],

  generateSteps(input: number[], target?: number): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];
    const array = [...input].sort((a, b) => a - b);
    const n = array.length;
    const stepSize = Math.floor(Math.sqrt(n));

    const searchFor = target ?? array[Math.floor(Math.random() * n)];
    const eliminated: number[] = [];

    steps.push({
      array: [...array],
      highlighted: [],
      sorted: [],
      eliminated: [],
      target: searchFor,
      description: `Sorted array. Jump step size = √${n} ≈ ${stepSize}`,
      explanation: `We will jump in blocks of ${stepSize} until we overshoot ${searchFor}, then scan that block.`,
      concept: 'done',
    });

    let prev = 0;
    let step = stepSize;

    
    while (prev < n) {
      const blockEnd = Math.min(step, n) - 1;

      steps.push({
        array: [...array],
        highlighted: [blockEnd],
        sorted: [],
        eliminated: [...eliminated],
        target: searchFor,
        pointers: { prev, blockEnd },
        description: `Check end of block [${prev}..${blockEnd}]: ${array[blockEnd]}`,
        explanation:
          array[blockEnd] < searchFor
            ? `${array[blockEnd]} < ${searchFor}. Target is in a later block — jump.`
            : `${array[blockEnd]} ≥ ${searchFor}. Target must be in this block. Stop jumping.`,
        concept: 'compare',
        lineOfCode: 3,
      });

      if (array[blockEnd] >= searchFor) break;

      
      for (let i = prev; i <= blockEnd; i++) {
        if (!eliminated.includes(i)) eliminated.push(i);
      }

      prev = step;
      step += stepSize;

      steps.push({
        array: [...array],
        highlighted: [],
        sorted: [],
        eliminated: [...eliminated],
        target: searchFor,
        pointers: { prev },
        description: `Jumped past first ${eliminated.length} elements. Next start: ${prev}`,
        explanation: `Everything before index ${prev} is too small. Continue jumping.`,
        concept: 'done',
        lineOfCode: 4,
      });

      if (prev >= n) {
        steps.push({
          array: [...array],
          highlighted: [],
          sorted: [],
          eliminated: [...Array(n).keys()],
          target: searchFor,
          description: `Target ${searchFor} not found`,
          explanation: `Jumped past the end without finding it. Return -1.`,
          concept: 'done',
          lineOfCode: 5,
        });
        return steps;
      }
    }

    // Phase 2: linear scan inside the found block
    const scanEnd = Math.min(step, n) - 1;

    while (prev <= scanEnd) {
      steps.push({
        array: [...array],
        highlighted: [prev],
        sorted: [],
        eliminated: [...eliminated],
        target: searchFor,
        pointers: { scanning: prev },
        description: `Scanning ${array[prev]} at index ${prev}`,
        explanation:
          array[prev] === searchFor
            ? `Match! Found ${searchFor}.`
            : `${array[prev]} ≠ ${searchFor}, continue scanning.`,
        concept: 'compare',
        lineOfCode: 7,
      });

      if (array[prev] === searchFor) {
        steps.push({
          array: [...array],
          highlighted: [prev],
          sorted: [prev],
          eliminated: [...eliminated],
          target: searchFor,
          pointers: { found: prev },
          description: `Found ${searchFor} at index ${prev}`,
          explanation: `Return ${prev}.`,
          concept: 'mark',
          lineOfCode: 10,
        });
        return steps;
      }

      if (array[prev] > searchFor) break;
      prev++;
    }

    steps.push({
      array: [...array],
      highlighted: [],
      sorted: [],
      eliminated: [...Array(n).keys()],
      target: searchFor,
      description: `Target ${searchFor} not found`,
      explanation: `Scanned the block but ${searchFor} isn't here. Return -1.`,
      concept: 'done',
      lineOfCode: 11,
    });

    return steps;
  },
};