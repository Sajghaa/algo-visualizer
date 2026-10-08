import { useState } from 'react';
import { useAuth } from '../auth/useAuth';

export function AuthForms() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-lg bg-slate-800 p-6">
      <div className="mb-4 flex border-b border-slate-700">
        <button
          onClick={() => { setMode('login'); setError(null); }}
          className={`flex-1 pb-2 text-sm font-semibold transition ${
            mode === 'login'
              ? 'border-b-2 border-indigo-500 text-white'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Log In
        </button>
        <button
          onClick={() => { setMode('register'); setError(null); }}
          className={`flex-1 pb-2 text-sm font-semibold transition ${
            mode === 'register'
              ? 'border-b-2 border-indigo-500 text-white'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Register
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-xs text-gray-400">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-xs text-gray-400">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={mode === 'register' ? 8 : undefined}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            className="w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
          />
          {mode === 'register' && (
            <p className="mt-1 text-xs text-gray-500">At least 8 characters</p>
          )}
        </div>

        {error && (
          <div className="rounded-md bg-red-500/20 px-3 py-2 text-xs text-red-300">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? '...' : mode === 'login' ? 'Log In' : 'Create Account'}
        </button>
      </form>
    </div>
  );
}