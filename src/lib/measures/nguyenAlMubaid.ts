import type { EdgeDirection, ExtraOptions, MeasureFunction } from '../types';
import { getShortestPathLength, getDepth, findLCAs } from '../helpers';

export const nguyenAlMubaid: MeasureFunction = (graph, concept1, concept2, options: ExtraOptions = {}) => {
  const { maxDepth, predicates } = options;
  const edgeDirection: EdgeDirection = options.edgeDirection ?? 'parentToChild';

  if (maxDepth === undefined || maxDepth <= 0) {
    return 0;
  }

  const spLength = getShortestPathLength(graph, concept1, concept2, predicates);

  if (spLength === null || spLength <= 0) {
    return 0;
  }

  const lcas = findLCAs(graph, concept1, concept2, predicates, edgeDirection);

  if (lcas.length === 0) {
    return 0;
  }

  let maxDepthLCA = 0;
  for (const lca of lcas) {
    const depthLCA = getDepth(graph, lca, predicates, edgeDirection);
    maxDepthLCA = Math.max(maxDepthLCA, depthLCA);
  }

  const d = maxDepthLCA;
  const value = 2 + (spLength - 1) * (maxDepth - d);

  if (value <= 0) {
    return 0;
  }

  return Math.log(value);
};
