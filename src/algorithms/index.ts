import type { SortingAlgorithm } from './types';
import { bubbleSort } from './sorting/bubbleSort';
import { mergeSort } from './sorting/mergeSort';
import { quickSort } from './sorting/quickSort';
import { heapSort } from './sorting/heapSort';
import { linearSearch } from './searching/linearSearch';

export const sortingAlgorithms: SortingAlgorithm[] = [
  bubbleSort,
  mergeSort,
  quickSort,
  heapSort,
];

export const searchingAlgorithms: SortingAlgorithm[] = [
  linearSearch,
];

export const allAlgorithms: SortingAlgorithm[] = [
  ...sortingAlgorithms,
  ...searchingAlgorithms,
];


if (import.meta.env.DEV) {
  const slugs = sortingAlgorithms.map((a) => a.slug);
  const unique = new Set(slugs);
  if (unique.size !== slugs.length) {
    console.error('Duplicate algorithm slugs detected:', slugs);
  }
}

export type { AlgorithmStep, SortingAlgorithm, AlgorithmInfo } from './types';