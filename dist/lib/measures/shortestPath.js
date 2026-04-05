import { getShortestPathLength } from '../helpers';
export const shortestPath = (graph, concept1, concept2, options = {}) => {
    const pathLength = getShortestPathLength(graph, concept1, concept2, options.predicates);
    return pathLength ?? 0;
};
//# sourceMappingURL=shortestPath.js.map