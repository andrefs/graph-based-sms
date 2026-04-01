import { describe, it, expect } from 'vitest';
import { simTBK, computeLambda } from './simTBK';
import { createSlimaniExample1, createTaxonomy, runMeasureTests } from './measures.test-helpers';

runMeasureTests('simTBK', simTBK);

// extracted from Slimani et al. 2003
describe('simTBK with SlimaniExample1', () => {
  it('returns expected value for c1 and c2 (same hierarchy, lambda=0)', () => {
    const g = createSlimaniExample1();
    expect(simTBK(g, 'c1', 'c2')).toBeCloseTo(0.4, 2);
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
