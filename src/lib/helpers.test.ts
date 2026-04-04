import { describe, it, expect } from 'vitest';
import { MultiDirectedGraph as Graph } from 'graphology';
import {
  bfsShortestPath,
  getShortestPathLength,
  getDepth,
  findLCAs,
  getPathLengthToAncestor,
  getAncestorSet,
} from './helpers';

describe('bfsShortestPath', () => {
  const createTaxonomy = () => {
    const g = new Graph();
    ['animal', 'mammal', 'bird', 'dog', 'cat', 'penguin'].forEach(n => g.addNode(n));
    g.addEdge('mammal', 'animal', { predicate: 'is-a' });
    g.addEdge('bird', 'animal', { predicate: 'is-a' });
    g.addEdge('dog', 'mammal', { predicate: 'is-a' });
    g.addEdge('cat', 'mammal', { predicate: 'is-a' });
    g.addEdge('penguin', 'bird', { predicate: 'is-a' });
    return g;
  };

  it('returns path for connected nodes', () => {
    const g = createTaxonomy();
    const result = bfsShortestPath(g, 'dog', 'cat');
    expect(result).toEqual(['dog', 'mammal', 'cat']);
  });

  it('returns single element array for same node', () => {
    const g = createTaxonomy();
    const result = bfsShortestPath(g, 'dog', 'dog');
    expect(result).toEqual(['dog']);
  });

  it('returns null for disconnected nodes', () => {
    const g = createTaxonomy();
    g.addNode('plant');
    const result = bfsShortestPath(g, 'dog', 'plant');
    expect(result).toBeNull();
  });

  it('returns null for nonexistent nodes', () => {
    const g = createTaxonomy();
    const result = bfsShortestPath(g, 'dog', 'nonexistent');
    expect(result).toBeNull();
  });

  it('finds path in reverse direction', () => {
    const g = createTaxonomy();
    const result = bfsShortestPath(g, 'cat', 'dog');
    expect(result).toEqual(['cat', 'mammal', 'dog']);
  });
});

describe('getShortestPathLength', () => {
  const createTaxonomy = () => {
    const g = new Graph();
    ['animal', 'mammal', 'bird', 'dog', 'penguin'].forEach(n => g.addNode(n));
    g.addEdge('mammal', 'animal', { predicate: 'is-a' });
    g.addEdge('bird', 'animal', { predicate: 'is-a' });
    g.addEdge('dog', 'mammal', { predicate: 'is-a' });
    g.addEdge('penguin', 'bird', { predicate: 'is-a' });
    return g;
  };

  it('returns 0 for same node', () => {
    const g = createTaxonomy();
    expect(getShortestPathLength(g, 'dog', 'dog')).toBe(0);
  });

  it('returns 1 for adjacent nodes', () => {
    const g = createTaxonomy();
    expect(getShortestPathLength(g, 'dog', 'mammal')).toBe(1);
  });

  it('returns 2 for nodes two edges apart', () => {
    const g = createTaxonomy();
    expect(getShortestPathLength(g, 'dog', 'animal')).toBe(2);
  });

  it('returns null for disconnected nodes', () => {
    const g = createTaxonomy();
    g.addNode('plant');
    expect(getShortestPathLength(g, 'dog', 'plant')).toBeNull();
  });
});

describe('getDepth', () => {
  const createTaxonomy = () => {
    const g = new Graph();
    ['animal', 'mammal', 'bird', 'dog'].forEach(n => g.addNode(n));
    g.addEdge('mammal', 'animal', { predicate: 'is-a' });
    g.addEdge('bird', 'animal', { predicate: 'is-a' });
    g.addEdge('dog', 'mammal', { predicate: 'is-a' });
    return g;
  };

  it('returns 0 for root node', () => {
    const g = createTaxonomy();
    expect(getDepth(g, 'animal', undefined, 'childToParent')).toBe(0);
  });

  it('returns 1 for direct child of root', () => {
    const g = createTaxonomy();
    expect(getDepth(g, 'mammal', undefined, 'childToParent')).toBe(1);
  });

  it('returns 2 for grandchild', () => {
    const g = createTaxonomy();
    expect(getDepth(g, 'dog', undefined, 'childToParent')).toBe(2);
  });

  it('returns 0 for nonexistent node', () => {
    const g = createTaxonomy();
    expect(getDepth(g, 'nonexistent')).toBe(0);
  });
});

