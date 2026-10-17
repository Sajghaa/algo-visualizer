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
import { bstInsert } from './tree/bstInsert';
import { inorderTraversal } from './tree/inorderTraversal';
import { preorderTraversal } from './tree/preorderTraversal';
import { postorderTraversal } from './tree/postorderTraversal';
import { bstSearch } from './tree/bstSearch';
import { avlInsert } from './tree/avIInsert';
import { bstDelete } from './tree/bstDelete';
import { avlDelete } from './tree/avlDelete';
import { reverseLinkedList } from './linkedList/reverseLinkedList';
import { insertHead } from './linkedList/insertHead';
import { insertTail } from './linkedList/insertTail';
import { linkedListSearch } from './linkedList/linkedListSearch';
import { deleteNode } from './linkedList/deleteNode';
import { cycleDetection } from './linkedList/cycleDetection';
import { mergeTwoSortedLists } from './linkedList/mergeTwoSortedLists';
import { circularLinkedList } from './linkedList/circularLinkedList';
import { topologicalSort } from './graph/topologicalSort';
import { primsMST } from './graph/primsMST';
import { kruskalsMST } from './graph/kruskalsMST';
import { fibonacci } from './dp/fibonacci';
import { lcs } from './dp/lcs';
import { knapsack } from './dp/knapsack';


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

export const treeAlgorithm: SortingAlgorithm[] = [
  bstInsert, 
  inorderTraversal,
  preorderTraversal,
  postorderTraversal,
  bstSearch,
  avlInsert,
  bstDelete,
  avlDelete,
];

export const linkedListAlgorithms: SortingAlgorithm[] = [
  reverseLinkedList,
  insertHead,
  insertTail,
  linkedListSearch,
  deleteNode,
  cycleDetection,
  mergeTwoSortedLists,
  circularLinkedList,
];

export const graphAlgorithms: SortingAlgorithm[] = [
  topologicalSort, 
  primsMST,
  kruskalsMST,
];

export const dpAlgorithms: SortingAlgorithm[] = [
  fibonacci,
  lcs,
  knapsack,
];

export const allAlgorithms: SortingAlgorithm[] = [
  ...sortingAlgorithms,
  ...searchingAlgorithms,
  ...pathfindingAlgorithms,
  ...treeAlgorithm,
  ...linkedListAlgorithms,
  ...graphAlgorithms,
  ...dpAlgorithms,

];


if (import.meta.env.DEV) {
  const slugs = sortingAlgorithms.map((a) => a.slug);
  const unique = new Set(slugs);
  if (unique.size !== slugs.length) {
    console.error('Duplicate algorithm slugs detected:', slugs);
  }
}

export type { AlgorithmStep, SortingAlgorithm, AlgorithmInfo } from './types';