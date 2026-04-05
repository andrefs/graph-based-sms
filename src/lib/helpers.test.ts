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

  it('returns 0 for same node', () => {
    const g = createTaxonomy();
    expect(getPathLengthToAncestor(g, 'dog', 'dog')).toBe(0);
  });
});

describe('findLCAs edge cases', () => {
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

  it('returns node itself when comparing same node', () => {
    const g = createTaxonomy();
    const lcas = findLCAs(g, 'dog', 'dog');
    expect(lcas).toContain('dog');
  });

  it('finds multiple LCAs in diamond graph', () => {
    const g = new Graph();
    ['root', 'A', 'B', 'C'].forEach(n => g.addNode(n));
    g.addEdge('A', 'root', { predicate: 'is-a' });
    g.addEdge('B', 'root', { predicate: 'is-a' });
    g.addEdge('C', 'A', { predicate: 'is-a' });
    g.addEdge('C', 'B', { predicate: 'is-a' });
    const lcas = findLCAs(g, 'A', 'B', undefined, 'childToParent');
    expect(lcas).toContain('root');
  });
});

describe('Multiple edges with different predicates', () => {
  const createMultiEdgeTaxonomy = () => {
    const g = new Graph();
    ['a', 'b', 'c'].forEach(n => g.addNode(n));
    // Multiple edges from a to b with different predicates (a is parent of b)
    g.addEdge('a', 'b', { predicate: 'is-a' });
    g.addEdge('a', 'b', { predicate: 'part-of' });
    // b to c edge (b is parent of c)
    g.addEdge('b', 'c', { predicate: 'is-a' });
    return g;
  };

  it('getDepth filters by predicate correctly', () => {
    const g = createMultiEdgeTaxonomy();
    // With 'is-a' predicate: depth should be 2 (c->b->a via is-a edges)
    expect(getDepth(g, 'c', 'is-a', 'parentToChild')).toBe(2);
    // With 'part-of' only: c->b edge is 'is-a', doesn't match 'part-of', so c cannot reach a. Depth is 0 (only self)
    expect(getDepth(g, 'c', 'part-of', 'parentToChild')).toBe(0);
  });

  it('findLCAs uses correct edge based on predicate', () => {
    const g = createMultiEdgeTaxonomy();
    // For a and c, LCA should be a itself when using is-a (path c->b->a via is-a)
    expect(findLCAs(g, 'a', 'c', 'is-a', 'parentToChild')).toContain('a');
    // With part-of only: no valid path from c to a, so no LCA besides potentially self but they are different nodes
    expect(findLCAs(g, 'a', 'c', 'part-of', 'parentToChild')).toEqual([]);
  });

  it('getAncestorSet respects predicate', () => {
    const g = createMultiEdgeTaxonomy();
    const ancestorsC_isA = getAncestorSet(g, 'c', 'is-a', 'parentToChild');
    expect(ancestorsC_isA).toContain('b');
    expect(ancestorsC_isA).toContain('a');

    const ancestorsC_partOf = getAncestorSet(g, 'c', 'part-of', 'parentToChild');
    expect(ancestorsC_partOf).not.toContain('b');
    expect(ancestorsC_partOf).not.toContain('a');
    expect(ancestorsC_partOf.has('c')).toBe(true);
  });

  it('getPathLengthToAncestor picks edge with matching predicate', () => {
    const g = createMultiEdgeTaxonomy();
    expect(getPathLengthToAncestor(g, 'c', 'a', 'is-a', 'parentToChild')).toBe(2);
    expect(getPathLengthToAncestor(g, 'c', 'a', 'part-of', 'parentToChild')).toBeNull();
  });

  it('bfsShortestPath respects predicate filter', () => {
    const g = createMultiEdgeTaxonomy();
    const path = bfsShortestPath(g, 'c', 'a', 'is-a');
    expect(path).toEqual(['c', 'b', 'a']);

    const noPath = bfsShortestPath(g, 'c', 'a', 'part-of');
    expect(noPath).toBeNull();
  });

  it('selects edge from opposite direction when needed', () => {
    // Test where matching edge exists only in reverse direction (relative to traversal)
    const g = new Graph();
    ['x', 'y'].forEach(n => g.addNode(n));
    g.addEdge('x', 'y', { predicate: 'is-a' }); // x -> y
    // Traversing from y to x: in parentToChild mode, y's inbound neighbors include x because edge is x->y.
    // The edge between x and y exists in x->y direction, but we're checking from y (current) to x (neighbor).
    // findEdgeWithPredicate should find it by checking both directions.
    expect(findLCAs(g, 'x', 'y', 'is-a', 'parentToChild')).toContain('x');
  });

  it('handles multiple edges with same predicate', () => {
    const g = new Graph();
    ['p', 'q'].forEach(n => g.addNode(n));
    // In parentToChild, edges point parent->child. To have q be a child of p, add edge p->q.
    g.addEdge('p', 'q', { predicate: 'is-a' });
    g.addEdge('p', 'q', { predicate: 'is-a' }); // duplicate with same predicate
    // Depth of q should be 1 (one parent)
    expect(getDepth(g, 'q', 'is-a', 'parentToChild')).toBe(1);
  });
});

