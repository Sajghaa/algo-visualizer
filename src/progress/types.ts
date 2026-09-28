export interface AlgorithmProgress {
    slug: string;
    quizAttempts: number;
    bestScore: number;
    lastAttempted?: string;
    timesPlayed: number;
}

export interface UserProgress {
    version: number;
    algorithms: Record<string, AlgorithmProgress>;
}

export const PROGRESS_VERSION = 1;

export function createEmptyProgress(): UserProgress {
    return {
        version: PROGRESS_VERSION,
        algorithms: {},
    };
}

export function createEmptyAlgorithmProgress(slug: string): AlgorithmProgress {
    return {
        slug,
        quizAttempts: 0,
        bestScore: 0,
        timesPlayed: 0,
    };
}