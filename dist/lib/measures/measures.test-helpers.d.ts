import { MultiDirectedGraph } from 'graphology';
export declare const MAX_DEPTH = 3;
export declare const createTaxonomy: () => MultiDirectedGraph<import("graphology-types").Attributes, import("graphology-types").Attributes, import("graphology-types").Attributes>;
export declare const createTaxonomyParentToChild: () => MultiDirectedGraph<import("graphology-types").Attributes, import("graphology-types").Attributes, import("graphology-types").Attributes>;
export declare const createSlimaniExample1: () => MultiDirectedGraph<import("graphology-types").Attributes, import("graphology-types").Attributes, import("graphology-types").Attributes>;
export declare const createSlimaniExample2: () => MultiDirectedGraph<import("graphology-types").Attributes, import("graphology-types").Attributes, import("graphology-types").Attributes>;
export declare function runMeasureTests(measureName: string, measureFn: (g: MultiDirectedGraph, c1: string, c2: string, options?: any) => number, options?: any): void;
export declare function runMeasureTestsDefault(measureName: string, measureFn: (g: MultiDirectedGraph, c1: string, c2: string, options?: any) => number, options?: any): void;
//# sourceMappingURL=measures.test-helpers.d.ts.map