interface ControlsProps {
  isPlaying: boolean;
  speed: number;
  currentIndex: number;
  totalSteps: number;
  onToggle: () => void;
  onStepForward: () => void;
  onStepBack: () => void;
  onReset: () => void;
  onSpeedChange: (ms: number) => void;
}

export function Controls({
  isPlaying,
  speed,
  currentIndex,
  totalSteps,
  onToggle,
  onStepForward,
  onStepBack,
  onReset,
  onSpeedChange,
}: ControlsProps) {
  const progress = totalSteps > 1 ? (currentIndex / (totalSteps - 1)) * 100 : 0;

  return (
    <div className="mt-6 space-y-4">
      {/* Buttons row */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onStepBack}
          disabled={isPlaying || currentIndex === 0}
          className="rounded-md bg-slate-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ⏮ Step Back
        </button>

        <button
          onClick={onToggle}
          className="rounded-md bg-indigo-500 px-6 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>

        <button
          onClick={onStepForward}
          disabled={isPlaying || currentIndex === totalSteps - 1}
          className="rounded-md bg-slate-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Step Forward ⏭
        </button>

        <button
          onClick={onReset}
          className="rounded-md bg-slate-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-600"
        >
          ⟲ Reset
        </button>
      </div>

      {/* Speed slider */}
      <div className="flex items-center justify-center gap-3">
        <label htmlFor="speed" className="text-sm text-gray-300">
          Speed
        </label>
        <input
          id="speed"
          type="range"
          min={50}
          max={1000}
          step={50}
          value={1050 - speed}
          onChange={(e) => onSpeedChange(1050 - Number(e.target.value))}
          className="w-48 accent-indigo-500"
        />
        <span className="w-16 text-sm text-gray-400">
          {1000 - speed + 50}ms
        </span>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-700">
          <div
            className="h-full bg-indigo-500 transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="w-24 text-right text-xs text-gray-400">
          {currentIndex + 1} / {totalSteps}
        </span>
      </div>
    </div>
  );
}