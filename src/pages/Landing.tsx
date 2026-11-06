import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { ArrayVisualizer } from '../components/ArrayVisualizer';
import { bubbleSort } from '../algorithms/sorting/bubbleSort';
import type { ArrayStep } from '../algorithms/types';


const DEMO_ARRAY = [45, 12, 89, 33, 67, 21, 90, 54, 78];

const DEMO_STEPS = bubbleSort.generateSteps(DEMO_ARRAY);

export function Landing() {
  const { isAuthenticated } = useAuth();
  const [demoIndex, setDemoIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDemoIndex((prev) => (prev + 1) % DEMO_STEPS.length);
    }, 250); 
    return () => clearInterval(interval);
  }, []);

  const currentDemoStep = DEMO_STEPS[demoIndex] as ArrayStep;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-6">
        <div className="flex items-center gap-2 text-xl font-bold">
          <span className="text-2xl">🧪</span> Algo Visualizer
        </div>
        <div>
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
            >
              Go to Workspace
            </Link>
          ) : (
            <Link
              to="/login"
              className="rounded-md border border-slate-700 px-4 py-2 text-sm font-semibold transition hover:bg-slate-800"
            >
              Sign In
            </Link>
          )}
        </div>
      </nav>

      {/* Hero */}
      <main className="mx-auto max-w-5xl px-6 py-20 text-center">
        <h1 className="mb-6 text-5xl font-extrabold tracking-tight sm:text-7xl">
          Master algorithms <span className="text-indigo-400">visually.</span>
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-400">
          Interactive step-by-step animations, synced pseudocode, and adaptive quizzes for 35+ algorithms. Built for students who want to *understand*, not just memorize.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to={isAuthenticated ? "/dashboard" : "/login"}
            className="rounded-md bg-indigo-500 px-8 py-3 text-lg font-semibold text-white transition hover:bg-indigo-400"
          >
            Start Learning →
          </Link>
          <a
            href="https://github.com/Sajghaa/algo-visualizer"
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-slate-700 px-8 py-3 text-lg font-semibold transition hover:bg-slate-800"
          >
            View on GitHub
          </a>
        </div>

        {/* LIVE Visual Mockup */}
        <div className="mt-20 rounded-xl border border-slate-700 bg-slate-800 p-2 shadow-2xl">
          <div className="rounded-lg bg-slate-900 p-8">
            
            {/* Fake Window Header (Only if you want it to look like an app) */}
            <div className="mb-6 flex justify-center gap-2">
              <div className="h-2 w-16 rounded-full bg-indigo-500"></div>
              <div className="h-2 w-16 rounded-full bg-slate-700"></div>
              <div className="h-2 w-16 rounded-full bg-slate-700"></div>
            </div>

            {/* The REAL Array Visualizer */}
            <div className="pointer-events-none"> 
              {/* pointer-events-none prevents users from clicking the fake buttons if any */}
              <ArrayVisualizer 
                step={currentDemoStep} 
                maxValue={Math.max(...DEMO_ARRAY)} 
              />
            </div>

            {/* Fake Controls */}
            <div className="mt-8 flex flex-col items-center gap-2">
              <div className="flex gap-2">
                <div className="rounded bg-slate-800 px-4 py-1 text-sm font-semibold text-gray-400">Step Back</div>
                <div className="rounded bg-indigo-500 px-4 py-1 text-sm font-semibold text-white">Play</div>
                <div className="rounded bg-slate-800 px-4 py-1 text-sm font-semibold text-gray-400">Step Forward</div>
              </div>
              <div className="mt-2 text-center font-mono text-sm text-gray-400">
                Sorting: Bubble Sort | Step {demoIndex + 1} / {DEMO_STEPS.length}
              </div>
            </div>

          </div>
        </div>

        {/* Feature Grid */}
        <div className="mt-24 grid grid-cols-1 gap-8 text-left md:grid-cols-3">
          <div className="rounded-lg bg-slate-800/50 p-6 border border-slate-700/50">
            <div className="mb-4 text-3xl">🎬</div>
            <h3 className="mb-2 text-xl font-semibold">Step-by-step</h3>
            <p className="text-sm text-gray-400">Pause, rewind, and slow down any algorithm to see exactly what happens in each frame.</p>
          </div>
          <div className="rounded-lg bg-slate-800/50 p-6 border border-slate-700/50">
            <div className="mb-4 text-3xl">📖</div>
            <h3 className="mb-2 text-xl font-semibold">Synced Code</h3>
            <p className="text-sm text-gray-400">Watch the pseudocode highlight line-by-line as the visualization runs.</p>
          </div>
          <div className="rounded-lg bg-slate-800/50 p-6 border border-slate-700/50">
            <div className="mb-4 text-3xl">🧠</div>
            <h3 className="mb-2 text-xl font-semibold">Active Recall</h3>
            <p className="text-sm text-gray-400">Test yourself with auto-generated quizzes that adapt to the algorithm you're viewing.</p>
          </div>
        </div>
      </main>
    </div>
  );
}