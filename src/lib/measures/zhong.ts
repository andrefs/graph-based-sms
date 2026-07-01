import type { EdgeDirection, MeasureFunction } from '../types';
import { getDepth, findLCAs, getPathLengthToAncestor } from '../helpers';

export const zhong: MeasureFunction = (graph, concept1, concept2, options = {}) => {
  const edgeDirection: EdgeDirection = options.edgeDirection ?? 'parentToChild';
  const k = options.kZhong ?? 2;

  if (k <= 1) {
    return 0;
  }

  const lcas = findLCAs(graph, concept1, concept2, options.predicates, edgeDirection);

  if (lcas.length === 0) {
    return 0;
  }

  // Find the deepest (most specific) common ancestor
  let bestDepthLCA = -1;
  let deepestLCA: string | null = null;

  for (const lca of lcas) {
    const depthLCA = getDepth(graph, lca, options.predicates, edgeDirection);
    if (depthLCA > bestDepthLCA) {
      bestDepthLCA = depthLCA;
      deepestLCA = lca;
    }
  }

  if (deepestLCA === null) return 0;

  // Compute concept depths along the path through the deepest LCA
  // This ensures depth(concept) >= depth(LCA), fixing the zero-score bug in DAGs
  const path1 = getPathLengthToAncestor(graph, concept1, deepestLCA, options.predicates, edgeDirection);
  const path2 = getPathLengthToAncestor(graph, concept2, deepestLCA, options.predicates, edgeDirection);

  if (path1 === null || path2 === null) return 0;

  const depth1 = bestDepthLCA + path1;
  const depth2 = bestDepthLCA + path2;

  // milestone(n) = (1/2) / k^l(n)  where l(n) is the depth of node n
  // d(c1,c2) = 2*milestone(ccp) - milestone(c1) - milestone(c2)
  // Source: Zhong et al. (2002), unnumbered equation on the fifth page.
  const milestone = (depth: number) => 1 / (2 * Math.pow(k, depth));
  const score = 2 * milestone(bestDepthLCA) - milestone(depth1) - milestone(depth2);

  return score;
};
