import type { AlgorithmStep, CellType, SortingAlgorithm } from '../types';
import { MinHeap } from '../../utils/MinHeap';

function cloneGrid(grid: CellType[][]): CellType[][] {
  return grid.map((row) => [...row]);
}

function manhattan(a: [number, number], b: [number, number]): number {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

export const astar: SortingAlgorithm = {
  slug: 'astar',
  name: 'A* Search',
  description: 'Like Dijkstra, but guided by a heuristic — same shortest path, far fewer cells explored.',
  timeComplexity: 'O(E log V)',
  spaceComplexity: 'O(V)',
  stable: false,
  category: 'pathfinding',

  keyIdeas: [
    'Priority = distance-from-start + heuristic-to-goal',
    'Uses Manhattan distance as the heuristic on a 4-way grid',
    'Guided search — explores toward the goal, not outward in all directions',
    'Optimal path guaranteed if the heuristic never overestimates',
  ],

  whenToUse: 'Pathfinding when you know the goal position in advance — the standard choice for game AI, robotics, and maps.',

  pseudocode: [
    'astar(grid, start, end):',
    '  g[start] = 0; h[start] = manhattan(start, end)',
    '  heap = [(h[start], start)]',
    '  while heap not empty:',
    '    current = heap.pop()',
    '    if current == end: reconstruct path; return',
    '    for each neighbor of current:',
    '      tentativeG = g[current] + 1',
    '      if tentativeG < g[neighbor]:',
    '        g[neighbor] = tentativeG',
    '        h[neighbor] = manhattan(neighbor, end)',
    '        parent[neighbor] = current',
    '        heap.push((tentativeG + h[neighbor], neighbor))',
  ],

  generateSteps(_input: number[]): AlgorithmStep[] {
    const rows = 15;
    const cols = 25;
    const wallDensity = 0.25;

    const grid: CellType[][] = [];
    for (let r = 0; r < rows; r++) {
      const row: CellType[] = [];
      for (let c = 0; c < cols; c++) {
        row.push(Math.random() < wallDensity ? 'wall' : 'empty');
      }
      grid.push(row);
    }

    const start: [number, number] = [0, 0];
    const end: [number, number] = [rows - 1, cols - 1];

    grid[start[0]][start[1]] = 'start';
    grid[end[0]][end[1]] = 'end';

    for (const [r, c] of [start, end]) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 'wall') {
            grid[nr][nc] = 'empty';
          }
        }
      }
    }

    const steps: AlgorithmStep[] = [];

    steps.push({
      kind: 'grid',
      grid: cloneGrid(grid),
      description: 'Starting A*',
      explanation:
        'Priority = distance from start (g) + Manhattan distance to end (h). The heuristic pulls the search toward the goal.',
      concept: 'done',
    });

    const heap = new MinHeap<[number, number]>();

    const gScore = new Map<string, number>();
    const parent = new Map<string, string>();
    const closed = new Set<string>();

    gScore.set(`${start[0]},${start[1]}`, 0);
    heap.push(start, manhattan(start, end));

    const directions: [number, number][] = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];

    while (!heap.isEmpty()) {
      const [r, c] = heap.pop()!;
      const key = `${r},${c}`;

      if (closed.has(key)) continue;
      closed.add(key);

      const g = gScore.get(key)!;
      const h = manhattan([r, c], end);
      const f = g + h;

      steps.push({
        kind: 'grid',
        grid: cloneGrid(grid),
        current: [r, c],
        description: `Settling (${r}, ${c})  g=${g}  h=${h}  f=${f}`,
        explanation: `Priority score is ${f}. Lower f = closer to start AND closer to goal.`,
        concept: 'compare',
        lineOfCode: 4,
      });

      if (r === end[0] && c === end[1]) {
        const path: string[] = [];
        let cursor = key;
        while (cursor !== `${start[0]},${start[1]}`) {
          path.push(cursor);
          const p = parent.get(cursor);
          if (!p) break;
          cursor = p;
        }

        const finalGrid = cloneGrid(grid);
        for (const cell of path) {
          const [pr, pc] = cell.split(',').map(Number);
          if (finalGrid[pr][pc] === 'empty') finalGrid[pr][pc] = 'path';
        }

        steps.push({
          kind: 'grid',
          grid: finalGrid,
          description: `Path found! Distance: ${g}`,
          explanation:
            `A* explored only ${closed.size} cells. Compare with Dijkstra on the same maze for a dramatic difference.`,
          concept: 'done',
        });

        return steps;
      }

      for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;
        const nkey = `${nr},${nc}`;

        if (
          nr < 0 || nr >= rows || nc < 0 || nc >= cols ||
          grid[nr][nc] === 'wall' ||
          closed.has(nkey)
        ) {
          continue;
        }

        const tentativeG = g + 1;
        const knownG = gScore.get(nkey) ?? Infinity;

        if (tentativeG < knownG) {
          gScore.set(nkey, tentativeG);
          parent.set(nkey, key);
          if (grid[nr][nc] === 'empty') grid[nr][nc] = 'visited';
          heap.push([nr, nc], tentativeG + manhattan([nr, nc], end));
        }
      }
    }

    steps.push({
      kind: 'grid',
      grid: cloneGrid(grid),
      description: 'No path found',
      explanation: 'The end is unreachable.',
      concept: 'done',
    });

    return steps;
  },
};