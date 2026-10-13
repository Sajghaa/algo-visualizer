import type { NodeStep, NodeState, TreeNode } from '../algorithms/types';

interface NodeVisualizerProps {
  step: NodeStep;
}

const NODE_RADIUS = 22;
const H_GAP = 55;
const V_GAP = 75;
const PADDING = 40;
const GRAPH_RADIUS = 160;

export function NodeVisualizer({ step }: NodeVisualizerProps) {
  const { nodes, rootId, edges: explicitEdges, layout: rawLayout } = step;

  const nodeMap = new Map<string, TreeNode>();
  for (const n of nodes) nodeMap.set(n.id, n);

  const layout = rawLayout ?? 'tree';

  const xPositions = new Map<string, number>();
  const yPositions = new Map<string, number>();

  if (layout === 'linear') {
    const rowCounters = new Map<number, number>();
    nodes.forEach((n) => {
      const row = n.yOffset ?? 0;
      const x = rowCounters.get(row) ?? 0;
      xPositions.set(n.id, x);
      yPositions.set(n.id, row);
      rowCounters.set(row, x + 1);
    });
  } else if (layout === 'graph') {
    const cx = GRAPH_RADIUS + PADDING;
    const cy = GRAPH_RADIUS + PADDING;
    nodes.forEach((n, i) => {
      const angle = (i / nodes.length) * 2 * Math.PI - Math.PI / 2;
      xPositions.set(n.id, cx + GRAPH_RADIUS * Math.cos(angle));
      yPositions.set(n.id, cy + GRAPH_RADIUS * Math.sin(angle));
    });
  } else {
    let inOrderIndex = 0;
    function walkInOrder(id: string | undefined) {
      if (!id) return;
      const node = nodeMap.get(id);
      if (!node) return;
      walkInOrder(node.left);
      xPositions.set(id, inOrderIndex++);
      walkInOrder(node.right);
    }
    if (rootId) walkInOrder(rootId);

    function walkDepth(id: string | undefined, depth: number) {
      if (!id) return;
      const node = nodeMap.get(id);
      if (!node) return;
      yPositions.set(id, depth);
      walkDepth(node.left, depth + 1);
      walkDepth(node.right, depth + 1);
    }
    if (rootId) walkDepth(rootId, 0);
  }


  let width: number;
  let height: number;

  if (layout === 'graph') {
    width = 2 * GRAPH_RADIUS + 2 * PADDING;
    height = 2 * GRAPH_RADIUS + 2 * PADDING;
  } else {
    const maxX = Math.max(0, ...Array.from(xPositions.values()));
    const maxY = Math.max(0, ...Array.from(yPositions.values()));
    width = (maxX + 1) * H_GAP + PADDING * 2;
    height = (maxY + 1) * V_GAP + PADDING * 2;
  }

  function getXY(id: string): { x: number; y: number } {
    if (layout === 'graph') {
      return {
        x: xPositions.get(id) ?? 0,
        y: yPositions.get(id) ?? 0,
      };
    }

    const xi = xPositions.get(id) ?? 0;
    const yi = yPositions.get(id) ?? 0;
    return {
      x: PADDING + xi * H_GAP + H_GAP / 2,
      y: PADDING + yi * V_GAP + V_GAP / 2,
    };
  }

  const stateColor = (state?: NodeState): string => {
    switch (state) {
      case 'current': return '#eab308';
      case 'comparing': return '#f97316';
      case 'inserted': return '#22c55e';
      case 'found': return '#10b981';
      case 'eliminated': return '#334155';
      case 'pivot': return '#ec4899';
      default: return '#6366f1';
    }
  };

  const edges: { key: string; from: string; to: string }[] = [];

  if (explicitEdges) {
    explicitEdges.forEach(([from, to], i) => {
      edges.push({ key: `e${i}`, from, to });
    });
  } else {
    for (const node of nodes) {
      if (node.left) edges.push({ key: `${node.id}-L`, from: node.id, to: node.left });
      if (node.right) edges.push({ key: `${node.id}-R`, from: node.id, to: node.right });
    }
  }

  if (nodes.length === 0) {
    return (
      <div className="flex h-96 w-full items-center justify-center px-4 text-sm text-gray-500">
        Empty tree — insert values to begin.
      </div>
    );
  }

  return (
    <div className="flex h-96 w-full items-center justify-center px-4">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-full max-h-96 w-full"
        preserveAspectRatio="xMidYMid meet"
      >
   
        {edges.map(({ key, from, to }) => {
          const a = getXY(from);
          const b = getXY(to);
          const showArrow = layout === 'linear' || layout === 'graph';

          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const ux = dx / dist;
          const uy = dy / dist;

          const endX = b.x - ux * (NODE_RADIUS + 2);
          const endY = b.y - uy * (NODE_RADIUS + 2);

          return (
            <g key={key}>
              <line
                x1={a.x}
                y1={a.y}
                x2={showArrow ? endX : b.x}
                y2={showArrow ? endY : b.y}
                stroke="#475569"
                strokeWidth={2}
              />
              {showArrow && (
                <polygon
                  points={`${endX},${endY} ${endX - ux * 10 - uy * 5},${endY - uy * 10 + ux * 5} ${endX - ux * 10 + uy * 5},${endY - uy * 10 - ux * 5}`}
                  fill="#475569"
                />
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const { x, y } = getXY(node.id);
          return (
            <g key={node.id}>
              <circle
                cx={x}
                cy={y}
                r={NODE_RADIUS}
                fill={stateColor(node.state)}
                stroke="#0f172a"
                strokeWidth={2}
              />
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fill={node.state === 'eliminated' ? '#64748b' : 'white'}
                fontSize="14"
                fontWeight="600"
                fontFamily="ui-monospace, monospace"
              >
                {node.value}
              </text>

              {node.balanceFactor !== undefined && (
                <text
                  x={x + NODE_RADIUS + 6}
                  y={y - NODE_RADIUS + 6}
                  fontSize="10"
                  fill="#94a3b8"
                  fontFamily="ui-monospace, monospace"
                >
                  {node.balanceFactor > 0 ? `+${node.balanceFactor}` : node.balanceFactor}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}