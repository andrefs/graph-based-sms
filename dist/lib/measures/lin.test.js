import { describe, it, expect } from 'vitest';
import { lin } from './lin';
import { createTaxonomy, createTaxonomyParentToChild } from './measures.test-helpers';
const createICMap = () => {
    const ic = new Map();
    ic.set('animal', 0);
    ic.set('mammal', 1);
    ic.set('bird', 1);
    ic.set('dog', 2);
    ic.set('cat', 2);
    ic.set('penguin', 2);
    return ic;
};
const ic = createICMap();
describe('lin extra tests (childToParent)', () => {
    const g = createTaxonomy();
    it('returns 0 when no ic provided', () => {
        expect(lin(g, 'dog', 'cat', { edgeDirection: 'childToParent' })).toBe(0);
    });
    it('returns 0 when concept1 not in ic', () => {
        const partialIC = new Map();
        partialIC.set('cat', 2);
        partialIC.set('mammal', 1);
        partialIC.set('animal', 0);
        expect(lin(g, 'dog', 'cat', { ic: partialIC, edgeDirection: 'childToParent' })).toBe(0);
    });
    it('returns 0 when concept2 not in ic', () => {
        const partialIC = new Map();
        partialIC.set('dog', 2);
        partialIC.set('mammal', 1);
        partialIC.set('animal', 0);
        expect(lin(g, 'dog', 'cat', { ic: partialIC, edgeDirection: 'childToParent' })).toBe(0);
    });
});
describe('lin with IC map (childToParent)', () => {
    const g = createTaxonomy();
    const ic = createICMap();
    it('returns 1 for identical dog', () => {
        expect(lin(g, 'dog', 'dog', { ic, edgeDirection: 'childToParent' })).toBe(1);
    });
    it('returns 0.66667 for mammal-dog', () => {
        expect(lin(g, 'mammal', 'dog', { ic, edgeDirection: 'childToParent' })).toBeCloseTo(2 / 3, 5);
    });
    it('returns 0 for animal-dog', () => {
        expect(lin(g, 'animal', 'dog', { ic, edgeDirection: 'childToParent' })).toBe(0);
    });
    it('returns 0.5 for dog-cat', () => {
        expect(lin(g, 'dog', 'cat', { ic, edgeDirection: 'childToParent' })).toBeCloseTo(0.5, 5);
    });
    it('returns 0 for dog-penguin', () => {
        expect(lin(g, 'dog', 'penguin', { ic, edgeDirection: 'childToParent' })).toBe(0);
    });
});
describe('lin with IC map (default parentToChild)', () => {
    const g = createTaxonomyParentToChild();
    const ic = createICMap();
    it('returns 1 for identical dog', () => {
        expect(lin(g, 'dog', 'dog', { ic })).toBe(1);
    });
    it('returns 0.66667 for mammal-dog', () => {
        expect(lin(g, 'mammal', 'dog', { ic })).toBeCloseTo(2 / 3, 5);
    });
    it('returns 0 for animal-dog', () => {
        expect(lin(g, 'animal', 'dog', { ic })).toBe(0);
    });
    it('returns 0.5 for dog-cat', () => {
        expect(lin(g, 'dog', 'cat', { ic })).toBeCloseTo(0.5, 5);
    });
    it('returns 0 for dog-penguin', () => {
        expect(lin(g, 'dog', 'penguin', { ic })).toBe(0);
    });
});
//# sourceMappingURL=lin.test.js.map