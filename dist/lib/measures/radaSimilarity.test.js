import { describe, it, expect } from 'vitest';
import { MultiDirectedGraph } from 'graphology';
import { radaSimilarity } from './radaSimilarity';
import { runMeasureTests, runMeasureTestsDefault } from './measures.test-helpers';
runMeasureTests('radaSimilarity', radaSimilarity);
describe('radaSimilarity extra', () => {
    it('handles single node graph', () => {
        const g = new MultiDirectedGraph();
        g.addNode('only');
        expect(radaSimilarity(g, 'only', 'only')).toBe(1);
    });
});
runMeasureTestsDefault('radaSimilarity', radaSimilarity);
//# sourceMappingURL=radaSimilarity.test.js.map