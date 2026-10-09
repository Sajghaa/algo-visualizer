export interface AlgorithmStep {

    array: number[];
    highlighted : number[];
    sorted: number[];
    pointers?: Record<string, number>;
    description: string;
    explanation: string;
    concept?: 'compare' | 'swap' | 'done' | 'mark' | 'divide' | 'merge' | 'pivot'|'eliminated';
    lineOfCode?: number;
    target?: number;
}


export interface AlgorithmInfo {

    slug: string;
    name: string;
    description: string;
    timeComplexity: string;
    spaceComplexity: string;
    stable: boolean;
    pseudocode: string[];
    keyIdeas: string[];
    whenToUse: string;
    category?: 'sorting' | 'searching';
}


export interface SortingAlgorithm extends AlgorithmInfo {
    generateSteps(input: number[], target?: number) : AlgorithmStep[];
}