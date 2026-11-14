import type {
  AlgorithmStep,
  SortingAlgorithm,
  TreeNode,
  NodeState,
} from '../types';

export const reverseLinkedList: SortingAlgorithm = {
  slug: 'reverse-linked-list',
  name: 'Reverse Linked List',
  description: 'Reverses a singly linked list in place by rewiring next pointers.',
  howItWorks: [
    "Use three pointers: `prev` (starts as null), `current` (starts at head), and `next`.",
    "Save `current.next` into the `next` pointer so we don't lose the rest of the list.",
    "Reverse the link: point `current.next` backwards to `prev`.",
    "Move `prev` forward to `current`.",
    "Move `current` forward to `next`.",
    "Repeat until `current` is null. The new head is `prev`."
  ],
  traps: [
    "If you don't save `next` before overwriting `current.next`, you will lose the rest of the list forever.",
    "Make sure to update the head pointer to `prev` at the very end.",
    "It takes O(n) time and O(1) space."
  ],
  pseudocodeExplanations: [
    "Entry point for reversing the list.",
    "Set prev to null because the original head will become the new tail.",
    "Start our current pointer at the head.",
    "Keep going until we reach the end of the list.",
    "Temporarily save the next node so we don't lose it.",
    "Reverse the current node's pointer to point backwards.",
    "Move prev one step forward.",
    "Move current one step forward.",
    "Return prev, which is now the new head of the reversed list."
  ],
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(1)',
  stable: false,
  category: 'linked-list',

  keyIdeas: [
    'Three pointers: prev, current, next',
    'Rewire current.next to point back at prev, then advance',
    'In-place — no extra memory beyond three pointers',
    'The original head becomes the tail; the original tail becomes the new head',
  ],

  whenToUse: 'Any problem needing a list in reverse order without allocating a new one.',

  pseudocode: [
    'reverse(head):',
    '  prev = null',
    '  current = head',
    '  while current is not null:',
    '    next = current.next',
    '    current.next = prev',
    '    prev = current',
    '    current = next',
    '  return prev',
  ],

  generateSteps(input: number[]): AlgorithmStep[] {
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
      'Initial linked list',
      `Head is ${nodes[0].value}. We'll reverse it with three pointers: prev, current, next.`
    );

    let prevId: string | undefined = undefined;
    let currentId: string | undefined = headId;

    while (currentId) {
      const current = nodes.find((n) => n.id === currentId)!;
      const nextId: string | undefined = current.right;

      pushStep(
        `At node ${current.value}`,
        `Prev is ${prevId ? nodes.find((n) => n.id === prevId)!.value : 'null'}. Next will be saved, then current.next rewired.`,
        {
          [currentId]: 'comparing',
          ...(prevId ? { [prevId]: 'current' } : {}),
          ...(nextId ? { [nextId]: 'inserted' } : {}),
        },
        'compare'
      );

      const cidx = nodes.findIndex((n) => n.id === currentId);
      nodes[cidx] = { ...nodes[cidx], right: prevId };

      pushStep(
        `Rewired: ${current.value}.next → ${prevId ? nodes.find((n) => n.id === prevId)!.value : 'null'}`,
        'Now advance: prev = current, current = next.',
        {
          [currentId]: 'current',
          ...(prevId ? { [prevId]: 'inserted' } : {}),
          ...(nextId ? { [nextId]: 'comparing' } : {}),
        },
        'mark'
      );

      prevId = currentId;
      currentId = nextId;
    }

    steps.push({
      kind: 'nodes',
      layout: 'linear',
      nodes: nodes.map((n) => ({
        ...n,
        state: n.id === prevId ? 'found' : 'inserted',
      })),
      rootId: headId,
      description: `Reversed. New head is ${nodes.find((n) => n.id === prevId)!.value}`,
      explanation:
        'Every next pointer now points the other way. The old tail is the new head.',
      concept: 'done',
    });

    return steps;
  },
};