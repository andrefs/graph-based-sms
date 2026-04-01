import { describe, it, expect } from 'vitest';
import { wuPalmer } from './wuPalmer';
import { runMeasureTests, createSlimaniExample1 } from './measures.test-helpers';

runMeasureTests('wuPalmer', wuPalmer);

describe('wuPalmer', () => {
  // extracted from Slimani et al. 2003
  it('returns 0.4 for c1 and c2', () => {
    const g = createSlimaniExample1();
    expect(wuPalmer(g, 'c1', 'c2')).toBeCloseTo(0.4, 2);
  });

  it('returns 0.57 for c2 and c3', () => {
    const g = createSlimaniExample1();
    expect(wuPalmer(g, 'c2', 'c3')).toBeCloseTo(0.57, 2);
  });
});
