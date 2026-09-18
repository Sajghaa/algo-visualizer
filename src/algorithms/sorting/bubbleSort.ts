import type { AlgorithmStep, SortingAlgorithm } from '../types';

export const bubbleSort: SortingAlgorithm = {
  name: 'Bubble Sort',
  description: 'Repeatedly swaps adjacent elements that are out of order.',
  timeComplexity: 'O(n²)',
  spaceComplexity: 'O(1)',

  keyIdeas: [
    'Compares adjacent elements and swaps them if out of order',
    'After each pass, the largest remaining element "bubbles" to the end',
    'In-place and stable',
  ],

  whenToUse: 'Small datasets or nearly-sorted data. Rarely used in practice—mostly for teaching.',

  pseudocode: [
    'for i from 0 to n-1:',
    '  for j from 0 to n-i-2:',
    '    if array[j] > array[j+1]:',
    '      swap(array[j], array[j+1])',
    '  mark array[n-i-1] as sorted',
  ],

  generateSteps(input: number[]): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];
    const array = [...input];
    const sorted: number[] = [];
    const n = array.length;


    steps.push({
      array: [...array],
      highlighted: [],
      sorted: [],
      description: 'Starting Bubble Sort',
      explanation: `We'll compare adjacent elements and bubble the largest to the end, one pass at a time.`,
      concept: 'done',
    });

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
      
        steps.push({
          array: [...array],
          highlighted: [j, j + 1],
          sorted: [...sorted],
          pointers: { i, j },
          description: `Comparing ${array[j]} and ${array[j + 1]}`,
          explanation:
            array[j] > array[j + 1]
              ? `${array[j]} > ${array[j + 1]}, so they need to swap.`
              : `${array[j]} ≤ ${array[j + 1]}, no swap needed.`,
          concept: 'compare',
          lineOfCode: 2,
        });

        if (array[j] > array[j + 1]) {
          [array[j], array[j + 1]] = [array[j + 1], array[j]];

          
          steps.push({
            array: [...array],
            highlighted: [j, j + 1],
            sorted: [...sorted],
            pointers: { i, j },
            description: `Swapped to ${array[j]} and ${array[j + 1]}`,
            explanation: `Larger element moved right. This is how the largest "bubbles up".`,
            concept: 'swap',
            lineOfCode: 3,
          });
        }
      }

    
      sorted.push(n - i - 1);
      steps.push({
        array: [...array],
        highlighted: [],
        sorted: [...sorted],
        pointers: { i },
        description: `Element ${array[n - i - 1]} is now in its final position.`,
        explanation: `After pass ${i + 1}, the largest remaining value has settled at the end.`,
        concept: 'mark',
        lineOfCode: 4,
      });
    }

    // Final frame
    steps.push({
      array: [...array],
      highlighted: [],
      sorted: [...Array(n).keys()],
      description: 'Array is sorted!',
      explanation: `Bubble sort is complete. Every element is in its final position.`,
      concept: 'done',
    });

    return steps;
  },
};