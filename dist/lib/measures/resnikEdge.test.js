import { describe, it, expect } from 'vitest';
import { resnikEdge } from './resnikPath';
import { runMeasureTests, MAX_DEPTH, createTaxonomy } from './measures.test-helpers';
runMeasureTests('resnikEdge', resnikEdge, { maxDepth: MAX_DEPTH });
describe('resnikEdge', () => {
    it('returns 0 without maxDepth', () => {
        const g = createTaxonomy();
        expect(resnikEdge(g, 'dog', 'cat')).toBe(0);
    });
});
//# sourceMappingURL=resnikEdge.test.js.map