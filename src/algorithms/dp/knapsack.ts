import type {
  AlgorithmStep,
  SortingAlgorithm,
  TableCell,
} from '../types';

export const knapsack: SortingAlgorithm = {
  slug: 'knapsack',
  name: '0/1 Knapsack',
  description: 'Maximizes value given a weight limit — each item taken or not taken.',
  timeComplexity: 'O(n · W)',
  spaceComplexity: 'O(n · W)',
  stable: false,
  category: 'dp',

  keyIdeas: [
    'dp[i][w] = max value using first i items with capacity w',
    'Either skip item i (dp[i-1][w]) or take it (value + dp[i-1][w-weight])',
    'If the item is heavier than the capacity, we must skip it',
    'The bottom-right cell contains the final answer',
  ],

  whenToUse: 'Resource allocation, subset selection, packing problems.',

  pseudocode: [
    'knapsack(items, W):',
    '  dp = 2D array of zeros, size (n+1) x (W+1)',
    '  for i from 1 to n:',
    '    for w from 1 to W:',
    '      if weight[i-1] > w:',
    '        dp[i][w] = dp[i-1][w]  // skip',
    '      else:',
    '        dp[i][w] = max(',
    '          dp[i-1][w],  // skip',
    '          value[i-1] + dp[i-1][w - weight[i-1]]  // take',
    '        )',
    '  return dp[n][W]',
  ],

  generateSteps(_input: number[]): AlgorithmStep[] {
    // Generate a random set of items and a capacity
    const numItems = 4;
    const capacity = 8;
    const items: { weight: number; value: number }[] = [];

    for (let i = 0; i < numItems; i++) {
      items.push({
        weight: Math.floor(Math.random() * 4) + 1,  // 1-4
        value: Math.floor(Math.random() * 6) + 2,   // 2-7
      });
    }

    const n = items.length;
    const W = capacity;
    const steps: AlgorithmStep[] = [];

    const table: TableCell[][] = Array(n + 1)
      .fill(null)
      .map(() => Array(W + 1).fill(null).map(() => ({ value: 0 })));

    const colLabels = Array.from({ length: W + 1 }, (_, i) => String(i));
    const rowLabels = ['ε', ...items.map((it) => `w:${it.weight} v:${it.value}`)];

    const pushStep = (
      description: string,
      explanation: string,
      states: Record<string, 'current' | 'reading' | 'filled' | 'highlight'> = {},
      concept: 'compare' | 'mark' | 'done' = 'done'
    ) => {
      const snapshot = table.map((row) => row.map((c) => ({ ...c })));
      for (const [key, state] of Object.entries(states)) {
        const [r, c] = key.split(',').map(Number);
        if (snapshot[r] && snapshot[r][c]) {
          snapshot[r][c] = { ...snapshot[r][c], state };
        }
      }
      steps.push({
        kind: 'table',
        table: snapshot,
        rowLabels,
        colLabels,
        description,
        explanation,
        concept,
      });
    };

    pushStep(
      `Capacity: ${W}. Items: ${items.map((it) => `(w:${it.weight}, v:${it.value})`).join(', ')}`,
      'Row 0 and column 0 are zeros. We fill the table top-left to bottom-right.'
    );

    for (let i = 1; i <= n; i++) {
      const item = items[i - 1];

      for (let w = 1; w <= W; w++) {
        if (item.weight > w) {
          // Can't fit — copy from top
          pushStep(
            `Item ${i} (w:${item.weight}, v:${item.value}) doesn't fit in capacity ${w}`,
            `Weight ${item.weight} > capacity ${w}. Must skip. Copy from top.`,
            { [`${i},${w}`]: 'current', [`${i - 1},${w}`]: 'reading' },
            'compare'
          );

          table[i][w] = { value: table[i - 1][w].value };
        } else {
          // Can fit — choose skip or take
          const skipValue = Number(table[i - 1][w].value);
          const takeValue = item.value + Number(table[i - 1][w - item.weight].value);

          pushStep(
            `Item ${i} (w:${item.weight}, v:${item.value}) at capacity ${w}`,
            `Skip: top (${skipValue}). Take: value ${item.value} + dp[${i - 1}][${w - item.weight}] (${table[i - 1][w - item.weight].value}) = ${takeValue}.`,
            {
              [`${i},${w}`]: 'current',
              [`${i - 1},${w}`]: 'reading',
              [`${i - 1},${w - item.weight}`]: 'reading',
            },
            'compare'
          );

          table[i][w] = { value: Math.max(skipValue, takeValue) };
        }

        pushStep(
          `dp[${i}][${w}] = ${table[i][w].value}`,
          'Filled cell.',
          { [`${i},${w}`]: 'filled' },
          'mark'
        );
      }
    }

    const finalSnapshot: TableCell[][] = table.map((row) =>
      row.map((c) => ({ ...c, state: 'filled'}))
    );
    finalSnapshot[n][W] = { ...finalSnapshot[n][W], state: 'highlight' };

    steps.push({
      kind: 'table',
      table: finalSnapshot,
      rowLabels,
      colLabels,
      description: `Max value = ${table[n][W].value}`,
      explanation: `Best value using all items with capacity ${W}.`,
      concept: 'done',
    });

    return steps;
  },
};