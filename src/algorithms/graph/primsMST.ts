import type {
  AlgorithmStep,
  SortingAlgorithm,

  NodeState,
  GraphEdge,
} from '../types';
import { MinHeap } from '../../utils/MinHeap';
import { generateWeightedUndirectedGraph } from './graphUtils';

interface HeapEdge {
  from: string;
  to: string;
  weight: number;
  edgeIndex: number;
}

export const primsMST: SortingAlgorithm = {
  slug: 'prims-mst',
  name: "Prim's MST",
  description: 'Grows a minimum spanning tree from one node — always adds the cheapest frontier edge.',
  timeComplexity: 'O((V + E) log V)',
  spaceComplexity: 'O(V + E)',
  stable: false,
  category: 'graph',

  keyIdeas: [
    'Start from any node — the MST is the same regardless of start',
    'Maintain a frontier of edges from the tree to unvisited nodes',
    'Always pick the cheapest frontier edge (priority queue)',
    'Add the edge only if it connects a new node — otherwise skip',
    'Greedy works for MSTs (unlike many optimization problems)',
  ],

  whenToUse: 'Dense graphs (many edges). Network design, circuit layout, cluster analysis.',

  pseudocode: [
    'prim(graph, start):',
    '  tree = {start}; mst = []',
    '  heap = edges from start',
    '  while heap not empty:',
    '    (w, from, to) = heap.pop()',
    '    if to in tree: continue',
    '    mst.push((from, to))',
    '    tree.add(to)',
    '    for each edge from to:',
    '      if edge.to not in tree: heap.push(edge)',
    '  return mst',
  ],

  generateSteps(_input: number[]): AlgorithmStep[] {
    const { nodes, edges } = generateWeightedUndirectedGraph(6, 0.35);
    const steps: AlgorithmStep[] = [];

    const startId = nodes[0].id;
    const inTree = new Set<string>([startId]);
    const chosenEdges = new Set<number>();  // indices of chosen edges
    const rejectedEdges = new Set<number>();

    // Adjacency: for each node, list of (neighborId, weight, edgeIndex)
    const adj = new Map<string, { to: string; weight: number; edgeIndex: number }[]>();
    for (const n of nodes) adj.set(n.id, []);
    edges.forEach((e, i) => {
      adj.get(e.from)!.push({ to: e.to, weight: e.weight!, edgeIndex: i });
      adj.get(e.to)!.push({ to: e.from, weight: e.weight!, edgeIndex: i });
    });

    const buildEdges = (): GraphEdge[] =>
      edges.map((e, i) => ({
        ...e,
        state: chosenEdges.has(i)
          ? 'chosen'
          : rejectedEdges.has(i)
          ? 'rejected'
          : 'default',
      }));

    const pushStep = (
      description: string,
      explanation: string,
      states: Record<string, NodeState> = {},
      concept: 'compare' | 'mark' | 'done' = 'done',
      extraEdges?: GraphEdge[]
    ) => {
      steps.push({
        kind: 'nodes',
        layout: 'graph',
        nodes: nodes.map((n) => ({ ...n, state: states[n.id] ?? 'default' })),
        rootId: '',
        edges: extraEdges ?? buildEdges(),
        description,
        explanation,
        concept,
      });
    };

    pushStep(
      'Weighted undirected graph',
      'We will build a minimum spanning tree using Prim\'s greedy algorithm.',
      { [startId]: 'inserted' }
    );

    const heap = new MinHeap<HeapEdge>();

    // Seed the heap with edges from the start
    for (const neighbor of adj.get(startId) ?? []) {
      heap.push(
        { from: startId, to: neighbor.to, weight: neighbor.weight, edgeIndex: neighbor.edgeIndex },
        neighbor.weight
      );
    }

    pushStep(
      `Starting from node ${nodes.find((n) => n.id === startId)!.value}`,
      `Pushed ${heap.size} edges into the priority queue.`,
      { [startId]: 'current' }
    );

    while (!heap.isEmpty()) {
      const top = heap.pop()!;
      const fromValue = nodes.find((n) => n.id === top.from)!.value;
      const toValue = nodes.find((n) => n.id === top.to)!.value;


      pushStep(
        `Pop cheapest: ${fromValue} → ${toValue} (weight ${top.weight})`,
        inTree.has(top.to)
          ? `${toValue} is already in the tree — this edge would create a cycle. Skip.`
          : `${toValue} is not in the tree — add this edge.`,
        { [top.from]: 'current', [top.to]: 'comparing' },
        'compare',
        buildEdges().map((e, i) => i === top.edgeIndex ? { ...e, state: 'considering' } : e)
      );

      if (inTree.has(top.to)) {
        rejectedEdges.add(top.edgeIndex);
        pushStep(
          `Skipped edge ${fromValue} → ${toValue}`,
          'Both endpoints already in the tree.',
          {},
          'done'
        );
        continue;
      }

      // Add to MST
      chosenEdges.add(top.edgeIndex);
      inTree.add(top.to);

      pushStep(
        `Added ${fromValue} → ${toValue} to MST`,
        `Tree now has ${inTree.size} nodes, ${chosenEdges.size} edges.`,
        { [top.from]: 'inserted', [top.to]: 'inserted' },
        'mark'
      );

      // Push this node's edges
      for (const neighbor of adj.get(top.to) ?? []) {
        if (!inTree.has(neighbor.to)) {
          heap.push(
            { from: top.to, to: neighbor.to, weight: neighbor.weight, edgeIndex: neighbor.edgeIndex },
            neighbor.weight
          );
        }
      }

    
      if (inTree.size === nodes.length) {
        pushStep(
          'All nodes connected',
          `MST complete. Total weight: ${edges
            .filter((_, i) => chosenEdges.has(i))
            .reduce((sum, e) => sum + (e.weight ?? 0), 0)}.`,
          Object.fromEntries(nodes.map((n) => [n.id, 'inserted'])),
          'done'
        );
        return steps;
      }
    }

    pushStep('Heap exhausted', 'All edges considered.', {}, 'done');
    return steps;
  },
};