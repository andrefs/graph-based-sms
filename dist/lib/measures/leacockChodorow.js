import { findLCAs, getPathLengthToAncestor } from '../helpers';
export const leacockChodorow = (graph, concept1, concept2, options = {}) => {
    const { maxDepth } = options;
    const edgeDirection = options.edgeDirection ?? 'parentToChild';
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
    // N = cardinality of the union of nodes in shortest paths sp(c1, LCA) and sp(c2, LCA)
    // For trees where paths don't share intermediate nodes, N = shortestPath + 1
    // (number of edges + 1 gives the number of nodes in the path)
    const n = shortestPath + 1;
    return Math.log(2 * maxDepth) - Math.log(n);
};
//# sourceMappingURL=leacockChodorow.js.map