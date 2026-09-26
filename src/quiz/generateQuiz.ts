import type { AlgorithmInfo } from '../algorithms/types';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickDistractors(
  correct: string,
  pool: string[],
  count: number
): string[] {
  const unique = Array.from(new Set(pool.filter((p) => p !== correct)));
  return shuffle(unique).slice(0, count);
}

function buildQuestion(
  id: string,
  question: string,
  correct: string,
  distractors: string[],
  explanation: string
): QuizQuestion {
  const options = shuffle([correct, ...distractors]);
  return {
    id,
    question,
    options,
    correctIndex: options.indexOf(correct),
    explanation,
  };
}

export function generateQuiz(
  current: AlgorithmInfo,
  all: AlgorithmInfo[]
): QuizQuestion[] {
  const others = all.filter((a) => a.name !== current.name);

  const questions: QuizQuestion[] = [];

  // Q1: Time complexity
  const timeDistractors = pickDistractors(
    current.timeComplexity,
    others.map((a) => a.timeComplexity),
    3
  );
  questions.push(
    buildQuestion(
      'time',
      `What is the time complexity of ${current.name}?`,
      current.timeComplexity,
      timeDistractors,
      `${current.name} runs in ${current.timeComplexity}.`
    )
  );

  // Q2: Space complexity
  const spaceDistractors = pickDistractors(
    current.spaceComplexity,
    others.map((a) => a.spaceComplexity),
    3
  );
  questions.push(
    buildQuestion(
      'space',
      `What is the space complexity of ${current.name}?`,
      current.spaceComplexity,
      spaceDistractors,
      `${current.name} uses ${current.spaceComplexity} extra space.`
    )
  );

  // Q3: Stability
  const stabilityOptions = shuffle(['Stable', 'Not stable']);
  questions.push({
    id: 'stable',
    question: `Is ${current.name} a stable sort?`,
    options: stabilityOptions,
    correctIndex: stabilityOptions.indexOf(
      current.stable ? 'Stable' : 'Not stable'
    ),
    explanation: current.stable
      ? `${current.name} preserves the relative order of equal elements.`
      : `${current.name} may reorder equal elements.`,
  });

  // Q4: When to use (pick from other algorithms' whenToUse + a "never" distractor)
  const whenCorrect = current.whenToUse;
  const whenDistractors = pickDistractors(
    whenCorrect,
    others.map((a) => a.whenToUse),
    3
  );
  questions.push(
    buildQuestion(
      'when',
      `When is ${current.name} the best choice?`,
      whenCorrect,
      whenDistractors,
      `Best fit: ${current.whenToUse}`
    )
  );

  // Q5: A key idea
  const correctIdea =
    current.keyIdeas[Math.floor(Math.random() * current.keyIdeas.length)];
  const ideaDistractors = pickDistractors(
    correctIdea,
    others.flatMap((a) => a.keyIdeas),
    3
  );
  questions.push(
    buildQuestion(
      'idea',
      `Which of these is a key idea of ${current.name}?`,
      correctIdea,
      ideaDistractors,
      `One of ${current.name}'s core ideas: "${correctIdea}"`
    )
  );

  return questions;
}