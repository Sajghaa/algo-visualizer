import type {
  AlgorithmStep,
  SortingAlgorithm,
  TreeNode,
  NodeState,
} from '../types';

export const insertTail: SortingAlgorithm = {
  slug: 'insert-tail',
  name: 'Insert at Tail',
  description: 'Appends a new node at the end of the linked list.',
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(1)',
  stable: false,
  category: 'linked-list',

  keyIdeas: [
    'Singly linked lists have no tail pointer by default',
    'We must walk from head to the last node',
    'The last node\'s next becomes the new node',
    'With a tail pointer, this would be O(1)',
  ],

  whenToUse: 'Queues, event logs, or any append-heavy workload (better with a tail pointer).',

  pseudocode: [
    'insertTail(head, value):',
    '  new = Node(value)',
    '  if head is null: return new',
    '  current = head',
    '  while current.next is not null:',
    '    current = current.next',
    '  current.next = new',
    '  return head',
  ],

  generateSteps(input: number[]): AlgorithmStep[] {
    if (input.length === 0) return [];

    const steps: AlgorithmStep[] = [];
    const nodes: TreeNode[] = [];
    let nextId = 0;

    const bodyValues = input.slice(0, -1);
    const insertValue = input[input.length - 1];

    for (const value of bodyValues) {
      nodes.push({ id: `n${nextId++}`, value });
    }
    for (let i = 0; i < nodes.length - 1; i++) {
      nodes[i] = { ...nodes[i], right: nodes[i + 1].id };
    }
    const headId = nodes[0]?.id ?? '';

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

    pushStep(
      `Inserting ${insertValue} at the tail`,
      'We must walk from head to the last node before we can append.'
    );

    const visited: string[] = [];
    let current = headId;
    while (current) {
      const node = nodes.find((n) => n.id === current)!;
      visited.push(current);

      pushStep(
        `At node ${node.value}`,
        node.right ? 'Not the last node — advance.' : 'This is the last node. Append here.',
        {
          [current]: 'comparing',
          ...Object.fromEntries(visited.slice(0, -1).map((id) => [id, 'eliminated'])),
        },
        'compare'
      );

      if (!node.right) break;
      current = node.right;
    }

    const newId = `n${nextId++}`;
    nodes.push({ id: newId, value: insertValue, state: 'inserted' });

    const lastIdx = nodes.findIndex((n) => n.id === current);
    nodes[lastIdx] = { ...nodes[lastIdx], right: newId };

    pushStep(
      `${nodes.find((n) => n.id === current)!.value}.next → ${insertValue}`,
      'New node attached at the end.',
      {
        [current]: 'current',
        [newId]: 'inserted',
        ...Object.fromEntries(visited.slice(0, -1).map((id) => [id, 'eliminated'])),
      },
      'mark'
    );

    steps.push({
      kind: 'nodes',
      layout: 'linear',
      nodes: nodes.map((n) => ({
        ...n,
        state: n.id === newId ? 'found' : 'default',
      })),
      rootId: headId,
      description: `Appended ${insertValue} at the tail`,
      explanation: `Walked ${visited.length} nodes to find the end — that's O(n).`,
      concept: 'done',
    });

    return steps;
  },
};