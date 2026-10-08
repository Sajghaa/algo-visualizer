import type { AlgorithmProgress } from '../progress/types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';


let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

function authHeaders(): Record<string, string> {
  return authToken ? { Authorization: `Bearer ${authToken}` } : {};
}

interface ProgressApiResponse {
  slug: string;
  quizAttempts: number;
  bestScore: number;
  latestScore: number | null;
  timesPlayed: number;
  lastAttempted: string | null;
}

function toAlgorithmProgress(r: ProgressApiResponse): AlgorithmProgress {
  return {
    slug: r.slug,
    quizAttempts: r.quizAttempts,
    bestScore: r.bestScore,
    latestScore: r.latestScore ?? undefined,
    timesPlayed: r.timesPlayed,
    lastAttempted: r.lastAttempted ?? undefined,
  };
}

export async function fetchAllProgress(): Promise<AlgorithmProgress[]> {
  if (!authToken) return [];  
  try {
    const res = await fetch(`${API_BASE}/progress`, {
      headers: { ...authHeaders() },
    });
    if (!res.ok) return [];
    const data: ProgressApiResponse[] = await res.json();
    return data.map(toAlgorithmProgress);
  } catch (error) {
    console.warn('Failed to fetch all progress:', error);
    return [];
  }
}

export async function submitQuiz(
  slug: string,
  score: number,
  total: number
): Promise<AlgorithmProgress | null> {
  if (!authToken) return null;
  try {
    const res = await fetch(`${API_BASE}/progress/${slug}/quiz`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify({ score, total }),
    });
    if (!res.ok) return null;
    const data: ProgressApiResponse = await res.json();
    return toAlgorithmProgress(data);
  } catch (error) {
    console.warn('Failed to submit quiz:', error);
    return null;
  }
}



export interface AuthUser {
  id: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  user: AuthUser;
}

interface ApiError {
  detail?: string;
}

async function handleAuthResponse(res: Response): Promise<AuthResponse> {
  if (!res.ok) {
    let message = 'Request failed';
    try {
      const err: ApiError = await res.json();
      if (err.detail) message = err.detail;
    } catch {
      // ignore JSON parse failures
    }
    throw new Error(message);
  }
  return res.json();
}

export async function register(
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleAuthResponse(res);
}

export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleAuthResponse(res);
}