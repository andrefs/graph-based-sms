import { describe, it, expect } from 'vitest';
import { MultiDirectedGraph } from 'graphology';
import {
  shortestPath,
  radaSimilarity,
  resnikEdge,
  wuPalmer,
  leacockChodorow,
  hirstStOnge,
  batet,
  _batetCommonInfo,
} from './measures';

const createTaxonomy = () => {
  const g = new MultiDirectedGraph();
  ['animal', 'mammal', 'bird', 'dog', 'cat', 'penguin'].forEach(n => g.addNode(n));
  g.addEdge('mammal', 'animal', { predicate: 'is-a' });
  g.addEdge('bird', 'animal', { predicate: 'is-a' });
  g.addEdge('dog', 'mammal', { predicate: 'is-a' });
  g.addEdge('cat', 'mammal', { predicate: 'is-a' });
  g.addEdge('penguin', 'bird', { predicate: 'is-a' });
  return g;
};

const MAX_DEPTH = 3;

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

/**
 * Test cases for semantic measures
 */
interface TestCase {
  name: string;
  c1: string;
  c2: string;
  expected: {
    shortestPath: number;
    radaSimilarity: number;
    resnikEdge: number;
    wuPalmer: number;
    leacockChodorow: number;
    hirstStOnge: number;
  };
}

const testCases: TestCase[] = [
  {
    name: 'same node',
    c1: 'dog',
    c2: 'dog',
    expected: {
      shortestPath: 0,
      radaSimilarity: 1,
      resnikEdge: 6,
      wuPalmer: 1,
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
      leacockChodorow: Math.log(6) - Math.log(5),
      hirstStOnge: 3,
    },
  },
];

/**
 * Run tests for a specific measure
 */
function runMeasureTests(measureName: string, measureFn: (g: MultiDirectedGraph, c1: string, c2: string, options?: any) => number, options?: any) {
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

// Run tests for each measure
runMeasureTests('shortestPath (Rada Distance)', shortestPath);
runMeasureTests('radaSimilarity', radaSimilarity);
runMeasureTests('resnikEdge', resnikEdge, { maxDepth: MAX_DEPTH });
runMeasureTests('wuPalmer', wuPalmer);
runMeasureTests('leacockChodorow', leacockChodorow, { maxDepth: MAX_DEPTH });
runMeasureTests('hirstStOnge', hirstStOnge, { C: 8, k: 1, maxLength: 5 });

// Additional test for single node graph (radaSimilarity specific)
describe('radaSimilarity', () => {
  it('handles single node graph', () => {
    const g = new MultiDirectedGraph();
    g.addNode('only');
    expect(radaSimilarity(g, 'only', 'only')).toBe(1);
  });
});

// Additional test for resnikEdge without maxDepth
describe('resnikEdge', () => {
  it('returns 0 without maxDepth', () => {
    const g = createTaxonomy();
    expect(resnikEdge(g, 'dog', 'cat')).toBe(0);
  });
});

// Additional test for leacockChodorow without maxDepth
describe('leacockChodorow', () => {
  it('returns 0 without maxDepth', () => {
    const g = createTaxonomy();
    expect(leacockChodorow(g, 'dog', 'cat')).toBe(0);
  });
});

// Tests for batet
describe('batet', () => {
  const g = createTaxonomy();

  it('returns 0 for same node', () => {
    expect(batet(g, 'dog', 'dog')).toBe(0);
  });

  it('returns expected value for siblings', () => {
    const result = batet(g, 'dog', 'cat');
    const dogAncestors = new Set(['dog', 'mammal', 'animal']);
    const catAncestors = new Set(['cat', 'mammal', 'animal']);
    const union = new Set([...dogAncestors, ...catAncestors]);
    const intersection = new Set([...dogAncestors].filter(x => catAncestors.has(x)));
    const expected = -Math.log2((union.size - intersection.size) / union.size);
    expect(result).toBeCloseTo(expected, 5);
  });

  it('returns expected value for cousins', () => {
    const result = batet(g, 'dog', 'penguin');
    const dogAncestors = new Set(['dog', 'mammal', 'animal']);
    const penguinAncestors = new Set(['penguin', 'bird', 'animal']);
    const union = new Set([...dogAncestors, ...penguinAncestors]);
    const intersection = new Set([...dogAncestors].filter(x => penguinAncestors.has(x)));
    const expected = -Math.log2((union.size - intersection.size) / union.size);
    expect(result).toBeCloseTo(expected, 5);
  });

  it('returns 0 when no path exists', () => {
    const g = createTaxonomy();
    g.addNode('plant');
    expect(batet(g, 'dog', 'plant')).toBe(0);
  });

  it('handles nonexistent nodes gracefully', () => {
    const g = createTaxonomy();
    expect(batet(g, 'nonexistent1', 'nonexistent2')).toBe(0);
  });

  it('handles single node graph', () => {
    const g = new MultiDirectedGraph();
    g.addNode('only');
    expect(batet(g, 'only', 'only')).toBe(0);
  });
});

describe('_batetCommonInfo', () => {
  // example extracted from paper
  const createBatetExample = () => {
    const g = new MultiDirectedGraph();
    ['x', 'c3', 'c4', 'c1', 'c2'].forEach(n => g.addNode(n));
    g.addEdge('c3', 'x', { predicate: 'is-a' });
    g.addEdge('c4', 'x', { predicate: 'is-a' });
    g.addEdge('c1', 'c3', { predicate: 'is-a' });
    g.addEdge('c2', 'c3', { predicate: 'is-a' });
    return g;
  };

  // example extracted from paper
  it('returns 0.5 for siblings c1 and c2', () => {
    const g = createBatetExample();
    expect(_batetCommonInfo(g, 'c1', 'c2')).toBeCloseTo(0.5, 5);
  });

  // example extracted from paper
  it('returns 2/3 for cousins c3 and c4', () => {
    const g = createBatetExample();
    expect(_batetCommonInfo(g, 'c3', 'c4')).toBeCloseTo(2 / 3, 5);
  });

  it('returns 0 for same node', () => {
    const g = createBatetExample();
    expect(_batetCommonInfo(g, 'c1', 'c1')).toBe(0);
  });

  it('returns 1 when no path exists (max distance)', () => {
    const g = createBatetExample();
    g.addNode('y');
    expect(_batetCommonInfo(g, 'c1', 'y')).toBe(1);
  });
});
