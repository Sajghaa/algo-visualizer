import type { AlgorithmStep, SortingAlgorithm } from '../types';

export const quickSort: SortingAlgorithm = {
  slug: 'quick-sort',
  name: 'Quick Sort',
  description: 'Picks a pivot, partitions the array around it, and recursively sorts each side.',
  howItWorks: [
    "Choose a 'pivot' element from the array (usually the last element).",
    "Partition the array: move all elements smaller than the pivot to the left, and all larger elements to the right.",
    "The pivot is now in its correct, final sorted position.",
    "Recursively apply this same process to the left sub-array and the right sub-array.",
    "The recursion stops when sub-arrays have 0 or 1 elements."
  ],
  
  traps: [
    "Worst-case time complexity is O(n²) if the pivot is always the smallest or largest element (e.g., an already sorted array).",
    "It is NOT stable. The partitioning process can swap identical elements out of order.",
    "To avoid the O(n²) worst case, real-world implementations use 'Randomized Quick Sort' or 'Median-of-Three' pivot selection.",
    "Because it's in-place, it's very memory efficient (O(log n) stack space) and usually the fastest sorting algorithm in practice."
  ],

  timeComplexity: 'O(n log n) average, O(n²) worst',
  spaceComplexity: 'O(log n) — recursion stack',
  stable: false,
  category: 'sorting',

  keyIdeas: [
    'Pick a pivot; partition so smaller elements are left, larger are right',
    'Pivot lands in its final sorted position after each partition',
    'Recurse on left and right partitions',
    'In-place — no extra array needed (unlike merge sort)',
    'Performance depends on pivot choice; worst case on already-sorted input',
  ],

  whenToUse:
    'When in-place sorting and average-case speed matter. Use randomized or median-of-three pivot selection to avoid worst case.',

  pseudocode: [
    'quickSort(array, low, high):',
    '  if low < high:',
    '    pivotIndex = partition(array, low, high)',
    '    quickSort(array, low, pivotIndex - 1)',
    '    quickSort(array, pivotIndex + 1, high)',
    '',
    'partition(array, low, high):',
    '  pivot = array[high]',
    '  i = low - 1',
    '  for j = low to high - 1:',
    '    if array[j] <= pivot:',
    '      i = i + 1',
    '      swap(array[i], array[j])',
    '  swap(array[i + 1], array[high])',
    '  return i + 1',
  ],

  pseudocodeExplanations: [
    "Entry point for the recursive Quick Sort function.",
    "Base case: if the range has 1 or 0 elements, it's already sorted.",
    "Partition the array around a pivot. This returns the final index of the pivot.",
    "Recursively sort the elements to the left of the pivot (they are all smaller).",
    "Recursively sort the elements to the right of the pivot (they are all larger).",
    "The partition function begins here.",
    "We choose the last element as the pivot.",
    "`i` tracks the 'wall' where elements smaller than the pivot end.",
    "Loop through the array, comparing each element to the pivot.",
    "If the current element is smaller than or equal to the pivot...",
    "Move the wall forward...",
    "...and swap the smaller element to the left side of the wall.",
    "Finally, swap the pivot into its correct place, right after all the smaller elements.",
    "Return the pivot's index so we can split the array into left and right halves."
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
      description: 'Starting Quick Sort',
      explanation:
        'We will pick a pivot, partition the array so smaller elements are on the left, then recurse.',
      concept: 'done',
    });

    function partition(low: number, high: number): number {
      const pivotValue = array[high];
      let i = low - 1;

      steps.push({
        array: [...array],
        highlighted: [high],
        sorted: [...sorted],
        pointers: { low, high },
        description: `Pivot chosen: ${pivotValue} at index ${high}`,
        explanation: `Partition range [${low}..${high}]. Everything ≤ ${pivotValue} goes left; everything > goes right.`,
        concept: 'pivot',
        lineOfCode: 7,
      });

      for (let j = low; j < high; j++) {
        steps.push({
          array: [...array],
          highlighted: [j, high],
          sorted: [...sorted],
          pointers: { j, pivot: high },
          description: `Comparing ${array[j]} with pivot ${pivotValue}`,
          explanation:
            array[j] <= pivotValue
              ? `${array[j]} ≤ ${pivotValue} → belongs in left partition.`
              : `${array[j]} > ${pivotValue} → stays in right partition.`,
          concept: 'compare',
          lineOfCode: 9,
        });

        if (array[j] <= pivotValue) {
          i++;
          if (i !== j) {
            [array[i], array[j]] = [array[j], array[i]];
            steps.push({
              array: [...array],
              highlighted: [i, j],
              sorted: [...sorted],
              pointers: { i, j },
              description: `Swapped ${array[j]} and ${array[i]}`,
              explanation: `Wall moved to ${i}. ${array[i]} is now in the left partition.`,
              concept: 'swap',
              lineOfCode: 11,
            });
          }
        }
      }

      // Place pivot at its final position
      const pivotIndex = i + 1;
      [array[pivotIndex], array[high]] = [array[high], array[pivotIndex]];
      sorted.add(pivotIndex);

      steps.push({
        array: [...array],
        highlighted: [pivotIndex],
        sorted: [...sorted],
        pointers: { pivot: pivotIndex },
        description: `Pivot ${pivotValue} placed at index ${pivotIndex}`,
        explanation: `The pivot is now in its final position. Recurse on both sides.`,
        concept: 'pivot',
        lineOfCode: 13,
      });

      return pivotIndex;
    }

    function quickSortHelper(low: number, high: number): void {
      if (low >= high) return;
      const pivotIndex = partition(low, high);
      quickSortHelper(low, pivotIndex - 1);
      quickSortHelper(pivotIndex + 1, high);
    }

    quickSortHelper(0, n - 1);

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