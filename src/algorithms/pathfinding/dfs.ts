import type {
  AlgorithmStep,
  CellType,
  SortingAlgorithm,
} from '../types';

function cloneGrid(grid: CellType[][]): CellType[][] {
  return grid.map((row) => [...row]);
}

export const dfs: SortingAlgorithm = {
  slug: 'dfs',
  name: 'Depth-First Search',
  description: 'Dives as deep as possible before backtracking — finds *a* path, not the shortest.',
  timeComplexity: 'O(V + E)',
  spaceComplexity: 'O(V)',
  stable: false,
  category: 'pathfinding',

  keyIdeas: [
    'Explores one branch as deep as possible before backtracking',
    'Uses a LIFO stack — last-in, first-out',
    'Finds *a* path, but not necessarily the shortest',
    'Paths are often long and meandering compared to BFS',
  ],

  whenToUse: 'When any path is fine and memory is tight. Also the basis for topological sort, cycle detection, and maze generation.',

  pseudocode: [
    'dfs(grid, start, end):',
    '  stack = [start]; visited = {start}',
    '  while stack is not empty:',
    '    current = stack.pop()',
    '    if current == end: reconstruct path; return',
    '    for each neighbor of current:',
    '      if valid and not wall and not visited:',
    '        visited.add(neighbor); parent[neighbor] = current',
    '        stack.push(neighbor)',
    '  return no path',
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
      description: 'Starting DFS',
      explanation:
        'We dive deep along each branch before backtracking. The path found is not always the shortest.',
      concept: 'done',
    });

    
    const stack: [number, number][] = [start];
    const visited = new Set<string>([`${start[0]},${start[1]}`]);
    const parent = new Map<string, string>();
    const directions: [number, number][] = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];

    while (stack.length > 0) {
      const [r, c] = stack.pop()!;  

      steps.push({
        kind: 'grid',
        grid: cloneGrid(grid),
        current: [r, c],
        description: `Visiting (${r}, ${c})`,
        explanation: `Stack size: ${stack.length}. Diving into neighbors.`,
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
          explanation: `DFS found a path — compare its length to BFS on the same maze.`,
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
        stack.push([nr, nc]);   // ← push to end (LIFO)
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