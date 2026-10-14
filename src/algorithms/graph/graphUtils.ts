import type { GraphEdge, TreeNode } from '../types';

export function generateWeightedUndirectedGraph(
  numNodes: number,
  edgeProbability: number
): { nodes: TreeNode[]; edges: GraphEdge[] } {
  const nodes: TreeNode[] = [];
  for (let i = 0; i < numNodes; i++) {
    nodes.push({ id: `n${i}`, value: i + 1 });
  }

  const edges: GraphEdge[] = [];
  const connected = new Set<string>([`n0`]);

  for (let i = 1; i < numNodes; i++) {
    const candidates = [...connected];
    const from = candidates[Math.floor(Math.random() * candidates.length)];
    const to = `n${i}`;
    const weight = Math.floor(Math.random() * 9) + 1;
    edges.push({ from, to, weight });
    connected.add(to);
  }

  for (let i = 0; i < numNodes; i++) {
    for (let j = i + 1; j < numNodes; j++) {
      if (Math.random() > edgeProbability) continue;
      const from = `n${i}`;
      const to = `n${j}`;

      
      if (edges.some((e) => (e.from === from && e.to === to) || (e.from === to && e.to === from))) {
        continue;
      }
      const weight = Math.floor(Math.random() * 9) + 1;
      edges.push({ from, to, weight });
    }
  }

  return { nodes, edges };
}