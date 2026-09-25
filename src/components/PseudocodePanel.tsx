import { useEffect, useRef } from 'react';

interface PseudocodePanelProps {
  pseudocode: string[];
  activeLine?: number;
}

export function PseudocodePanel({ pseudocode, activeLine }: PseudocodePanelProps) {
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (activeLine === undefined) return;
    const el = lineRefs.current[activeLine];
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [activeLine]);

  return (
    <div className="flex h-full flex-col rounded-lg bg-slate-800 p-4">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
        Pseudocode
      </h3>
      <div className="max-h-[500px] flex-1 overflow-y-auto rounded-md bg-slate-900 p-3 font-mono text-xs">
        {pseudocode.map((line, index) => {
          const isActive = index === activeLine;
          return (
            <div
              key={index}
              ref={(el) => {
                lineRefs.current[index] = el;
              }}
              className={`flex items-start gap-3 rounded px-2 py-1 transition-colors duration-200 ${
                isActive
                  ? 'border-l-2 border-indigo-400 bg-indigo-500/20'
                  : 'border-l-2 border-transparent'
              }`}
            >
              <span className="w-6 shrink-0 select-none text-right text-gray-600">
                {index + 1}
              </span>
              <span
                className={`whitespace-pre ${
                  isActive ? 'text-white' : 'text-gray-400'
                }`}
              >
                {line || '\u00A0'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}