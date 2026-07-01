import type { EdgeDirection, MeasureFunction } from '../types';
import { getDepth, findLCAs, getAncestorSet, getPathLengthToAncestor } from '../helpers';
import { MultiDirectedGraph } from 'graphology';

export function computeLambda(
  graph: MultiDirectedGraph,
  concept1: string,
  concept2: string,
  predicates?: string | string[],
  edgeDirection: EdgeDirection = 'parentToChild'
): number {
  if (concept1 === concept2) {
    return 1;
  }

  const ancestors1 = getAncestorSet(graph, concept1, predicates, edgeDirection);
  const ancestors2 = getAncestorSet(graph, concept2, predicates, edgeDirection);

  const isSameHierarchy = ancestors1.has(concept2) || ancestors2.has(concept1);
  return isSameHierarchy ? 0 : 1;
}

export const simTBK: MeasureFunction = (graph, concept1, concept2, options = {}) => {
  const edgeDirection: EdgeDirection = options.edgeDirection ?? 'parentToChild';
  const lcas = findLCAs(graph, concept1, concept2, options.predicates, edgeDirection);

  if (lcas.length === 0) {
    return 0;
  }

  const lambda = computeLambda(graph, concept1, concept2, options.predicates, edgeDirection);
  let bestScore = 0;

  for (const lca of lcas) {
    const depthLCA = getDepth(graph, lca, options.predicates, edgeDirection);
    const path1 = getPathLengthToAncestor(graph, concept1, lca, options.predicates, edgeDirection);
    const path2 = getPathLengthToAncestor(graph, concept2, lca, options.predicates, edgeDirection);
    if (path1 === null || path2 === null) continue;
    const N1 = depthLCA + path1;
    const N2 = depthLCA + path2;
    const N = depthLCA;

    const wpDenominator = N1 + N2;
    const wuPalmerFactor = wpDenominator === 0 ? 1 : (2 * N) / wpDenominator;
    const PF = lambda === 0 ? 1 : (1 / (Math.abs(N1 - N2) + 1));
    const score = wuPalmerFactor * PF;

    bestScore = Math.max(bestScore, score);
  }

  return bestScore;
};
