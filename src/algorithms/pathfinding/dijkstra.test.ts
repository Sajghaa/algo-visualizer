import { describe, it, expect } from 'vitest';
import { dijkstra } from './dijkstra';

describe('Dijkstra', () => {
  it('should find a path on an open grid', () => {
   
    const emptyGrid: any[][] = [
      ['start', 'empty', 'empty'],
      ['empty', 'empty', 'empty'],
      ['empty', 'empty', 'end'],
    ];

    const steps = dijkstra.generateSteps([], undefined, emptyGrid);
    const finalStep = steps[steps.length - 1];


    expect(finalStep.description).toContain('Path found');
  });
});