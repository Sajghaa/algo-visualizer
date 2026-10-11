import type {
  AlgorithmStep,
  SortingAlgorithm,
  
} from '../types';

import { buildBalancedBST } from './treeUtils';

export const postorderTraversal: SortingAlgorithm = {
  slug: 'postorder-traversal',
  name: 'Postorder Traversal',
  description: 'Visits left → right → node. Used to delete trees and evaluate expressions.',
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(h) — recursion depth',
  stable: false,
  category: 'tree',

  keyIdeas: [
    'Visit order: left subtree, then right subtree, then the node itself',
    'Children are always visited before their parent',
    'Used for deleting trees (free children before parent)',
    'Evaluates postfix expressions in an expression tree',
  ],

  whenToUse: 'Deleting a tree, evaluating expression trees, or any problem needing children processed before parents.',

  pseudocode: [
    'postorder(node):',
    '  if node is null: return',
    '  postorder(node.left)',
    '  postorder(node.right)',
    '  visit(node)',
  ],

  generateSteps(input: number[]): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];
    const { nodes, rootId } = buildBalancedBST(input);

    steps.push({
      kind: 'nodes',
      nodes: nodes.map((n) => ({ ...n, state: 'default' })),
      rootId,
      description: 'Starting post-order traversal',
      explanation:
        'We recurse into left, then right, and only visit the node after both subtrees are done.',
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
        explanation: 'Recurse into both subtrees before visiting this node.',
        concept: 'compare',
        lineOfCode: 0,
      });

      // Recurse left FIRST
      visit(node.left);

      // Recurse right SECOND
      visit(node.right);

      // Visit this node LAST
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
        lineOfCode: 4,
      });
    }

    visit(rootId);

    steps.push({
      kind: 'nodes',
      nodes: nodes.map((n) => ({ ...n, state: 'inserted' })),
      rootId,
      description: `Traversal complete: [${visitOrder.join(', ')}]`,
      explanation:
        'Notice the root comes last — both subtrees were fully visited before it.',
      concept: 'done',
    });

    return steps;
  },
};