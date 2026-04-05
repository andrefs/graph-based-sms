import { describe, it, expect } from 'vitest';
import { MultiDirectedGraph } from 'graphology';
import { shortestPath, radaSimilarity, resnikEdge, wuPalmer, leacockChodorow, hirstStOnge, } from './measures';
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
const testCases = [
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
function runMeasureTests(measureName, measureFn, options) {
    describe(measureName, () => {
        for (const tc of testCases) {
            it(`returns expected value for ${tc.name}`, () => {
                const g = createTaxonomy();
                const result = measureFn(g, tc.c1, tc.c2, options);
                const expected = tc.expected[measureFn.name];
                if (Number.isInteger(expected)) {
                    expect(result).toBe(expected);
                }
                else {
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
// Additional test for wuPalmer root node self-similarity
describe('wuPalmer', () => {
    it('returns 1 for root node self-similarity', () => {
        const g = createTaxonomy();
        expect(wuPalmer(g, 'animal', 'animal')).toBe(1);
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
// Additional tests for hirstStOnge direction changes
describe('hirstStOnge direction changes', () => {
    it('counts 0 direction changes for upward-only path', () => {
        const g = new MultiDirectedGraph();
        ['A', 'B', 'C'].forEach(n => g.addNode(n));
        g.addEdge('B', 'A', { predicate: 'is-a' });
        g.addEdge('C', 'B', { predicate: 'is-a' });
        // Path C -> B -> A: all UP, 0 changes
        // Score: 8 - 2 - 1*0 = 6
        expect(hirstStOnge(g, 'C', 'A', { C: 8, k: 1 })).toBe(6);
    });
    it('counts 1 direction change for UP then DOWN path', () => {
        const g = new MultiDirectedGraph();
        ['root', 'A', 'B', 'C', 'D'].forEach(n => g.addNode(n));
        g.addEdge('A', 'root', { predicate: 'is-a' });
        g.addEdge('B', 'root', { predicate: 'is-a' });
        g.addEdge('C', 'A', { predicate: 'is-a' });
        g.addEdge('D', 'B', { predicate: 'is-a' });
        // Path C -> A -> root -> B -> D: UP, UP, DOWN, DOWN (1 change)
        // Score: 8 - 4 - 1*1 = 3
        expect(hirstStOnge(g, 'C', 'D', { C: 8, k: 1, maxLength: 5 })).toBe(3);
    });
});
// Tests for multiple LCA scenarios
describe('multiple LCAs', () => {
    const createDiamondTaxonomy = () => {
        const g = new MultiDirectedGraph();
        ['root', 'A', 'B', 'C', 'D'].forEach(n => g.addNode(n));
        g.addEdge('A', 'root', { predicate: 'is-a' });
        g.addEdge('B', 'root', { predicate: 'is-a' });
        g.addEdge('C', 'A', { predicate: 'is-a' });
        g.addEdge('C', 'B', { predicate: 'is-a' });
        g.addEdge('D', 'A', { predicate: 'is-a' });
        g.addEdge('D', 'B', { predicate: 'is-a' });
        return g;
    };
    /*
     * Diamond taxonomy:
     *       root
     *       ^  ^
     *      /    \
     *     A      B
     *      ^    ^
     *       \  /
     *        C     (C has two parents: A and B)
     *       / \
     *      D   (D also has two parents: A and B)
     *
     * For (C, D): LCAs = {A, B, root}
     * A and B are at depth 1, root at depth 0
     */
    it('wuPalmer selects best LCA (highest depth)', () => {
        const g = createDiamondTaxonomy();
        // C and D share LCAs: A, B (depth 1), root (depth 0)
        // Best: A or B with depth 1
        // path(C,A) = 1, path(D,A) = 1
        // score = 2*1 / (2*1 + 1 + 1) = 2/4 = 0.5
        expect(wuPalmer(g, 'C', 'D')).toBeCloseTo(0.5, 5);
    });
    it('leacockChodorow selects shortest path through any LCA', () => {
        const g = createDiamondTaxonomy();
        // Through A: path = 1 + 1 = 2, N = 3
        // Through B: path = 1 + 1 = 2, N = 3
        // Through root: path = 2 + 2 = 4, N = 5
        // Shortest: 2, N = 3
        // Score: log(2*2) - log(3) = log(4) - log(3)
        expect(leacockChodorow(g, 'C', 'D', { maxDepth: 2 })).toBeCloseTo(Math.log(4) - Math.log(3), 5);
    });
});
// Tests for predicate filtering
describe('predicate filtering', () => {
    const createMultiPredicateTaxonomy = () => {
        const g = new MultiDirectedGraph();
        ['A', 'B', 'C', 'D'].forEach(n => g.addNode(n));
        g.addEdge('A', 'B', { predicate: 'is-a' });
        g.addEdge('B', 'C', { predicate: 'is-a' });
        g.addEdge('C', 'D', { predicate: 'is-a' });
        g.addEdge('A', 'D', { predicate: 'part-of' });
        return g;
    };
    /*
     * Multi-predicate taxonomy:
     *   A -> B -> C -> D  (is-a edges, length 3)
     *   A -> D (part-of edge, length 1)
     *
     * With is-a filter: path A to D is A-B-C-D (length 3)
     * With part-of filter: path A to D is A-D (length 1)
     */
    it('filters edges by predicate for shortestPath', () => {
        const g = createMultiPredicateTaxonomy();
        // With is-a filter: path A->D is A-B-C-D (length 3)
        // With part-of filter: path A->D is A-D (length 1)
        expect(shortestPath(g, 'A', 'D', { predicates: 'is-a' })).toBe(3);
        expect(shortestPath(g, 'A', 'D', { predicates: 'part-of' })).toBe(1);
    });
    it('radaSimilarity respects predicate filter', () => {
        const g = createMultiPredicateTaxonomy();
        const simIsA = radaSimilarity(g, 'A', 'D', { predicates: 'is-a' });
        const simPartOf = radaSimilarity(g, 'A', 'D', { predicates: 'part-of' });
        expect(simIsA).toBeCloseTo(1 / 4, 5); // path = 3, sim = 1/(1+3) = 1/4
        expect(simPartOf).toBeCloseTo(1 / 2, 5); // path = 1, sim = 1/(1+1) = 1/2
    });
});
// Tests for edge cases and boundary conditions
describe('edge cases', () => {
    it('handles single-node graph for all measures', () => {
        const g = new MultiDirectedGraph();
        g.addNode('only');
        expect(shortestPath(g, 'only', 'only')).toBe(0);
        expect(radaSimilarity(g, 'only', 'only')).toBe(1);
        expect(wuPalmer(g, 'only', 'only')).toBe(1);
        expect(leacockChodorow(g, 'only', 'only', { maxDepth: 1 })).toBeCloseTo(Math.log(2), 5);
        expect(hirstStOnge(g, 'only', 'only')).toBe(8);
    });
    it('handles maxDepth = 0 for Resnik Edge', () => {
        const g = createTaxonomy();
        expect(resnikEdge(g, 'dog', 'cat', { maxDepth: 0 })).toBe(-2); // 2*0 - 2
    });
    it('handles maxDepth = 1 for Leacock-Chodorow', () => {
        const g = createTaxonomy();
        // log(2*1) - log(N) = log(2) - log(3)
        expect(leacockChodorow(g, 'dog', 'cat', { maxDepth: 1 })).toBeCloseTo(Math.log(2) - Math.log(3), 5);
    });
    it('returns 0 when maxLength exceeded for Hirst-St-Onge', () => {
        const g = createTaxonomy();
        // Path dog -> penguin has length 4, maxLength = 2
        expect(hirstStOnge(g, 'dog', 'penguin', { C: 8, k: 1, maxLength: 2 })).toBe(0);
    });
    it('handles cycle detection in Hirst-St-Onge', () => {
        const g = new MultiDirectedGraph();
        ['A', 'B', 'C'].forEach(n => g.addNode(n));
        g.addEdge('A', 'B', { predicate: 'is-a' });
        g.addEdge('B', 'C', { predicate: 'is-a' });
        g.addEdge('C', 'A', { predicate: 'is-a' });
        // Should still find path without infinite loop
        const result = hirstStOnge(g, 'A', 'C', { C: 8, k: 1, maxLength: 5 });
        expect(result).toBeGreaterThan(0);
    });
});
//# sourceMappingURL=measures.test.js.map