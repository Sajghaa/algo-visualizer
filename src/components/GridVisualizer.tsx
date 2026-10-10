import type { GridStep } from '../algorithms/types';

interface GridVisualizerProps {
  step: GridStep;
}

export function GridVisualizer({ step }: GridVisualizerProps) {
  const { grid, current } = step;
  const rows = grid.length;
  const cols = grid[0].length;

  const cellColor = (r: number, c: number): string => {
    // Highlight the current cell above all others
    if (current && current[0] === r && current[1] === c) {
      return 'bg-yellow-400';
    }

    switch (grid[r][c]) {
      case 'wall':
        return 'bg-slate-950';
      case 'start':
        return 'bg-green-500';
      case 'end':
        return 'bg-red-500';
      case 'visited':
        return 'bg-indigo-500';
      case 'path':
        return 'bg-yellow-300';
      default:
        return 'bg-slate-700';
    }
  };

  return (
    <div className="flex h-96 w-full items-center justify-center px-4">
      <div
        className="grid gap-px"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          aspectRatio: `${cols} / ${rows}`,
          height: '100%',
          maxWidth: '100%',
        }}
      >
        {grid.map((row, r) =>
          row.map((_, c) => (
            <div
              key={`${r}-${c}`}
              className={`${cellColor(r, c)} rounded-sm transition-colors duration-100`}
            />
          ))
        )}
      </div>
    </div>
  );
}