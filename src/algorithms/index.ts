import type { SortingAlgorithm } from './types';
import { bubbleSort } from './sorting/bubbleSort';
import { mergeSort } from './sorting/mergeSort';
import { quickSort } from './sorting/quickSort';

export const sortingAlgorithms: SortingAlgorithm[] = [
  bubbleSort,
  mergeSort,
  quickSort,
];

export type { AlgorithmStep, SortingAlgorithm, AlgorithmInfo } from './types';