import type { ExtraOptions, MeasureFunction } from '../types';
import { getAncestorSet } from '../helpers';

export const batet: MeasureFunction = (graph, concept1, concept2, options: ExtraOptions = {}) => {
  const value = _batetCommonInfo(graph, concept1, concept2, options)

  if (value <= 0) {
    return 0;
  }

  return -Math.log2(value) || 0;
};

export const _batetCommonInfo: MeasureFunction = (graph, concept1, concept2, options: ExtraOptions = {}) => {
  const { predicates } = options;

  const ancestors1 = getAncestorSet(graph, concept1, predicates);
  const ancestors2 = getAncestorSet(graph, concept2, predicates);

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
