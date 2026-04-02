import type { MeasureFunction } from '../types';
import { getAncestorSet } from '../helpers';

export const sanchez: MeasureFunction = (graph, concept1, concept2, options = {}) => {
  const { TFSanchez, predicates } = options as { TFSanchez?: Map<string, Set<string>>; predicates?: string | string[] };

  let set1: Set<string>;
  let set2: Set<string>;

  if (TFSanchez && TFSanchez.has(concept1) && TFSanchez.has(concept2)) {
    set1 = TFSanchez.get(concept1)!;
    set2 = TFSanchez.get(concept2)!;
  } else {
    set1 = getAncestorSet(graph, concept1, predicates);
    set2 = getAncestorSet(graph, concept2, predicates);
  }

  if (set1.size === 0 || set2.size === 0) {
    return 0;
  }

  const diff1 = new Set<string>();
  for (const item of set1) {
    if (!set2.has(item)) diff1.add(item);
  }

  const diff2 = new Set<string>();
  for (const item of set2) {
    if (!set1.has(item)) diff2.add(item);
  }

  const A = diff1.size + diff2.size;
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const B = intersection.size;

  const denominator = A + B;
  if (denominator === 0) {
    return 0;
  }

  return Math.log2(1 + A / denominator);
};
