import { MultiDirectedGraph } from 'graphology';

export { MultiDirectedGraph as Graph };

export interface ExtraOptions {
  predicates?: string | string[];
  maxDepth?: number;
  ic?: Map<string, number>;
  [key: string]: any;
}

export type MeasureFunction = (
  graph: MultiDirectedGraph,
  concept1: string,
  concept2: string,
  options?: ExtraOptions
) => number;
