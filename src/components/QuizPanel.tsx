import { useMemo, useState } from 'react';
import { generateQuiz } from '../quiz/generateQuiz';
import type { AlgorithmInfo } from '../algorithms/types';

interface QuizPanelProps {
  algorithm: AlgorithmInfo;
  allAlgorithms: AlgorithmInfo[];
}

export function QuizPanel({ algorithm, allAlgorithms }: QuizPanelProps) {
  const [attempt, setAttempt] = useState(0);
  const questions = useMemo(
    () => generateQuiz(algorithm, allAlgorithms),
    [algorithm, attempt]
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = questions[currentIndex];

  const handleSelect = (index: number) => {
    if (selected !== null) return; // already answered
    setSelected(index);
    if (index === question.correctIndex) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (currentIndex === questions.length - 1) {
      setFinished(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
    }
  };

  const handleRestart = () => {
    setAttempt((a) => a + 1);
    setCurrentIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    const total = questions.length;
    const pct = Math.round((score / total) * 100);
    return (
      <div className="rounded-lg bg-slate-800 p-6 text-center">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
          Quiz Complete
        </h3>
        <p className="mb-2 text-4xl font-bold text-white">
          {score} / {total}
        </p>
        <p className="mb-6 text-gray-400">{pct}% correct</p>
        <button
          onClick={handleRestart}
          className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
        >
          🔄 Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-slate-800 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
          Quiz: {algorithm.name}
        </h3>
        <span className="text-xs text-gray-500">
          Question {currentIndex + 1} of {questions.length}
        </span>
      </div>

      <p className="mb-4 text-base text-white">{question.question}</p>

      <div className="space-y-2">
        {question.options.map((option, index) => {
          const isCorrect = index === question.correctIndex;
          const isSelected = index === selected;
          const answered = selected !== null;

          let classes =
            'w-full rounded-md border px-4 py-2 text-left text-sm transition ';
          if (!answered) {
            classes +=
              'border-slate-600 bg-slate-700 text-white hover:border-indigo-400 hover:bg-slate-600';
          } else if (isCorrect) {
            classes += 'border-green-500 bg-green-500/20 text-green-200';
          } else if (isSelected) {
            classes += 'border-red-500 bg-red-500/20 text-red-200';
          } else {
            classes += 'border-slate-700 bg-slate-800 text-gray-500';
          }

          return (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={answered}
              className={classes}
            >
              {option}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div className="mt-4 rounded-md bg-slate-900 p-3 text-sm text-gray-300">
          <p className="mb-2">
            {selected === question.correctIndex ? '✅ Correct!' : '❌ Not quite.'}
          </p>
          <p className="text-xs text-gray-400">{question.explanation}</p>
        </div>
      )}

      {selected !== null && (
        <button
          onClick={handleNext}
          className="mt-4 rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
        >
          {currentIndex === questions.length - 1 ? 'See Results' : 'Next →'}
        </button>
      )}
    </div>
  );
}