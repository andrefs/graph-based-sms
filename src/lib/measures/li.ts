import type { EdgeDirection, ExtraOptions, MeasureFunction } from '../types';
import { getDepth, findLCAs, getShortestPathLength } from '../helpers';

interface LiOptions {
  alpha?: number;
  beta?: number;
}

export const li: MeasureFunction = (graph, concept1, concept2, options = {}) => {
  const { alpha = 0.2, beta = 0.45 } = options as LiOptions;
  const edgeDirection: EdgeDirection = options.edgeDirection ?? 'parentToChild';

  const lcas = findLCAs(graph, concept1, concept2, options.predicates, edgeDirection);

  if (lcas.length === 0) {
    return 0;
  }

  const pathLength = getShortestPathLength(graph, concept1, concept2, options.predicates);
  if (pathLength === null) {
    return 0;
  }

  let bestScore = 0;

  for (const lca of lcas) {
    const depthLCA = getDepth(graph, lca, options.predicates, edgeDirection);

    if (depthLCA > 0) {
      const expPart = Math.exp(-alpha * pathLength);
      const expBetaH = Math.exp(beta * depthLCA);
      const expNegBetaH = Math.exp(-beta * depthLCA);
      const df = (expBetaH - expNegBetaH) / (expBetaH + expNegBetaH);
      const score = expPart * df;

      bestScore = Math.max(bestScore, score);
    }
  }

  return bestScore;
};
