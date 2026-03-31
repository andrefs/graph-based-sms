import type { MeasureFunction } from '../types';
import { getDepth, findLCAs, getAncestorSet } from '../helpers';
import { MultiDirectedGraph } from 'graphology';

export function computeLambda(
  graph: MultiDirectedGraph,
  concept1: string,
  concept2: string,
  predicates?: string | string[]
): number {
  if (concept1 === concept2) {
    return 1;
  }

  const ancestors1 = getAncestorSet(graph, concept1, predicates);
  const ancestors2 = getAncestorSet(graph, concept2, predicates);

  const isSameHierarchy = ancestors1.has(concept2) || ancestors2.has(concept1);
  return isSameHierarchy ? 0 : 1;
}

export const simTBK: MeasureFunction = (graph, concept1, concept2, options = {}) => {
  const lcas = findLCAs(graph, concept1, concept2, options.predicates);

  if (lcas.length === 0) {
    return 0;
  }

  const depth1 = getDepth(graph, concept1, options.predicates);
  const depth2 = getDepth(graph, concept2, options.predicates);

  if (depth1 === 0 || depth2 === 0) {
    return 0;
  }

  let lambda: number;
  if (options.lambda !== undefined) {
    lambda = options.lambda;
  } else {
    lambda = computeLambda(graph, concept1, concept2, options.predicates);
  }

  let bestScore = 0;

  for (const lca of lcas) {
    const depthLCA = getDepth(graph, lca, options.predicates);

    if (depthLCA > 0) {
      const N = depthLCA;
      const N1 = depth1;
      const N2 = depth2;

      const wuPalmerFactor = (2 * N) / (N1 + N2);
      const PF = (1 - lambda) * (Math.min(N1, N2) - N) + lambda * (1 / (Math.abs(N1 - N2) + 1));
      const score = wuPalmerFactor * PF;

      bestScore = Math.max(bestScore, score);
    }
  }

  return bestScore;
};
