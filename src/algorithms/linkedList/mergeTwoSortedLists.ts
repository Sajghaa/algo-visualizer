import type {
  AlgorithmStep,
  SortingAlgorithm,
  TreeNode,
  NodeState,
} from '../types';

export const mergeTwoSortedLists: SortingAlgorithm = {
  slug: 'merge-two-sorted-lists',
  name: 'Merge Two Sorted Lists',
  description: 'Two-pointer merge — walk both sorted lists, always pick the smaller head.',
  timeComplexity: 'O(n + m)',
  spaceComplexity: 'O(1) extra',
  stable: false,
  category: 'linked-list',

  keyIdeas: [
    'Both inputs must be sorted — that is the invariant we exploit',
    'Two pointers: one per list, always advance the one with the smaller value',
    'One pass — each node is visited exactly once',
    'Same core idea as the merge step inside merge sort',
  ],

  whenToUse: 'Merging sorted streams, external sort, or any "merge N sorted sequences" problem.',

  pseudocode: [
    'merge(a, b):',
    '  result = new list',
    '  while a is not null and b is not null:',
    '    if a.value <= b.value:',
    '      append a.value; a = a.next',
    '    else:',
    '      append b.value; b = b.next',
    '  append any remaining nodes',
    '  return result',
  ],

  generateSteps(input: number[]): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];
    const nodes: TreeNode[] = [];
    let nextId = 0;

    const mid = Math.floor(input.length / 2);
    const listA = [...input.slice(0, mid)].sort((a, b) => a - b);
    const listB = [...input.slice(mid)].sort((a, b) => a - b);

    const aIds: string[] = [];
    for (const value of listA) {
      const id = `n${nextId++}`;
      nodes.push({ id, value, yOffset: 0 });
      aIds.push(id);
    }
    for (let i = 0; i < aIds.length - 1; i++) {
      const idx = nodes.findIndex((n) => n.id === aIds[i]);
      nodes[idx] = { ...nodes[idx], right: aIds[i + 1] };
    }

    const bIds: string[] = [];
    for (const value of listB) {
      const id = `n${nextId++}`;
      nodes.push({ id, value, yOffset: 1 });
      bIds.push(id);
    }
    for (let i = 0; i < bIds.length - 1; i++) {
      const idx = nodes.findIndex((n) => n.id === bIds[i]);
      nodes[idx] = { ...nodes[idx], right: bIds[i + 1] };
    }

    const headA = aIds[0] ?? '';

    const mergedIds: string[] = [];
    const tailIdRef = { current: undefined as string | undefined };

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
        rootId: headA,
        description,
        explanation,
        concept,
      });
    };

    pushStep(
      'Two sorted lists, ready to merge',
      `List A: [${listA.join(', ')}]  List B: [${listB.join(', ')}]`,
      {}
    );

    let ai = 0;
    let bi = 0;

    while (ai < aIds.length && bi < bIds.length) {
      const aNode = nodes.find((n) => n.id === aIds[ai])!;
      const bNode = nodes.find((n) => n.id === bIds[bi])!;

      pushStep(
        `Compare ${aNode.value} (A) with ${bNode.value} (B)`,
        aNode.value <= bNode.value
          ? `${aNode.value} ≤ ${bNode.value} — take from A.`
          : `${bNode.value} < ${aNode.value} — take from B.`,
        { [aNode.id]: 'comparing', [bNode.id]: 'current' },
        'compare'
      );

      const takeFromA = aNode.value <= bNode.value;
      const chosen = takeFromA ? aNode : bNode;

     
      const newId = `n${nextId++}`;
      nodes.push({ id: newId, value: chosen.value, yOffset: 2, state: 'inserted' });

      if (tailIdRef.current) {
        const tIdx = nodes.findIndex((n) => n.id === tailIdRef.current);
        nodes[tIdx] = { ...nodes[tIdx], right: newId };
      }
      tailIdRef.current = newId;
      mergedIds.push(newId);

      
      const consumedIdx = nodes.findIndex((n) => n.id === chosen.id);
      nodes[consumedIdx] = { ...nodes[consumedIdx], state: 'eliminated' };

      pushStep(
        `Appended ${chosen.value} to merged list`,
        `Advancing pointer in list ${takeFromA ? 'A' : 'B'}.`,
        { [newId]: 'inserted' },
        'mark'
      );

      if (takeFromA) ai++;
      else bi++;
    }

    while (ai < aIds.length) {
      const aNode = nodes.find((n) => n.id === aIds[ai])!;
      const newId = `n${nextId++}`;
      nodes.push({ id: newId, value: aNode.value, yOffset: 2, state: 'inserted' });
      if (tailIdRef.current) {
        const tIdx = nodes.findIndex((n) => n.id === tailIdRef.current);
        nodes[tIdx] = { ...nodes[tIdx], right: newId };
      }
      tailIdRef.current = newId;
      mergedIds.push(newId);

      const consumedIdx = nodes.findIndex((n) => n.id === aNode.id);
      nodes[consumedIdx] = { ...nodes[consumedIdx], state: 'eliminated' };

      pushStep(
        `Appended remaining ${aNode.value} from A`,
        'List B is exhausted — drain A.',
        { [newId]: 'inserted' },
        'mark'
      );
      ai++;
    }

    while (bi < bIds.length) {
      const bNode = nodes.find((n) => n.id === bIds[bi])!;
      const newId = `n${nextId++}`;
      nodes.push({ id: newId, value: bNode.value, yOffset: 2, state: 'inserted' });
      if (tailIdRef.current) {
        const tIdx = nodes.findIndex((n) => n.id === tailIdRef.current);
        nodes[tIdx] = { ...nodes[tIdx], right: newId };
      }
      tailIdRef.current = newId;
      mergedIds.push(newId);

      const consumedIdx = nodes.findIndex((n) => n.id === bNode.id);
      nodes[consumedIdx] = { ...nodes[consumedIdx], state: 'eliminated' };

      pushStep(
        `Appended remaining ${bNode.value} from B`,
        'List A is exhausted — drain B.',
        { [newId]: 'inserted' },
        'mark'
      );
      bi++;
    }

    steps.push({
      kind: 'nodes',
      layout: 'linear',
      nodes: nodes.map((n) => ({ ...n, state: 'default' })),
      rootId: headA,
      description: `Merged: [${[...listA, ...listB].sort((a, b) => a - b).join(', ')}]`,
      explanation:
        'One pass through both lists. Sorted order preserved. Same idea as the merge step in merge sort.',
      concept: 'done',
    });

    return steps;
  },
};