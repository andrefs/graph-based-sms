import { describe, it, expect } from 'vitest';
import { li } from './li';
import { createTaxonomy, createTaxonomyParentToChild } from './measures.test-helpers';

describe('li extra tests (childToParent)', () => {
  const g = createTaxonomy();
  const baseOptions = { edgeDirection: 'childToParent' as const };
  it('respects custom alpha and beta options', () => {
    expect(li(g, 'dog', 'cat', { ...baseOptions, alpha: 0.1, beta: 0.5 })).toBeCloseTo(0.37834953, 6);
  });
});

describe('li (childToParent)', () => {
  const g = createTaxonomy();

  it('returns expected values for default alpha/beta (0.2, 0.45)', () => {
    // dog-dog
    expect(li(g, 'dog', 'dog', { edgeDirection: 'childToParent' })).toBeCloseTo(0.716298, 5);
    // mammal-dog
    expect(li(g, 'mammal', 'dog', { edgeDirection: 'childToParent' })).toBeCloseTo(0.345422, 5);
    // dog-cat
    expect(li(g, 'dog', 'cat', { edgeDirection: 'childToParent' })).toBeCloseTo(0.282807, 5);
    // animal-dog (0)
    expect(li(g, 'animal', 'dog', { edgeDirection: 'childToParent' })).toBe(0);
    // dog-penguin (0)
    expect(li(g, 'dog', 'penguin', { edgeDirection: 'childToParent' })).toBe(0);
  });
});

describe('li extra tests (default parentToChild)', () => {
  const g = createTaxonomyParentToChild();
  it('respects custom alpha and beta options', () => {
    expect(li(g, 'dog', 'cat', { alpha: 0.1, beta: 0.5 })).toBeCloseTo(0.37834953, 6);
  });
});

describe('li (default parentToChild)', () => {
  const g = createTaxonomyParentToChild();

  it('returns expected values for default alpha/beta (0.2, 0.45)', () => {
    // dog-dog
    expect(li(g, 'dog', 'dog')).toBeCloseTo(0.716298, 5);
    // mammal-dog
    expect(li(g, 'mammal', 'dog')).toBeCloseTo(0.345422, 5);
    // dog-cat
    expect(li(g, 'dog', 'cat')).toBeCloseTo(0.282807, 5);
    // animal-dog (0)
    expect(li(g, 'animal', 'dog')).toBe(0);
    // dog-penguin (0)
    expect(li(g, 'dog', 'penguin')).toBe(0);
  });
});
