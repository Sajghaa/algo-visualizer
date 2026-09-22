import { useCallback, useEffect, useState } from 'react';
import type { AlgorithmStep } from '../algorithms/types';

interface UseVisualizerReturn {
  currentStep: AlgorithmStep;
  currentIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  stepForward: () => void;
  stepBack: () => void;
  reset: () => void;
  setSpeed: (ms: number) => void;
}

export function useVisualizer(steps: AlgorithmStep[]): UseVisualizerReturn {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(300);

  // Reset when steps change — done during render, not in an effect
  const [prevSteps, setPrevSteps] = useState(steps);
  if (steps !== prevSteps) {
    setPrevSteps(steps);
    setCurrentIndex(0);
    setIsPlaying(false);
  }

  const totalSteps = steps.length;
  const currentStep = steps[currentIndex];

  useEffect(() => {
    if (!isPlaying) return;

    const intervalId = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= totalSteps - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, speed);

    return () => clearInterval(intervalId);
  }, [isPlaying, speed, totalSteps]);

  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);
  const toggle = useCallback(() => setIsPlaying((p) => !p), []);
  const reset = useCallback(() => {
    setCurrentIndex(0);
    setIsPlaying(false);
  }, []);

  const stepForward = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, totalSteps - 1));
  }, [totalSteps]);

  const stepBack = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  return {
    currentStep,
    currentIndex,
    totalSteps,
    isPlaying,
    speed,
    play,
    pause,
    toggle,
    stepForward,
    stepBack,
    reset,
    setSpeed,
  };
}