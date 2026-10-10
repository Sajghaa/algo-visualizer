import type { CellType } from '../algorithms/types';

export interface GeneratedGrid {
  grid: CellType[][];
  start: [number, number];
  end: [number, number];
}

export function generateGrid(
  rows = 15,
  cols = 25,
  wallDensity = 0.25
): GeneratedGrid {
  const grid: CellType[][] = [];

  for (let r = 0; r < rows; r++) {
    const row: CellType[] = [];
    for (let c = 0; c < cols; c++) {
      row.push(Math.random() < wallDensity ? 'wall' : 'empty');
    }
    grid.push(row);
  }

  const start: [number, number] = [
    Math.floor(Math.random() * 3),
    Math.floor(Math.random() * 3),
  ];
  const end: [number, number] = [
    rows - 1 - Math.floor(Math.random() * 3),
    cols - 1 - Math.floor(Math.random() * 3),
  ];

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

  return { grid, start, end };
}