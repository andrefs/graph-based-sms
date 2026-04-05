import { describe, it, expect } from 'vitest';
import { leacockChodorow } from './leacockChodorow';
import { runMeasureTests, runMeasureTestsDefault, MAX_DEPTH, createTaxonomyParentToChild } from './measures.test-helpers';
runMeasureTests('leacockChodorow', leacockChodorow, { maxDepth: MAX_DEPTH });
runMeasureTestsDefault('leacockChodorow', leacockChodorow, { maxDepth: MAX_DEPTH });
describe('leacockChodorow extra', () => {
    it('returns 0 without maxDepth', () => {
        const g = createTaxonomyParentToChild();
        expect(leacockChodorow(g, 'dog', 'cat')).toBe(0);
    });
});
//# sourceMappingURL=leacockChodorow.test.js.map