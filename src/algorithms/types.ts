export interface AlgorithmStep {

    array: number[];
    highlighted : number[];
    sorted: number[];
    pointers?: Record<string, number>;
    description: string;
    explanation: string;
    concept?: 'compare' | 'swap' | 'done' | 'mark';
    lineOfCode?: number;
}


export interface AlgorithmInfo {

    name: string;
    description: string;
    timeComplexity: string;
    spaceComplexity: string;
    pseudocode: string[];
    keyIdeas: string[];
    whenToUse: string;
}


export interface SortingAlgorithm extends AlgorithmInfo {
    generateSteps(input: number[]) : AlgorithmStep[];
}