import type {
  AlgorithmStep,
  SortingAlgorithm,
  HashNode,
  HashNodeState,
} from '../types';

export const insertChaining: SortingAlgorithm = {
  slug: 'hash-insert-chaining',
  name: 'Hash Table (Insert)',
  description: 'Inserts keys using modulo hashing. Collisions are handled by chaining.',
  timeComplexity: 'O(1) average, O(n) worst',
  spaceComplexity: 'O(n)',
  stable: false,
  category: 'hash-table',

  keyIdeas: [
    'Hash function maps key to a bucket index',
    'Modulo hash (key % N) is the simplest hash',
    'Collision: two keys hash to the same bucket',
    'Chaining: store colliding keys in a linked list at the bucket',
    'Average O(1) — degrades to O(n) if many collisions',
  ],

  whenToUse: 'Fast lookups, sets, caches, symbol tables. Hash tables power JSON, dictionaries, database indexes.',

  pseudocode: [
    'insert(key):',
    '  index = key % N',
    '  bucket = table[index]',
    '  if bucket is empty:',
    '    bucket.append(key)',
    '  else:',
    '    // collision — append to chain',
    '    bucket.append(key)',
  ],

  generateSteps(input: number[]): AlgorithmStep[] {
    const N = 5; // number of buckets
    const steps: AlgorithmStep[] = [];
    const buckets: HashNode[][] = Array(N).fill(null).map(() => []);

    const pushStep = (
      description: string,
      explanation: string,
      activeBucket?: number,
      activeKey?: number,
      states: Record<string, HashNodeState> = {},
      concept: 'compare' | 'mark' | 'done' = 'done'
    ) => {
      steps.push({
        kind: 'hash-table',
        buckets: buckets.map((b) => b.map((n) => ({ ...n, state: states[`${buckets.indexOf(b)}-${b.indexOf(n)}`] ?? n.state ?? 'default' }))),
        key: activeKey ?? 0,
        hashIndex: activeBucket ?? -1,
        hashFunction: `key % ${N}`,
        description,
        explanation,
        concept,
      });
    };

    pushStep(
      'Initial hash table',
      `${N} empty buckets. We will insert ${input.length} keys and watch collisions occur.`
    );

    for (const key of input) {
      const index = key % N;

      pushStep(
        `Hashing ${key}`,
        `${key} % ${N} = ${index}. Heading to bucket [${index}].`,
        index,
        key,
        {},
        'compare'
      );

      const bucket = buckets[index];
      const isCollision = bucket.length > 0;

      // Clear previous states
      for (const b of buckets) {
        for (const n of b) n.state = 'default';
      }

      // Append new node
      const newNode: HashNode = {
        value: key,
        state: isCollision ? 'collision' : 'inserted',
      };
      bucket.push(newNode);

      if (isCollision) {
        pushStep(
          `Collision! Appending ${key} to bucket [${index}]`,
          `Bucket [${index}] already had ${bucket.length - 1} key(s). Chain them together.`,
          index,
          key,
          { [`${index}-${bucket.length - 1}`]: 'collision' },
          'mark'
        );
      } else {
        pushStep(
          `Inserted ${key} into empty bucket [${index}]`,
          `No collision. Bucket [${index}] now holds ${key}.`,
          index,
          key,
          { [`${index}-0`]: 'inserted' },
          'mark'
        );
      }
    }

    pushStep(
      'Insertion complete',
      `All ${input.length} keys inserted. Buckets with chains indicate collisions.`,
      undefined,
      undefined,
      {},
      'done'
    );

    return steps;
  },
};