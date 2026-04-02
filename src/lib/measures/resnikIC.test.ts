import { describe, it, expect } from 'vitest';
import { createTaxonomy, MAX_DEPTH } from './measures.test-helpers';
import { resnikIC } from './resnikIC';

const createICMap = () => {
  const ic = new Map<string, number>();
  ic.set('animal', 0);
  ic.set('mammal', 1);
  ic.set('bird', 1);
  ic.set('dog', 2);
  ic.set('cat', 2);
  ic.set('penguin', 2);
  return ic;
};

describe('resnikIC', () => {
  const g = createTaxonomy();
  const ic = createICMap();

  it('returns 0 when no ic provided', () => {
    expect(resnikIC(g, 'dog', 'cat')).toBe(0);
  });

  it('returns IC of same node for same node', () => {
    expect(resnikIC(g, 'dog', 'dog', { ic })).toBe(2);
  });

  it('returns IC of LCS for siblings', () => {
    expect(resnikIC(g, 'dog', 'cat', { ic })).toBe(1);
  });

  it('returns IC of LCS for cousins', () => {
    expect(resnikIC(g, 'dog', 'penguin', { ic })).toBe(0);
  });

  it('returns IC of parent for parent-child', () => {
    expect(resnikIC(g, 'mammal', 'dog', { ic })).toBe(1);
  });

  it('returns IC of grandparent for grandparent-grandchild', () => {
    expect(resnikIC(g, 'animal', 'dog', { ic })).toBe(0);
  });

  it('returns 0 when concept1 not in ic', () => {
    const partialIC = new Map<string, number>();
    partialIC.set('cat', 2);
    partialIC.set('mammal', 1);
    partialIC.set('animal', 0);
    expect(resnikIC(g, 'dog', 'cat', { ic: partialIC })).toBe(0);
  });

  it('returns 0 when concept2 not in ic', () => {
    const partialIC = new Map<string, number>();
    partialIC.set('dog', 2);
    partialIC.set('mammal', 1);
    partialIC.set('animal', 0);
    expect(resnikIC(g, 'dog', 'cat', { ic: partialIC })).toBe(0);
  });

  it('returns 0 when no path exists', () => {
    const g = createTaxonomy();
    g.addNode('plant');
    expect(resnikIC(g, 'dog', 'plant', { ic })).toBe(0);
  });

  it('handles nonexistent nodes gracefully', () => {
    const g = createTaxonomy();
    expect(resnikIC(g, 'nonexistent1', 'nonexistent2', { ic })).toBe(0);
  });
});