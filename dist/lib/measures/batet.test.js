import { describe, it, expect } from 'vitest';
import { MultiDirectedGraph } from 'graphology';
import { batet, _batetCommonInfo } from './batet';
import { createTaxonomy, createTaxonomyParentToChild } from './measures.test-helpers';
describe('_batetCommonInfo (childToParent)', () => {
    const createBatetExample = () => {
        const g = new MultiDirectedGraph();
        ['x', 'c3', 'c4', 'c1', 'c2'].forEach(n => g.addNode(n));
        g.addEdge('c3', 'x', { predicate: 'is-a' });
        g.addEdge('c4', 'x', { predicate: 'is-a' });
        g.addEdge('c1', 'c3', { predicate: 'is-a' });
        g.addEdge('c2', 'c3', { predicate: 'is-a' });
        return g;
    };
    it('returns 0.5 for siblings c1 and c2', () => {
        const g = createBatetExample();
        expect(_batetCommonInfo(g, 'c1', 'c2', {}, 'childToParent')).toBeCloseTo(0.5, 5);
    });
    it('returns 2/3 for cousins c3 and c4', () => {
        const g = createBatetExample();
        expect(_batetCommonInfo(g, 'c3', 'c4', {}, 'childToParent')).toBeCloseTo(2 / 3, 5);
    });
});
describe('batet (childToParent)', () => {
    const g = createTaxonomy();
    it('returns 0 for identical nodes', () => {
        expect(batet(g, 'dog', 'dog', { edgeDirection: 'childToParent' })).toBe(0);
    });
    it('returns correct value for parent-child (mammal, dog)', () => {
        expect(batet(g, 'mammal', 'dog', { edgeDirection: 'childToParent' })).toBeCloseTo(1.584962500721156, 5);
    });
    it('returns correct value for grandparent-grandchild (animal, dog)', () => {
        expect(batet(g, 'animal', 'dog', { edgeDirection: 'childToParent' })).toBeCloseTo(0.5849625007211562, 5);
    });
    it('returns correct value for siblings (dog, cat)', () => {
        expect(batet(g, 'dog', 'cat', { edgeDirection: 'childToParent' })).toBeCloseTo(1, 5);
    });
    it('returns correct value for cousins (dog, penguin)', () => {
        expect(batet(g, 'dog', 'penguin', { edgeDirection: 'childToParent' })).toBeCloseTo(0.3219280948873623, 5);
    });
    it('returns 0 when no path exists', () => {
        const g2 = createTaxonomy();
        g2.addNode('plant');
        expect(batet(g2, 'dog', 'plant', { edgeDirection: 'childToParent' })).toBe(0);
    });
    it('handles nonexistent nodes gracefully', () => {
        const g2 = createTaxonomy();
        expect(batet(g2, 'nonexistent', 'dog', { edgeDirection: 'childToParent' })).toBe(0);
    });
});
describe('batet (default parentToChild)', () => {
    const g = createTaxonomyParentToChild();
    it('returns 0 for identical nodes', () => {
        expect(batet(g, 'dog', 'dog')).toBe(0);
    });
    it('returns correct value for parent-child (mammal, dog)', () => {
        expect(batet(g, 'mammal', 'dog')).toBeCloseTo(1.584962500721156, 5);
    });
    it('returns correct value for grandparent-grandchild (animal, dog)', () => {
        expect(batet(g, 'animal', 'dog')).toBeCloseTo(0.5849625007211562, 5);
    });
    it('returns correct value for siblings (dog, cat)', () => {
        expect(batet(g, 'dog', 'cat')).toBeCloseTo(1, 5);
    });
    it('returns correct value for cousins (dog, penguin)', () => {
        expect(batet(g, 'dog', 'penguin')).toBeCloseTo(0.3219280948873623, 5);
    });
    it('returns 0 when no path exists', () => {
        const g2 = createTaxonomyParentToChild();
        g2.addNode('plant');
        expect(batet(g2, 'dog', 'plant')).toBe(0);
    });
    it('handles nonexistent nodes gracefully', () => {
        const g2 = createTaxonomyParentToChild();
        expect(batet(g2, 'nonexistent', 'dog')).toBe(0);
    });
});
//# sourceMappingURL=batet.test.js.map