import type { GridStep, SortingAlgorithm } from '../algorithms/types';
import { GridVisualizer } from './GridVisualizer';
import type { useVisualizer } from '../hooks/useVisualizer';

interface ComparePaneProps {
  visualizer: ReturnType<typeof useVisualizer>;
  label: string;
  onAlgorithmChange: (index: number) => void;
  algorithmIndex: number;
  algorithms: SortingAlgorithm[];
}

export function ComparePane({
  visualizer,
  label,
  onAlgorithmChange,
  algorithmIndex,
  algorithms,
}: ComparePaneProps) {
  const currentStep = visualizer.currentStep;
  const isGrid = currentStep.kind === 'grid';

  return (
    <div className="rounded-lg bg-slate-800 p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="rounded bg-indigo-500 px-2 py-0.5 font-mono text-xs font-bold text-white">
          {label}
        </span>
        <select
          value={algorithmIndex}
          onChange={(e) => onAlgorithmChange(Number(e.target.value))}
          className="flex-1 rounded-md border border-slate-600 bg-slate-700 px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {algorithms.map((a, i) => (
            <option key={a.slug} value={i}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      {isGrid && <GridVisualizer step={currentStep as GridStep} />}

      <div className="mt-3 rounded-md bg-slate-900 p-2 text-center">
        <p className="font-mono text-xs text-white">
          Step {visualizer.currentIndex + 1} / {visualizer.totalSteps}
        </p>
      </div>
    </div>
  );
}