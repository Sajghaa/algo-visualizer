import type { SortingAlgorithm } from './types';
import { bubbleSort } from './sorting/bubbleSort';
import { mergeSort } from './sorting/mergeSort';

export const sortingAlgorithms: SortingAlgorithm[] = [
  bubbleSort,
  mergeSort,
];

export type { AlgorithmStep, SortingAlgorithm, AlgorithmInfo } from './types';