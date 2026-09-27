import type { AlgorithmInfo } from '../algorithms/types';

export interface UrlState {
  slug: string;
  array: number[];
  step?: number;
}

export function encodeState(state: UrlState): string {
  const params = new URLSearchParams();
  params.set('algo', state.slug);
  params.set('arr', state.array.join(','));
  if (state.step !== undefined) {
    params.set('step', String(state.step));
  }
  return params.toString();
}

export function decodeState(search: string, algorithms: AlgorithmInfo[]): UrlState | null {
  const params = new URLSearchParams(search);
  const slug = params.get('algo');
  const arr = params.get('arr');

  if (!slug || !arr) return null;

  const algorithm = algorithms.find((a) => a.slug === slug);
  if (!algorithm) return null;

  const array = arr
    .split(',')
    .map(Number)
    .filter((n) => Number.isFinite(n) && n > 0);

  if (array.length === 0) return null;

  const stepParam = params.get('step');
  const step = stepParam !== null ? Number(stepParam) : undefined;

  return {
    slug,
    array,
    step: step !== undefined && Number.isFinite(step) ? step : undefined,
  };
}