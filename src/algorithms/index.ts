import type { SortingAlgorithm } from './types';
import { bubbleSort } from './sorting/bubbleSort';
import { mergeSort } from './sorting/mergeSort';
import { quickSort } from './sorting/quickSort';
import { heapSort } from './sorting/heapSort';

export const sortingAlgorithms: SortingAlgorithm[] = [
  bubbleSort,
  mergeSort,
  quickSort,
  heapSort,
];

export type { AlgorithmStep, SortingAlgorithm, AlgorithmInfo } from './types';