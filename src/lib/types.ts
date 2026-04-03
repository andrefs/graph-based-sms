import { MultiDirectedGraph } from 'graphology';

export { MultiDirectedGraph as Graph };

export interface ExtraOptions {
  /** Filter edges by predicate(s). Applies to all measures. */
  predicates?: string | string[];

  /** Maximum depth of the taxonomy. Required for Resnik Edge and Leacock-Chodorow. */
  maxDepth?: number;

  /** Information content values for nodes. Required for Resnik IC, Lin, and Jiang-Conrath. */
  ic?: Map<string, number>;

  /** Depth factor for Zhong measure (default: 2, must be > 1). */
  kZhong?: number;

  /** Controls importance of taxonomic distance for Li et al. measure (default: 0.2). */
  alpha?: number;

  /** Controls depth factor for Li et al. measure (default: 0.45). */
  beta?: number;

  /** Constant for Hirst-St-Onge measure (default: 8). */
  C?: number;

  /** Direction change weight for Hirst-St-Onge measure (default: 1). */
  kHSO?: number;

  /** Maximum path length for Hirst-St-Onge measure (default: 5). */
  maxLength?: number;

  [key: string]: any;
}

export type MeasureFunction = (
  graph: MultiDirectedGraph,
  concept1: string,
  concept2: string,
  options?: ExtraOptions
) => number;
