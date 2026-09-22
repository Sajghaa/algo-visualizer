import type { AlgorithmStep, SortingAlgorithm } from '../types';

export const mergeSort: SortingAlgorithm = {
  name: 'Merge Sort',
  description: 'Recursively divides the array, sorts each half, then merges them back together.',
  timeComplexity: 'O(n log n)',
  spaceComplexity: 'O(n)',

  keyIdeas: [
    'Divide and conquer: split, sort each half, merge',
    'Merging two sorted arrays is O(n) using two pointers',
    'Stable sort — equal elements keep their relative order',
    'Predictable performance regardless of input order',
  ],

  whenToUse: 'When you need guaranteed O(n log n) and stability, and can afford extra memory.',

  pseudocode: [
    'mergeSort(array, left, right):',
    '  if left >= right: return',
    '  mid = (left + right) / 2',
    '  mergeSort(array, left, mid)',
    '  mergeSort(array, mid+1, right)',
    '  merge(array, left, mid, right)',
    '',
    'merge(array, left, mid, right):',
    '  leftHalf = copy of array[left..mid]',
    '  rightHalf = copy of array[mid+1..right]',
    '  i = j = 0; k = left',
    '  while i < len(leftHalf) and j < len(rightHalf):',
    '    if leftHalf[i] <= rightHalf[j]: array[k++] = leftHalf[i++]',
    '    else: array[k++] = rightHalf[j++]',
    '  copy remaining elements from either half',
  ],

  generateSteps(input: number[]): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];
    const array = [...input];
    const n = array.length;

    steps.push({
      array: [...array],
      highlighted: [],
      sorted: [],
      description: 'Starting Merge Sort',
      explanation:
        'We will recursively split the array in half until each piece has 1 element, then merge them back in sorted order.',
      concept: 'done',
    });

    function mergeSortHelper(left: number, right: number): void {
      if (left >= right) return;

      const mid = Math.floor((left + right) / 2);

      steps.push({
        array: [...array],
        highlighted: Array.from({ length: right - left + 1 }, (_, i) => left + i),
        sorted: [],
        pointers: { left, mid, right },
        description: `Dividing range [${left}..${right}] at mid = ${mid}`,
        explanation: `Splitting into [${left}..${mid}] and [${mid + 1}..${right}].`,
        concept: 'divide',
        lineOfCode: 2,
      });

      mergeSortHelper(left, mid);
      mergeSortHelper(mid + 1, right);
      merge(left, mid, right);
    }

    function merge(left: number, mid: number, right: number): void {
      const leftHalf = array.slice(left, mid + 1);
      const rightHalf = array.slice(mid + 1, right + 1);

      steps.push({
        array: [...array],
        highlighted: Array.from({ length: right - left + 1 }, (_, i) => left + i),
        sorted: [],
        pointers: { left, mid, right },
        description: `Merging [${left}..${mid}] and [${mid + 1}..${right}]`,
        explanation: 'Both halves are sorted. Merging them into one sorted range using two pointers.',
        concept: 'merge',
        lineOfCode: 6,
      });

      let i = 0;
      let j = 0;
      let k = left;

      while (i < leftHalf.length && j < rightHalf.length) {
  
        steps.push({
          array: [...array],
          highlighted: [left + i, mid + 1 + j],
          sorted: [],
          pointers: { i: left + i, j: mid + 1 + j, k },
          description: `Comparing ${leftHalf[i]} and ${rightHalf[j]}`,
          explanation:
            leftHalf[i] <= rightHalf[j]
              ? `${leftHalf[i]} ≤ ${rightHalf[j]}, take from left half.`
              : `${leftHalf[i]} > ${rightHalf[j]}, take from right half.`,
          concept: 'compare',
          lineOfCode: 12,
        });

        if (leftHalf[i] <= rightHalf[j]) {
          array[k] = leftHalf[i];
          i++;
        } else {
          array[k] = rightHalf[j];
          j++;
        }

        steps.push({
          array: [...array],
          highlighted: [k],
          sorted: [],
          pointers: { k },
          description: `Wrote ${array[k]} to position ${k}`,
          explanation: `Placing the smaller value at index ${k}.`,
          concept: 'merge',
          lineOfCode: 13,
        });

        k++;
      }

      while (i < leftHalf.length) {
        array[k] = leftHalf[i];
        steps.push({
          array: [...array],
          highlighted: [k],
          sorted: [],
          pointers: { k },
          description: `Copying remaining ${leftHalf[i]} to position ${k}`,
          explanation: 'Left half still has elements; copy them in order.',
          concept: 'merge',
          lineOfCode: 14,
        });
        i++;
        k++;
      }

      while (j < rightHalf.length) {
        array[k] = rightHalf[j];
        steps.push({
          array: [...array],
          highlighted: [k],
          sorted: [],
          pointers: { k },
          description: `Copying remaining ${rightHalf[j]} to position ${k}`,
          explanation: 'Right half still has elements; copy them in order.',
          concept: 'merge',
          lineOfCode: 14,
        });
        j++;
        k++;
      }
    }

    mergeSortHelper(0, n - 1);

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