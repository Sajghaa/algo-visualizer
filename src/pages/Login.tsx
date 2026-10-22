import { Navigate } from 'react-router-dom';
import { AuthForms } from '../components/AuthForms';
import { useAuth } from '../auth/useAuth';
import { Link } from 'react-router-dom';

export function Login() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 p-6">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 block text-center text-sm text-indigo-400 hover:text-indigo-300">
          ← Back to home
        </Link>
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