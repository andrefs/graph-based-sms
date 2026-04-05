import { findLCAs } from '../helpers';
export const jiangConrath = (graph, concept1, concept2, options = {}) => {
    const { predicates, ic } = options;
    const edgeDirection = options.edgeDirection ?? 'parentToChild';
    if (!ic) {
        return 0;
    }
    const concept1IC = ic.get(concept1);
    const concept2IC = ic.get(concept2);
    if (concept1IC === undefined || concept2IC === undefined) {
        return 0;
    }
    const lcas = findLCAs(graph, concept1, concept2, predicates, edgeDirection);
    if (lcas.length === 0) {
        return 0;
    }
    let maxIC = 0;
    for (const lca of lcas) {
        const lcaIC = ic.get(lca);
        if (lcaIC !== undefined && lcaIC > maxIC) {
            maxIC = lcaIC;
        }
    }
    return concept1IC + concept2IC - 2 * maxIC;
};
//# sourceMappingURL=jiangConrath.js.map