import type {
  AlgorithmStep,
  SortingAlgorithm,
 
  NodeState,
} from '../types';

import { buildBalancedBST } from './treeUtils';

export const bstDelete: SortingAlgorithm = {
  slug: 'bst-delete',
  name: 'BST Delete',
  description: 'Removes a node from a BST — three cases: leaf, one child, two children.',
  timeComplexity: 'O(log n) average, O(n) worst',
  spaceComplexity: 'O(1)',
  stable: false,
  category: 'tree',

  keyIdeas: [
    'Three cases: leaf (detach), one child (splice), two children (successor)',
    'The in-order successor is the smallest value in the right subtree',
    'The successor has no left child — so removing it reduces to Case 1 or 2',
    'Copying the successor value preserves the BST invariant',
  ],

  whenToUse: 'Any ordered collection where removal must preserve sorted order — databases, sets, ordered maps.',

  pseudocode: [
    'bstDelete(root, target):',
    '  walk down from root, comparing, until found (track parent)',
    '  if leaf: detach from parent',
    '  if one child: parent points to that child',
    '  if two children:',
    '    successor = smallest value in right subtree',
    '    copy successor value into node',
    '    delete successor from right subtree',
  ],

  generateSteps(input: number[]): AlgorithmStep[] {
    const { nodes, rootId: initialRoot } = buildBalancedBST(input);
    const steps: AlgorithmStep[] = [];
    let rootId = initialRoot;

    const pushStep = (
      description: string,
      explanation: string,
      states: Record<string, NodeState> = {},
      concept: 'compare' | 'mark' | 'done' = 'done'
    ) => {
      steps.push({
        kind: 'nodes',
        nodes: nodes.map((n) => ({ ...n, state: states[n.id] ?? 'default' })),
        rootId,
        description,
        explanation,
        concept,
      });
    };

    pushStep('Starting tree', 'We will delete a randomly chosen value and watch the tree restructure.');

    const target = input[Math.floor(Math.random() * input.length)];
    pushStep(`Deleting ${target}`, 'Walking down from the root, comparing as we go.');

    let current: string | undefined = rootId;
    let parent: string | undefined = undefined;
    let found = false;

    while (current) {
      const node = nodes.find((n) => n.id === current)!;
      pushStep(
        `Compare ${target} with ${node.value}`,
        target === node.value
          ? 'Match! Found the node to delete.'
          : target < node.value
          ? `${target} < ${node.value}, go left.`
          : `${target} > ${node.value}, go right.`,
        { [current]: 'comparing' },
        'compare'
      );

      if (target === node.value) {
        found = true;
        break;
      }
      parent = current;
      current = target < node.value ? node.left : node.right;
    }

    if (!found || !current) {
      pushStep(`${target} not found`, 'Reached a null child. Nothing to delete.');
      return steps;
    }

    const toDelete = nodes.find((n) => n.id === current)!;
    const hasLeft = !!toDelete.left;
    const hasRight = !!toDelete.right;

    const caseLabel =
      !hasLeft && !hasRight
        ? 'Case 1: Leaf node'
        : hasLeft && hasRight
        ? 'Case 3: Two children'
        : 'Case 2: One child';

    pushStep(
      caseLabel,
      caseLabel === 'Case 1: Leaf node'
        ? 'No children. Just detach it from its parent.'
        : caseLabel === 'Case 2: One child'
        ? 'The single child replaces the node.'
        : 'Find the in-order successor in the right subtree.',
      { [current]: 'pivot' },
      'mark'
    );

    if (hasLeft && hasRight) {
      let succParent = current;
      let successor = toDelete.right!;

      while (true) {
        const sNode = nodes.find((n) => n.id === successor)!;
        pushStep(
          `Successor search: at ${sNode.value}`,
          sNode.left ? 'Has a left child — go left for a smaller value.' : 'No left child — this is the successor.',
          { [successor]: 'pivot', [current]: 'comparing' },
          'compare'
        );
        if (!sNode.left) break;
        succParent = successor;
        successor = sNode.left;
      }

      const successorNode = nodes.find((n) => n.id === successor)!;
      pushStep(
        `Successor is ${successorNode.value}`,
        `Copy ${successorNode.value} into the node being deleted, then remove the successor.`,
        { [successor]: 'pivot', [current]: 'comparing' },
        'mark'
      );

      const delIdx = nodes.findIndex((n) => n.id === current);
      nodes[delIdx] = { ...nodes[delIdx], value: successorNode.value };

      pushStep(
        `Node now holds ${successorNode.value}`,
        'The successor\'s position can now be safely removed.',
        { [current]: 'inserted' },
        'mark'
      );

      const replacement = successorNode.right;
      if (succParent === current) {
        const idx = nodes.findIndex((n) => n.id === current);
        nodes[idx] = { ...nodes[idx], right: replacement };
      } else {
        const idx = nodes.findIndex((n) => n.id === succParent);
        nodes[idx] = { ...nodes[idx], left: replacement };
      }
      const succIdx = nodes.findIndex((n) => n.id === successor);
      nodes.splice(succIdx, 1);

      pushStep(
        `${target} deleted`,
        'Successor moved into place. BST invariant intact.',
        {},
        'done'
      );
      return steps;
    }

    const replacement = hasLeft ? toDelete.left : hasRight ? toDelete.right : undefined;

    if (parent) {
      const idx = nodes.findIndex((n) => n.id === parent);
      const pNode = nodes[idx];
      nodes[idx] =
        pNode.left === current
          ? { ...pNode, left: replacement }
          : { ...pNode, right: replacement };
    } else {
      
      rootId = replacement ?? '';
    }

    const removeIdx = nodes.findIndex((n) => n.id === current);
    nodes.splice(removeIdx, 1);

    pushStep(`${target} deleted`, 'BST invariant preserved.', {}, 'done');

    return steps;
  },
};