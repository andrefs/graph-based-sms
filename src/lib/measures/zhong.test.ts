import { describe, it, expect } from 'vitest';
import { MultiDirectedGraph } from 'graphology';
import { zhong } from './zhong';
import { runMeasureTests, runMeasureTestsDefault } from './measures.test-helpers';

runMeasureTests('zhong', zhong, { kZhong: 2 });
runMeasureTestsDefault('zhong', zhong, { kZhong: 2 });

describe('zhong (Zhong et al. 2002 paper example)', () => {
  // Example extracted from the original Zhong et al. (2002) paper.
  // The paper provides milestone values for an ontology segment:
  //   garment:  1/128  → depth 6  (since (1/2)/2^6 = 1/128)
  //   shirt, sweater:  1/256 → depth 7
  //   jersey, pullover:  1/512 → depth 8
  //
  // Taxonomy structure (childToParent direction):
  //   jersey → shirt → garment → r6 → r5 → r4 → r3 → r2 → r1
  //   pullover → sweater → garment → r6 → r5 → r4 → r3 → r2 → r1

  const createPaperTaxonomy = () => {
    const g = new MultiDirectedGraph();
    const nodes = ['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'garment', 'shirt', 'sweater', 'jersey', 'pullover'];
    nodes.forEach(n => g.addNode(n));
    g.addEdge('jersey', 'shirt', { predicate: 'is-a' });
    g.addEdge('pullover', 'sweater', { predicate: 'is-a' });
    g.addEdge('shirt', 'garment', { predicate: 'is-a' });
    g.addEdge('sweater', 'garment', { predicate: 'is-a' });
    g.addEdge('garment', 'r6', { predicate: 'is-a' });
    g.addEdge('r6', 'r5', { predicate: 'is-a' });
    g.addEdge('r5', 'r4', { predicate: 'is-a' });
    g.addEdge('r4', 'r3', { predicate: 'is-a' });
    g.addEdge('r3', 'r2', { predicate: 'is-a' });
    g.addEdge('r2', 'r1', { predicate: 'is-a' });
    return g;
  };

  it('returns correct value for (jersey, pullover) matching paper formula', () => {
    const g = createPaperTaxonomy();
    // d(jersey, pullover) with LCA=garment(depth 6), k=2
    //   milestone(n) = (1/2)/k^l(n)
    //   d = 2*milestone(garment) - milestone(jersey) - milestone(pullover)
    //   = 2/(2*2^6) - 1/(2*2^8) - 1/(2*2^8)
    //   = 1/64 - 1/512 - 1/512
    //   = 8/512 - 2/512
    //   = 6/512 = 3/256 ≈ 0.01171875
    const expected = 3 / 256;
    expect(zhong(g, 'jersey', 'pullover', { kZhong: 2, edgeDirection: 'childToParent' })).toBeCloseTo(expected, 5);
  });
});
