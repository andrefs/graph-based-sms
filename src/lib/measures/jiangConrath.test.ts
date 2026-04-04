import { describe, it, expect } from 'vitest';
import { jiangConrath } from './jiangConrath';
import { createTaxonomy, createTaxonomyParentToChild } from './measures.test-helpers';

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

const ic = createICMap();

describe('jiangConrath extra tests (childToParent)', () => {
  const g = createTaxonomy();

  it('returns 0 when no ic provided', () => {
    expect(jiangConrath(g, 'dog', 'cat', { edgeDirection: 'childToParent' })).toBe(0);
  });

  it('returns 0 when concept1 not in ic', () => {
    const partialIC = new Map<string, number>();
    partialIC.set('cat', 2);
    partialIC.set('mammal', 1);
    partialIC.set('animal', 0);
    expect(jiangConrath(g, 'dog', 'cat', { ic: partialIC, edgeDirection: 'childToParent' as const })).toBe(0);
  });

  it('returns 0 when concept2 not in ic', () => {
    const partialIC = new Map<string, number>();
    partialIC.set('dog', 2);
    partialIC.set('mammal', 1);
    partialIC.set('animal', 0);
    expect(jiangConrath(g, 'dog', 'cat', { ic: partialIC, edgeDirection: 'childToParent' as const })).toBe(0);
  });
});

describe('jiangConrath with IC map (childToParent)', () => {
  const g = createTaxonomy();
  const ic = createICMap();

  it('returns 0 for identical dog', () => {
    expect(jiangConrath(g, 'dog', 'dog', { ic, edgeDirection: 'childToParent' })).toBe(0);
  });

  it('returns 1 for mammal-dog', () => {
    expect(jiangConrath(g, 'mammal', 'dog', { ic, edgeDirection: 'childToParent' })).toBe(1);
  });

  it('returns 2 for animal-dog', () => {
    expect(jiangConrath(g, 'animal', 'dog', { ic, edgeDirection: 'childToParent' })).toBe(2);
  });

  it('returns 2 for dog-cat', () => {
    expect(jiangConrath(g, 'dog', 'cat', { ic, edgeDirection: 'childToParent' })).toBe(2);
  });

  it('returns 4 for dog-penguin', () => {
    expect(jiangConrath(g, 'dog', 'penguin', { ic, edgeDirection: 'childToParent' })).toBe(4);
  });
});

describe('jiangConrath with IC map (default parentToChild)', () => {
  const g = createTaxonomyParentToChild();
  const ic = createICMap();

  it('returns 0 for identical dog', () => {
    expect(jiangConrath(g, 'dog', 'dog', { ic })).toBe(0);
  });

  it('returns 1 for mammal-dog', () => {
    expect(jiangConrath(g, 'mammal', 'dog', { ic })).toBe(1);
  });

  it('returns 2 for animal-dog', () => {
    expect(jiangConrath(g, 'animal', 'dog', { ic })).toBe(2);
  });

  it('returns 2 for dog-cat', () => {
    expect(jiangConrath(g, 'dog', 'cat', { ic })).toBe(2);
  });

  it('returns 4 for dog-penguin', () => {
    expect(jiangConrath(g, 'dog', 'penguin', { ic })).toBe(4);
  });
});
