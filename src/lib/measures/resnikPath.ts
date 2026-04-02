import type { ExtraOptions, MeasureFunction } from '../types';
import { getShortestPathLength } from '../helpers';

export const resnikEdge: MeasureFunction = (graph, concept1, concept2, options = {}) => {
  const { maxDepth } = options;
  const pathLength = getShortestPathLength(graph, concept1, concept2, options.predicates);
  
  if (pathLength === null || maxDepth === undefined) {
    return 0;
  }
  
  return 2 * maxDepth - pathLength;
};
