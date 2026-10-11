import type {
  AlgorithmStep,
  SortingAlgorithm,
  
} from '../types';


import { buildBalancedBST } from './treeUtils';


export const preorderTraversal: SortingAlgorithm = {
  slug: 'preorder-traversal',
  name: 'Preorder Traversal',
  description: 'Visits node → left → right. Used to copy trees and serialize them.',
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(h) — recursion depth',
  stable: false,
  category: 'tree',

  keyIdeas: [
    'Visit order: node itself, then left subtree, then right subtree',
    'The root is always visited first — useful for copying trees',
    'Used for prefix expressions and tree serialization',
    'Same recursion as inorder, different position of the visit',
  ],

  whenToUse: 'Copying trees, serializing them, or any problem where you need the root before its subtrees.',

  pseudocode: [
    'preorder(node):',
    '  if node is null: return',
    '  visit(node)',
    '  preorder(node.left)',
    '  preorder(node.right)',
  ],

  generateSteps(input: number[]): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];
    const { nodes, rootId } = buildBalancedBST(input);

    steps.push({
      kind: 'nodes',
      nodes: nodes.map((n) => ({ ...n, state: 'default' })),
      rootId,
    description: 'Starting pre-order traversal',
    explanation:
    'We visit the node first, then recurse into left, then right. The root always comes first.',
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

      visit(node.left);

      visit(node.right);;
    }

    visit(rootId);

    steps.push({
      kind: 'nodes',
      nodes: nodes.map((n) => ({ ...n, state: 'inserted' })),
      rootId,
      description: `Traversal complete: [${visitOrder.join(', ')}]`,
      explanation: 'Notice the root appears first, then its left subtree, then its right subtree.',
      concept: 'done',
    });

    return steps;
  },
};