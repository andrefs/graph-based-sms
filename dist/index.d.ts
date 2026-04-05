import { MultiDirectedGraph } from 'graphology';
export { MultiDirectedGraph as Graph } from 'graphology';

type EdgeDirection = 'parentToChild' | 'childToParent';
interface ExtraOptions {
    /** Filter edges by predicate(s). Applies to all measures. */
    predicates?: string | string[];
    /** Direction of edges in the taxonomy. 'parentToChild' means edges point from parent to child. 'childToParent' means edges point from child to parent. Default: 'parentToChild'. */
    edgeDirection?: EdgeDirection;
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
type MeasureFunction = (graph: MultiDirectedGraph, concept1: string, concept2: string, options?: ExtraOptions) => number;

declare const shortestPath: MeasureFunction;

declare const radaSimilarity: MeasureFunction;

declare const resnikEdge: MeasureFunction;

declare const resnikIC: MeasureFunction;

declare const wuPalmer: MeasureFunction;

declare const pekarStaab: MeasureFunction;

declare const leacockChodorow: MeasureFunction;

declare const hirstStOnge: MeasureFunction;

declare const nguyenAlMubaid: MeasureFunction;

declare const batet: MeasureFunction;
declare function _batetCommonInfo(graph: MultiDirectedGraph, concept1: string, concept2: string, options: ExtraOptions, edgeDirection: EdgeDirection): number;

declare const zhong: MeasureFunction;

declare function computeLambda(graph: MultiDirectedGraph, concept1: string, concept2: string, predicates?: string | string[], edgeDirection?: EdgeDirection): number;
declare const simTBK: MeasureFunction;

declare const li: MeasureFunction;

declare const sanchez: MeasureFunction;

declare const lin: MeasureFunction;

declare const jiangConrath: MeasureFunction;

export { type ExtraOptions, type MeasureFunction, _batetCommonInfo, batet, computeLambda, hirstStOnge, jiangConrath, leacockChodorow, li, lin, nguyenAlMubaid, pekarStaab, radaSimilarity, resnikEdge, resnikIC, sanchez, shortestPath, simTBK, wuPalmer, zhong };
