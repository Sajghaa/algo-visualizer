import { describe, it, expect } from 'vitest';
import { bubbleSort } from './bubbleSort';
import type { ArrayStep } from '../types'; 

describe('Bubble Sort', () => {
  it('should sort an array of numbers in ascending order', () => {
    const input = [5, 2, 8, 1, 9];
    const steps = bubbleSort.generateSteps(input);
    
  
    const finalStep = steps[steps.length - 1] as ArrayStep; 
    
    expect(finalStep.array).toEqual([1, 2, 5, 8, 9]);
    expect(finalStep.sorted).toHaveLength(5);
  });

  it('should handle an already sorted array', () => {
    const input = [1, 2, 3, 4, 5];
    const steps = bubbleSort.generateSteps(input);
    const finalStep = steps[steps.length - 1] as ArrayStep; 
    expect(finalStep.array).toEqual([1, 2, 3, 4, 5]);
  });

  it('should handle an empty array', () => {
    const steps = bubbleSort.generateSteps([]);
    const finalStep = steps[steps.length - 1] as ArrayStep; 
    expect(finalStep.array).toEqual([]);
  });
});