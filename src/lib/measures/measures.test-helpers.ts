import { describe, it, expect } from 'vitest';
import { MultiDirectedGraph } from 'graphology';

export const MAX_DEPTH = 3;

/**
 * Taxonomy structure used in tests:
 * 
 *       animal
 *       ^    ^
 *      /      \
 *    mammal  bird
 *     ^   ^    ^
 *    /     \    \ 
 *   dog   cat  penguin
 */
export const createTaxonomy = () => {
  const g = new MultiDirectedGraph();
  ['animal', 'mammal', 'bird', 'dog', 'cat', 'penguin'].forEach(n => g.addNode(n));
  g.addEdge('mammal', 'animal', { predicate: 'is-a' });
  g.addEdge('bird', 'animal', { predicate: 'is-a' });
  g.addEdge('dog', 'mammal', { predicate: 'is-a' });
  g.addEdge('cat', 'mammal', { predicate: 'is-a' });
  g.addEdge('penguin', 'bird', { predicate: 'is-a' });
  return g;
};

/**
 * Example extracted from Slimani et al. 2003
 * Shared between wuPalmer and simTBK tests
 */
export const createSlimaniExample1 = () => {
  const g = new MultiDirectedGraph();
  ['v', 'c1', 'w', 'x', 'y', 'z', 'c2', 'c3'].forEach(n => g.addNode(n));
  g.addEdge('c1', 'v', { predicate: 'is-a' });
  g.addEdge('w', 'v', { predicate: 'is-a' });
  g.addEdge('x', 'c1', { predicate: 'is-a' });
  g.addEdge('y', 'c1', { predicate: 'is-a' });
  g.addEdge('z', 'x', { predicate: 'is-a' });
  g.addEdge('c2', 'z', { predicate: 'is-a' });
  g.addEdge('c3', 'x', { predicate: 'is-a' });
  return g;
};

/**
 * Test cases for semantic measures
 */
export interface TestCase {
  name: string;
  c1: string;
  c2: string;
  expected: {
    shortestPath: number;
    radaSimilarity: number;
    resnikEdge: number;
    wuPalmer: number;
    pekarStaab: number;
    zhong: number;
    leacockChodorow: number;
    hirstStOnge: number;
  };
}

export const testCases: TestCase[] = [
  {
    name: 'same node',
    c1: 'dog',
    c2: 'dog',
    expected: {
      shortestPath: 0,
      radaSimilarity: 1,
      resnikEdge: 6,
      wuPalmer: 1,
      pekarStaab: 1,
      zhong: 1 / Math.pow(2, 2),
      leacockChodorow: Math.log(6),
      hirstStOnge: 8,
    },
  },
  {
    name: 'direct parent-child',
    c1: 'mammal',
    c2: 'dog',
    expected: {
      shortestPath: 1,
      radaSimilarity: 0.5,
      resnikEdge: 5,
      wuPalmer: 2 / 3,
      pekarStaab: 0.5,
      zhong: 1 / Math.pow(2, 1) - 1 / (2 * Math.pow(2, 1)) - 1 / (2 * Math.pow(2, 2)),
      leacockChodorow: Math.log(6) - Math.log(2),
      hirstStOnge: 7,
    },
  },
  {
    name: 'grandparent-grandchild',
    c1: 'animal',
    c2: 'dog',
    expected: {
      shortestPath: 2,
      radaSimilarity: 1 / 3,
      resnikEdge: 4,
      wuPalmer: 0,
      pekarStaab: 0,
      zhong: 0,
      leacockChodorow: Math.log(6) - Math.log(3),
      hirstStOnge: 6,
    },
  },
  {
    name: 'siblings',
    c1: 'dog',
    c2: 'cat',
    expected: {
      shortestPath: 2,
      radaSimilarity: 1 / 3,
      resnikEdge: 4,
      wuPalmer: 0.5,
      pekarStaab: 1 / 3,
      zhong: 1 / Math.pow(2, 1) - 2 * (1 / (2 * Math.pow(2, 2))),
      leacockChodorow: Math.log(6) - Math.log(3),
      hirstStOnge: 5,
    },
  },
  {
    name: 'cousins',
    c1: 'dog',
    c2: 'penguin',
    expected: {
      shortestPath: 4,
      radaSimilarity: 1 / 5,
      resnikEdge: 2,
      wuPalmer: 0,
      pekarStaab: 0,
      zhong: 0,
      leacockChodorow: Math.log(6) - Math.log(5),
      hirstStOnge: 3,
    },
  },
];

/**
 * Run tests for a specific measure
 */
export function runMeasureTests(measureName: string, measureFn: (g: MultiDirectedGraph, c1: string, c2: string, options?: any) => number, options?: any) {
  describe(measureName, () => {
    for (const tc of testCases) {
      it(`returns expected value for ${tc.name}`, () => {
        const g = createTaxonomy();
        const result = measureFn(g, tc.c1, tc.c2, options);
        const expected = tc.expected[measureFn.name as keyof typeof tc.expected];

        if (Number.isInteger(expected)) {
          expect(result).toBe(expected);
        } else {
          expect(result).toBeCloseTo(expected, 5);
        }
      });
    }

    it('returns 0 when no path exists', () => {
      const g = createTaxonomy();
      g.addNode('plant');
      expect(measureFn(g, 'dog', 'plant', options)).toBe(0);
    });

    it('handles nonexistent nodes gracefully', () => {
      const g = createTaxonomy();
      expect(measureFn(g, 'nonexistent1', 'nonexistent2', options)).toBe(0);
    });
  });
}
