import type { HashTableStep, HashNodeState } from '../algorithms/types';

interface HashTableVisualizerProps {
  step: HashTableStep;
}

export function HashTableVisualizer({ step }: HashTableVisualizerProps) {
  const { buckets, key, hashIndex, hashFunction } = step;

  const nodeColor = (state?: HashNodeState): string => {
    switch (state) {
      case 'current': return 'bg-yellow-500 border-yellow-400';
      case 'inserted': return 'bg-green-500 border-green-400';
      case 'collision': return 'bg-red-500 border-red-400';
      default: return 'bg-indigo-500 border-indigo-400';
    }
  };

  return (
    <div className="flex h-96 w-full flex-col overflow-y-auto p-4">
      {/* Header info */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-md bg-slate-800 p-3 text-xs text-gray-300">
        <span>
          Hash function: <span className="font-mono text-white">{hashFunction}</span>
        </span>
        <span>
          Inserting: <span className="font-mono text-yellow-400">{key}</span>
        </span>
        <span>
          Index: <span className="font-mono text-indigo-400">{hashIndex}</span>
        </span>
      </div>

      {/* Buckets */}
      <div className="flex flex-col gap-1">
        {buckets.map((bucket, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 rounded-md px-2 py-1.5 transition-colors ${
              i === hashIndex ? 'bg-slate-800/80' : 'bg-slate-800/30'
            }`}
          >
            {/* Bucket index */}
            <div className="flex h-8 w-12 shrink-0 items-center justify-center rounded bg-slate-900 font-mono text-xs text-gray-400">
              [{i}]
            </div>

            {/* Chain */}
            <div className="flex flex-wrap items-center gap-2">
              {bucket.length === 0 ? (
                <span className="text-xs italic text-gray-600">empty</span>
              ) : (
                bucket.map((node, j) => (
                  <div key={j} className="flex items-center">
                    <div
                      className={`flex h-8 min-w-[2.5rem] items-center justify-center rounded border font-mono text-sm font-semibold text-white transition-colors ${nodeColor(node.state)}`}
                    >
                      {node.value}
                    </div>
                    {j < bucket.length - 1 && (
                      <span className="mx-1 text-gray-500">→</span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}