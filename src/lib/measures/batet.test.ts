import { describe, it, expect } from 'vitest';
import { MultiDirectedGraph } from 'graphology';
import { batet, _batetCommonInfo } from './batet';
import { createTaxonomy } from './measures.test-helpers';

describe('batet', () => {
  const g = createTaxonomy();

  it('returns 0 for same node', () => {
    expect(batet(g, 'dog', 'dog')).toBe(0);
  });

  it('returns expected value for siblings', () => {
    const result = batet(g, 'dog', 'cat');
    const dogAncestors = new Set(['dog', 'mammal', 'animal']);
    const catAncestors = new Set(['cat', 'mammal', 'animal']);
    const union = new Set([...dogAncestors, ...catAncestors]);
    const intersection = new Set([...dogAncestors].filter(x => catAncestors.has(x)));
    const expected = -Math.log2((union.size - intersection.size) / union.size);
    expect(result).toBeCloseTo(expected, 5);
  });

  it('returns expected value for cousins', () => {
    const result = batet(g, 'dog', 'penguin');
    const dogAncestors = new Set(['dog', 'mammal', 'animal']);
    const penguinAncestors = new Set(['penguin', 'bird', 'animal']);
    const union = new Set([...dogAncestors, ...penguinAncestors]);
    const intersection = new Set([...dogAncestors].filter(x => penguinAncestors.has(x)));
    const expected = -Math.log2((union.size - intersection.size) / union.size);
    expect(result).toBeCloseTo(expected, 5);
  });

  it('returns 0 when no path exists', () => {
    const g = createTaxonomy();
    g.addNode('plant');
    expect(batet(g, 'dog', 'plant')).toBe(0);
  });

  it('handles nonexistent nodes gracefully', () => {
    const g = createTaxonomy();
    expect(batet(g, 'nonexistent1', 'nonexistent2')).toBe(0);
  });

  it('handles single node graph', () => {
    const g = new MultiDirectedGraph();
    g.addNode('only');
    expect(batet(g, 'only', 'only')).toBe(0);
  });
});

describe('_batetCommonInfo', () => {
  // example extracted from paper
  const createBatetExample = () => {
    const g = new MultiDirectedGraph();
    ['x', 'c3', 'c4', 'c1', 'c2'].forEach(n => g.addNode(n));
    g.addEdge('c3', 'x', { predicate: 'is-a' });
    g.addEdge('c4', 'x', { predicate: 'is-a' });
    g.addEdge('c1', 'c3', { predicate: 'is-a' });
    g.addEdge('c2', 'c3', { predicate: 'is-a' });
    return g;
  };

  // example extracted from paper
  it('returns 0.5 for siblings c1 and c2', () => {
    const g = createBatetExample();
    expect(_batetCommonInfo(g, 'c1', 'c2')).toBeCloseTo(0.5, 5);
  });

  // example extracted from paper
  it('returns 2/3 for cousins c3 and c4', () => {
    const g = createBatetExample();
    expect(_batetCommonInfo(g, 'c3', 'c4')).toBeCloseTo(2 / 3, 5);
  });

  it('returns 0 for same node', () => {
    const g = createBatetExample();
    expect(_batetCommonInfo(g, 'c1', 'c1')).toBe(0);
  });

  it('returns 1 when no path exists (max distance)', () => {
    const g = createBatetExample();
    g.addNode('y');
    expect(_batetCommonInfo(g, 'c1', 'y')).toBe(1);
  });
});
