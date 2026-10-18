import type {
  AlgorithmStep,
  SortingAlgorithm,
  TableCell,
} from '../types';

export const editDistance: SortingAlgorithm = {
  slug: 'edit-distance',
  name: 'Edit Distance',
  description: 'Minimum operations (insert, delete, replace) to transform one sequence into another.',
  timeComplexity: 'O(m · n)',
  spaceComplexity: 'O(m · n)',
  stable: false,
  category: 'dp',

  keyIdeas: [
    'Measures similarity between two sequences',
    'Three operations: insert, delete, replace',
    'If characters match, copy the diagonal value directly',
    'If they differ, 1 + minimum of top, left, or diagonal',
    'Base cases: transforming to/from an empty sequence',
  ],

  whenToUse: 'Spell checkers, DNA alignment, fuzzy string matching, diff tools.',

  pseudocode: [
    'editDistance(A, B):',
    '  dp = 2D array size (m+1) x (n+1)',
    '  for i from 0 to m: dp[i][0] = i',
    '  for j from 0 to n: dp[0][j] = j',
    '  for i from 1 to m:',
    '    for j from 1 to n:',
    '      if A[i-1] == B[j-1]:',
    '        dp[i][j] = dp[i-1][j-1]',
    '      else:',
    '        dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])',
    '  return dp[m][n]',
  ],

  generateSteps(input: number[]): AlgorithmStep[] {
    const mid = Math.floor(input.length / 2);
    const A = input.slice(0, mid);
    const B = input.slice(mid);
    const m = A.length;
    const n = B.length;

    const steps: AlgorithmStep[] = [];

    const table: TableCell[][] = Array(m + 1)
      .fill(null)
      .map(() => Array(n + 1).fill(null).map(() => ({ value: 0 })));

    const colLabels = ['ε', ...B.map(String)];
    const rowLabels = ['ε', ...A.map(String)];

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
      `Transform A = [${A.join(', ')}] into B = [${B.join(', ')}]`,
      'Base cases: dp[i][0] = i (deletions) and dp[0][j] = j (insertions).'
    );

    for (let i = 1; i <= m; i++) {
      table[i][0] = { value: i };
      pushStep(`dp[${i}][0] = ${i}`, `Delete ${i} item(s) from A to reach empty string.`, { [`${i},0`]: 'filled' }, 'mark');
    }
    for (let j = 1; j <= n; j++) {
      table[0][j] = { value: j };
      pushStep(`dp[0][${j}] = ${j}`, `Insert ${j} item(s) to reach B.`, { [`0,${j}`]: 'filled' }, 'mark');
    }

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const aChar = A[i - 1];
        const bChar = B[j - 1];
        const match = aChar === bChar;

        if (match) {
          pushStep(
            `Compare A[${i - 1}] = ${aChar} with B[${j - 1}] = ${bChar}`,
            `Match! Copy diagonal: dp[${i - 1}][${j - 1}] = ${table[i - 1][j - 1].value}.`,
            { [`${i},${j}`]: 'current', [`${i - 1},${j - 1}`]: 'reading' },
            'compare'
          );

          table[i][j] = { value: table[i - 1][j - 1].value };
        } else {
          const top = Number(table[i - 1][j].value);
          const left = Number(table[i][j - 1].value);
          const diag = Number(table[i - 1][j - 1].value);
          const minOp = Math.min(top, left, diag);

          pushStep(
            `Compare A[${i - 1}] = ${aChar} with B[${j - 1}] = ${bChar}`,
            `Mismatch. Minimum of top (${top}), left (${left}), diag (${diag}) is ${minOp}. Add 1.`,
            {
              [`${i},${j}`]: 'current',
              [`${i - 1},${j}`]: 'reading',
              [`${i},${j - 1}`]: 'reading',
              [`${i - 1},${j - 1}`]: 'reading',
            },
            'compare'
          );

          table[i][j] = { value: 1 + minOp };
        }

        pushStep(
          `dp[${i}][${j}] = ${table[i][j].value}`,
          'Filled cell.',
          { [`${i},${j}`]: 'filled' },
          'mark'
        );
      }
    }

    const finalSnapshot: TableCell[][] = table.map((row) =>
      row.map((c) => ({ ...c, state: 'filled' as const }))
    );
    finalSnapshot[m][n] = { ...finalSnapshot[m][n], state: 'highlight' };

    steps.push({
      kind: 'table',
      table: finalSnapshot,
      rowLabels,
      colLabels,
      description: `Minimum operations = ${table[m][n].value}`,
      explanation: `Requires ${table[m][n].value} insert/delete/replace operations to transform A into B.`,
      concept: 'done',
    });

    return steps;
  },
};