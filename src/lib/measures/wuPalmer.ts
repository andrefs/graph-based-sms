import type { ExtraOptions, MeasureFunction } from '../types';
import { getDepth, findLCAs, getPathLengthToAncestor } from '../helpers';

export const wuPalmer: MeasureFunction = (graph, concept1, concept2, options = {}) => {
  const lcas = findLCAs(graph, concept1, concept2, options.predicates);
  
  if (lcas.length === 0) {
    return 0;
  }

  let bestScore = 0;

  for (const lca of lcas) {
    const depthLCA = getDepth(graph, lca, options.predicates);
    const path1 = getPathLengthToAncestor(graph, concept1, lca, options.predicates);
    const path2 = getPathLengthToAncestor(graph, concept2, lca, options.predicates);

    if (path1 !== null && path2 !== null) {
      const denominator = 2 * depthLCA + path1 + path2;
      if (denominator === 0) {
        bestScore = 1; // Same node at root
      } else {
        const score = (2 * depthLCA) / denominator;
        bestScore = Math.max(bestScore, score);
      }
    }
  }

  return bestScore;
};
