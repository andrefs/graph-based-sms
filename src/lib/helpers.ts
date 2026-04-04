import type { EdgeDirection, ExtraOptions } from './types';
import { MultiDirectedGraph } from 'graphology';
import { Attributes } from 'graphology-types';

export type { EdgeDirection, ExtraOptions };

/**
 * Find an edge between source and target (in either direction) that matches the given predicates.
 * Returns the edge attributes of the first matching edge, or null if none found.
 */
function findEdgeWithPredicate(
  graph: MultiDirectedGraph,
  source: string,
  target: string,
  predicates?: string | string[]
): Attributes | null {
  const edges1 = graph.edges(source, target);
  const edges2 = graph.edges(target, source);
  const allEdges = [...edges1, ...edges2].sort();

  if (allEdges.length === 0) return null;

  const predArray = predicates
    ? Array.isArray(predicates) ? predicates : [predicates]
    : null;

  for (const edgeKey of allEdges) {
    const attrs = graph.getEdgeAttributes(edgeKey);
    if (!attrs) continue;
    if (predArray) {
      const edgePred = attrs.predicate;
      if (!edgePred) continue;
      if (predArray.includes(edgePred)) {
        return attrs;
      }
    } else {
      return attrs;
    }
  }

  return null;
}

/**
 * BFS-based shortest path with edge filtering
 */
export function bfsShortestPath(
  graph: MultiDirectedGraph,
  source: string,
  target: string,
  predicates?: string | string[]
): string[] | null {
  if (!graph.hasNode(source) || !graph.hasNode(target)) {
    return null;
  }

  const visited = new Set<string>();
  const queue: string[] = [source];
  const parent = new Map<string, string>();
  visited.add(source);

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (current === target) {
      // Reconstruct path
      const path: string[] = [];
      let node: string | undefined = target;
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
        if (!edge) continue;

        visited.add(neighbor);
        parent.set(neighbor, current);
        queue.push(neighbor);
      }
    }
  }

  return null;
}

export function getShortestPathLength(
  graph: MultiDirectedGraph,
  source: string,
  target: string,
  predicates?: string | string[]
): number | null {
  const path = bfsShortestPath(graph, source, target, predicates);
  return path ? path.length - 1 : null;
}

export function getDepth(
  graph: MultiDirectedGraph,
  node: string,
  predicates?: string | string[],
  edgeDirection: EdgeDirection = 'parentToChild'
): number {
  if (!graph.hasNode(node)) {
    return 0;
  }

  const getUpNeighbors = (n: string) =>
    edgeDirection === 'parentToChild'
      ? graph.inboundNeighbors(n)
      : graph.outboundNeighbors(n);

  let maxDepth = 0;
  const visited = new Set<string>();
  const queue: [string, number][] = [[node, 0]];
  visited.add(node);

  while (queue.length > 0) {
    const [current, depth] = queue.shift()!;
    maxDepth = Math.max(maxDepth, depth);

    for (const neighbor of getUpNeighbors(current)) {
      if (!visited.has(neighbor)) {
        const edge = findEdgeWithPredicate(graph, current, neighbor, predicates);
        if (!edge) continue;
        visited.add(neighbor);
        queue.push([neighbor, depth + 1]);
      }
    }
  }

  return maxDepth;
}

export function findLCAs(
  graph: MultiDirectedGraph,
  node1: string,
  node2: string,
  predicates?: string | string[],
  edgeDirection: EdgeDirection = 'parentToChild'
): string[] {
  if (!graph.hasNode(node1) || !graph.hasNode(node2)) {
    return [];
  }

  const getUpNeighbors = (n: string) =>
    edgeDirection === 'parentToChild'
      ? graph.inboundNeighbors(n)
      : graph.outboundNeighbors(n);

  // Get ancestors of node1
  const ancestors1 = new Set<string>();
  const queue1: string[] = [node1];
  while (queue1.length > 0) {
    const current = queue1.shift()!;
    ancestors1.add(current);
    for (const neighbor of getUpNeighbors(current)) {
      if (!ancestors1.has(neighbor)) {
        const edge = findEdgeWithPredicate(graph, current, neighbor, predicates);
        if (!edge) continue;
        queue1.push(neighbor);
      }
    }
  }

  // Find ancestors of node2 that are also ancestors of node1
  const lcas = new Set<string>();
  const queue2: string[] = [node2];
  const visited2 = new Set<string>();
  visited2.add(node2);

  while (queue2.length > 0) {
    const current = queue2.shift()!;
    if (ancestors1.has(current)) {
      lcas.add(current);
    }
    for (const neighbor of getUpNeighbors(current)) {
      if (!visited2.has(neighbor)) {
        const edge = findEdgeWithPredicate(graph, current, neighbor, predicates);
        if (!edge) continue;
        visited2.add(neighbor);
        queue2.push(neighbor);
      }
    }
  }

  return Array.from(lcas);
}

export function getAncestorSet(
  graph: MultiDirectedGraph,
  node: string,
  predicates?: string | string[],
  edgeDirection: EdgeDirection = 'parentToChild'
): Set<string> {
  if (!graph.hasNode(node)) {
    return new Set<string>();
  }

  const getUpNeighbors = (n: string) =>
    edgeDirection === 'parentToChild'
      ? graph.inboundNeighbors(n)
      : graph.outboundNeighbors(n);

  const ancestors = new Set<string>();
  const queue: string[] = [node];

  while (queue.length > 0) {
    const current = queue.shift()!;
    ancestors.add(current);

    for (const neighbor of getUpNeighbors(current)) {
      if (!ancestors.has(neighbor)) {
        const edge = findEdgeWithPredicate(graph, current, neighbor, predicates);
        if (!edge) continue;
        queue.push(neighbor);
      }
    }
  }

  return ancestors;
}

export function getPathLengthToAncestor(
  graph: MultiDirectedGraph,
  node: string,
  ancestor: string,
  predicates?: string | string[],
  edgeDirection: EdgeDirection = 'parentToChild'
): number | null {
  const getUpNeighbors = (n: string) =>
    edgeDirection === 'parentToChild'
      ? graph.inboundNeighbors(n)
      : graph.outboundNeighbors(n);

  const visited = new Set<string>();
  const queue: [string, number][] = [[node, 0]];
  visited.add(node);

  while (queue.length > 0) {
    const [current, dist] = queue.shift()!;
    if (current === ancestor) {
      return dist;
    }

    for (const neighbor of getUpNeighbors(current)) {
      if (!visited.has(neighbor)) {
        const edge = findEdgeWithPredicate(graph, current, neighbor, predicates);
        if (!edge) continue;
        visited.add(neighbor);
        queue.push([neighbor, dist + 1]);
      }
    }
  }

  return null;
}
