import { describe, it, expect } from 'vitest';
import { MultiDirectedGraph } from 'graphology';
import { sanchez } from './sanchez';
import { getAncestorSet } from '../helpers';
import { createTaxonomyParentToChild } from './measures.test-helpers';

function createSanchezOntology() {
  const g = new MultiDirectedGraph();
  ['activity', 'sport', 'cultural_entertainment', 'beach_leisure',
   'wind', 'water', 'surfing', 'sailing', 'swimming', 'sunbathing'].forEach(n => g.addNode(n));
  g.addEdge('cultural_entertainment', 'activity', { predicate: 'is-a' });
  g.addEdge('sport', 'activity', { predicate: 'is-a' });
  g.addEdge('beach_leisure', 'activity', { predicate: 'is-a' });
  g.addEdge('wind', 'sport', { predicate: 'is-a' });
  g.addEdge('water', 'sport', { predicate: 'is-a' });
  g.addEdge('surfing', 'wind', { predicate: 'is-a' });
  g.addEdge('surfing', 'water', { predicate: 'is-a' });
  g.addEdge('surfing', 'beach_leisure', { predicate: 'is-a' });
  g.addEdge('sailing', 'wind', { predicate: 'is-a' });
  g.addEdge('sailing', 'water', { predicate: 'is-a' });
  g.addEdge('sailing', 'beach_leisure', { predicate: 'is-a' });
  g.addEdge('swimming', 'water', { predicate: 'is-a' });
  g.addEdge('swimming', 'beach_leisure', { predicate: 'is-a' });
  g.addEdge('sunbathing', 'beach_leisure', { predicate: 'is-a' });
  return g;
}

describe('sanchez extra (childToParent)', () => {
  describe('paper ontology (Sánchez et al. 2012)', () => {
    const paperG = createSanchezOntology();

    it('computes expected ancestor sets', () => {
      const surfing = getAncestorSet(paperG, 'surfing', undefined, 'childToParent');
      const sailing = getAncestorSet(paperG, 'sailing', undefined, 'childToParent');
      const swimming = getAncestorSet(paperG, 'swimming', undefined, 'childToParent');
      const sunbathing = getAncestorSet(paperG, 'sunbathing', undefined, 'childToParent');

      expect(surfing).toEqual(new Set(['surfing', 'wind', 'water', 'sport', 'activity', 'beach_leisure']));
      expect(sailing).toEqual(new Set(['sailing', 'wind', 'water', 'sport', 'activity', 'beach_leisure']));
      expect(swimming).toEqual(new Set(['swimming', 'water', 'sport', 'activity', 'beach_leisure']));
      expect(sunbathing).toEqual(new Set(['sunbathing', 'beach_leisure', 'activity']));
    });

    it('computes expected dissimilarity values', () => {
      expect(sanchez(paperG, 'surfing', 'sailing', { edgeDirection: 'childToParent' })).toBeCloseTo(0.36, 2);
      expect(sanchez(paperG, 'surfing', 'swimming', { edgeDirection: 'childToParent' })).toBeCloseTo(0.51, 2);
      expect(sanchez(paperG, 'surfing', 'sunbathing', { edgeDirection: 'childToParent' })).toBeCloseTo(0.78, 2);
      expect(sanchez(paperG, 'sailing', 'swimming', { edgeDirection: 'childToParent' })).toBeCloseTo(0.51, 2);
      expect(sanchez(paperG, 'sailing', 'sunbathing', { edgeDirection: 'childToParent' })).toBeCloseTo(0.78, 2);
      expect(sanchez(paperG, 'swimming', 'sunbathing', { edgeDirection: 'childToParent' })).toBeCloseTo(0.74, 2);
    });
  });
});

describe('sanchez (default parentToChild)', () => {
  const g = createTaxonomyParentToChild();

  it('returns 0 for identical nodes', () => {
    expect(sanchez(g, 'dog', 'dog')).toBe(0);
  });

  it('returns correct value for parent-child (mammal, dog)', () => {
    expect(sanchez(g, 'mammal', 'dog')).toBeCloseTo(Math.log2(4/3), 5);
  });

  it('returns correct value for grandparent-grandchild (animal, dog)', () => {
    expect(sanchez(g, 'animal', 'dog')).toBeCloseTo(0.7369655941662062, 5);
  });

  it('returns correct value for siblings (dog, cat)', () => {
    expect(sanchez(g, 'dog', 'cat')).toBeCloseTo(0.5849625007211562, 5);
  });

  it('returns correct value for cousins (dog, penguin)', () => {
    expect(sanchez(g, 'dog', 'penguin')).toBeCloseTo(0.8479969065081857, 5);
  });

  it('returns 1 when no path exists', () => {
    const g2 = createTaxonomyParentToChild();
    g2.addNode('plant');
    expect(sanchez(g2, 'dog', 'plant')).toBe(1);
  });

  it('handles nonexistent nodes gracefully', () => {
    const g2 = createTaxonomyParentToChild();
    expect(sanchez(g2, 'nonexistent', 'dog')).toBe(1);
  });
});
