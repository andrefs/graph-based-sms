import type { MeasureFunction } from '../types';
import { getDepth, findLCAs, getPathLengthToAncestor } from '../helpers';

export const pekarStaab: MeasureFunction = (graph, concept1, concept2, options = {}) => {
  const lcas = findLCAs(graph, concept1, concept2, options.predicates);

  if (lcas.length === 0) {
    return 0;
  }

  let bestScore = 0;

  for (const lca of lcas) {
    const depthLCA = getDepth(graph, lca, options.predicates);
    const path1 = getPathLengthToAncestor(graph, concept1, lca, options.predicates);
    const path2 = getPathLengthToAncestor(graph, concept2, lca, options.predicates);

    if (depthLCA > 0 && path1 !== null && path2 !== null) {
      const score = depthLCA / (path1 + path2 + depthLCA);
      bestScore = Math.max(bestScore, score);
    }
  }

  return bestScore;
};
