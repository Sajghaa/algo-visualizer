import type {
  AlgorithmStep,
  SortingAlgorithm,
  TreeNode,
  NodeState,
} from '../types';

export const cycleDetection: SortingAlgorithm = {
  slug: 'cycle-detection',
  name: "Floyd's Cycle Detection",
  description: 'Two pointers at different speeds — if they meet, there is a cycle.',
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(1)',
  stable: false,
  category: 'linked-list',

  keyIdeas: [
    'Slow pointer advances 1 node; fast advances 2',
    'If there is a cycle, fast eventually laps slow and they meet',
    'If there is no cycle, fast hits null first',
    'Constant extra space — no visited set required',
  ],

  whenToUse: 'Detecting cycles in linked lists, streams, or any functional iteration. Also a classic interview question.',

  pseudocode: [
    'hasCycle(head):',
    '  slow = head; fast = head',
    '  while fast is not null and fast.next is not null:',
    '    slow = slow.next',
    '    fast = fast.next.next',
    '    if slow == fast: return true',
    '  return false',
  ],

  generateSteps(input: number[]): AlgorithmStep[] {
    if (input.length < 3) return [];

    const steps: AlgorithmStep[] = [];
    const nodes: TreeNode[] = [];
    let nextId = 0;

    for (const value of input) {
      nodes.push({ id: `n${nextId++}`, value });
    }
    for (let i = 0; i < nodes.length - 1; i++) {
      nodes[i] = { ...nodes[i], right: nodes[i + 1].id };
    }

    const cycleStart = Math.floor(Math.random() * (nodes.length - 2));
    nodes[nodes.length - 1] = {
      ...nodes[nodes.length - 1],
      right: nodes[cycleStart].id,
    };
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
      `Cycle created: tail → node ${nodes[cycleStart].value}`,
      'Slow moves 1 step; fast moves 2. If they meet, there is a cycle.',
      {}
    );

    let slowId: string | undefined = headId;
    let fastId: string | undefined = headId;
    let iteration = 0;

    while (fastId) {
      iteration++;

      const fast1 = nodes.find((n) => n.id === fastId)?.right;
      if (!fast1) {
        pushStep('No cycle', `Fast reached the end after ${iteration - 1} iterations.`, {}, 'done');
        return steps;
      }
      const fast2 = nodes.find((n) => n.id === fast1)?.right;
      if (!fast2) {
        pushStep('No cycle', `Fast reached the end after ${iteration - 1} iterations.`, {}, 'done');
        return steps;
      }

      slowId = nodes.find((n) => n.id === slowId)?.right;
      fastId = fast2;

      pushStep(
        `Iteration ${iteration}`,
        `Slow is at ${nodes.find((n) => n.id === slowId)!.value}; fast is at ${nodes.find((n) => n.id === fastId)!.value}.`,
        {
          ...(slowId ? { [slowId]: 'comparing' } : {}),
          ...(fastId ? { [fastId]: 'current' } : {}),
        },
        'compare'
      );

      if (slowId === fastId) {
        pushStep(
          `Slow and fast met at ${nodes.find((n) => n.id === slowId)!.value}`,
          `Confirmed cycle after ${iteration} iterations. Floyd's algorithm uses O(1) space.`,
          { [slowId]: 'found' },
          'done'
        );
        return steps;
      }
    }

    pushStep('No cycle', 'Fast reached null — the list terminates.', {}, 'done');
    return steps;
  },
};