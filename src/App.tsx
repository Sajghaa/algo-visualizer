import { useMemo, useState } from 'react';
import { ArrayVisualizer } from './components/ArrayVisualizer';
import { Controls } from './components/Controls';
import { sortingAlgorithms } from './algorithms';
import { generateArray } from './utils/generateArray';
import { useVisualizer } from './hooks/useVisualizer';

function App() {
  const [arraySize, setArraySize] = useState(15);
  const [inputArray, setInputArray] = useState(() => generateArray(arraySize));
  const [algorithmIndex, setAlgorithmIndex] = useState(0);

  const algorithm = sortingAlgorithms[algorithmIndex];

  const steps = useMemo(
    () => algorithm.generateSteps(inputArray),
    [algorithm, inputArray]
  );

  const maxValue = useMemo(() => Math.max(...inputArray), [inputArray]);

  const visualizer = useVisualizer(steps);

  const handleNewArray = () => {
    setInputArray(generateArray(arraySize));
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
   
      <div className="mx-auto mb-6 flex max-w-5xl flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-white">Algo Visualizer</h1>

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
            {sortingAlgorithms.map((algo, index) => (
              <option key={algo.name} value={index}>
                {algo.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mx-auto max-w-5xl space-y-4">
     
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
            </div>
          </div>
        </div>

   
        <div className="rounded-lg bg-slate-800 p-6">
          <ArrayVisualizer step={visualizer.currentStep} maxValue={maxValue} />

         
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

        {/* Array controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 rounded-lg bg-slate-800 p-4">
          <label htmlFor="size" className="text-sm text-gray-300">
            Array size: {arraySize}
          </label>
          <input
            id="size"
            type="range"
            min={5}
            max={50}
            value={arraySize}
            onChange={(e) => setArraySize(Number(e.target.value))}
            className="w-48 accent-indigo-500"
          />
          <button
            onClick={handleNewArray}
            className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
          >
            🎲 New Array
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;