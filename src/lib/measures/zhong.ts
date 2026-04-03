import type { ExtraOptions, MeasureFunction } from '../types';
import { getDepth, findLCAs } from '../helpers';

export const zhong: MeasureFunction = (graph, concept1, concept2, options = {}) => {
  const k = options.kZhong ?? 2;

  if (k <= 1) {
    return 0;
  }

  const lcas = findLCAs(graph, concept1, concept2, options.predicates);

  if (lcas.length === 0) {
    return 0;
  }

  const depth1 = getDepth(graph, concept1, options.predicates);
  const depth2 = getDepth(graph, concept2, options.predicates);

  if (depth1 === 0 || depth2 === 0) {
    return 0;
  }

  let bestScore = -Infinity;

  for (const lca of lcas) {
    const depthLCA = getDepth(graph, lca, options.predicates);

    if (depthLCA > 0) {
      const score = 
        2 * (1 / (2 * Math.pow(k, depthLCA))) -
        (1 / (2 * Math.pow(k, depth1))) -
        (1 / (2 * Math.pow(k, depth2)));

      bestScore = Math.max(bestScore, score);
    }
  }

  return bestScore > 0 ? bestScore : 0;
};
