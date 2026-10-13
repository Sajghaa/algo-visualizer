import type {
  AlgorithmStep,
  SortingAlgorithm,
  TreeNode,
  NodeState,
} from '../types';

function generateDAG(numNodes: number, edgeProbability: number): {
  nodes: TreeNode[];
  edges: [string, string][];
} {
  const nodes: TreeNode[] = [];
  for (let i = 0; i < numNodes; i++) {
    nodes.push({ id: `n${i}`, value: i + 1 });
  }

  // Randomly assign each node a "rank" — a random position in the topological order
  const ranks = [...Array(numNodes).keys()].sort(() => Math.random() - 0.5);

  // Only add edges from lower rank to higher rank → guaranteed DAG
  const edges: [string, string][] = [];
  for (let i = 0; i < numNodes; i++) {
    for (let j = 0; j < numNodes; j++) {
      if (i === j) continue;
      if (ranks[i] < ranks[j] && Math.random() < edgeProbability) {
        edges.push([`n${i}`, `n${j}`]);
      }
    }
  }

  return { nodes, edges };
}

export const topologicalSort: SortingAlgorithm = {
  slug: 'topological-sort',
  name: 'Topological Sort',
  description: 'Orders DAG nodes so every edge points forward — Kahn\'s algorithm.',
  timeComplexity: 'O(V + E)',
  spaceComplexity: 'O(V)',
  stable: false,
  category: 'graph',

  keyIdeas: [
    'Only works on directed acyclic graphs (DAGs)',
    'Kahn\'s algorithm: repeatedly remove nodes with no incoming edges',
    'In-degree tracks how many prerequisites remain for each node',
    'Multiple valid orders can exist — this finds one of them',
  ],

  whenToUse: 'Task scheduling, build systems, dependency resolution, course prerequisites.',

  pseudocode: [
    'topologicalSort(graph):',
    '  compute in-degree for every node',
    '  queue = all nodes with in-degree 0',
    '  result = []',
    '  while queue is not empty:',
    '    node = queue.dequeue()',
    '    result.push(node)',
    '    for each neighbor of node:',
    '      inDegree[neighbor] -= 1',
    '      if inDegree[neighbor] == 0: queue.enqueue(neighbor)',
    '  if result.length != total nodes: cycle detected',
    '  return result',
  ],

  generateSteps(_input: number[]): AlgorithmStep[] {
    const numNodes = 6;
    const { nodes, edges } = generateDAG(numNodes, 0.35);
    const steps: AlgorithmStep[] = [];

    const adj = new Map<string, string[]>();
    const inDegree = new Map<string, number>();
    for (const n of nodes) {
      adj.set(n.id, []);
      inDegree.set(n.id, 0);
    }
    for (const [from, to] of edges) {
      adj.get(from)!.push(to);
      inDegree.set(to, (inDegree.get(to) ?? 0) + 1);
    }

    const pushStep = (
      description: string,
      explanation: string,
      states: Record<string, NodeState> = {},
      concept: 'compare' | 'mark' | 'done' = 'done'
    ) => {
      steps.push({
        kind: 'nodes',
        layout: 'graph',
        nodes: nodes.map((n) => ({ ...n, state: states[n.id] ?? 'default' })),
        rootId: '',
        edges,
        description,
        explanation,
        concept,
      });
    };

    pushStep(
      'Directed Acyclic Graph (DAG)',
      `In-degrees: ${nodes.map((n) => `${n.value}:${inDegree.get(n.id)}`).join(', ')}`,
      {}
    );

    const result: string[] = [];
    const queue: string[] = [];

    for (const n of nodes) {
      if (inDegree.get(n.id) === 0) {
        queue.push(n.id);
      }
    }

    pushStep(
      'Initialize: queue nodes with in-degree 0',
      `Queue: [${queue.map((id) => nodes.find((n) => n.id === id)!.value).join(', ')}]`,
      Object.fromEntries(queue.map((id) => [id, 'inserted']))
    );

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const currentNode = nodes.find((n) => n.id === currentId)!;

      pushStep(
        `Dequeue ${currentNode.value}`,
        `Add to result. Result so far: [${result.map((id) => nodes.find((n) => n.id === id)!.value).join(', ')}]`,
        {
          ...Object.fromEntries(result.map((id) => [id, 'inserted'])),
          [currentId]: 'comparing',
        },
        'compare'
      );

      result.push(currentId);

      const neighbors = adj.get(currentId) ?? [];
      for (const neighborId of neighbors) {
        const newDeg = (inDegree.get(neighborId) ?? 0) - 1;
        inDegree.set(neighborId, newDeg);

        const neighborValue = nodes.find((n) => n.id === neighborId)!.value;

        if (newDeg === 0) {
          queue.push(neighborId);
        }

        pushStep(
          `Process edge → ${neighborValue}`,
          `In-degree of ${neighborValue}: ${newDeg + 1} → ${newDeg}${newDeg === 0 ? ' (now ready for queue)' : ''}`,
          {
            ...Object.fromEntries(result.map((id) => [id, 'inserted'])),
            [currentId]: 'current',
            [neighborId]: newDeg === 0 ? 'inserted' : 'comparing',
          },
          'mark'
        );
      }

      pushStep(
        `Node ${currentNode.value} fully processed`,
        `Result: [${result.map((id) => nodes.find((n) => n.id === id)!.value).join(', ')}]`,
        Object.fromEntries(result.map((id) => [id, 'inserted']))
      );
    }

    if (result.length !== nodes.length) {
      pushStep(
        'Cycle detected!',
        'Not all nodes were processed. The graph is not a DAG.',
        {},
        'done'
      );
      return steps;
    }

    steps.push({
      kind: 'nodes',
      layout: 'graph',
      nodes: nodes.map((n) => ({ ...n, state: 'inserted' })),
      rootId: '',
      edges,
      description: `Topological order: [${result.map((id) => nodes.find((n) => n.id === id)!.value).join(' → ')}]`,
      explanation:
        'Every edge points forward in this order. No node appears before all its prerequisites.',
      concept: 'done',
    });

    return steps;
  },
};