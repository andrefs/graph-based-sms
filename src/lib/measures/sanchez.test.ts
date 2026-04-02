import { describe, it, expect } from 'vitest';
import { sanchez } from './sanchez';
import { createTaxonomy } from './measures.test-helpers';

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
    expect(sanchez(g, 'nonexistent1', 'nonexistent2')).toBe(0);
  });
});
