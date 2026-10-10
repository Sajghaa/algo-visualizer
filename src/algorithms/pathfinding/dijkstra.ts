import type { AlgorithmStep, CellType, SortingAlgorithm } from '../types';
import { MinHeap } from '../../utils/MinHeap';

function cloneGrid(grid: CellType[][]): CellType[][] {
  return grid.map((row) => [...row]);
}

export const dijkstra: SortingAlgorithm = {
  slug: 'dijkstra',
  name: "Dijkstra's Algorithm",
  description: 'Explores cells in order of distance from start using a priority queue.',
  timeComplexity: 'O((V + E) log V)',
  spaceComplexity: 'O(V)',
  stable: false,
  category: 'pathfinding',

  keyIdeas: [
    'Uses a priority queue ordered by distance from start',
    'Explores the closest unvisited cell first',
    'Handles weighted edges — each step can have a different cost',
    'Guarantees the shortest path on weighted, non-negative graphs',
  ],

  whenToUse: 'Weighted graphs where cost matters — road networks, game maps with terrain.',

  pseudocode: [
    'dijkstra(grid, start, end):',
    '  dist[start] = 0; heap = [(0, start)]',
    '  while heap not empty:',
    '    (d, current) = heap.pop()',
    '    if current == end: reconstruct path; return',
    '    if d > dist[current]: continue',
    '    for each neighbor of current:',
    '      newDist = d + cost(current, neighbor)',
    '      if newDist < dist[neighbor]:',
    '        dist[neighbor] = newDist; parent[neighbor] = current',
    '        heap.push((newDist, neighbor))',
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
      description: 'Starting Dijkstra',
      explanation:
        'We pop the closest unvisited cell from a priority queue. Each step extends outward by distance.',
      concept: 'done',
    });


    const heap = new MinHeap<[number, number]>();

    const distances = new Map<string, number>();
    const parent = new Map<string, string>();
    const finalized = new Set<string>();

    distances.set(`${start[0]},${start[1]}`, 0);
    heap.push(start, 0);

    const directions: [number, number][] = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];

    while (!heap.isEmpty()) {
      const popped = heap.pop()!;
      const [r, c] = popped;
      const key = `${r},${c}`;

      if (finalized.has(key)) continue;

      finalized.add(key);
      const currentDist = distances.get(key)!;

      steps.push({
        kind: 'grid',
        grid: cloneGrid(grid),
        current: [r, c],
        description: `Settling (${r}, ${c}) at distance ${currentDist}`,
        explanation: `Closest unfinalized cell has distance ${currentDist}. Expand to neighbors.`,
        concept: 'compare',
        lineOfCode: 3,
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
          description: `Path found! Distance: ${currentDist}`,
          explanation:
            'Dijkstra guarantees this is the shortest path — same as BFS on unweighted grids.',
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
          finalized.has(nkey)
        ) {
          continue;
        }

        const newDist = currentDist + 1;
        const known = distances.get(nkey) ?? Infinity;

        if (newDist < known) {
          distances.set(nkey, newDist);
          parent.set(nkey, key);

          if (grid[nr][nc] === 'empty') grid[nr][nc] = 'visited';
          heap.push([nr, nc], newDist);
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