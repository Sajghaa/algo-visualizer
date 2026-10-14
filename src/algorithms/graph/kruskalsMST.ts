import type {
  AlgorithmStep,
  SortingAlgorithm,
  NodeState,
  GraphEdge,
} from '../types';
import { UnionFind } from '../../utils/UnionFind';
import { generateWeightedUndirectedGraph } from './graphUtils';

export const kruskalsMST: SortingAlgorithm = {
  slug: 'kruskals-mst',
  name: "Kruskal's MST",
  description: 'Sort all edges by weight, add each unless it would create a cycle.',
  timeComplexity: 'O(E log E)',
  spaceComplexity: 'O(V + E)',
  stable: false,
  category: 'graph',

  keyIdeas: [
    'Sort all edges globally by weight',
    'Process them in order — cheapest first',
    'Use Union-Find to check if an edge would create a cycle',
    'Add the edge if endpoints are in different components',
    'Stop after n-1 edges are chosen',
  ],

  whenToUse: 'Sparse graphs (few edges). Also natural for streaming or distributed settings.',

  pseudocode: [
    'kruskal(graph):',
    '  sort all edges by weight',
    '  uf = UnionFind(all nodes)',
    '  mst = []',
    '  for each edge (from, to, weight) in sorted order:',
    '    if uf.find(from) != uf.find(to):',
    '      uf.union(from, to)',
    '      mst.push(edge)',
    '      if mst.length == n-1: break',
    '  return mst',
  ],

  generateSteps(_input: number[]): AlgorithmStep[] {
    const { nodes, edges } = generateWeightedUndirectedGraph(6, 0.35);
    const steps: AlgorithmStep[] = [];

    const sortedIndices = edges
      .map((_, i) => i)
      .sort((a, b) => (edges[a].weight ?? 0) - (edges[b].weight ?? 0));

    const chosen = new Set<number>();
    const rejected = new Set<number>();

    const buildEdges = (consideringIdx?: number): GraphEdge[] =>
      edges.map((e, i) => ({
        ...e,
        state: chosen.has(i)
          ? 'chosen'
          : rejected.has(i)
          ? 'rejected'
          : i === consideringIdx
          ? 'considering'
          : 'default',
      }));

    const pushStep = (
      description: string,
      explanation: string,
      states: Record<string, NodeState> = {},
      concept: 'compare' | 'mark' | 'done' = 'done',
      consideringIdx?: number
    ) => {
      steps.push({
        kind: 'nodes',
        layout: 'graph',
        nodes: nodes.map((n) => ({ ...n, state: states[n.id] ?? 'default' })),
        rootId: '',
        edges: buildEdges(consideringIdx),
        description,
        explanation,
        concept,
      });
    };

    pushStep(
      'Weighted undirected graph',
      `Edges sorted by weight: [${sortedIndices.map((i) => edges[i].weight).join(', ')}]`,
      {}
    );

    const uf = new UnionFind(nodes.map((n) => n.id));

    for (const edgeIdx of sortedIndices) {
      const edge = edges[edgeIdx];
      const fromValue = nodes.find((n) => n.id === edge.from)!.value;
      const toValue = nodes.find((n) => n.id === edge.to)!.value;

      pushStep(
        `Consider edge ${fromValue} → ${toValue} (weight ${edge.weight})`,
        'Check if endpoints are already in the same component.',
        { [edge.from]: 'comparing', [edge.to]: 'comparing' },
        'compare',
        edgeIdx
      );

      const rootFrom = uf.find(edge.from);
      const rootTo = uf.find(edge.to);

      if (rootFrom === rootTo) {
        rejected.add(edgeIdx);
        pushStep(
          `Skip ${fromValue} → ${toValue}`,
          'Same component — this edge would create a cycle.',
          {},
          'done'
        );
        continue;
      }

      uf.union(edge.from, edge.to);
      chosen.add(edgeIdx);

      pushStep(
        `Add ${fromValue} → ${toValue}`,
        `Merged components. MST has ${chosen.size} edge(s).`,
        { [edge.from]: 'inserted', [edge.to]: 'inserted' },
        'mark'
      );

      if (chosen.size === nodes.length - 1) {
        pushStep(
          'MST complete',
          `All ${nodes.length} nodes connected with ${chosen.size} edges. Total weight: ${edges
            .filter((_, i) => chosen.has(i))
            .reduce((s, e) => s + (e.weight ?? 0), 0)}.`,
          Object.fromEntries(nodes.map((n) => [n.id, 'inserted'])),
          'done'
        );
        return steps;
      }
    }

    pushStep('All edges processed', 'MST built from remaining edges.', {}, 'done');
    return steps;
  },
};