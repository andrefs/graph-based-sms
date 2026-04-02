import { describe, it, expect } from 'vitest';
import { createTaxonomy, MAX_DEPTH } from './measures.test-helpers';
import { jiangConrath } from './jiangConrath';

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

describe('jiangConrath', () => {
  const g = createTaxonomy();
  const ic = createICMap();

  it('returns 0 when no ic provided', () => {
    expect(jiangConrath(g, 'dog', 'cat')).toBe(0);
  });

  it('returns 0 for same node', () => {
    expect(jiangConrath(g, 'dog', 'dog', { ic })).toBe(0);
  });

  it('returns expected value for siblings', () => {
    const result = jiangConrath(g, 'dog', 'cat', { ic });
    expect(result).toBeCloseTo(2 + 2 - 2 * 1, 5);
  });

  it('returns sum of ICs for cousins with no common ancestor IC', () => {
    const result = jiangConrath(g, 'dog', 'penguin', { ic });
    expect(result).toBe(2 + 2);
  });

  it('returns expected value for parent-child', () => {
    const result = jiangConrath(g, 'mammal', 'dog', { ic });
    expect(result).toBeCloseTo(1 + 2 - 2 * 1, 5);
  });

  it('returns 0 when concept1 not in ic', () => {
    const partialIC = new Map<string, number>();
    partialIC.set('cat', 2);
    partialIC.set('mammal', 1);
    partialIC.set('animal', 0);
    expect(jiangConrath(g, 'dog', 'cat', { ic: partialIC })).toBe(0);
  });

  it('returns 0 when concept2 not in ic', () => {
    const partialIC = new Map<string, number>();
    partialIC.set('dog', 2);
    partialIC.set('mammal', 1);
    partialIC.set('animal', 0);
    expect(jiangConrath(g, 'dog', 'cat', { ic: partialIC })).toBe(0);
  });

  it('returns 0 when no path exists', () => {
    const g = createTaxonomy();
    g.addNode('plant');
    expect(jiangConrath(g, 'dog', 'plant', { ic })).toBe(0);
  });

  it('handles nonexistent nodes gracefully', () => {
    const g = createTaxonomy();
    expect(jiangConrath(g, 'nonexistent1', 'nonexistent2', { ic })).toBe(0);
  });
});