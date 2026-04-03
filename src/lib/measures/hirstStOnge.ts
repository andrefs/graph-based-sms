import type { ExtraOptions, MeasureFunction } from '../types';
import { MultiDirectedGraph } from 'graphology';

type Direction =
  'UP' | 'DOWN';

interface State {
  node: string;
  path: string[];
  prevDir: Direction | null;
  changes: number;
}

/**
 * Returns a list of valid edges from the given node, filtered by the optional whitelist of predicates.
 * Each edge is represented as an object containing the neighboring node and the direction of the edge.
 *
 * @param graph - The graph to search within.
 * @param from - The starting node for which to find valid edges.
 * @param whitelist - An optional set of predicates to filter edges. If provided, only edges with predicates in this set will be included.
 * @returns An array of objects, each containing a neighboring node and the direction of the edge (UP or DOWN).
 */
function getValidEdges(graph: MultiDirectedGraph, from: string, whitelist?: Set<string>) {
  if (!graph.hasNode(from)) return [];

  const edges: { neighbor: string, dir: Direction }[] = [];

  for (const outEdge of graph.outEdges(from)) {
    const predicate = graph.getEdgeAttribute(outEdge, 'predicate');
    if (whitelist && !whitelist.has(predicate)) continue;
    edges.push({ neighbor: graph.target(outEdge), dir: 'UP' });
  }

  for (const inEdge of graph.inEdges(from)) {
    const predicate = graph.getEdgeAttribute(inEdge, 'predicate');
    if (whitelist && !whitelist.has(predicate)) continue;
    edges.push({ neighbor: graph.source(inEdge), dir: 'DOWN' });
  }

  return edges;
}


interface HirstStOngeOptions extends ExtraOptions {
  C?: number;
  kHSO?: number;
  maxLength?: number; // Maximum path length
}

export const hirstStOnge: MeasureFunction = (
  graph: MultiDirectedGraph,
  concept1: string,
  concept2: string,
  options?: HirstStOngeOptions): number => {
  if (!graph.hasNode(concept1) || !graph.hasNode(concept2)) {
    return 0;
  }

  const C = options?.C ?? 8;
  const k = options?.kHSO ?? 1;
  const maxLength = options?.maxLength ?? 5;
  const predicates = options?.predicates
    ? new Set(Array.isArray(options.predicates)
      ? options.predicates
      : [options.predicates])
    : undefined;

  let bestScore = 0;

  const queue: State[] = [{
    node: concept1,
    path: [concept1],
    prevDir: null,
    changes: 0
  }];

  while (queue.length) {
    const { node, path, prevDir, changes: d } = queue.shift()!;

    const length = path.length - 1;
    if (length > maxLength!) continue;

    if (node === concept2) {
      const score = C - length - k * d;
      bestScore = Math.max(bestScore, score);
      continue;
    }

    const edges = getValidEdges(graph, node, predicates);

    for (const { neighbor, dir } of edges) {
      if (path.includes(neighbor)) continue; // Avoid cycles

      let newD = d;
      if (prevDir && dir !== prevDir) {
        newD += 1; // Increment changes if direction changes
      }

      queue.push({
        node: neighbor,
        path: [...path, neighbor],
        prevDir: dir,
        changes: newD
      });
    }
  }

  return Math.max(bestScore, 0);
}


