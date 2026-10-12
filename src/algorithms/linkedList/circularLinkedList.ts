import type {
  AlgorithmStep,
  SortingAlgorithm,
  TreeNode,
  NodeState,
} from '../types';

export const circularLinkedList: SortingAlgorithm = {
  slug: 'circular-linked-list',
  name: 'Circular Linked List',
  description: 'Tail points back to head — the list has no end. Insert and traverse to see the loop.',
  timeComplexity: 'O(n) for insert at tail',
  spaceComplexity: 'O(1)',
  stable: false,
  category: 'linked-list',

  keyIdeas: [
    'The tail node\'s next pointer points back to the head — no null terminator',
    'Traversal must stop when we return to the start, not when we hit null',
    'Used in round-robin schedulers, ring buffers, and multiplayer turn order',
    'Insertion at tail requires updating both tail.next and new.next',
  ],

  whenToUse: 'Any cyclic process — round-robin scheduling, audio buffers, player turns, token rings.',

  pseudocode: [
    'circularInsert(head, value):',
    '  new = Node(value)',
    '  if head is null:',
    '    new.next = new; return new',
    '  tail = head',
    '  while tail.next is not head: tail = tail.next',
    '  new.next = head',
    '  tail.next = new',
    '  return head',
    '',
    'traverse(head):',
    '  current = head',
    '  do: visit(current); current = current.next',
    '  while current != head',
  ],

  generateSteps(input: number[]): AlgorithmStep[] {
    if (input.length === 0) return [];

    const steps: AlgorithmStep[] = [];
    const nodes: TreeNode[] = [];
    let nextId = 0;

    // Build the initial list (all but last value)
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
      'Starting with a linear list',
      `Head is ${bodyValues[0]}. Currently the tail's next is null.`,
      {}
    );

    if (nodes.length > 0) {
      const tailId = nodes[nodes.length - 1].id;
      const tIdx = nodes.findIndex((n) => n.id === tailId);
      nodes[tIdx] = { ...nodes[tIdx], right: headId };

      pushStep(
        `Closed the loop: tail (${nodes[tIdx].value}).next → head (${bodyValues[0]})`,
        'Now the list has no end. Traversal must stop when we return to head.',
        { [tailId]: 'current', [headId]: 'inserted' },
        'mark'
      );
    }

    const newId = `n${nextId}`;
    nodes.push({ id: newId, value: insertValue, state: 'inserted' });

    pushStep(
      `Inserting ${insertValue} at the tail`,
      'We need to update two pointers: the current tail\'s next, and the new node\'s next.',
      { [newId]: 'inserted' },
      'mark'
    );

    let current = headId;
    const visited: string[] = [];
    while (current) {
      const node = nodes.find((n) => n.id === current)!;
      visited.push(current);

      pushStep(
        `At node ${node.value}`,
        node.right === headId
          ? 'This is the tail — next points to head.'
          : 'Not the tail yet — advance.',
        {
          [current]: 'comparing',
          ...Object.fromEntries(visited.slice(0, -1).map((id) => [id, 'eliminated'])),
        },
        'compare'
      );

      if (node.right === headId) break;
      current = node.right!;
    }

    const tIdx = nodes.findIndex((n) => n.id === current);
    nodes[tIdx] = { ...nodes[tIdx], right: newId };

    const nIdx = nodes.findIndex((n) => n.id === newId);
    nodes[nIdx] = { ...nodes[nIdx], right: headId };

    pushStep(
      `${nodes[tIdx].value}.next → ${insertValue}, and ${insertValue}.next → ${bodyValues[0]}`,
      'Two pointers rewired. The loop now includes the new node.',
      { [current]: 'current', [newId]: 'inserted', [headId]: 'inserted' },
      'mark'
    );

    // ==== Step 3: Traverse the full loop once ====
    const loopOrder: string[] = [];
    let trav: string | undefined = headId;

    while (trav && !loopOrder.includes(trav)) {
      const node = nodes.find((n) => n.id === trav)!;
      loopOrder.push(trav);

      pushStep(
        `Traverse: visit ${node.value}`,
        `Visited so far: [${loopOrder.map((id) => nodes.find((n) => n.id === id)!.value).join(' → ')}]`,
        {
          [trav]: 'comparing',
          ...Object.fromEntries(loopOrder.slice(0, -1).map((id) => [id, 'inserted'])),
        },
        'compare'
      );

      trav = node.right;
    }

    steps.push({
      kind: 'nodes',
      layout: 'linear',
      nodes: nodes.map((n) => ({ ...n, state: 'inserted' })),
      rootId: headId,
      description: 'Traversal complete — returned to head',
      explanation:
        `Visited ${loopOrder.length} nodes. The loop closed without ever hitting null — that is the circular property.`,
      concept: 'done',
    });

    return steps;
  },
};