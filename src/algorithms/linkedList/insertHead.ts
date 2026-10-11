import type {
  AlgorithmStep,
  SortingAlgorithm,
  TreeNode,
  NodeState,
} from '../types';

export const insertHead: SortingAlgorithm = {
  slug: 'insert-head',
  name: 'Insert at Head',
  description: 'Prepends a new node to the linked list in O(1) time.',
  timeComplexity: 'O(1)',
  spaceComplexity: 'O(1)',
  stable: false,
  category: 'linked-list',

  keyIdeas: [
    'New node\'s next points to the current head',
    'Head pointer moves to the new node',
    'Constant time — no traversal needed',
    'The opposite of append, which is O(n)',
  ],

  whenToUse: 'Stacks, undo buffers, or any prepend-heavy workload.',

  pseudocode: [
    'insertHead(head, value):',
    '  new = Node(value)',
    '  new.next = head',
    '  return new  // new head',
  ],

  generateSteps(input: number[]): AlgorithmStep[] {
    if (input.length === 0) return [];

    const steps: AlgorithmStep[] = [];
    const nodes: TreeNode[] = [];
    let nextId = 0;

    const bodyValues = input.slice(1);
    const insertValue = input[0];

    for (const value of bodyValues) {
      nodes.push({ id: `n${nextId++}`, value });
    }
    for (let i = 0; i < nodes.length - 1; i++) {
      nodes[i] = { ...nodes[i], right: nodes[i + 1].id };
    }
    const oldHeadId = nodes[0]?.id;

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
        rootId: oldHeadId ?? '',
        description,
        explanation,
        concept,
      });
    };

    pushStep(
      `Inserting ${insertValue} at the head`,
      `Current head is ${bodyValues[0]}. We'll prepend a new node in O(1).`
    );

    const newId = `n${nextId++}`;
    nodes.unshift({ id: newId, value: insertValue, state: 'inserted' });

    pushStep(
      `New node ${insertValue} created`,
      'It has no next pointer yet.',
      { [newId]: 'inserted' },
      'mark'
    );

    const nidx = nodes.findIndex((n) => n.id === newId);
    nodes[nidx] = { ...nodes[nidx], right: oldHeadId };

    pushStep(
      `${insertValue}.next → ${bodyValues[0] ?? 'null'}`,
      'The new node now points at the old head.',
      { [newId]: 'current', ...(oldHeadId ? { [oldHeadId]: 'inserted' } : {}) },
      'mark'
    );

    steps.push({
      kind: 'nodes',
      layout: 'linear',
      nodes: nodes.map((n) => ({
        ...n,
        state: n.id === newId ? 'found' : 'default',
      })),
      rootId: newId,
      description: `Head is now ${insertValue}`,
      explanation: 'The new node is the head. No traversal was needed — constant time.',
      concept: 'done',
    });

    return steps;
  },
};