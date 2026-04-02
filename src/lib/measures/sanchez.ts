import type { MeasureFunction } from '../types';
import { getAncestorSet } from '../helpers';

export const sanchez: MeasureFunction = (graph, concept1, concept2, options = {}) => {
  const { TFSanchez, predicates } = options as { TFSanchez?: Map<string, Set<string>>; predicates?: string | string[] };

  let set_c1: Set<string>;
  let set_c2: Set<string>;

  if (TFSanchez && TFSanchez.has(concept1) && TFSanchez.has(concept2)) {
    set_c1 = TFSanchez.get(concept1)!;
    set_c2 = TFSanchez.get(concept2)!;
  } else {
    set_c1 = getAncestorSet(graph, concept1, predicates);
    set_c2 = getAncestorSet(graph, concept2, predicates);
  }

  if (set_c1.size === 0 || set_c2.size === 0) {
    // should never happen
    return 1;
  }

  const diff_c1_c2 = new Set<string>();
  for (const item of set_c1) {
    if (!set_c2.has(item)) diff_c1_c2.add(item);
  }

  const diff_c2_c1 = new Set<string>();
  for (const item of set_c2) {
    if (!set_c1.has(item)) diff_c2_c1.add(item);
  }
  const intersection = new Set([...set_c1].filter(x => set_c2.has(x)));
  const denominator = diff_c1_c2.size + diff_c2_c1.size + intersection.size;

  if (denominator === 0) {
    return 1;
  }

  return Math.log2(1 + (diff_c1_c2.size + diff_c2_c1.size) / denominator);
};
