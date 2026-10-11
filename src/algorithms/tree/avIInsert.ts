import type {
  AlgorithmStep,
  SortingAlgorithm,
  TreeNode,
} from '../types';


function getHeight(nodes: TreeNode[], id: string | undefined): number {
  if (!id) return 0;
  const node = nodes.find((n) => n.id === id);
  if (!node) return 0;
  return 1 + Math.max(getHeight(nodes, node.left), getHeight(nodes, node.right));
}

function getBalance(nodes: TreeNode[], id: string): number {
  const node = nodes.find((n) => n.id === id);
  if (!node) return 0;
  return getHeight(nodes, node.left) - getHeight(nodes, node.right);
}


function rotateRight(nodes: TreeNode[], pivotId: string): string {
  const pivot = nodes.find((n) => n.id === pivotId)!;
  const newRoot = nodes.find((n) => n.id === pivot.left)!;
  const newRootId = newRoot.id;

  const pivotIdx = nodes.findIndex((n) => n.id === pivotId);
  nodes[pivotIdx] = { ...pivot, left: newRoot.right };

  const newRootIdx = nodes.findIndex((n) => n.id === newRootId);
  nodes[newRootIdx] = { ...newRoot, right: pivotId };

  return newRootId;
}

function rotateLeft(nodes: TreeNode[], pivotId: string): string {
  const pivot = nodes.find((n) => n.id === pivotId)!;
  const newRoot = nodes.find((n) => n.id === pivot.right)!;
  const newRootId = newRoot.id;

  const pivotIdx = nodes.findIndex((n) => n.id === pivotId);
  nodes[pivotIdx] = { ...pivot, right: newRoot.left };

  const newRootIdx = nodes.findIndex((n) => n.id === newRootId);
  nodes[newRootIdx] = { ...newRoot, left: pivotId };

  return newRootId;
}


