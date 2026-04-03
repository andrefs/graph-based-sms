import type { MeasureFunction } from '../types';
import { getShortestPathLength } from '../helpers';

export const radaSimilarity: MeasureFunction = (graph, concept1, concept2, options = {}) => {
  const pathLength = getShortestPathLength(graph, concept1, concept2, options.predicates);
  if (pathLength === null) {
    return 0;
  }
  return 1 / (1 + pathLength);
};
