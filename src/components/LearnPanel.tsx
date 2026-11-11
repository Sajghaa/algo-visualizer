import type { AlgorithmInfo } from '../algorithms/types';

interface LearnPanelProps {
  algorithm: AlgorithmInfo;
}

export function LearnPanel({ algorithm }: LearnPanelProps) {
  return (
    <div className="rounded-lg bg-slate-800 p-6 shadow-lg">
      <h3 className="mb-6 text-xl font-bold text-white">
        📖 Learn: {algorithm.name}
      </h3>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        
        {/* Left Column: What and How */}
        <div className="space-y-6">
          {/* What is it? */}
          <div className="rounded-md border border-slate-700 bg-slate-900/50 p-4">
            <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-indigo-400 uppercase tracking-wider">
              <span>🎯</span> What is it?
            </h4>
            <p className="text-sm leading-relaxed text-gray-300">
              {algorithm.description}
            </p>
          </div>

          {/* How it Works */}
          {algorithm.howItWorks && (
            <div>
              <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-indigo-400 uppercase tracking-wider">
                <span>🪜</span> How it Works (Step-by-Step)
              </h4>
              <ol className="space-y-3">
                {algorithm.howItWorks.map((step, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-gray-300">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 font-mono text-xs font-bold text-indigo-400">
                      {index + 1}
                    </span>
                    <span className="mt-0.5 leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* Right Column: Key Ideas, Traps, When to Use */}
        <div className="space-y-6">
          {/* Key Ideas */}
          <div>
            <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-indigo-400 uppercase tracking-wider">
              <span>💡</span> Key Ideas
            </h4>
            <ul className="space-y-2">
              {algorithm.keyIdeas.map((idea, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                  <span>{idea}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Traps & Pitfalls */}
          {algorithm.traps && (
            <div className="rounded-md border border-red-500/30 bg-red-500/10 p-4">
              <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-red-400 uppercase tracking-wider">
                <span>⚠️</span> Traps & Pitfalls
              </h4>
              <ul className="space-y-2">
                {algorithm.traps.map((trap, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                    <span>{trap}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* When to Use */}
          <div>
            <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-indigo-400 uppercase tracking-wider">
              <span>⚖️</span> When to Use
            </h4>
            <p className="text-sm leading-relaxed text-gray-300">
              {algorithm.whenToUse}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}