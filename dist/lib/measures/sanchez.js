import { getAncestorSet } from '../helpers';
export const sanchez = (graph, concept1, concept2, options = {}) => {
    const edgeDirection = options.edgeDirection ?? 'parentToChild';
    const { TFSanchez, predicates } = options;
    let set_c1;
    let set_c2;
    if (TFSanchez && TFSanchez.has(concept1) && TFSanchez.has(concept2)) {
        set_c1 = TFSanchez.get(concept1);
        set_c2 = TFSanchez.get(concept2);
    }
    else {
        set_c1 = getAncestorSet(graph, concept1, predicates, edgeDirection);
        set_c2 = getAncestorSet(graph, concept2, predicates, edgeDirection);
    }
    if (set_c1.size === 0 || set_c2.size === 0) {
        // should never happen
        return 1;
    }
    const diff_c1_c2 = new Set();
    for (const item of set_c1) {
        if (!set_c2.has(item))
            diff_c1_c2.add(item);
    }
    const diff_c2_c1 = new Set();
    for (const item of set_c2) {
        if (!set_c1.has(item))
            diff_c2_c1.add(item);
    }
    const intersection = new Set([...set_c1].filter(x => set_c2.has(x)));
    const denominator = diff_c1_c2.size + diff_c2_c1.size + intersection.size;
    if (denominator === 0) {
        return 1;
    }
    return Math.log2(1 + (diff_c1_c2.size + diff_c2_c1.size) / denominator);
};
//# sourceMappingURL=sanchez.js.map