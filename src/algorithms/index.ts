import type { SortingAlgorithm } from './types';
import { bubbleSort } from './sorting/bubbleSort';
import { mergeSort } from './sorting/mergeSort';
import { quickSort } from './sorting/quickSort';
import { heapSort } from './sorting/heapSort';
import { linearSearch } from './searching/linearSearch';
import { binarySearch } from './searching/binarySearch';
import { jumpSearch } from './searching/jumpSearch';
import { interpolationSearch } from './searching/interpolationSearch';
import { bfs } from './pathfinding/bfs';
import { dfs } from './pathfinding/dfs';
import { dijkstra } from './pathfinding/dijkstra';
import { astar } from './pathfinding/astar';
export const sortingAlgorithms: SortingAlgorithm[] = [
  bubbleSort,
  mergeSort,
  quickSort,
  heapSort,
];

export const searchingAlgorithms: SortingAlgorithm[] = [
  linearSearch,
  binarySearch,
  jumpSearch,
  interpolationSearch,
];

export const pathfindingAlgorithms: SortingAlgorithm[] = [
  bfs, 
  dfs, 
  dijkstra,
  astar,
];

export const allAlgorithms: SortingAlgorithm[] = [
  ...sortingAlgorithms,
  ...searchingAlgorithms,
  ...pathfindingAlgorithms,
];


if (import.meta.env.DEV) {
  const slugs = sortingAlgorithms.map((a) => a.slug);
  const unique = new Set(slugs);
  if (unique.size !== slugs.length) {
    console.error('Duplicate algorithm slugs detected:', slugs);
  }
}

export type { AlgorithmStep, SortingAlgorithm, AlgorithmInfo } from './types';