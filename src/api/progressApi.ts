import type { AlgorithmProgress } from '../progress/types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';


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

export async function fetchProgress(slug: string): Promise<AlgorithmProgress | null> {
  try {
    const res = await fetch(`${API_BASE}/progress/${slug}`);
    if (!res.ok) return null;
    const data: ProgressApiResponse = await res.json();

    if (data.quizAttempts === 0 && data.timesPlayed === 0) {
      return null;
    }

    return toAlgorithmProgress(data);
  } catch (error) {
    console.warn('Failed to fetch progress from backend:', error);
    return null;
  }
}

export async function submitQuiz(
  slug: string,
  score: number,
  total: number
): Promise<AlgorithmProgress | null> {
  try {
    const res = await fetch(`${API_BASE}/progress/${slug}/quiz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score, total }),
    });
    if (!res.ok) return null;
    const data: ProgressApiResponse = await res.json();
    return toAlgorithmProgress(data);
  } catch (error) {
    console.warn('Failed to submit quiz to backend:', error);
    return null;
  }
}


export async function fetchAllProgress(): Promise<AlgorithmProgress[]> {
  try {
    const res = await fetch (`${API_BASE}/progress`);
    if (!res.ok) return [];
    const data: ProgressApiResponse[] = await res.json();
    return data.map(toAlgorithmProgress);
  } catch (error) {
    console.warn('Failed to fetch all progress from backend:', error);
    return [];
  }
}