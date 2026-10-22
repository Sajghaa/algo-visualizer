import { useEffect, useMemo, useState } from 'react';
import { Navigate, useParams, Link } from 'react-router-dom';

import { ArrayVisualizer } from '../components/ArrayVisualizer';
import { Controls } from '../components/Controls';
import { PseudocodePanel } from '../components/PseudocodePanel';
import { LearnPanel } from '../components/LearnPanel';
import { QuizPanel } from '../components/QuizPanel';
import { ProgressStats } from '../components/ProgressStats';
import { GridVisualizer } from '../components/GridVisualizer';
import { ComparePane } from '../components/ComparePane';
import { NodeVisualizer } from '../components/NodeVisualizer';
import { TableVisualizer } from '../components/TableVisualizer';
import { HashTableVisualizer } from '../components/HashTableVisualizer';

import { allAlgorithms, pathfindingAlgorithms } from '../algorithms';
import { generateArray } from '../utils/generateArray';
import { generateGrid } from '../utils/generateGrid';
import { useVisualizer } from '../hooks/useVisualizer';
import { encodeState, decodeState } from '../utils/urlState';
import { useProgress } from '../progress/useProgress';
import { useAuth } from '../auth/useAuth';
import type { CellType } from '../algorithms/types';

export function Workspace() {
  const { user, isAuthenticated, logout } = useAuth();
  const { slug } = useParams();

  const [compareMode, setCompareMode] = useState(false);
  const [compareGrid, setCompareGrid] = useState<CellType[][]>(
    () => generateGrid().grid
  );
  const [compareAIndex, setCompareAIndex] = useState(0);
  const [compareBIndex, setCompareBIndex] = useState(3);

  const compareA = pathfindingAlgorithms[compareAIndex];
  const compareB = pathfindingAlgorithms[compareBIndex];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

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

  const initial = useMemo(
    () => decodeState(window.location.search, allAlgorithms),
    []
  );

  const [arraySize, setArraySize] = useState(initial?.array.length ?? 15);
  const [inputArray, setInputArray] = useState(
    () => initial?.array ?? generateArray(15)
  );

  const algorithm = allAlgorithms.find((a) => a.slug === slug) || allAlgorithms[0];

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

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      {/* Header */}
      <div className="mx-auto mb-8 flex max-w-6xl flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-xl font-bold text-white transition hover:text-indigo-400"
          >
            <span className="text-2xl">🧪</span> Algo Visualizer
          </Link>
          <span className="hidden text-slate-600 sm:inline">|</span>
          <h1 className="hidden text-lg font-medium text-gray-300 sm:inline">
            {algorithm.name}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setCompareMode((m) => !m)}
            className={`rounded-md px-4 py-2 text-xs font-semibold transition ${
              compareMode
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                : 'border border-slate-600 text-gray-300 hover:border-indigo-500 hover:text-white'
            }`}
          >
            {compareMode ? '✓ Compare Mode On' : '⚖ Compare Mode'}
          </button>

          <div className="flex items-center gap-3 border-l border-slate-700 pl-3">
            <span className="hidden text-xs text-gray-400 sm:inline">
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

          <>
            <div className="mb-2 text-center">
              <h2 className="text-lg font-semibold text-white">Pathfinding Race</h2>
              <p className="text-sm text-gray-400">Run two algorithms on the exact same grid.</p>
            </div>

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
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 rounded-lg bg-slate-800 p-4">
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
              <div className="rounded-lg bg-slate-800 p-6 shadow-inner shadow-black/20 lg:col-span-2">
                {visualizer.currentStep.kind === 'grid' ? (
                  <GridVisualizer step={visualizer.currentStep} />
                ) : visualizer.currentStep.kind === 'nodes' ? (
                  <NodeVisualizer step={visualizer.currentStep} />
                ) : visualizer.currentStep.kind === 'table' ? (
                  <TableVisualizer step={visualizer.currentStep} />
                ) : visualizer.currentStep.kind === 'hash-table' ? (
                  <HashTableVisualizer step={visualizer.currentStep} />
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

            {/* Learning section: separated from the tool */}
            <div className="mt-8 space-y-4">
              <LearnPanel algorithm={algorithm} />
              <QuizPanel
                algorithm={algorithm}
                allAlgorithms={allAlgorithms}
                onComplete={(score, total) =>
                  recordQuizAttempt(algorithm.slug, score, total)
                }
              />
            </div>

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