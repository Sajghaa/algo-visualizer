import type { AlgorithmProgress } from '../progress/types';
import { formatTimeAgo } from '../progress/formatTime';

interface ProgressStatsProps {
  progress: AlgorithmProgress;
}

export function ProgressStats({ progress }: ProgressStatsProps) {
  const hasAttempts = progress.quizAttempts > 0;
  const hasPlayed = progress.timesPlayed > 0;

  if (!hasAttempts && !hasPlayed) {
    return (
      <div className="text-xs text-gray-500 italic">
        No activity yet — take a quiz or watch the animation to start tracking.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-4 text-xs">
      <span className="flex items-center gap-1.5 text-gray-300">
        <span aria-hidden>📚</span>
        <span>
          {progress.quizAttempts} attempt{progress.quizAttempts === 1 ? '' : 's'}
        </span>
      </span>

      {hasAttempts && (
        <span className="flex items-center gap-1.5 text-gray-300">
          <span aria-hidden>🏆</span>
          <span>{progress.bestScore}% best</span>
        </span>
      )}

      {hasPlayed && (
        <span className="flex items-center gap-1.5 text-gray-300">
          <span aria-hidden>▶</span>
          <span>
            {progress.timesPlayed} play{progress.timesPlayed === 1 ? '' : 's'}
          </span>
        </span>
      )}

      {progress.lastAttempted && (
        <span className="flex items-center gap-1.5 text-gray-500">
          <span aria-hidden>🕐</span>
          <span>{formatTimeAgo(progress.lastAttempted)}</span>
        </span>
      )}
    </div>
  );
}