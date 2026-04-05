"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resnikEdge = void 0;
const helpers_1 = require("../helpers");
const resnikEdge = (graph, concept1, concept2, options = {}) => {
    const { maxDepth } = options;
    const pathLength = (0, helpers_1.getShortestPathLength)(graph, concept1, concept2, options.predicates);
    if (pathLength === null || maxDepth === undefined) {
        return 0;
    }
    return 2 * maxDepth - pathLength;
};
exports.resnikEdge = resnikEdge;
//# sourceMappingURL=resnikEdge.js.map