import { describe, it, expect } from 'vitest';
import { simTBK, computeLambda } from './simTBK';
import { createSlimaniExample1, createTaxonomy } from './measures.test-helpers';

describe('simTBK', () => {
  const g = createTaxonomy();

  it('returns 1 for same node', () => {
    expect(simTBK(g, 'dog', 'dog')).toBe(1);
  });

  it('returns expected value for direct parent-child', () => {
    const result = simTBK(g, 'mammal', 'dog');
    expect(result).toBeCloseTo(0, 2);
  });

  it('returns expected value for grandparent-grandchild', () => {
    const result = simTBK(g, 'animal', 'dog');
    expect(result).toBeCloseTo(0, 2);
  });

  it('returns expected value for siblings', () => {
    const result = simTBK(g, 'dog', 'cat');
    expect(result).toBeCloseTo(0.5, 2);
  });

  it('returns expected value for cousins', () => {
    const result = simTBK(g, 'dog', 'penguin');
    expect(result).toBeCloseTo(0, 2);
  });

  it('returns 0 when no path exists', () => {
    const g = createTaxonomy();
    g.addNode('plant');
    expect(simTBK(g, 'dog', 'plant')).toBe(0);
  });

  it('handles nonexistent nodes gracefully', () => {
    const g = createTaxonomy();
    expect(simTBK(g, 'nonexistent1', 'nonexistent2')).toBe(0);
  });

  // extracted from Slimani et al. 2003
  it('returns expected value for c1 and c2 (same hierarchy, lambda=0)', () => {
    const g = createSlimaniExample1();
    expect(simTBK(g, 'c1', 'c2')).toBeCloseTo(0, 2);
  });

  it('returns expected value for c2 and c3 (neighborhood, lambda=1)', () => {
    const g = createSlimaniExample1();
    expect(simTBK(g, 'c2', 'c3')).toBeCloseTo(0.29, 2);
  });
});

describe('computeLambda', () => {
  const g = createTaxonomy();

  it('returns 1 for same node', () => {
    expect(computeLambda(g, 'dog', 'dog')).toBe(1);
  });

  it('returns 0 for parent-child (same hierarchy)', () => {
    expect(computeLambda(g, 'mammal', 'dog')).toBe(0);
  });

  it('returns 0 for child-parent (same hierarchy)', () => {
    expect(computeLambda(g, 'dog', 'mammal')).toBe(0);
  });

  it('returns 1 for siblings (neighborhood)', () => {
    expect(computeLambda(g, 'dog', 'cat')).toBe(1);
  });

  it('returns 1 for cousins (neighborhood)', () => {
    expect(computeLambda(g, 'dog', 'penguin')).toBe(1);
  });

  it('returns 1 for disconnected nodes', () => {
    const g = createTaxonomy();
    g.addNode('plant');
    expect(computeLambda(g, 'dog', 'plant')).toBe(1);
  });
});
