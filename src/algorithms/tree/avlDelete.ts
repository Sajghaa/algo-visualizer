import type {
  AlgorithmStep,
  SortingAlgorithm,
  NodeState,
} from '../types';

import {
  buildBalancedBST,
  getBalance,
  rotateLeft,
  rotateRight,
} from './treeUtils';

export const avlDelete: SortingAlgorithm = {
  slug: 'avl-delete',
  name: 'AVL Delete',
  description: 'Removes a value from an AVL tree, then rebalances on the way up.',
  timeComplexity: 'O(log n)',
  spaceComplexity: 'O(1)',
  stable: false,
  category: 'tree',

  keyIdeas: [
    'Same three delete cases as BST: leaf, one child, two children',
    'After removal, walk up from the deepest ancestor',
    'Unlike insert, deletion can unbalance MULTIPLE ancestors',
    'Keep rebalancing until reaching the root',
    'Each node still guarantees |balance| ≤ 1',
  ],

  whenToUse: 'Removing from a sorted collection that must stay balanced — e.g. ordered sets, indexes.',

  pseudocode: [
    'avlDelete(root, target):',
    '  root = bstDelete(root, target)  // three cases',
    '  for each ancestor from deepest to root:',
    '    update balance factor at ancestor',
    '    if |balance| > 1: rotate appropriately',
    '  return root',
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

    pushStep('Starting tree', 'We will delete a random value and rebalance the tree on the way up.');

    const target = input[Math.floor(Math.random() * input.length)];
    pushStep(`Deleting ${target}`, 'Walk down from the root to find the node.');

    // ===== Walk down =====
    let current: string | undefined = rootId;
    let parent: string | undefined;
    const ancestors: string[] = [];
    let found = false;

    while (current) {
      ancestors.push(current);
      const node = nodes.find((n) => n.id === current)!;
      pushStep(
        `Compare ${target} with ${node.value}`,
        target === node.value
          ? 'Match! This is the node to delete.'
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
        ? 'Detach it from its parent.'
        : caseLabel === 'Case 2: One child'
        ? 'The single child replaces the node.'
        : 'Find the in-order successor in the right subtree.',
      { [current]: 'pivot' },
      'mark'
    );

    let succParent = current;
    const succPath: string[] = []; 

    if (hasLeft && hasRight) {
      let successor = toDelete.right!;
      while (true) {
        const sNode = nodes.find((n) => n.id === successor)!;
        succPath.push(successor);
        pushStep(
          `Successor search: at ${sNode.value}`,
          sNode.left ? 'Has left child — go further left.' : 'No left child — this is the successor.',
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
        `Copy ${successorNode.value} into the target, then remove the successor from the right subtree.`,
        { [successor]: 'pivot', [current]: 'comparing' },
        'mark'
      );

      const delIdx = nodes.findIndex((n) => n.id === current);
      nodes[delIdx] = { ...nodes[delIdx], value: successorNode.value };
      pushStep(
        `Node now holds ${successorNode.value}`,
        'Now remove the successor from its old position.',
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

      pushStep(`${target} deleted`, 'Value replaced. Now walk up and rebalance.', {}, 'done');
    } else {
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

      pushStep(`${target} deleted`, 'Now walk up and rebalance.', {}, 'done');
    }

    const fullPath: string[] = [...ancestors];
    if (hasLeft && hasRight && succParent !== current) {
      // The successor was deeper than target — its parents are additional ancestors
      for (const s of succPath) {
        if (s === succParent) {
          fullPath.push(s);
          break;
        }
        fullPath.push(s);
      }
    }

    for (let i = fullPath.length - 1; i >= 0; i--) {
      const aid = fullPath[i];
      const aNode = nodes.find((n) => n.id === aid);
      if (!aNode) continue;

      const balance = getBalance(nodes, aid);
      const ai = nodes.findIndex((n) => n.id === aid);
      nodes[ai] = { ...nodes[ai], balanceFactor: balance };

      const nodeAfter = nodes.find((n) => n.id === aid)!;
      const leftBalance = nodeAfter.left ? getBalance(nodes, nodeAfter.left) : 0;
      const rightBalance = nodeAfter.right ? getBalance(nodes, nodeAfter.right) : 0;

      pushStep(
        `Balance factor at ${nodeAfter.value}: ${balance > 0 ? '+' : ''}${balance}`,
        Math.abs(balance) > 1
          ? `Imbalanced! |${balance}| > 1. Rotation needed.`
          : 'Balance is fine. Keep walking up.',
        { [aid]: Math.abs(balance) > 1 ? 'pivot' : 'comparing' },
        'compare'
      );

      let rotationType: 'LL' | 'RR' | 'LR' | 'RL' | undefined;
      if (balance > 1) {
        rotationType = leftBalance >= 0 ? 'LL' : 'LR';
      } else if (balance < -1) {
        rotationType = rightBalance <= 0 ? 'RR' : 'RL';
      }

      if (!rotationType) continue;

      pushStep(
        `Rotating at ${nodeAfter.value} — ${rotationType} case`,
        rotationType === 'LL'
          ? 'Left-left: single right rotation.'
          : rotationType === 'RR'
          ? 'Right-right: single left rotation.'
          : rotationType === 'LR'
          ? 'Left-right: rotate left child left, then rotate node right.'
          : 'Right-left: rotate right child right, then rotate node left.',
        { [aid]: 'pivot' },
        'mark'
      );

      let newSubtreeRoot: string;
      if (rotationType === 'LL') {
        newSubtreeRoot = rotateRight(nodes, aid);
      } else if (rotationType === 'RR') {
        newSubtreeRoot = rotateLeft(nodes, aid);
      } else if (rotationType === 'LR') {
        const newLeft = rotateLeft(nodes, nodeAfter.left!);
        const uidx = nodes.findIndex((n) => n.id === aid);
        nodes[uidx] = { ...nodes[uidx], left: newLeft };
        newSubtreeRoot = rotateRight(nodes, aid);
      } else {
        const newRight = rotateRight(nodes, nodeAfter.right!);
        const uidx = nodes.findIndex((n) => n.id === aid);
        nodes[uidx] = { ...nodes[uidx], right: newRight };
        newSubtreeRoot = rotateLeft(nodes, aid);
      }

      if (aid === rootId) {
        rootId = newSubtreeRoot;
      } else {
        const p = nodes.find((n) => n.left === aid || n.right === aid);
        if (p) {
          const pidx = nodes.findIndex((n) => n.id === p.id);
          nodes[pidx] =
            p.left === aid
              ? { ...p, left: newSubtreeRoot }
              : { ...p, right: newSubtreeRoot };
        }
      }

      for (const node of nodes) {
        const idx = nodes.findIndex((n) => n.id === node.id);
        nodes[idx] = { ...nodes[idx], balanceFactor: undefined };
      }

      pushStep('Rotation complete', 'Subtree is balanced again. Keep walking up.', {}, 'done');
    }

    pushStep(
      'AVL tree after deletion',
      'All nodes have |balance| ≤ 1. Height is O(log n).',
      {},
      'done'
    );

    return steps;
  },
};