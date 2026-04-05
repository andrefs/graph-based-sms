/**
 * Find an edge between source and target with optional predicate and direction filtering.
 * Direction controls which edge directions are considered:
 * - 'forward': only edges from source to target
 * - 'reverse': only edges from target to source
 * - 'both': both directions (default)
 * Returns the edge attributes of the first matching edge (sorted deterministically), or null.
 */
function findEdgeWithPredicate(graph, source, target, predicates, direction = 'both') {
    // Get all edges between the nodes (both directions)
    const allEdges = graph.edges(source, target);
    if (allEdges.length === 0)
        return null;
    // Sort edges deterministically: first by predicate (if available), then by edge key
    const sortedEdges = allEdges.sort((a, b) => {
        const predA = graph.getEdgeAttributes(a)?.predicate ?? '';
        const predB = graph.getEdgeAttributes(b)?.predicate ?? '';
        const predCompare = predA.localeCompare(predB);
        if (predCompare !== 0)
            return predCompare;
        return a.localeCompare(b);
    });
    const predArray = predicates
        ? Array.isArray(predicates) ? predicates : [predicates]
        : null;
    for (const edgeKey of sortedEdges) {
        // Filter by direction if needed
        if (direction !== 'both') {
            const src = graph.source(edgeKey);
            const tgt = graph.target(edgeKey);
            if (direction === 'forward' && !(src === source && tgt === target))
                continue;
            if (direction === 'reverse' && !(src === target && tgt === source))
                continue;
        }
        const attrs = graph.getEdgeAttributes(edgeKey);
        if (!attrs)
            continue;
        if (predArray) {
            const edgePred = attrs.predicate;
            if (!edgePred)
                continue;
            if (predArray.includes(edgePred)) {
                return attrs;
            }
        }
        else {
            return attrs;
        }
    }
    return null;
}
/**
 * BFS-based shortest path with edge filtering
 */
export function bfsShortestPath(graph, source, target, predicates) {
    if (!graph.hasNode(source) || !graph.hasNode(target)) {
        return null;
    }
    const visited = new Set();
    const queue = [source];
    const parent = new Map();
    visited.add(source);
    while (queue.length > 0) {
        const current = queue.shift();
        if (current === target) {
            // Reconstruct path
            const path = [];
            let node = target;
            while (node) {
                path.unshift(node);
                node = parent.get(node);
            }
            return path;
        }
        // Check both inbound and outbound neighbors (taxonomy is directed but we want shortest path either way)
        const neighbors = [
            ...graph.outboundNeighbors(current),
            ...graph.inboundNeighbors(current)
        ];
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                // Check edge passes filter
                const edge = findEdgeWithPredicate(graph, current, neighbor, predicates);
                if (!edge)
                    continue;
                visited.add(neighbor);
                parent.set(neighbor, current);
                queue.push(neighbor);
            }
        }
    }
    return null;
}
export function getShortestPathLength(graph, source, target, predicates) {
    const path = bfsShortestPath(graph, source, target, predicates);
    return path ? path.length - 1 : null;
}
export function getDepth(graph, node, predicates, edgeDirection = 'parentToChild') {
    if (!graph.hasNode(node)) {
        return 0;
    }
    const getUpNeighbors = (n) => edgeDirection === 'parentToChild'
        ? graph.inboundNeighbors(n)
        : graph.outboundNeighbors(n);
    let maxDepth = 0;
    const visited = new Set();
    const queue = [[node, 0]];
    visited.add(node);
    while (queue.length > 0) {
        const [current, depth] = queue.shift();
        maxDepth = Math.max(maxDepth, depth);
        for (const neighbor of getUpNeighbors(current)) {
            if (!visited.has(neighbor)) {
                const direction = edgeDirection === 'parentToChild' ? 'reverse' : 'forward';
                const edge = findEdgeWithPredicate(graph, current, neighbor, predicates, direction);
                if (!edge)
                    continue;
                visited.add(neighbor);
                queue.push([neighbor, depth + 1]);
            }
        }
    }
    return maxDepth;
}
export function findLCAs(graph, node1, node2, predicates, edgeDirection = 'parentToChild') {
    if (!graph.hasNode(node1) || !graph.hasNode(node2)) {
        return [];
    }
    const getUpNeighbors = (n) => edgeDirection === 'parentToChild'
        ? graph.inboundNeighbors(n)
        : graph.outboundNeighbors(n);
    // Get ancestors of node1
    const ancestors1 = new Set();
    const queue1 = [node1];
    while (queue1.length > 0) {
        const current = queue1.shift();
        ancestors1.add(current);
        for (const neighbor of getUpNeighbors(current)) {
            if (!ancestors1.has(neighbor)) {
                const direction = edgeDirection === 'parentToChild' ? 'reverse' : 'forward';
                const edge = findEdgeWithPredicate(graph, current, neighbor, predicates, direction);
                if (!edge)
                    continue;
                queue1.push(neighbor);
            }
        }
    }
    // Find ancestors of node2 that are also ancestors of node1
    const lcas = new Set();
    const queue2 = [node2];
    const visited2 = new Set();
    visited2.add(node2);
    while (queue2.length > 0) {
        const current = queue2.shift();
        if (ancestors1.has(current)) {
            lcas.add(current);
        }
        for (const neighbor of getUpNeighbors(current)) {
            if (!visited2.has(neighbor)) {
                const direction = edgeDirection === 'parentToChild' ? 'reverse' : 'forward';
                const edge = findEdgeWithPredicate(graph, current, neighbor, predicates, direction);
                if (!edge)
                    continue;
                visited2.add(neighbor);
                queue2.push(neighbor);
            }
        }
    }
    return Array.from(lcas);
}
export function getAncestorSet(graph, node, predicates, edgeDirection = 'parentToChild') {
    if (!graph.hasNode(node)) {
        return new Set();
    }
    const getUpNeighbors = (n) => edgeDirection === 'parentToChild'
        ? graph.inboundNeighbors(n)
        : graph.outboundNeighbors(n);
    const ancestors = new Set();
    const queue = [node];
    while (queue.length > 0) {
        const current = queue.shift();
        ancestors.add(current);
        for (const neighbor of getUpNeighbors(current)) {
            if (!ancestors.has(neighbor)) {
                const direction = edgeDirection === 'parentToChild' ? 'reverse' : 'forward';
                const edge = findEdgeWithPredicate(graph, current, neighbor, predicates, direction);
                if (!edge)
                    continue;
                queue.push(neighbor);
            }
        }
    }
    return ancestors;
}
export function getPathLengthToAncestor(graph, node, ancestor, predicates, edgeDirection = 'parentToChild') {
    const getUpNeighbors = (n) => edgeDirection === 'parentToChild'
        ? graph.inboundNeighbors(n)
        : graph.outboundNeighbors(n);
    const visited = new Set();
    const queue = [[node, 0]];
    visited.add(node);
    while (queue.length > 0) {
        const [current, dist] = queue.shift();
        if (current === ancestor) {
            return dist;
        }
        for (const neighbor of getUpNeighbors(current)) {
            if (!visited.has(neighbor)) {
                const direction = edgeDirection === 'parentToChild' ? 'reverse' : 'forward';
                const edge = findEdgeWithPredicate(graph, current, neighbor, predicates, direction);
                if (!edge)
                    continue;
                visited.add(neighbor);
                queue.push([neighbor, dist + 1]);
            }
        }
    }
    return null;
}
//# sourceMappingURL=helpers.js.map