import { describe, it, expect } from 'vitest';
import { li } from './li';
import { createTaxonomy } from './measures.test-helpers';

describe('li', () => {
  const g = createTaxonomy();

  it('returns 0 for no LCA (grandparent-grandchild, cousins)', () => {
    // animal-dog: LCA depth = 0, so score 0
    expect(li(g, 'animal', 'dog')).toBe(0);
    // dog-penguin: LCA depth = 0
    expect(li(g, 'dog', 'penguin')).toBe(0);
  });

  it('returns 0 when no path exists', () => {
    const g2 = createTaxonomy();
    g2.addNode('plant');
    expect(li(g2, 'dog', 'plant')).toBe(0);
  });

  it('handles nonexistent nodes gracefully', () => {
    const g2 = createTaxonomy();
    expect(li(g2, 'nonexistent1', 'nonexistent2')).toBe(0);
  });

  it('computes correct values for siblings (dog, cat)', () => {
    const result = li(g, 'dog', 'cat');
    expect(result).toBeCloseTo(0.28280736, 6);
  });

  it('computes correct values for parent-child (mammal, dog)', () => {
    const result = li(g, 'mammal', 'dog');
    expect(result).toBeCloseTo(0.34542169, 6);
  });

  it('returns highest similarity for same node (dog, dog)', () => {
    const result = li(g, 'dog', 'dog');
    expect(result).toBeCloseTo(0.7162978701990244, 8);
  });

  it('respects custom alpha and beta options', () => {
    const result = li(g, 'dog', 'cat', { alpha: 0.1, beta: 0.5 });
    expect(result).toBeCloseTo(0.37834953, 6);
  });
});
