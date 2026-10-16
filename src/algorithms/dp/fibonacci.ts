import type {
  AlgorithmStep,
  SortingAlgorithm,
  TableCell,
} from '../types';

export const fibonacci: SortingAlgorithm = {
  slug: 'fibonacci-dp',
  name: 'Fibonacci (DP)',
  description: 'Computes Fib(n) bottom-up by filling a table of size n+1.',
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(n)',
  stable: false,
  category: 'dp',

  keyIdeas: [
    'Naive recursion recomputes the same values exponentially',
    'Bottom-up DP fills a table once — each subproblem solved once',
    'Each new cell depends on the previous two',
    'Classic intro to DP: tiny memory trade-off, huge speed gain',
  ],

  whenToUse: 'Fibonacci specifically — rarely. The technique — anytime subproblems overlap.',

  pseudocode: [
    'fib(n):',
    '  dp[0] = 0; dp[1] = 1',
    '  for i from 2 to n:',
    '    dp[i] = dp[i-1] + dp[i-2]',
    '  return dp[n]',
  ],

  generateSteps(input: number[]): AlgorithmStep[] {
    const n = Math.min(Math.max(input.length, 5), 12); // clamp to a sensible range
    const steps: AlgorithmStep[] = [];
    const table: TableCell[] = Array(n + 1).fill(null).map(() => ({ value: '' }));

    const pushStep = (
      description: string,
      explanation: string,
      states: Record<number, TableCell['state']> = {},
      concept: 'compare' | 'mark' | 'done' = 'done'
    ) => {
      const row: TableCell[] = table.map((c, i) => ({
        ...c,
        state: states[i] ?? 'default',
      }));
      steps.push({
        kind: 'table',
        table: [row],
        colLabels: Array.from({ length: n + 1 }, (_, i) => `n=${i}`),
        description,
        explanation,
        concept,
      });
    };

    pushStep(
      'Starting Fibonacci DP',
      `Computing Fib(${n}) bottom-up. Table has ${n + 1} cells: dp[0] through dp[${n}].`
    );

    table[0] = { value: 0 };
    pushStep(
      'dp[0] = 0',
      'Base case: Fibonacci of 0 is 0.',
      { 0: 'filled' },
      'mark'
    );

    table[1] = { value: 1 };
    pushStep(
      'dp[1] = 1',
      'Base case: Fibonacci of 1 is 1.',
      { 1: 'filled' },
      'mark'
    );

    for (let i = 2; i <= n; i++) {
      const prev2 = Number(table[i - 2].value);
      const prev1 = Number(table[i - 1].value);

      pushStep(
        `Reading dp[${i - 2}] = ${prev2} and dp[${i - 1}] = ${prev1}`,
        `Computing dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${prev1} + ${prev2}.`,
        { [i - 2]: 'reading', [i - 1]: 'reading' },
        'compare'
      );

      table[i] = { value: prev1 + prev2 };

      pushStep(
        `dp[${i}] = ${prev1 + prev2}`,
        `Filled cell ${i}.`,
        { [i]: 'current' },
        'mark'
      );
    }

    steps.push({
      kind: 'table',
      table: [
        table.map((c, i) => ({
          ...c,
          state: i === n ? 'highlight' : 'filled',
        })),
      ],
      colLabels: Array.from({ length: n + 1 }, (_, i) => `n=${i}`),
      description: `Fib(${n}) = ${table[n].value}`,
      explanation: `Filled ${n + 1} cells. Each cell computed once — O(n) total.`,
      concept: 'done',
    });

    return steps;
  },
};