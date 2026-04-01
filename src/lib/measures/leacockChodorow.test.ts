import { describe, it, expect } from 'vitest';
import { leacockChodorow } from './leacockChodorow';
import { runMeasureTests, MAX_DEPTH, createTaxonomy } from './measures.test-helpers';

runMeasureTests('leacockChodorow', leacockChodorow, { maxDepth: MAX_DEPTH });

describe('leacockChodorow', () => {
  it('returns 0 without maxDepth', () => {
    const g = createTaxonomy();
    expect(leacockChodorow(g, 'dog', 'cat')).toBe(0);
  });
});
