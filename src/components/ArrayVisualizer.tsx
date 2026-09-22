import type { AlgorithmStep } from '../algorithms/types';

interface ArrayVisualizerProps {
  step: AlgorithmStep;
  maxValue: number;
}

export function ArrayVisualizer({ step, maxValue }: ArrayVisualizerProps) {
  const { array, highlighted, sorted, pointers, concept } = step;

  const getBarColor = (index: number): string => {
    if (sorted.includes(index)) return 'bg-green-500';
    if (highlighted.includes(index)) {
      return concept === 'swap' ? 'bg-red-500' : 'bg-yellow-400';
    }
    return 'bg-indigo-500';
  };

  return (
    <div className="relative flex h-96 w-full items-end justify-center gap-1 px-4">
      {array.map((value, index) => {
        const heightPercent = (value / maxValue) * 100;

        return (
          <div
            key={index}
            className="relative flex h-full flex-1 flex-col justify-end"
          >
            {/* Pointer labels (i, j, etc.) above the bar */}
            {pointers &&
              Object.entries(pointers).some(([, idx]) => idx === index) && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-mono text-white">
                  {Object.entries(pointers)
                    .filter(([, idx]) => idx === index)
                    .map(([name]) => name)
                    .join(', ')}
                </div>
              )}

            {/* The bar itself */}
            <div
              className={`w-full rounded-t transition-all duration-150 ${getBarColor(index)}`}
              style={{ height: `${heightPercent}%` }}
            />
          </div>
        );
      })}
    </div>
  );
}