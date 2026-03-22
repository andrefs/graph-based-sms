import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { MultiDirectedGraph } from 'graphology';
import {
  shortestPath,
  radaSimilarity,
  resnikEdge,
  wuPalmer,
  leacockChodorow,
  hirstStOnge,
} from './measures';

const NODE_NAMES = ['n0', 'n1', 'n2', 'n3', 'n4', 'n5', 'n6', 'n7'];

const treeArb = fc.array(
  fc.tuple(fc.constantFrom(...NODE_NAMES), fc.constantFrom(...NODE_NAMES)),
  { minLength: 1, maxLength: 10 }
).map(edges => {
  const g = new MultiDirectedGraph();
  const nodes = new Set<string>();
  edges.forEach(([parent, child]) => {
    if (parent !== child) {
      nodes.add(parent);
      nodes.add(child);
    }
  });
  nodes.forEach(n => g.addNode(n));
  edges.forEach(([parent, child]) => {
    if (parent !== child && !g.hasEdge(child, parent)) {
      g.addEdge(child, parent, { predicate: 'is-a' });
    }
  });
  return { graph: g, nodes: Array.from(nodes) };
});

describe('Property-based tests', () => {
  it('P1: shortestPath is symmetric', () => {
    fc.assert(
      fc.property(treeArb, ({ graph, nodes }) => {
        if (nodes.length < 2) return true;
        const a = nodes[0];
        const b = nodes[1];
        const ab = shortestPath(graph, a, b);
        const ba = shortestPath(graph, b, a);
        return ab === ba;
      })
    );
  });

  it('P1: radaSimilarity is symmetric', () => {
    fc.assert(
      fc.property(treeArb, ({ graph, nodes }) => {
        if (nodes.length < 2) return true;
        const a = nodes[0];
        const b = nodes[1];
        return radaSimilarity(graph, a, b) === radaSimilarity(graph, b, a);
      })
    );
  });

  it('P2: radaSimilarity(a,a) = 1', () => {
    fc.assert(
      fc.property(treeArb, ({ graph, nodes }) => {
        if (nodes.length === 0) return true;
        return radaSimilarity(graph, nodes[0], nodes[0]) === 1;
      })
    );
  });

  it('P2: shortestPath(a,a) = 0', () => {
    fc.assert(
      fc.property(treeArb, ({ graph, nodes }) => {
        if (nodes.length === 0) return true;
        return shortestPath(graph, nodes[0], nodes[0]) === 0;
      })
    );
  });

  it('P3: radaSimilarity decreases with path length', () => {
    fc.assert(
      fc.property(treeArb, ({ graph, nodes }) => {
        if (nodes.length < 2) return true;
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const sim = radaSimilarity(graph, nodes[i], nodes[j]);
            const path = shortestPath(graph, nodes[i], nodes[j]);
            if (path > 0) {
              const expected = 1 / (1 + path);
              if (Math.abs(sim - expected) > 1e-10) return false;
            }
          }
        }
        return true;
      })
    );
  });

  it('P4: radaSimilarity is in [0, 1]', () => {
    fc.assert(
      fc.property(treeArb, ({ graph, nodes }) => {
        if (nodes.length < 2) return true;
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i; j < nodes.length; j++) {
            const sim = radaSimilarity(graph, nodes[i], nodes[j]);
            if (sim < 0 || sim > 1) return false;
          }
        }
        return true;
      })
    );
  });

  it('P4: wuPalmer is in [0, 1]', () => {
    fc.assert(
      fc.property(treeArb, ({ graph, nodes }) => {
        if (nodes.length < 2) return true;
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i; j < nodes.length; j++) {
            const sim = wuPalmer(graph, nodes[i], nodes[j]);
            if (sim < 0 || sim > 1) return false;
          }
        }
        return true;
      })
    );
  });

  it('P5: disconnected nodes return 0', () => {
    fc.assert(
      fc.property(
        treeArb,
        ({ graph, nodes }) => {
          if (nodes.length === 0) return true;
          const isolated = 'isolated_node_xyz';
          graph.addNode(isolated);
          return shortestPath(graph, nodes[0], isolated) === 0 &&
                 radaSimilarity(graph, nodes[0], isolated) === 0;
        }
      )
    );
  });
});