describe('findLCAs', () => {
  const createTaxonomy = () => {
    const g = new Graph();
    ['animal', 'mammal', 'bird', 'dog', 'cat', 'penguin'].forEach(n => g.addNode(n));
    g.addEdge('mammal', 'animal', { predicate: 'is-a' });
    g.addEdge('bird', 'animal', { predicate: 'is-a' });
    g.addEdge('dog', 'mammal', { predicate: 'is-a' });
    g.addEdge('cat', 'mammal', { predicate: 'is-a' });
    g.addEdge('penguin', 'bird', { predicate: 'is-a' });
    return g;
  };

  it('returns node itself for same node', () => {
    const g = createTaxonomy();
    expect(findLCAs(g, 'dog', 'dog', undefined, 'childToParent')).toContain('dog');
  });

  it('returns parent for siblings', () => {
    const g = createTaxonomy();
    const result = findLCAs(g, 'dog', 'cat', undefined, 'childToParent');
    expect(result).toContain('mammal');
  });

  it('returns root for cousins', () => {
    const g = createTaxonomy();
    const result = findLCAs(g, 'dog', 'penguin', undefined, 'childToParent');
    expect(result).toContain('animal');
  });

  it('returns ancestor for parent-child', () => {
    const g = createTaxonomy();
    const result = findLCAs(g, 'dog', 'mammal', undefined, 'childToParent');
    expect(result).toContain('mammal');
  });

  it('returns empty array for disconnected nodes', () => {
    const g = createTaxonomy();
    g.addNode('plant');
    expect(findLCAs(g, 'dog', 'plant', undefined, 'childToParent')).toEqual([]);
  });
});

describe('getPathLengthToAncestor', () => {
  const createTaxonomy = () => {
    const g = new Graph();
    ['animal', 'mammal', 'bird', 'dog', 'penguin'].forEach(n => g.addNode(n));
    g.addEdge('mammal', 'animal', { predicate: 'is-a' });
    g.addEdge('bird', 'animal', { predicate: 'is-a' });
    g.addEdge('dog', 'mammal', { predicate: 'is-a' });
    g.addEdge('penguin', 'bird', { predicate: 'is-a' });
    return g;
  };

  it('returns 0 when node is the ancestor', () => {
    const g = createTaxonomy();
    expect(getPathLengthToAncestor(g, 'mammal', 'mammal', undefined, 'childToParent')).toBe(0);
  });

  it('returns 1 for direct parent', () => {
    const g = createTaxonomy();
    expect(getPathLengthToAncestor(g, 'dog', 'mammal', undefined, 'childToParent')).toBe(1);
  });

  it('returns 2 for grandparent', () => {
    const g = createTaxonomy();
    expect(getPathLengthToAncestor(g, 'dog', 'animal', undefined, 'childToParent')).toBe(2);
  });

  it('returns null when not an ancestor', () => {
    const g = createTaxonomy();
    expect(getPathLengthToAncestor(g, 'dog', 'bird', undefined, 'childToParent')).toBeNull();
  });

  it('returns null for nonexistent ancestor', () => {
    const g = createTaxonomy();
    expect(getPathLengthToAncestor(g, 'dog', 'nonexistent', undefined, 'childToParent')).toBeNull();
  });
});

describe('getAncestorSet', () => {
  const createTaxonomy = () => {
    const g = new Graph();
    ['animal', 'mammal', 'bird', 'dog', 'cat', 'penguin'].forEach(n => g.addNode(n));
    g.addEdge('mammal', 'animal', { predicate: 'is-a' });
    g.addEdge('bird', 'animal', { predicate: 'is-a' });
    g.addEdge('dog', 'mammal', { predicate: 'is-a' });
    g.addEdge('cat', 'mammal', { predicate: 'is-a' });
    g.addEdge('penguin', 'bird', { predicate: 'is-a' });
    return g;
  };

  it('returns set containing node itself', () => {
    const g = createTaxonomy();
    const result = getAncestorSet(g, 'dog', undefined, 'childToParent');
    expect(result).toContain('dog');
  });

  it('returns all ancestors including self', () => {
    const g = createTaxonomy();
    const result = getAncestorSet(g, 'dog', undefined, 'childToParent');
    expect(result).toContain('dog');
    expect(result).toContain('mammal');
    expect(result).toContain('animal');
  });

  it('returns root only for root node', () => {
    const g = createTaxonomy();
    const result = getAncestorSet(g, 'animal', undefined, 'childToParent');
    expect(result).toEqual(new Set(['animal']));
  });

  it('returns empty set for nonexistent node', () => {
    const g = createTaxonomy();
    const result = getAncestorSet(g, 'nonexistent');
    expect(result).toEqual(new Set());
  });

  it('filters by predicates', () => {
    const g = createTaxonomy();
    g.addNode('feline');
    g.addEdge('feline', 'mammal', { predicate: 'related-to' });
    g.addEdge('cat', 'feline', { predicate: 'is-a' });
    const result = getAncestorSet(g, 'cat', 'is-a', 'childToParent');
    expect(result).toContain('cat');
    expect(result).toContain('feline');
    expect(result).toContain('mammal');
    expect(result).toContain('animal');
  });
});
