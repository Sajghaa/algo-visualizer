import type { UserProgress } from './types';
import {
  PROGRESS_VERSION,
  createEmptyProgress,
} from './types';


const STORAGE_KEY = 'algovisualizer.progress.v1';

export function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createEmptyProgress();

    const parsed = JSON.parse(raw) as UserProgress;

    if (parsed.version !== PROGRESS_VERSION) {
      console.warn(
        `Progress version mismatch (found ${parsed.version}, expected ${PROGRESS_VERSION}). Resetting.`
      );
      return createEmptyProgress();
    }

    if (!parsed.algorithms || typeof parsed.algorithms !== 'object') {
      return createEmptyProgress();
    }

    return parsed;
  } catch (error) {
    console.error('Failed to load progress, resetting:', error);
    return createEmptyProgress();
  }
}

export function saveProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {

    console.error('Failed to save progress:', error);
  }
}

export function clearProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear progress:', error);
  }
}