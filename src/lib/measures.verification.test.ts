import { describe, it, expect } from 'vitest';
import { MultiDirectedGraph } from 'graphology';
import {
  shortestPath,
  radaSimilarity,
  resnikEdge,
  wuPalmer,
  leacockChodorow,
  hirstStOnge,
} from './measures';

/**
 * Academic paper cross-validation tests.
 *
 * These tests verify implementations against formulas from original papers.
 */

const createTaxonomy = () => {
  const g = new MultiDirectedGraph();
  ['animal', 'mammal', 'bird', 'dog', 'cat', 'penguin'].forEach(n => g.addNode(n));
  g.addEdge('mammal', 'animal', { predicate: 'is-a' });
  g.addEdge('bird', 'animal', { predicate: 'is-a' });
  g.addEdge('dog', 'mammal', { predicate: 'is-a' });
  g.addEdge('cat', 'mammal', { predicate: 'is-a' });
  g.addEdge('penguin', 'bird', { predicate: 'is-a' });
  return g;
};

/*
 * Taxonomy structure:
 *       animal (depth 0)
 *       ^    ^
 *      /      \
 *    mammal  bird (depth 1)
 *     ^   ^    ^
 *    /     \    \
 *   dog   cat  penguin (depth 2)
 */

describe('academic paper verification', () => {
  const g = createTaxonomy();

  it('Rada (1989): shortest path distance', () => {
    // Definition 1: m(c1,c2) = length(sp(c1,c2))
    expect(shortestPath(g, 'dog', 'cat')).toBe(2); // dog->mammal->cat
    expect(shortestPath(g, 'dog', 'penguin')).toBe(4); // dog->mammal->animal->bird->penguin
  });

  it('Rezgui (2013): Rada similarity conversion', () => {
    // Equation (1): m(c1,c2) = 1/(1+length(sp))
    expect(radaSimilarity(g, 'dog', 'cat')).toBeCloseTo(1/3, 10);
    expect(radaSimilarity(g, 'dog', 'dog')).toBe(1); // length=0, 1/(1+0)=1
  });

  it('Resnik (1999): edge-based measure', () => {
    // Equation (5): m(c1,c2) = 2*D - length(sp)
    // D = 3 (maxDepth from animal to dog/cat/penguin)
    expect(resnikEdge(g, 'dog', 'cat', { maxDepth: 3 })).toBe(4); // 2*3 - 2
  });

  it('Wu & Palmer (1994): LCS depth measure', () => {
    // Unnumbered eq, p.136: 2*depth(LCS) / (2*depth(LCS) + path1 + path2)
    // dog-cat: LCS=mammal(depth=1), path1=1, path2=1
    // = 2*1 / (2*1 + 1 + 1) = 2/4 = 0.5
    expect(wuPalmer(g, 'dog', 'cat')).toBeCloseTo(0.5, 10);
  });

  it('Leacock & Chodorow (1998): path-based similarity', () => {
    // Unnumbered eq, p.275: log(2D) - log(N)
    // dog-cat: N=3 (nodes {dog,mammal,cat}), D=3
    // = log(6) - log(3)
    expect(leacockChodorow(g, 'dog', 'cat', { maxDepth: 3 }))
      .toBeCloseTo(Math.log(6) - Math.log(3), 10);
  });

  it('Hirst & St-Onge (1998): direction change measure', () => {
    // m(c1,c2) = C - length(sp) - k*d
    // dog-cat: path dog->mammal->cat, length=2, 1 direction change (UP->DOWN)
    // = 8 - 2 - 1*1 = 5
    expect(hirstStOnge(g, 'dog', 'cat', { C: 8, k: 1 })).toBe(5);
  });
});
