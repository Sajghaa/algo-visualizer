import type { AlgorithmStep, SortingAlgorithm } from '../types';

export const heapSort: SortingAlgorithm = {
  name: 'Heap Sort',
  description: 'Builds a max-heap from the array, then repeatedly extracts the maximum.',
  timeComplexity: 'O(n log n)',
  spaceComplexity: 'O(1)',

  keyIdeas: [
    'The array is treated as a binary tree: children of i are 2i+1 and 2i+2',
    'Phase 1: build a max-heap so the largest element is at the root',
    'Phase 2: swap root with last element, shrink heap, sift down',
    'In-place and guaranteed O(n log n) — no worst case like quick sort',
    'Not stable: swaps can reorder equal elements',
  ],

  whenToUse:
    'When you need guaranteed O(n log n) with O(1) extra space. Also the basis for priority queues.',

  pseudocode: [
    'heapSort(array):',
    '  buildMaxHeap(array)',
    '  for i = n-1 down to 1:',
    '    swap(array[0], array[i])',
    '    heapify(array, size = i, root = 0)',
    '',
    'buildMaxHeap(array):',
    '  for i = n/2 - 1 down to 0:',
    '    heapify(array, n, i)',
    '',
    'heapify(array, size, i):',
    '  largest = i',
    '  left = 2i + 1;  right = 2i + 2',
    '  if left < size and array[left] > array[largest]: largest = left',
    '  if right < size and array[right] > array[largest]: largest = right',
    '  if largest != i:',
    '    swap(array[i], array[largest])',
    '    heapify(array, size, largest)',
  ],

  generateSteps(input: number[]): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];
    const array = [...input];
    const n = array.length;
    const sorted = new Set<number>();

    steps.push({
      array: [...array],
      highlighted: [],
      sorted: [],
      description: 'Starting Heap Sort',
      explanation:
        'Phase 1: build a max-heap. Phase 2: extract the max repeatedly by swapping it to the end.',
      concept: 'done',
    });

    function heapify(size: number, i: number): void {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let largest = i;

      // Compare with left child
      if (left < size) {
        steps.push({
          array: [...array],
          highlighted: [i, left],
          sorted: [...sorted],
          pointers: { parent: i, left },
          description: `Compare parent ${array[i]} with left child ${array[left]}`,
          explanation:
            array[left] > array[largest]
              ? `Left child ${array[left]} is larger — becomes candidate.`
              : `Parent ${array[i]} stays larger.`,
          concept: 'compare',
          lineOfCode: 13,
        });
        if (array[left] > array[largest]) largest = left;
      }

      // Compare with right child
      if (right < size) {
        steps.push({
          array: [...array],
          highlighted: [largest, right],
          sorted: [...sorted],
          pointers: { parent: i, right },
          description: `Compare current largest ${array[largest]} with right child ${array[right]}`,
          explanation:
            array[right] > array[largest]
              ? `Right child ${array[right]} is larger — becomes candidate.`
              : `Current largest ${array[largest]} stays.`,
          concept: 'compare',
          lineOfCode: 14,
        });
        if (array[right] > array[largest]) largest = right;
      }

      // Swap if needed and recurse
      if (largest !== i) {
        [array[i], array[largest]] = [array[largest], array[i]];
        steps.push({
          array: [...array],
          highlighted: [i, largest],
          sorted: [...sorted],
          pointers: { i, largest },
          description: `Swap ${array[largest]} and ${array[i]}`,
          explanation: `Move larger value ${array[i]} up to maintain the max-heap property.`,
          concept: 'swap',
          lineOfCode: 16,
        });
        heapify(size, largest);
      }
    }

    // Phase 1: build max heap
    steps.push({
      array: [...array],
      highlighted: [],
      sorted: [],
      description: 'Phase 1: Building max-heap',
      explanation: 'Sift down every internal node from the last parent to the root.',
      concept: 'divide',
      lineOfCode: 6,
    });

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(n, i);
    }

    steps.push({
      array: [...array],
      highlighted: [],
      sorted: [],
      description: `Max-heap built. Root = ${array[0]} is the maximum.`,
      explanation: 'Now we extract the max repeatedly.',
      concept: 'done',
      lineOfCode: 1,
    });

    // Phase 2: extract max repeatedly
    for (let i = n - 1; i > 0; i--) {
      [array[0], array[i]] = [array[i], array[0]];
      sorted.add(i);

      steps.push({
        array: [...array],
        highlighted: [0, i],
        sorted: [...sorted],
        pointers: { root: 0, end: i },
        description: `Swap max ${array[i]} to position ${i}`,
        explanation: `Extracted max. Position ${i} is now final. Heap size shrinks to ${i}.`,
        concept: 'mark',
        lineOfCode: 3,
      });

      heapify(i, 0);
    }

    sorted.add(0);

    steps.push({
      array: [...array],
      highlighted: [],
      sorted: [...Array(n).keys()],
      description: 'Array is sorted!',
      explanation: 'Every element is in its final position.',
      concept: 'done',
    });

    return steps;
  },
};