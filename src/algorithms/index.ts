import type { SortingAlgorithm } from './types';
import { bubbleSort } from './sorting/bubbleSort';

export const sortingAlgorithms: SortingAlgorithm[] = [
  bubbleSort,

];

export type { AlgorithmStep, SortingAlgorithm, AlgorithmInfo } from './types';