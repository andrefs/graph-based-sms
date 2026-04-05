import { getDepth, findLCAs, getPathLengthToAncestor } from '../helpers';
export const wuPalmer = (graph, concept1, concept2, options = {}) => {
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
        if (path1 !== null && path2 !== null) {
            const denominator = 2 * depthLCA + path1 + path2;
            if (denominator === 0) {
                bestScore = 1; // Same node at root
            }
            else {
                const score = (2 * depthLCA) / denominator;
                bestScore = Math.max(bestScore, score);
            }
        }
    }
    return bestScore;
};
//# sourceMappingURL=wuPalmer.js.map