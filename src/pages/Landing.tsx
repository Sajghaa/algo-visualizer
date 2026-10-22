import { Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

export function Landing() {
  const { isAuthenticated } = useAuth();

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
            to={isAuthenticated ? "/app" : "/login"}
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

        {/* Visual Mockup (Using CSS to fake a screenshot for now) */}
        <div className="mt-20 rounded-xl border border-slate-700 bg-slate-800 p-2 shadow-2xl">
          <div className="rounded-lg bg-slate-900 p-8">
            <div className="mb-6 flex justify-center gap-2">
              <div className="h-2 w-16 rounded-full bg-indigo-500"></div>
              <div className="h-2 w-16 rounded-full bg-slate-700"></div>
              <div className="h-2 w-16 rounded-full bg-slate-700"></div>
            </div>
            <div className="flex h-48 items-end justify-center gap-1">
              {[40, 70, 20, 90, 50, 80, 30, 100, 60].map((height, i) => (
                <div
                  key={i}
                  className={`w-8 rounded-t-sm transition-all ${
                    height === 100 ? 'bg-green-500' : height === 90 ? 'bg-yellow-400' : 'bg-indigo-500'
                  }`}
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
            <div className="mt-8 text-center font-mono text-sm text-gray-400">
              Sorting: Bubble Sort | Step 14 / 32
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