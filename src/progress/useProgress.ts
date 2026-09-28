import { useCallback, useState } from 'react';
import type { UserProgress, AlgorithmProgress} from './types';
import { createEmptyAlgorithmProgress, createEmptyProgress } from './types';
import { loadProgress, saveProgress, clearProgress } from './storage';

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => loadProgress());

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
        const existing =
          prev.algorithms[slug] ?? createEmptyAlgorithmProgress(slug);

        const updated: UserProgress = {
          ...prev,
          algorithms: {
            ...prev.algorithms,
            [slug]: {
              ...existing,
              quizAttempts: existing.quizAttempts + 1,
              bestScore: Math.max(existing.bestScore, percentage),
              lastAttempted: new Date().toISOString(),
            },
          },
        };

        saveProgress(updated);
        return updated;
      });
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