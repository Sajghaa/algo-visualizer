import type {
  AlgorithmStep,
  SortingAlgorithm,
  TreeNode,
  NodeState,
} from '../types';

export const linkedListSearch: SortingAlgorithm = {
  slug: 'linked-list-search',
  name: 'Linked List Search',
  description: 'Walks the list from head to tail comparing each node to the target.',
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(1)',
  stable: false,
  category: 'linked-list',

  keyIdeas: [
    'No random access — must start at head and walk forward',
    'Each node costs one comparison',
    'Worst case visits every node (target not present)',
    'Best case finds it at the head in O(1)',
  ],

  whenToUse: 'When you must find a value in a linked list — but consider hash maps if lookups are frequent.',

  pseudocode: [
    'search(head, target):',
    '  current = head',
    '  while current is not null:',
    '    if current.value == target: return current',
    '    current = current.next',
    '  return null',
  ],

  generateSteps(input: number[]): AlgorithmStep[] {
    if (input.length === 0) return [];

    const steps: AlgorithmStep[] = [];
    const nodes: TreeNode[] = [];
    let nextId = 0;

    for (const value of input) {
      nodes.push({ id: `n${nextId++}`, value });
    }
    for (let i = 0; i < nodes.length - 1; i++) {
      nodes[i] = { ...nodes[i], right: nodes[i + 1].id };
    }
    const headId = nodes[0].id;

    const searchFor = input[Math.floor(Math.random() * input.length)];
    const eliminated: string[] = [];

    const pushStep = (
      description: string,
      explanation: string,
      states: Record<string, NodeState> = {},
      concept: 'compare' | 'mark' | 'done' = 'done'
    ) => {
      steps.push({
        kind: 'nodes',
        layout: 'linear',
        nodes: nodes.map((n) => ({ ...n, state: states[n.id] ?? 'default' })),
        rootId: headId,
        description,
        explanation,
        concept,
      });
    };

    pushStep(`Searching for ${searchFor}`, 'Start at the head and walk forward, comparing each node.');

    let current: string | undefined = headId;
    let found = false;

    while (current) {
      const node = nodes.find((n) => n.id === current)!;

      pushStep(
        `Compare ${node.value} with ${searchFor}`,
        node.value === searchFor
          ? `Match! Found ${searchFor}.`
          : `${node.value} ≠ ${searchFor}, advance.`,
        {
          [current]: 'comparing',
          ...Object.fromEntries(eliminated.map((id) => [id, 'eliminated'])),
        },
        'compare'
      );

      if (node.value === searchFor) {
        found = true;
        steps.push({
          kind: 'nodes',
          layout: 'linear',
          nodes: nodes.map((n) => ({
            ...n,
            state: n.id === current ? 'found' : eliminated.includes(n.id) ? 'eliminated' : 'default',
          })),
          rootId: headId,
          description: `Found ${searchFor}`,
          explanation: `Visited ${eliminated.length + 1} node(s). Linear search is O(n) — no shortcuts.`,
          concept: 'done',
        });
        break;
      }

      eliminated.push(current);
      current = node.right;
    }

    if (!found) {
      steps.push({
        kind: 'nodes',
        layout: 'linear',
        nodes: nodes.map((n) => ({ ...n, state: 'eliminated' })),
        rootId: headId,
        description: `${searchFor} not found`,
        explanation: `Walked all ${nodes.length} nodes. Target is not in the list.`,
        concept: 'done',
      });
    }

    return steps;
  },
};