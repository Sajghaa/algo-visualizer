import { Link } from 'react-router-dom';
import { allAlgorithms } from '../algorithms';
import { useAuth } from '../auth/useAuth';
import { useProgress } from '../progress/useProgress';

export function Dashboard() {
  const { user, logout } = useAuth();
  const { progress } = useProgress();


  const categories = Array.from(new Set(allAlgorithms.map((a) => a.category)));

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      {/* Header */}
      <div className="mx-auto mb-10 flex max-w-6xl items-center justify-between">
        <div className="flex items-center gap-2 text-2xl font-bold text-white">
          <span className="text-3xl">🧪</span> Algo Visualizer
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-400">{user?.email}</span>
          <button
            onClick={logout}
            className="rounded-md border border-slate-600 px-3 py-1.5 text-xs text-gray-300 transition hover:border-red-500 hover:text-red-400"
          >
            Log Out
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold text-white">Your Workspace</h1>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const algos = allAlgorithms.filter((a) => a.category === category);

            return (
              <div
                key={category}
                className="flex flex-col rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-lg"
              >
                <h2 className="mb-4 text-xl font-semibold capitalize text-white">
                  {category.replace('-', ' ')}
                </h2>
                <div className="flex flex-col gap-2">
                  {algos.map((algo) => {
                    const p = progress.algorithms[algo.slug];
                    const attempts = p?.quizAttempts ?? 0;
                    
                    return (
                      <Link
                        key={algo.slug}
                        to={`/app/${algo.slug}`}
                        className="group flex items-center justify-between rounded-md bg-slate-700/50 px-3 py-2 text-sm text-gray-300 transition hover:bg-indigo-500/20 hover:text-white"
                      >
                        <span>{algo.name}</span>
                        {attempts > 0 && (
                          <span className="text-xs text-green-400">
                            ✓ {attempts} {attempts === 1 ? 'attempt' : 'attempts'}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}