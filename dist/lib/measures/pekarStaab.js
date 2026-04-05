import { getDepth, findLCAs, getPathLengthToAncestor } from '../helpers';
export const pekarStaab = (graph, concept1, concept2, options = {}) => {
    const edgeDirection = options.edgeDirection ?? 'parentToChild';
    const lcas = findLCAs(graph, concept1, concept2, options.predicates, edgeDirection);
    if (lcas.length === 0) {
        return 0;
    }
    let bestScore = 0;
    for (const lca of lcas) {
        const depthLCA = getDepth(graph, lca, options.predicates, edgeDirection);
        const path1 = getPathLengthToAncestor(graph, concept1, lca, options.predicates, edgeDirection);
        const path2 = getPathLengthToAncestor(graph, concept2, lca, options.predicates, edgeDirection);
        if (depthLCA > 0 && path1 !== null && path2 !== null) {
            const score = depthLCA / (path1 + path2 + depthLCA);
            bestScore = Math.max(bestScore, score);
        }
    }
    return bestScore;
};
//# sourceMappingURL=pekarStaab.js.map