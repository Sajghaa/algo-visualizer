import type {
  AlgorithmStep,
  SortingAlgorithm,
  TableCell,
} from '../types';

export const lcs: SortingAlgorithm = {
  slug: 'lcs',
  name: 'Longest Common Subsequence',
  description: 'Fills a 2D table where each cell is the LCS length of two prefixes.',
  timeComplexity: 'O(m · n)',
  spaceComplexity: 'O(m · n)',
  stable: false,
  category: 'dp',

  keyIdeas: [
    'Subsequence: characters in order, not necessarily adjacent',
    'dp[i][j] = LCS length of first i chars of A and first j chars of B',
    'If A[i-1] == B[j-1], extend diagonal: dp[i-1][j-1] + 1',
    'Otherwise take the max of top and left neighbors',
    'Row 0 and column 0 are all zeros (empty prefix)',
  ],

  whenToUse: 'Diff tools, DNA sequence alignment, spell checking, version control merge.',

  pseudocode: [
    'lcs(A, B):',
    '  dp = 2D array of zeros, size (m+1) x (n+1)',
    '  for i from 1 to m:',
    '    for j from 1 to n:',
    '      if A[i-1] == B[j-1]:',
    '        dp[i][j] = dp[i-1][j-1] + 1',
    '      else:',
    '        dp[i][j] = max(dp[i-1][j], dp[i][j-1])',
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
      `LCS of A = [${A.join(', ')}] and B = [${B.join(', ')}]`,
      'Row 0 and column 0 are zeros. We fill the table top-left to bottom-right.'
    );

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const aChar = A[i - 1];
        const bChar = B[j - 1];
        const match = aChar === bChar;

        pushStep(
          `Compare A[${i - 1}] = ${aChar} with B[${j - 1}] = ${bChar}`,
          match
            ? `Match! Extend diagonal: dp[${i - 1}][${j - 1}] + 1.`
            : `No match. Take max of top (${table[i - 1][j].value}) and left (${table[i][j - 1].value}).`,
          match
            ? { [`${i},${j}`]: 'current', [`${i - 1},${j - 1}`]: 'reading' }
            : {
                [`${i},${j}`]: 'current',
                [`${i - 1},${j}`]: 'reading',
                [`${i},${j - 1}`]: 'reading',
              },
          'compare'
        );

        if (match) {
          table[i][j] = { value: Number(table[i - 1][j - 1].value) + 1 };
        } else {
          table[i][j] = {
            value: Math.max(
              Number(table[i - 1][j].value),
              Number(table[i][j - 1].value)
            ),
          };
        }

        pushStep(
          `dp[${i}][${j}] = ${table[i][j].value}`,
          match
            ? `Diagonal ${table[i - 1][j - 1].value} + 1 = ${table[i][j].value}.`
            : `max(top, left) = ${table[i][j].value}.`,
          { [`${i},${j}`]: 'filled' },
          'mark'
        );
      }
    }


    const finalSnapshot = table.map((row) => row.map((c) => ({ ...c, state: 'filled' as const })));
    finalSnapshot[m][n] = { ...finalSnapshot[m][n], state: 'highlight' };

    steps.push({
      kind: 'table',
      table: finalSnapshot,
      rowLabels,
      colLabels,
      description: `LCS length = ${table[m][n].value}`,
      explanation: `Filled ${m}×${n} cells. Each cell computed once — O(m·n).`,
      concept: 'done',
    });

    return steps;
  },
};