import type { EdgeDirection, ExtraOptions, MeasureFunction } from '../types';
import { MultiDirectedGraph } from 'graphology';
import { getAncestorSet } from '../helpers';

export const batet: MeasureFunction = (graph, concept1, concept2, options: ExtraOptions = {}) => {
  const edgeDirection: EdgeDirection = options.edgeDirection ?? 'parentToChild';
  const value = _batetCommonInfo(graph, concept1, concept2, options, edgeDirection)

  if (value <= 0) {
    return 0;
  }

  return -Math.log2(value) || 0;
};

export function _batetCommonInfo(graph: MultiDirectedGraph, concept1: string, concept2: string, options: ExtraOptions, edgeDirection: EdgeDirection): number {
  const { predicates } = options;

  const ancestors1 = getAncestorSet(graph, concept1, predicates, edgeDirection);
  const ancestors2 = getAncestorSet(graph, concept2, predicates, edgeDirection);

  if (ancestors1.size === 0 || ancestors2.size === 0) {
    return 0;
  }

  const union = new Set([...ancestors1, ...ancestors2]);
  const intersection = new Set([...ancestors1].filter(x => ancestors2.has(x)));

  const unionSize = union.size;
  const intersectionSize = intersection.size;

  if (unionSize === 0) {
    return 0;
  }

  const numerator = unionSize - intersectionSize;
  return numerator / unionSize;
}
