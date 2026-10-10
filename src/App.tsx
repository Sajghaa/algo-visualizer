import { useEffect, useMemo, useState } from 'react';
import { ArrayVisualizer } from './components/ArrayVisualizer';
import { Controls } from './components/Controls';
import { PseudocodePanel } from './components/PseudocodePanel';
import { LearnPanel } from './components/LearnPanel';
import { QuizPanel } from './components/QuizPanel';
import { ProgressStats } from './components/ProgressStats';
import { AuthForms } from './components/AuthForms';
import { GridVisualizer } from './components/GridVisualizer';
import { ComparePane } from './components/ComparePane';
import { allAlgorithms, pathfindingAlgorithms } from './algorithms';
import { generateArray } from './utils/generateArray';
import { generateGrid } from './utils/generateGrid';
import { useVisualizer } from './hooks/useVisualizer';
import { encodeState, decodeState } from './utils/urlState';
import { useProgress } from './progress/useProgress';
import { useAuth } from './auth/useAuth';
import type { CellType } from './algorithms/types';

function App() {
  const { user, isAuthenticated, logout } = useAuth();

  // === Compare Mode state ===
  const [compareMode, setCompareMode] = useState(false);
  const [compareGrid, setCompareGrid] = useState<CellType[][]>(
    () => generateGrid().grid
  );
  const [compareAIndex, setCompareAIndex] = useState(0); // BFS
  const [compareBIndex, setCompareBIndex] = useState(3); // A*

  const compareA = pathfindingAlgorithms[compareAIndex];
  const compareB = pathfindingAlgorithms[compareBIndex];

  const stepsA = useMemo(
    () => compareA.generateSteps([], undefined, compareGrid),
    [compareA, compareGrid]
  );
  const stepsB = useMemo(
    () => compareB.generateSteps([], undefined, compareGrid),
    [compareB, compareGrid]
  );

  const vizA = useVisualizer(stepsA);
  const vizB = useVisualizer(stepsB);

  // === Single-mode state ===
  const initial = useMemo(
    () => decodeState(window.location.search, allAlgorithms),
    []
  );

  const [arraySize, setArraySize] = useState(initial?.array.length ?? 15);
  const [inputArray, setInputArray] = useState(
    () => initial?.array ?? generateArray(15)
  );
  const [algorithmIndex, setAlgorithmIndex] = useState(() => {
    if (!initial) return 0;
    const idx = allAlgorithms.findIndex((a) => a.slug === initial.slug);
    return idx >= 0 ? idx : 0;
  });

  const algorithm = allAlgorithms[algorithmIndex];

  const steps = useMemo(
    () => algorithm.generateSteps(inputArray),
    [algorithm, inputArray]
  );

  const { progress, recordQuizAttempt } = useProgress();

  const algorithmProgress = progress.algorithms[algorithm.slug] ?? {
    slug: algorithm.slug,
    quizAttempts: 0,
    bestScore: 0,
    timesPlayed: 0,
  };

  const maxValue = useMemo(() => Math.max(...inputArray), [inputArray]);

  const visualizer = useVisualizer(steps);

  useEffect(() => {
    const query = encodeState({
      slug: algorithm.slug,
      array: inputArray,
    });
    const newUrl = `${window.location.pathname}?${query}`;
    window.history.replaceState(null, '', newUrl);
  }, [algorithm.slug, inputArray]);

  const handleNewArray = () => {
    setInputArray(generateArray(arraySize));
  };

  const handleNewGrid = () => {
    setCompareGrid(generateGrid().grid);
    vizA.reset();
    vizB.reset();
  };

  const handlePlayBoth = () => {
    if (vizA.isPlaying || vizB.isPlaying) {
      vizA.pause();
      vizB.pause();
    } else {
      vizA.play();
      vizB.play();
    }
  };

  // Unauthenticated view
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 p-6">
        <div className="w-full max-w-md">
          <h1 className="mb-6 text-center text-3xl font-bold text-white">
            Algo Visualizer
          </h1>
          <AuthForms />
          <p className="mt-4 text-center text-xs text-gray-500">
            Sign in to save your progress across devices.
          </p>
        </div>
      </div>
    );
  }

  // Authenticated view
  return (
    <div className="min-h-screen bg-slate-900 p-6">
      {/* Header */}
      <div className="mx-auto mb-6 flex max-w-6xl flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-white">Algo Visualizer</h1>

        <div className="flex flex-wrap items-center gap-3">
          {!compareMode && (
            <div>
              <label htmlFor="algorithm" className="mr-2 text-sm text-gray-400">
                Algorithm:
              </label>
              <select
                id="algorithm"
                value={algorithmIndex}
                onChange={(e) => setAlgorithmIndex(Number(e.target.value))}
                className="rounded-md border border-slate-600 bg-slate-700 px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {allAlgorithms.map((algo, index) => (
                  <option key={algo.name} value={index}>
                    {algo.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={() => setCompareMode((m) => !m)}
            className={`rounded-md px-3 py-1.5 text-xs transition ${
              compareMode
                ? 'bg-indigo-500 text-white'
                : 'border border-slate-600 text-gray-300 hover:border-indigo-500'
            }`}
          >
            {compareMode ? '✓ Compare Mode' : '⚖ Compare Mode'}
          </button>

          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-gray-400 sm:inline">
              {user?.email}
            </span>
            <button
              onClick={logout}
              className="rounded-md border border-slate-600 px-3 py-1.5 text-xs text-gray-300 transition hover:border-red-500 hover:text-red-400"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-4">
        {compareMode ? (
          /* ===== COMPARE MODE ===== */
          <>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <ComparePane
                
                visualizer={vizA}
                label="A"
                onAlgorithmChange={setCompareAIndex}
                algorithmIndex={compareAIndex}
                algorithms={pathfindingAlgorithms}
              />
              <ComparePane
                
                visualizer={vizB}
                label="B"
                onAlgorithmChange={setCompareBIndex}
                algorithmIndex={compareBIndex}
                algorithms={pathfindingAlgorithms}
              />
            </div>

            {/* Shared Controls */}
            <div className="flex flex-wrap items-center justify-center gap-3 rounded-lg bg-slate-800 p-4">
              <button
                onClick={handlePlayBoth}
                className="rounded-md bg-indigo-500 px-6 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
              >
                {vizA.isPlaying || vizB.isPlaying ? '⏸ Pause Both' : '▶ Play Both'}
              </button>
              <button
                onClick={() => {
                  vizA.reset();
                  vizB.reset();
                }}
                className="rounded-md bg-slate-700 px-4 py-2 text-sm text-white transition hover:bg-slate-600"
              >
                ⟲ Reset Both
              </button>
              <button
                onClick={handleNewGrid}
                className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
              >
                🎲 New Grid
              </button>
            </div>

            {/* Info text */}
            <div className="rounded-lg bg-slate-800 p-4 text-center text-sm text-gray-400">
              Watch both algorithms run on the <span className="text-white">same grid</span>.
              Same start, same walls, same end.
            </div>
          </>
        ) : (
          /* ===== SINGLE MODE ===== */
          <>
            {/* Info card */}
            <div className="rounded-lg bg-slate-800 p-4 text-sm text-gray-300">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    {algorithm.name}
                  </h2>
                  <p className="text-gray-400">{algorithm.description}</p>
                </div>
                <div className="flex gap-4 text-xs">
                  <span className="rounded bg-slate-700 px-2 py-1">
                    ⏱ {algorithm.timeComplexity}
                  </span>
                  <span className="rounded bg-slate-700 px-2 py-1">
                    💾 {algorithm.spaceComplexity}
                  </span>
                  <span className="rounded bg-slate-700 px-2 py-1">
                    {algorithm.stable ? '✅ Stable' : '❌ Not stable'}
                  </span>
                </div>
              </div>

              <div className="mt-3 border-t border-slate-700 pt-3">
                <ProgressStats progress={algorithmProgress} />
              </div>
            </div>

            {/* Main grid: visualizer + pseudocode */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="rounded-lg bg-slate-800 p-6 lg:col-span-2">
                {visualizer.currentStep.kind === 'grid' ? (
                  <GridVisualizer step={visualizer.currentStep} />
                ) : (
                  <ArrayVisualizer
                    step={visualizer.currentStep}
                    maxValue={maxValue}
                  />
                )}

                <div className="mt-6 rounded-md bg-slate-900 p-3">
                  <p className="text-center font-mono text-sm text-white">
                    {visualizer.currentStep.description}
                  </p>
                  <p className="mt-1 text-center text-xs text-gray-400">
                    {visualizer.currentStep.explanation}
                  </p>
                </div>

                <Controls
                  isPlaying={visualizer.isPlaying}
                  speed={visualizer.speed}
                  currentIndex={visualizer.currentIndex}
                  totalSteps={visualizer.totalSteps}
                  onToggle={visualizer.toggle}
                  onStepForward={visualizer.stepForward}
                  onStepBack={visualizer.stepBack}
                  onReset={visualizer.reset}
                  onSpeedChange={visualizer.setSpeed}
                />
              </div>

              <div className="lg:col-span-1">
                <PseudocodePanel
                  pseudocode={algorithm.pseudocode}
                  activeLine={visualizer.currentStep.lineOfCode}
                />
              </div>
            </div>

            <LearnPanel algorithm={algorithm} />

            <QuizPanel
              algorithm={algorithm}
              allAlgorithms={allAlgorithms}
              onComplete={(score, total) =>
                recordQuizAttempt(algorithm.slug, score, total)
              }
            />

            <div className="flex flex-wrap items-center justify-center gap-3 rounded-lg bg-slate-800 p-4">
              <label htmlFor="size" className="text-sm text-gray-300">
                {algorithm.category === 'pathfinding' ? 'Grid size' : `Array size: ${arraySize}`}
              </label>
              {algorithm.category !== 'pathfinding' && (
                <input
                  id="size"
                  type="range"
                  min={5}
                  max={50}
                  value={arraySize}
                  onChange={(e) => setArraySize(Number(e.target.value))}
                  className="w-48 accent-indigo-500"
                />
              )}
              <button
                onClick={handleNewArray}
                className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
              >
                🎲 New {algorithm.category === 'pathfinding' ? 'Grid' : 'Array'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;