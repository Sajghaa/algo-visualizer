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
    'dijkstra(grid, start, end):',                             // 0
    '  dist[start] = 0; heap = [(0, start)]',                  // 1
    '  while heap not empty:',                                 // 2
    '    (d, current) = heap.pop()',                           // 3
    '    if current == end: reconstruct path; return',         // 4
    '    if d > dist[current]: continue',                      // 5
    '    for each neighbor of current:',                       // 6
    '      newDist = d + cost(current, neighbor)',             // 7
    '      if newDist < dist[neighbor]:',                      // 8
    '        dist[neighbor] = newDist; parent[neighbor] = current', // 9
    '        heap.push((newDist, neighbor))',                  // 10
  ],

  pseudocodeExplanations: [
    "Entry point for Dijkstra's algorithm.",
    "Initialize distances to Infinity, except the start which is 0. Add start to the priority queue.",
    "Keep processing until the priority queue is empty.",
    "Pop the cell with the smallest known distance (this is the magic of the min-heap).",
    "If we reached the end, reconstruct the shortest path.",
    "If we popped an old, stale entry, ignore it and continue.",
    "Look at all 4 neighbors (up, down, left, right).",
    "Calculate the new distance to this neighbor.",
    "If we found a shorter path to this neighbor...",
    "...update its shortest distance and record where we came from.",
    "...and push it into the priority queue so we can explore it later.",
  ],

  generateSteps(_input: number[], _target?: number, providedGrid?: CellType[][]): AlgorithmStep[] {
    const rows = 15;
    const cols = 25;

    let grid: CellType[][];

    if (providedGrid) {
      grid = providedGrid.map((row) => [...row]);
    } else {
      const wallDensity = 0.25;
      grid = [];
      for (let r = 0; r < rows; r++) {
        const row: CellType[] = [];
        for (let c = 0; c < cols; c++) {
          row.push(Math.random() < wallDensity ? 'wall' : 'empty');
        }
        grid.push(row);
      }

      grid[0][0] = 'start';
      grid[rows - 1][cols - 1] = 'end';

      for (const [r, c] of [[0, 0], [rows - 1, cols - 1]] as [number, number][]) {
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
    }

    const start: [number, number] = [0, 0];
    const end: [number, number] = [rows - 1, cols - 1];
    const steps: AlgorithmStep[] = [];

    steps.push({
      kind: 'grid',
      grid: cloneGrid(grid),
      description: 'Starting Dijkstra',
      explanation: 'We pop the closest unvisited cell from a priority queue. Each step extends outward by distance.',
      concept: 'done',
      lineOfCode: 0,
    });

    const heap = new MinHeap<[number, number]>();
    const distances = new Map<string, number>();
    const parent = new Map<string, string>();
    const finalized = new Set<string>();

    distances.set(`${start[0]},${start[1]}`, 0);
    heap.push(start, 0);

    steps.push({
      kind: 'grid',
      grid: cloneGrid(grid),
      description: 'Initialized distances',
      explanation: 'Start node has distance 0. Added to priority queue.',
      concept: 'mark',
      lineOfCode: 1,
    });

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
          explanation: 'Dijkstra guarantees this is the shortest path — same as BFS on unweighted grids.',
          concept: 'done',
          lineOfCode: 4, 
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

        steps.push({
          kind: 'grid',
          grid: cloneGrid(grid),
          current: [nr, nc],
          description: `Checking neighbor (${nr}, ${nc})`,
          explanation: `New distance: ${newDist}. Best known: ${known === Infinity ? '∞' : known}.`,
          concept: 'compare',
          lineOfCode: 7,
        });

        if (newDist < known) {
          distances.set(nkey, newDist);
          parent.set(nkey, key);
          if (grid[nr][nc] === 'empty') grid[nr][nc] = 'visited';
          heap.push([nr, nc], newDist);

          steps.push({
            kind: 'grid',
            grid: cloneGrid(grid),
            current: [nr, nc],
            description: `Updated (${nr}, ${nc}) to ${newDist}`,
            explanation: `Found a shorter path! Added to priority queue.`,
            concept: 'mark',
            lineOfCode: 9,
          });
        }
      }
    }

    steps.push({
      kind: 'grid',
      grid: cloneGrid(grid),
      description: 'No path found',
      explanation: 'The end is unreachable.',
      concept: 'done',
      lineOfCode: 2,
    });

    return steps;
  },
};