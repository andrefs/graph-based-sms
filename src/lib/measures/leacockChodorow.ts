import type { EdgeDirection, MeasureFunction } from '../types';
import { findLCAs, getPathLengthToAncestor } from '../helpers';

export const leacockChodorow: MeasureFunction = (graph, concept1, concept2, options = {}) => {
  const { maxDepth } = options;
  const edgeDirection: EdgeDirection = options.edgeDirection ?? 'parentToChild';

  if (maxDepth === undefined || maxDepth <= 0) {
    return 0;
  }

  const lcas = findLCAs(graph, concept1, concept2, options.predicates, edgeDirection);

  if (lcas.length === 0) {
    return 0;
  }

  let shortestPath = Infinity;

  for (const lca of lcas) {
    const path1 = getPathLengthToAncestor(graph, concept1, lca, options.predicates, edgeDirection);
    const path2 = getPathLengthToAncestor(graph, concept2, lca, options.predicates, edgeDirection);

    if (path1 !== null && path2 !== null) {
      shortestPath = Math.min(shortestPath, path1 + path2);
    }
  }

  if (shortestPath === Infinity) {
    return 0;
  }

  const n = shortestPath + 1;

  return Math.log(2 * maxDepth) - Math.log(n);
};
