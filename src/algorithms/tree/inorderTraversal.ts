import type {
  AlgorithmStep,
  SortingAlgorithm,

} from '../types';

import { buildBalancedBST } from './treeUtils';



export const inorderTraversal: SortingAlgorithm = {
  slug: 'inorder-traversal',
  name: 'Inorder Traversal',
  description: 'Visits left subtree → node → right subtree. Outputs a BST in sorted order.',
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(h) — recursion depth',
  stable: false,
  category: 'tree',

  keyIdeas: [
    'Visit order: left subtree, node itself, right subtree',
    'On a BST, inorder produces values in ascending sorted order',
    'This is *why* it is called a "search" tree — order is implicit',
    'Recursive shape mirrors the tree structure directly',
  ],

  whenToUse: 'Getting sorted output from a BST without sorting. Also the base for "kth smallest" and range queries.',

  pseudocode: [
    'inorder(node):',
    '  if node is null: return',
    '  inorder(node.left)',
    '  visit(node)',
    '  inorder(node.right)',
  ],

  generateSteps(input: number[]): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];
    const { nodes, rootId } = buildBalancedBST(input);

    steps.push({
      kind: 'nodes',
      nodes: nodes.map((n) => ({ ...n, state: 'default' })),
      rootId,
      description: 'Starting in-order traversal',
      explanation:
        'We will walk the tree left → node → right, recursively. Watch the visit order.',
      concept: 'done',
    });

    const visitOrder: number[] = [];

    function visit(nodeId: string | undefined) {
      if (!nodeId) return;
      const node = nodes.find((n) => n.id === nodeId);
      if (!node) return;

     
      steps.push({
        kind: 'nodes',
        nodes: nodes.map((n) => ({
          ...n,
          state:
            n.id === nodeId
              ? 'comparing'
              : visitOrder.includes(n.value)
              ? 'inserted'
              : 'default',
        })),
        rootId,
        description: `Entering node ${node.value}`,
        explanation: `Recurse left first. Then visit. Then right.`,
        concept: 'compare',
        lineOfCode: 1,
      });

   
      visit(node.left);

   
      visitOrder.push(node.value);
      steps.push({
        kind: 'nodes',
        nodes: nodes.map((n) => ({
          ...n,
          state: n.id === nodeId
            ? 'current'
            : visitOrder.includes(n.value)
            ? 'inserted'
            : 'default',
        })),
        rootId,
        description: `Visit ${node.value}`,
        explanation: `Visit order so far: [${visitOrder.join(', ')}]`,
        concept: 'mark',
        lineOfCode: 2,
      });

      
      visit(node.right);
    }

    visit(rootId);

    steps.push({
      kind: 'nodes',
      nodes: nodes.map((n) => ({ ...n, state: 'inserted' })),
      rootId,
      description: `Traversal complete: [${visitOrder.join(', ')}]`,
      explanation:
        'Notice the values are in ascending order. That is the BST invariant made visible.',
      concept: 'done',
    });

    return steps;
  },
};