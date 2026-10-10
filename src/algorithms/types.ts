export type AlgorithmCategory =
  | 'sorting'
  | 'searching'
  | 'pathfinding'
  | 'tree'
  | 'graph'
  | 'linked-list'
  | 'dp';

export interface BaseStep {
  description: string;
  explanation: string;
  concept?: 'compare' | 'swap' | 'done' | 'mark' | 'divide' | 'merge' | 'pivot';
  lineOfCode?: number;
}

export interface ArrayStep extends BaseStep {
  kind?: 'array';               
  array: number[];
  highlighted: number[];
  sorted: number[];
  eliminated?: number[];
  pointers?: Record<string, number>;
  target?: number;
}


export type AlgorithmStep = ArrayStep;

export interface AlgorithmInfo {
  slug: string;
  name: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  stable: boolean;
  category: AlgorithmCategory;
  pseudocode: string[];
  keyIdeas: string[];
  whenToUse: string;
}

export interface SortingAlgorithm extends AlgorithmInfo {
  generateSteps(input: number[], target?: number): AlgorithmStep[];
}