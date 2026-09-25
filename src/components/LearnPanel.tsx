import type { AlgorithmInfo } from '../algorithms/types';

interface LearnPanelProps {
  algorithm: AlgorithmInfo;
}

export function LearnPanel({ algorithm }: LearnPanelProps) {
  return (
    <div className="rounded-lg bg-slate-800 p-6">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
        Learn: {algorithm.name}
      </h3>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Key ideas */}
        <div>
          <h4 className="mb-2 text-sm font-semibold text-white">
            💡 Key Ideas
          </h4>
          <ul className="space-y-2">
            {algorithm.keyIdeas.map((idea, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-gray-300"
              >
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                <span>{idea}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* When to use */}
        <div>
          <h4 className="mb-2 text-sm font-semibold text-white">
            🎯 When to Use
          </h4>
          <p className="text-sm leading-relaxed text-gray-300">
            {algorithm.whenToUse}
          </p>
        </div>
      </div>
    </div>
  );
}