describe('Multi-edge deterministic behavior (same predicate)', () => {
  it('returns consistent result for duplicate edges with same predicate', () => {
    const g = new Graph();
    ['p', 'q'].forEach(n => g.addNode(n));
    g.addEdge('p', 'q', { predicate: 'is-a' });
    g.addEdge('p', 'q', { predicate: 'is-a' });
    // Should consistently return depth 1 regardless of edge order
    const result = getDepth(g, 'q', 'is-a', 'parentToChild');
    expect(result).toBe(1);
  });

  it('handles edges in both directions with same predicate deterministically', () => {
    const g = new Graph();
    ['x', 'y'].forEach(n => g.addNode(n));
    g.addEdge('x', 'y', { predicate: 'is-a' });
    g.addEdge('y', 'x', { predicate: 'is-a' });
    // Should find LCA correctly and deterministically
    const result = findLCAs(g, 'x', 'y', 'is-a', 'parentToChild');
    expect(result).toContain('x');
    expect(result).toContain('y');
  });

  it('predicate filter works with multiple duplicate edges', () => {
    const g = new Graph();
    ['a', 'b', 'c'].forEach(n => g.addNode(n));
    g.addEdge('a', 'b', { predicate: 'is-a' });
    g.addEdge('a', 'b', { predicate: 'is-a' }); // duplicate
    g.addEdge('b', 'c', { predicate: 'part-of' });
    g.addEdge('b', 'c', { predicate: 'part-of' }); // duplicate

    const ancestors = getAncestorSet(g, 'c', 'is-a', 'parentToChild');
    expect(ancestors.has('b')).toBe(false); // b->c is part-of, not is-a
    expect(ancestors.has('a')).toBe(false);
  });

  it('deterministic selection: sorted order ensures consistent first match', () => {
    const g = new Graph();
    ['root', 'child'].forEach(n => g.addNode(n));
    // Add edges in reverse alphabetical order to test sorting
    g.addEdge('root', 'child', { predicate: 'is-a' });
    g.addEdge('child', 'root', { predicate: 'is-a' });
    // LCA should include both nodes regardless of traversal direction
    const lcas = findLCAs(g, 'root', 'child', 'is-a', 'parentToChild');
    expect(lcas).toContain('root');
    expect(lcas).toContain('child');
  });
});

describe('Bidirectional edge direction bug', () => {
  it('getDepth does not follow reverse-direction edge with different predicate', () => {
    // Bug: When both directions exist with different predicates,
    // the traversal should only consider the edge in the traversal direction.
    const g = new Graph();
    ['A', 'B'].forEach(n => g.addNode(n));
    // A→B with 'is-a' (A is parent of B via is-a)
    g.addEdge('A', 'B', { predicate: 'is-a' });
    // B→A with 'part-of' (B part-of A)
    g.addEdge('B', 'A', { predicate: 'part-of' });

    // B's inbound neighbors: {A} (due to A→B)
    // For 'part-of' predicate, we should NOT traverse B→A because that edge
    // goes opposite to the inbound direction (it's B→A, not A→B).
    // Expected: B has no part-of ancestors, depth = 0.
    expect(getDepth(g, 'B', 'part-of', 'parentToChild')).toBe(0);
  });

  it('findLCAs respects edge direction with mixed predicates', () => {
    const g = new Graph();
    ['A', 'B'].forEach(n => g.addNode(n));
    g.addEdge('A', 'B', { predicate: 'is-a' });
    g.addEdge('B', 'A', { predicate: 'part-of' });

    // With 'part-of' predicate, B is an ancestor of A (via B->A), but A is not an ancestor of B.
    // Therefore the only common ancestor is B itself.
    const lcas = findLCAs(g, 'A', 'B', 'part-of', 'parentToChild');
    expect(lcas).toContain('B');
    // A should not be in LCA set.
    expect(lcas).not.toContain('A');
  });

  it('getAncestorSet respects edge direction with mixed predicates', () => {
    const g = new Graph();
    ['A', 'B'].forEach(n => g.addNode(n));
    g.addEdge('A', 'B', { predicate: 'is-a' });
    g.addEdge('B', 'A', { predicate: 'part-of' });

    const ancestors = getAncestorSet(g, 'B', 'part-of', 'parentToChild');
    // Should only include B; A is not a part-of ancestor
    expect(ancestors).toEqual(new Set(['B']));
  });

  it('getPathLengthToAncestor ignores reverse-direction edge', () => {
    const g = new Graph();
    ['A', 'B'].forEach(n => g.addNode(n));
    g.addEdge('A', 'B', { predicate: 'is-a' });
    g.addEdge('B', 'A', { predicate: 'part-of' });

    // No part-of path from B to A
    expect(getPathLengthToAncestor(g, 'B', 'A', 'part-of', 'parentToChild')).toBeNull();
  });
});

