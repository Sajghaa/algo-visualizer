import { ArrayVisualizer } from './components/ArrayVisualizer';
import { bubbleSort } from './algorithms/sorting/bubbleSort';

function App() {
  const input = [5, 2, 8, 1, 9, 3, 7, 4];
  const steps = bubbleSort.generateSteps(input);
  const currentStep = steps[0]; // show the first frame only, for now
  const maxValue = Math.max(...input);

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <h1 className="mb-6 text-center text-2xl font-bold text-white">
        Algo Visualizer
      </h1>
      <div className="mx-auto max-w-4xl rounded-lg bg-slate-800 p-6">
        <ArrayVisualizer step={currentStep} maxValue={maxValue} />
        <p className="mt-4 text-center text-gray-300">
          {currentStep.description}
        </p>
      </div>
    </div>
  );
}

export default App;