import type { EdgeDirection, ExtraOptions } from './types';
import { MultiDirectedGraph } from 'graphology';
export type { EdgeDirection, ExtraOptions };
/**
 * BFS-based shortest path with edge filtering
 */
export declare function bfsShortestPath(graph: MultiDirectedGraph, source: string, target: string, predicates?: string | string[]): string[] | null;
export declare function getShortestPathLength(graph: MultiDirectedGraph, source: string, target: string, predicates?: string | string[]): number | null;
export declare function getDepth(graph: MultiDirectedGraph, node: string, predicates?: string | string[], edgeDirection?: EdgeDirection): number;
export declare function findLCAs(graph: MultiDirectedGraph, node1: string, node2: string, predicates?: string | string[], edgeDirection?: EdgeDirection): string[];
export declare function getAncestorSet(graph: MultiDirectedGraph, node: string, predicates?: string | string[], edgeDirection?: EdgeDirection): Set<string>;
export declare function getPathLengthToAncestor(graph: MultiDirectedGraph, node: string, ancestor: string, predicates?: string | string[], edgeDirection?: EdgeDirection): number | null;
//# sourceMappingURL=helpers.d.ts.map