export const avlInsert: SortingAlgorithm = {
  slug: 'avl-insert',
  name: 'AVL Insert',
  description: 'BST insert that rebalances itself with rotations. Always O(log n) depth.',
  timeComplexity: 'O(log n)',
  spaceComplexity: 'O(1) iterative',
  stable: false,
  category: 'tree',

  keyIdeas: [
    'Every node stores a balance factor: height(left) − height(right)',
    'After insert, walk up the tree checking balance factors',
    'If any node has |balance| > 1, rotate to restore balance',
    'Four cases: LL, RR, LR, RL — each fixed by 1 or 2 rotations',
    'Guaranteed O(log n) depth → O(log n) search, insert, delete',
  ],

  whenToUse: 'When lookup performance must be guaranteed, not probabilistic. Used in databases, filesystems, and language runtimes.',

  pseudocode: [
    'avlInsert(root, value):',
    '  root = bstInsert(root, value)',
    '  update heights along the path',
    '  balance = height(left) - height(right)',
    '  if balance > 1 and value < left.value: rotateRight(root)  // LL',
    '  if balance < -1 and value > right.value: rotateLeft(root)  // RR',
    '  if balance > 1 and value > left.value:                     // LR',
    '    root.left = rotateLeft(root.left); rotateRight(root)',
    '  if balance < -1 and value < right.value:                   // RL',
    '    root.right = rotateRight(root.right); rotateLeft(root)',
  ],

  generateSteps(input: number[]): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];
    const nodes: TreeNode[] = [];
    let rootId: string | undefined;
    let nextId = 0;

    steps.push({
      kind: 'nodes',
      nodes: [],
      rootId: '',
      description: 'Starting with an empty AVL tree',
      explanation:
        'Every insertion inserts like a BST, then walks up to check balance factors.',
      concept: 'done',
    });

    for (const value of input) {

      if (!rootId) {
        const newId = `n${nextId++}`;
        nodes.push({ id: newId, value, state: 'inserted' });
        rootId = newId;
        steps.push({
          kind: 'nodes',
          nodes: nodes.map((n) => ({ ...n, state: n.id === newId ? 'inserted' : 'default' })),
          rootId,
          description: `${value} becomes the root`,
          explanation: 'First value in the tree.',
          concept: 'mark',
        });
        continue;
      }

      let current = rootId;
      const ancestors: string[] = [];
      let parentId: string | undefined;
      let insertAsLeft = false;
      let isDuplicate = false;

      while (true) {
        ancestors.push(current);
        const node = nodes.find((n) => n.id === current)!;

        steps.push({
          kind: 'nodes',
          nodes: nodes.map((n) => ({
            ...n,
            state: n.id === current ? 'comparing' : 'default',
          })),
          rootId,
          description: `Compare ${value} with ${node.value}`,
          explanation:
            value === node.value
              ? `Duplicate — ${value} already in the tree. Skip.`
              : value < node.value
              ? `${value} < ${node.value}, go left.`
              : `${value} > ${node.value}, go right.`,
          concept: 'compare',
        });

        if (value === node.value) {
          isDuplicate = true;
          break;
        }

        const goLeft = value < node.value;
        const child = goLeft ? node.left : node.right;

        if (!child) {
          parentId = current;
          insertAsLeft = goLeft;
          break;
        }
        current = child;
      }

      if (isDuplicate) continue;

      const newId = `n${nextId++}`;
      nodes.push({ id: newId, value, state: 'inserted' });

      if (parentId) {
        const pi = nodes.findIndex((n) => n.id === parentId);
        nodes[pi] = insertAsLeft
          ? { ...nodes[pi], left: newId }
          : { ...nodes[pi], right: newId };
      }

      steps.push({
        kind: 'nodes',
        nodes: nodes.map((n) => ({
          ...n,
          state: n.id === newId ? 'inserted' : 'default',
        })),
        rootId,
        description: `${value} inserted as a leaf`,
        explanation: 'Now we walk up the ancestors to check for imbalances.',
        concept: 'mark',
      });

      let unbalancedId: string | undefined;
      let rotationType: 'LL' | 'RR' | 'LR' | 'RL' | undefined;

      for (let i = ancestors.length - 1; i >= 0; i--) {
        const aid = ancestors[i];
        const balance = getBalance(nodes, aid);
        const ai = nodes.findIndex((n) => n.id === aid);
        nodes[ai] = { ...nodes[ai], balanceFactor: balance };

        const aNode = nodes.find((n) => n.id === aid)!;
        const leftBalance = aNode.left ? getBalance(nodes, aNode.left) : 0;
        const rightBalance = aNode.right ? getBalance(nodes, aNode.right) : 0;

        steps.push({
          kind: 'nodes',
          nodes: nodes.map((n) => ({
            ...n,
            state: n.id === aid ? 'comparing' : 'default',
          })),
          rootId,
          description: `Balance factor at ${aNode.value}: ${balance > 0 ? '+' : ''}${balance}`,
          explanation:
            Math.abs(balance) > 1
              ? `Imbalanced! |${balance}| > 1. Rotation needed.`
              : 'Balance is fine (|balance| ≤ 1). Keep walking up.',
          concept: 'compare',
        });

        if (balance > 1) {
          rotationType = leftBalance >= 0 ? 'LL' : 'LR';
          unbalancedId = aid;
          break;
        } else if (balance < -1) {
          rotationType = rightBalance <= 0 ? 'RR' : 'RL';
          unbalancedId = aid;
          break;
        }
      }

      if (unbalancedId && rotationType) {
        const unbalNode = nodes.find((n) => n.id === unbalancedId)!;

        steps.push({
          kind: 'nodes',
          nodes: nodes.map((n) => ({
            ...n,
            state: n.id === unbalancedId ? 'pivot' : 'default',
          })),
          rootId,
          rotation: { pivotId: unbalancedId, type: rotationType },
          description: `Imbalance at ${unbalNode.value} — ${rotationType} case`,
          explanation:
            rotationType === 'LL'
              ? 'Left-left: single right rotation.'
              : rotationType === 'RR'
              ? 'Right-right: single left rotation.'
              : rotationType === 'LR'
              ? 'Left-right: left rotation on left child, then right rotation on node.'
              : 'Right-left: right rotation on right child, then left rotation on node.',
          concept: 'mark',
        });

     
        let newSubtreeRoot: string;

        if (rotationType === 'LL') {
          newSubtreeRoot = rotateRight(nodes, unbalancedId);
        } else if (rotationType === 'RR') {
          newSubtreeRoot = rotateLeft(nodes, unbalancedId);
        } else if (rotationType === 'LR') {
          const leftId = unbalNode.left!;
          const newLeft = rotateLeft(nodes, leftId);
          const uidx = nodes.findIndex((n) => n.id === unbalancedId);
          nodes[uidx] = { ...nodes[uidx], left: newLeft };
          newSubtreeRoot = rotateRight(nodes, unbalancedId);
        } else {
          const rightId = unbalNode.right!;
          const newRight = rotateRight(nodes, rightId);
          const uidx = nodes.findIndex((n) => n.id === unbalancedId);
          nodes[uidx] = { ...nodes[uidx], right: newRight };
          newSubtreeRoot = rotateLeft(nodes, unbalancedId);
        }

        if (unbalancedId === rootId) {
          rootId = newSubtreeRoot;
        } else {
          const parent = nodes.find(
            (n) => n.left === unbalancedId || n.right === unbalancedId
          );
          if (parent) {
            const pidx = nodes.findIndex((n) => n.id === parent.id);
            nodes[pidx] =
              parent.left === unbalancedId
                ? { ...parent, left: newSubtreeRoot }
                : { ...parent, right: newSubtreeRoot };
          }
        }

        for (const node of nodes) {
          const idx = nodes.findIndex((n) => n.id === node.id);
          nodes[idx] = { ...nodes[idx], balanceFactor: undefined };
        }

        steps.push({
          kind: 'nodes',
          nodes: nodes.map((n) => ({ ...n, state: 'default' })),
          rootId,
          description: 'Rotation complete — tree rebalanced',
          explanation: 'The subtree height is back to what it was before the insert.',
          concept: 'done',
        });
      }
    }

    steps.push({
      kind: 'nodes',
      nodes: nodes.map((n) => ({ ...n, state: 'inserted', balanceFactor: undefined })),
      rootId: rootId ?? '',
      description: `AVL tree built with ${nodes.length} nodes`,
      explanation:
        'Every node has a balance factor of −1, 0, or +1. Height is guaranteed O(log n).',
      concept: 'done',
    });

    return steps;
  },
};