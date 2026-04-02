import { describe, it, expect } from 'vitest';
import { createTaxonomy, MAX_DEPTH } from './measures.test-helpers';
import { lin } from './lin';

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

describe('lin', () => {
  const g = createTaxonomy();
  const ic = createICMap();

  it('returns 0 when no ic provided', () => {
    expect(lin(g, 'dog', 'cat')).toBe(0);
  });

  it('returns 1 for same node', () => {
    expect(lin(g, 'dog', 'dog', { ic })).toBe(1);
  });

  it('returns expected value for siblings', () => {
    const result = lin(g, 'dog', 'cat', { ic });
    expect(result).toBeCloseTo((2 * 1) / (2 + 2), 5);
  });

  it('returns 0 for cousins with no common ancestor IC', () => {
    const result = lin(g, 'dog', 'penguin', { ic });
    expect(result).toBe(0);
  });

  it('returns expected value for parent-child', () => {
    const result = lin(g, 'mammal', 'dog', { ic });
    expect(result).toBeCloseTo((2 * 1) / (1 + 2), 5);
  });

  it('returns 0 when concept1 not in ic', () => {
    const partialIC = new Map<string, number>();
    partialIC.set('cat', 2);
    partialIC.set('mammal', 1);
    partialIC.set('animal', 0);
    expect(lin(g, 'dog', 'cat', { ic: partialIC })).toBe(0);
  });

  it('returns 0 when concept2 not in ic', () => {
    const partialIC = new Map<string, number>();
    partialIC.set('dog', 2);
    partialIC.set('mammal', 1);
    partialIC.set('animal', 0);
    expect(lin(g, 'dog', 'cat', { ic: partialIC })).toBe(0);
  });

  it('returns 0 when no path exists', () => {
    const g = createTaxonomy();
    g.addNode('plant');
    expect(lin(g, 'dog', 'plant', { ic })).toBe(0);
  });

  it('handles nonexistent nodes gracefully', () => {
    const g = createTaxonomy();
    expect(lin(g, 'nonexistent1', 'nonexistent2', { ic })).toBe(0);
  });
});