import type {
  AlgorithmStep,
  CellType,
  SortingAlgorithm,
} from '../types';

function cloneGrid(grid: CellType[][]): CellType[][] {
  return grid.map((row) => [...row]);
}

export const bfs: SortingAlgorithm = {
  slug: 'bfs',
  name: 'Breadth-First Search',
  description: 'Explores the grid level by level using a queue — finds the shortest path.',
  timeComplexity: 'O(V + E)',
  spaceComplexity: 'O(V)',
  stable: false,
  category: 'pathfinding',

  keyIdeas: [
    'Explores neighbors level by level from the start',
    'Uses a FIFO queue — first-in, first-out',
    'Guarantees the shortest path in unweighted grids',
    'Explores in a "wave" pattern outward from the start',
  ],

  whenToUse: 'Unweighted graphs where the shortest path matters. The simplest "correct" pathfinder.',

  pseudocode: [
    'bfs(grid, start, end):',
    '  queue = [start]; visited = {start}',
    '  while queue is not empty:',
    '    current = queue.dequeue()',
    '    if current == end: reconstruct path; return',
    '    for each neighbor of current:',
    '      if valid and not wall and not visited:',
    '        visited.add(neighbor); parent[neighbor] = current',
    '        queue.enqueue(neighbor)',
    '  return no path',
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
      description: 'Starting BFS',
      explanation:
        'We explore outward from the start using a queue. The first time we reach the end, we have the shortest path.',
      concept: 'done',
    });

    const queue: [number, number][] = [start];
    const visited = new Set<string>([`${start[0]},${start[1]}`]);
    const parent = new Map<string, string>();
    const directions: [number, number][] = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];

    while (queue.length > 0) {
      const [r, c] = queue.shift()!;

      
      steps.push({
        kind: 'grid',
        grid: cloneGrid(grid),
        current: [r, c],
        description: `Visiting (${r}, ${c})`,
        explanation: `Queue size: ${queue.length}. Exploring neighbors of (${r}, ${c}).`,
        concept: 'compare',
        lineOfCode: 3,
      });

     
      if (r === end[0] && c === end[1]) {
        const path: string[] = [];
        let cursor = `${r},${c}`;
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
          description: `Path found! Length: ${path.length}`,
          explanation: `BFS found the shortest path from start to end.`,
          concept: 'done',
        });

        return steps;
      }

      
      for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;
        const key = `${nr},${nc}`;

        if (
          nr < 0 || nr >= rows || nc < 0 || nc >= cols ||
          visited.has(key) ||
          grid[nr][nc] === 'wall'
        ) {
          continue;
        }

        visited.add(key);
        parent.set(key, `${r},${c}`);
        if (grid[nr][nc] === 'empty') grid[nr][nc] = 'visited';
        queue.push([nr, nc]);
      }
    }

    steps.push({
      kind: 'grid',
      grid: cloneGrid(grid),
      description: 'No path found',
      explanation: 'The end is unreachable — walls completely block the way.',
      concept: 'done',
    });

    return steps;
  },
};