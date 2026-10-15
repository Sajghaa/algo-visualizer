import type { TableStep, TableCellState } from '../algorithms/types';

interface TableVisualizerProps {
  step: TableStep;
}

export function TableVisualizer({ step }: TableVisualizerProps) {
  const { table, rowLabels, colLabels } = step;

  if (table.length === 0 || table[0].length === 0) {
    return (
      <div className="flex h-96 w-full items-center justify-center text-sm text-gray-500">
        Empty table
      </div>
    );
  }



  const cellColor = (state?: TableCellState): string => {
    switch (state) {
      case 'current': return 'bg-yellow-500/30 border-yellow-400';
      case 'reading': return 'bg-orange-500/30 border-orange-400';
      case 'filled': return 'bg-green-500/20 border-green-500/40';
      case 'highlight': return 'bg-emerald-500/40 border-emerald-400';
      default: return 'bg-slate-800 border-slate-700';
    }
  };

  return (
    <div className="flex h-96 w-full items-center justify-center overflow-auto p-4">
      <table className="border-separate border-spacing-1 font-mono text-sm">
        {/* Column headers */}
        {colLabels && (
          <thead>
            <tr>
              <th className="w-12" /> {/* spacer for row labels */}
              {colLabels.map((label, i) => (
                <th
                  key={i}
                  className="w-12 text-center text-xs font-semibold text-gray-400"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
        )}

        <tbody>
          {table.map((row, r) => (
            <tr key={r}>
              {rowLabels && (
                <td className="w-12 text-center text-xs font-semibold text-gray-400">
                  {rowLabels[r]}
                </td>
              )}
              {row.map((cell, c) => (
                <td
                  key={c}
                  className={`h-10 w-12 rounded border text-center transition-colors duration-150 ${cellColor(cell.state)}`}
                >
                  <span className="font-semibold text-white">{cell.value}</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}