import type {
  AlgorithmStep,
  SortingAlgorithm,
  TreeNode,
} from '../types';

function buildBalancedBST(values: number[]): { nodes: TreeNode[]; rootId: string } {
  const nodes: TreeNode[] = [];
  let nextId = 0;

  function build(sorted: number[], lo: number, hi: number): string | undefined {
    if (lo > hi) return undefined;
    const mid = Math.floor((lo + hi) / 2);
    const id = `n${nextId++}`;
    nodes.push({ id, value: sorted[mid] });
    const leftId = build(sorted, lo, mid - 1);
    const rightId = build(sorted, mid + 1, hi);
    const idx = nodes.findIndex((n) => n.id === id);
    nodes[idx] = { ...nodes[idx], left: leftId, right: rightId };
    return id;
  }

  const sorted = [...values].sort((a, b) => a - b);
  const rootId = build(sorted, 0, sorted.length - 1) ?? '';
  return { nodes, rootId };
}

function collectSubtree(nodes: TreeNode[], rootId: string | undefined): string[] {
  if (!rootId) return [];
  const node = nodes.find((n) => n.id === rootId);
  if (!node) return [];
  return [
    rootId,
    ...collectSubtree(nodes, node.left),
    ...collectSubtree(nodes, node.right),
  ];
}

export const bstSearch: SortingAlgorithm = {
  slug: 'bst-search',
  name: 'BST Search',
  description: 'Walks down the tree using comparisons — eliminates half the nodes at each step.',
  timeComplexity: 'O(log n) average, O(n) worst',
  spaceComplexity: 'O(1) iterative',
  stable: false,
  category: 'tree',

  keyIdeas: [
    'Compare target with current node — go left or right, never both',
    'Each comparison eliminates an entire subtree',
    'Average depth is O(log n) on balanced trees',
    'Degenerates to O(n) on unbalanced trees',
  ],

  whenToUse: 'Fast lookup in ordered data. The reason BSTs exist.',

  pseudocode: [
    'bstSearch(root, target):',
    '  current = root',
    '  while current is not null:',
    '    if target == current.value: return current',
    '    if target < current.value: current = current.left',
    '    else: current = current.right',
    '  return null',
  ],

  generateSteps(input: number[], target?: number): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];
    const { nodes, rootId } = buildBalancedBST(input);
    const eliminated = new Set<string>();

    const sorted = [...input].sort((a, b) => a - b);
    const searchFor =
      target ?? sorted[Math.floor(Math.random() * sorted.length)];

    steps.push({
      kind: 'nodes',
      nodes: nodes.map((n) => ({ ...n, state: 'default' })),
      rootId,
      description: `Searching for ${searchFor}`,
      explanation: 'We start at the root and compare our way down.',
      concept: 'done',
    });

    let current: string | undefined = rootId;
    let found = false;

    while (current) {
      const node = nodes.find((n) => n.id === current);
      if (!node) break;

      steps.push({
        kind: 'nodes',
        nodes: nodes.map((n) => ({
          ...n,
          state: eliminated.has(n.id)
            ? 'eliminated'
            : n.id === current
            ? 'comparing'
            : 'default',
        })),
        rootId,
        description: `Compare ${searchFor} with ${node.value}`,
        explanation:
          searchFor === node.value
            ? `Match! Found ${searchFor}.`
            : searchFor < node.value
            ? `${searchFor} < ${node.value}, go left. Eliminate right subtree.`
            : `${searchFor} > ${node.value}, go right. Eliminate left subtree.`,
        concept: 'compare',
        lineOfCode: 3,
      });

      if (searchFor === node.value) {
        found = true;
        steps.push({
          kind: 'nodes',
          nodes: nodes.map((n) => ({
            ...n,
            state:
              n.id === current
                ? 'found'
                : eliminated.has(n.id)
                ? 'eliminated'
                : 'default',
          })),
          rootId,
          description: `Found ${searchFor}!`,
          explanation: `Returned after ${eliminated.size + 1} comparisons. Balanced tree = O(log n).`,
          concept: 'mark',
          lineOfCode: 3,
        });
        break;
      }

      const toEliminate =
        searchFor < node.value ? node.right : node.left;
      if (toEliminate) {
        for (const id of collectSubtree(nodes, toEliminate)) {
          eliminated.add(id);
        }
      }

      current = searchFor < node.value ? node.left : node.right;
    }

    if (!found) {
      steps.push({
        kind: 'nodes',
        nodes: nodes.map((n) => ({
          ...n,
          state: eliminated.has(n.id) ? 'eliminated' : 'default',
        })),
        rootId,
        description: `${searchFor} not in the tree`,
        explanation: 'Reached a null child. Target is not present.',
        concept: 'done',
        lineOfCode: 6,
      });
    }

    return steps;
  },
};