import { describe, it, expect } from 'vitest';
import { MultiDirectedGraph } from 'graphology';
import { sanchez } from './sanchez';
import { getAncestorSet } from '../helpers';
import { createTaxonomy } from './measures.test-helpers';

function createSanchezOntology() {
  const g = new MultiDirectedGraph();

  // Add all nodes
  ['activity', 'sport', 'cultural_entertainment', 'beach_leisure',
   'wind', 'water', 'surfing', 'sailing', 'swimming', 'sunbathing'].forEach(n => g.addNode(n));

  // Edges: child -> parent
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

describe('sanchez', () => {
  const g = createTaxonomy();

  it('returns 0 for identical nodes', () => {
    expect(sanchez(g, 'dog', 'dog')).toBe(0);
  });

  it('returns 1 for disjoint sets', () => {
    const g2 = createTaxonomy();
    g2.addNode('plant');
    expect(sanchez(g2, 'dog', 'plant')).toBeCloseTo(1, 5);
  });

  it('computes correct value for parent-child (mammal, dog)', () => {
    const result = sanchez(g, 'mammal', 'dog');
    expect(result).toBeCloseTo(0.415037, 5);
  });

  it('computes correct value for siblings (dog, cat)', () => {
    const result = sanchez(g, 'dog', 'cat');
    expect(result).toBeCloseTo(0.5849625, 5);
  });

  it('computes correct value for cousins (dog, penguin)', () => {
    const result = sanchez(g, 'dog', 'penguin');
    expect(result).toBeCloseTo(0.8479969, 5);
  });

  it('handles nonexistent nodes gracefully', () => {
    expect(sanchez(g, 'nonexistent1', 'nonexistent2')).toBe(1);
  });

  describe('paper ontology (Sánchez et al. 2012)', () => {
    const paperG = createSanchezOntology();

    it('computes expected ancestor sets', () => {
      const surfing = getAncestorSet(paperG, 'surfing');
      const sailing = getAncestorSet(paperG, 'sailing');
      const swimming = getAncestorSet(paperG, 'swimming');
      const sunbathing = getAncestorSet(paperG, 'sunbathing');

      expect(surfing).toEqual(new Set(['surfing', 'wind', 'water', 'sport', 'activity', 'beach_leisure']));
      expect(sailing).toEqual(new Set(['sailing', 'wind', 'water', 'sport', 'activity', 'beach_leisure']));
      expect(swimming).toEqual(new Set(['swimming', 'water', 'sport', 'activity', 'beach_leisure']));
      expect(sunbathing).toEqual(new Set(['sunbathing', 'beach_leisure', 'activity']));
    });

    it('computes expected dissimilarity values', () => {
      expect(sanchez(paperG, 'surfing', 'sailing')).toBeCloseTo(0.36, 2);
      expect(sanchez(paperG, 'surfing', 'swimming')).toBeCloseTo(0.51, 2);
      expect(sanchez(paperG, 'surfing', 'sunbathing')).toBeCloseTo(0.78, 2);
      expect(sanchez(paperG, 'sailing', 'swimming')).toBeCloseTo(0.51, 2);
      expect(sanchez(paperG, 'sailing', 'sunbathing')).toBeCloseTo(0.78, 2);
      expect(sanchez(paperG, 'swimming', 'sunbathing')).toBeCloseTo(0.74, 2);
    });
  });
});
