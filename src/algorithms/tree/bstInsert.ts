import type {
  AlgorithmStep,
  SortingAlgorithm,
  TreeNode,
} from '../types';

export const bstInsert: SortingAlgorithm = {
  slug: 'bst-insert',
  name: 'BST Insert',
  description: 'Builds a Binary Search Tree by inserting values one at a time.',
  timeComplexity: 'O(n log n) average',
  spaceComplexity: 'O(n)',
  stable: false,
  category: 'tree',

  keyIdeas: [
    'Left child < parent < right child — the BST invariant',
    'Each insert walks down from the root, comparing as it goes',
    'Average depth is O(log n) for random inputs',
    'Worst case (sorted input) degenerates to a linked list — O(n)',
  ],

  whenToUse: 'Ordered data with fast insert, search, and delete. Foundation for balanced trees (AVL, Red-Black).',

  pseudocode: [
    'bstInsert(root, value):',
    '  if root is null: return new Node(value)',
    '  current = root',
    '  while true:',
    '    if value < current.value:',
    '      if current.left is null: current.left = new Node(value); return',
    '      current = current.left',
    '    else if value > current.value:',
    '      if current.right is null: current.right = new Node(value); return',
    '      current = current.right',
    '    else: return  // duplicate, ignore',
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
      description: 'Starting with an empty tree',
      explanation: 'Insert values one at a time. The first value becomes the root.',
      concept: 'done',
    });

    for (const value of input) {
      const newId = `n${nextId++}`;

      if (!rootId) {
        nodes.push({ id: newId, value, state: 'inserted' });
        rootId = newId;
        steps.push({
          kind: 'nodes',
          nodes: nodes.map((n) => ({ ...n, state: n.id === newId ? 'inserted' : 'default' })),
          rootId,
          description: `${value} becomes the root`,
          explanation: 'The first inserted value always becomes the root.',
          concept: 'mark',
        });
        continue;
      }

      let current = rootId;
      const ancestors: string[] = [];

      while (true) {
        ancestors.push(current);
        const currentNode = nodes.find((n) => n.id === current)!;

        steps.push({
          kind: 'nodes',
          nodes: nodes.map((n) => ({
            ...n,
            state:
              n.id === current
                ? 'comparing'
                : ancestors.slice(0, -1).includes(n.id)
                ? 'current'
                : 'default',
          })),
          rootId,
          description: `Compare ${value} with ${currentNode.value}`,
          explanation:
            value < currentNode.value
              ? `${value} < ${currentNode.value}, go left.`
              : value > currentNode.value
              ? `${value} > ${currentNode.value}, go right.`
              : `${value} equals ${currentNode.value} — duplicate, skip.`,
          concept: 'compare',
        });

        if (value === currentNode.value) break;

        const goLeft = value < currentNode.value;
        const childId = goLeft ? currentNode.left : currentNode.right;

        if (!childId) {
          const newNode: TreeNode = { id: newId, value, state: 'inserted' };
          nodes.push(newNode);

          const parentIdx = nodes.findIndex((n) => n.id === current);
          nodes[parentIdx] = goLeft
            ? { ...nodes[parentIdx], left: newId }
            : { ...nodes[parentIdx], right: newId };

          steps.push({
            kind: 'nodes',
            nodes: nodes.map((n) => ({
              ...n,
              state:
                n.id === newId
                  ? 'inserted'
                  : n.id === current
                  ? 'current'
                  : 'default',
            })),
            rootId,
            description: `${value} inserted as ${goLeft ? 'left' : 'right'} child of ${currentNode.value}`,
            explanation: `Empty slot found. BST invariant preserved.`,
            concept: 'mark',
          });
          break;
        }

        current = childId;
      }
    }

    steps.push({
      kind: 'nodes',
      nodes: nodes.map((n) => ({ ...n, state: 'default' })),
      rootId: rootId ?? '',
      description: `Tree built with ${nodes.length} nodes`,
      explanation: 'In-order traversal of this tree would give sorted values.',
      concept: 'done',
    });

    return steps;
  },
};