describe('Predicate edge cases and array handling', () => {
  it('handles predicates as array (multiple allowed predicates)', () => {
    const g = new Graph();
    ['a', 'b', 'c'].forEach(n => g.addNode(n));
    g.addEdge('a', 'b', { predicate: 'is-a' });
    g.addEdge('b', 'c', { predicate: 'part-of' });
    g.addEdge('c', 'a', { predicate: 'related-to' });

    // Should find path when one of the predicates matches
    const path = bfsShortestPath(g, 'a', 'c', ['is-a', 'part-of']);
    expect(path).toEqual(['a', 'b', 'c']);
  });

  it('filters out edges without predicate attribute', () => {
    const g = new Graph();
    ['x', 'y'].forEach(n => g.addNode(n));
    g.addEdge('x', 'y', {}); // no predicate
    g.addEdge('x', 'y', { predicate: 'is-a' });

    const path = bfsShortestPath(g, 'x', 'y', 'is-a');
    expect(path).toEqual(['x', 'y']);

    // No predicate filter should match any edge (including those with no predicate)
    const pathAny = bfsShortestPath(g, 'x', 'y');
    expect(pathAny).toEqual(['x', 'y']);
  });

  it('returns null when no edges match the predicate filter', () => {
    const g = new Graph();
    ['p', 'q'].forEach(n => g.addNode(n));
    g.addEdge('p', 'q', { predicate: 'is-a' });

    const result = bfsShortestPath(g, 'p', 'q', 'part-of');
    expect(result).toBeNull();
  });

  it('handles empty predicates array', () => {
    const g = new Graph();
    ['m', 'n'].forEach(n => g.addNode(n));
    g.addEdge('m', 'n', { predicate: 'is-a' });

    // Empty array means no predicates allowed; should not match any edge with a predicate
    const result = bfsShortestPath(g, 'm', 'n', []);
    expect(result).toBeNull();
  });

  it('getAncestorSet respects predicate priority with multiple edges', () => {
    const g = new Graph();
    ['root', 'child'].forEach(n => g.addNode(n));
    g.addEdge('root', 'child', { predicate: 'part-of' });
    g.addEdge('root', 'child', { predicate: 'is-a' });
    g.addEdge('root', 'child', { predicate: 'related-to' });

    // Without filter, should include child (predicate 'is-a' is first alphabetically)
    const ancestorsAny = getAncestorSet(g, 'child', undefined, 'parentToChild');
    expect(ancestorsAny.has('root')).toBe(true);

    // With 'related-to' filter, should still work
    const ancestorsRel = getAncestorSet(g, 'child', 'related-to', 'parentToChild');
    expect(ancestorsRel.has('root')).toBe(true);
  });

  it('edges with no predicate are considered when no filter is applied', () => {
    const g = new Graph();
    ['a', 'b'].forEach(n => g.addNode(n));
    g.addEdge('a', 'b', {}); // no predicate

    const path = bfsShortestPath(g, 'a', 'b');
    expect(path).toEqual(['a', 'b']);
  });

  it('predicate filter excludes edges without predicate', () => {
    const g = new Graph();
    ['x', 'y'].forEach(n => g.addNode(n));
    g.addEdge('x', 'y', {}); // no predicate
    g.addEdge('x', 'y', { predicate: 'is-a' });

    // Only is-a should match
    const path = bfsShortestPath(g, 'x', 'y', 'is-a');
    expect(path).toEqual(['x', 'y']);
  });
});
