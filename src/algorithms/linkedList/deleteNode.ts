import type {
  AlgorithmStep,
  SortingAlgorithm,
  TreeNode,
  NodeState,
} from '../types';

export const deleteNode: SortingAlgorithm = {
  slug: 'delete-node',
  name: 'Delete Node',
  description: 'Finds a value in the list and splices it out by rewiring the previous node.',
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(1)',
  stable: false,
  category: 'linked-list',

  keyIdeas: [
    'Must walk from head to find the target — O(n)',
    'Track the previous node so we can rewire its next pointer',
    'Deleting the head is a special case: move the head pointer',
    'Deleting the tail: previous node\'s next becomes null',
  ],

  whenToUse: 'Removing elements from a singly linked list. Doubly linked lists delete in O(1) given the node.',

  pseudocode: [
    'delete(head, target):',
    '  if head.value == target: return head.next',
    '  prev = head; current = head.next',
    '  while current is not null:',
    '    if current.value == target:',
    '      prev.next = current.next; return head',
    '    prev = current; current = current.next',
    '  return head  // not found',
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
    let headId = nodes[0].id;

    const target = input[Math.floor(Math.random() * input.length)];

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

    pushStep(`Deleting ${target}`, 'We walk from the head, tracking the previous node.');

    let prevId: string | undefined = undefined;
    let currentId: string | undefined = headId;
    let found = false;

    while (currentId) {
      const current = nodes.find((n) => n.id === currentId)!;

      pushStep(
        `Compare ${current.value} with ${target}`,
        current.value === target
          ? 'Match! Splice this node out.'
          : `${current.value} ≠ ${target}, advance.`,
        {
          [currentId]: 'comparing',
          ...(prevId ? { [prevId]: 'current' } : {}),
        },
        'compare'
      );

      if (current.value === target) {
        found = true;

        // Case 1: deleting the head
        if (prevId === undefined) {
          headId = current.right ?? '';
          const idx = nodes.findIndex((n) => n.id === currentId);
          nodes.splice(idx, 1);

          pushStep(
            `Head deleted`,
            'Head pointer moves to the next node.',
            {},
            'mark'
          );
        } else {
          // Case 2 or 3: rewire prev.next → current.next
          const nextId = current.right;
          const pidx = nodes.findIndex((n) => n.id === prevId);
          nodes[pidx] = { ...nodes[pidx], right: nextId };

          pushStep(
            `Rewired: ${nodes.find((n) => n.id === prevId)!.value}.next → ${
              nextId ? nodes.find((n) => n.id === nextId)!.value : 'null'
            }`,
            nextId
              ? 'Middle node removed — list closes the gap.'
              : 'Tail removed — the new last node\'s next is null.',
            { [prevId]: 'current', [currentId]: 'pivot' },
            'mark'
          );

          const idx = nodes.findIndex((n) => n.id === currentId);
          nodes.splice(idx, 1);
        }
        break;
      }

      prevId = currentId;
      currentId = current.right;
    }

    if (!found) {
      pushStep(
        `${target} not found`,
        'Walked the whole list. Nothing to delete.',
        {},
        'done'
      );
      return steps;
    }

    steps.push({
      kind: 'nodes',
      layout: 'linear',
      nodes: nodes.map((n) => ({ ...n, state: 'default' })),
      rootId: headId,
      description: `${target} deleted`,
      explanation: 'The list is intact — only the target node is gone.',
      concept: 'done',
    });

    return steps;
  },
};