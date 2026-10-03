import { useCallback, useState, useEffect } from 'react';
import type { UserProgress, AlgorithmProgress} from './types';
import { createEmptyAlgorithmProgress, createEmptyProgress } from './types';
import { loadProgress, saveProgress, clearProgress } from './storage';
import { fetchAllProgress, submitQuiz } from '../api/progressApi';

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => loadProgress());


  useEffect(() => {
  let cancelled = false;

  async function syncFromBackend() {
    const remoteList = await fetchAllProgress();
    if (cancelled) return;
    if (remoteList.length === 0) return;

    setProgress((prev) => {
      let changed = false;
      const merged = { ...prev.algorithms };

      for (const remote of remoteList) {
        const local = merged[remote.slug];

        // Backend wins if it has more attempts (or if we have nothing for this slug)
        if (!local || remote.quizAttempts > local.quizAttempts) {
          merged[remote.slug] = remote;
          changed = true;
        }
      }

      if (!changed) return prev;

      const updated = { ...prev, algorithms: merged };
      saveProgress(updated);
      return updated;
    });
  }

  syncFromBackend();
  return () => {
    cancelled = true;
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  const getAlgorithmProgress = useCallback(
    (slug: string): AlgorithmProgress => {
      return progress.algorithms[slug] ?? createEmptyAlgorithmProgress(slug);
    },
    [progress]
  );

    const recordQuizAttempt = useCallback(
    (slug: string, score: number, total: number) => {
      const percentage = Math.round((score / total) * 100);

      setProgress((prev) => {
        const existing = prev.algorithms[slug] ?? createEmptyAlgorithmProgress(slug);

        const updated: UserProgress = {
          ...prev,
          algorithms: {
            ...prev.algorithms,
            [slug]: {
              ...existing,
              quizAttempts: existing.quizAttempts + 1,
              bestScore: Math.max(existing.bestScore, percentage),
              latestScore: percentage,
              lastAttempted: new Date().toISOString(),
            },
          },
        };

        saveProgress(updated);
        return updated;
      });

      
      submitQuiz(slug, score, total).catch((err) =>
        console.warn('Backend sync failed; local state preserved:', err)
      );
    },
    []
  );

  const recordPlay = useCallback((slug: string) => {
    setProgress((prev) => {
      const existing =
        prev.algorithms[slug] ?? createEmptyAlgorithmProgress(slug);

      const updated: UserProgress = {
        ...prev,
        algorithms: {
          ...prev.algorithms,
          [slug]: {
            ...existing,
            timesPlayed: existing.timesPlayed + 1,
          },
        },
      };

      saveProgress(updated);
      return updated;
    });
  }, []);

  const resetAll = useCallback(() => {
    clearProgress();
    setProgress(createEmptyProgress());
  }, []);

  return {
    progress,
    getAlgorithmProgress,
    recordQuizAttempt,
    recordPlay,
    resetAll,
  };
}