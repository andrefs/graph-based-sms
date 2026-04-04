import type { EdgeDirection, ExtraOptions, MeasureFunction } from '../types';
import { findLCAs } from '../helpers';

export const resnikIC: MeasureFunction = (graph, concept1, concept2, options: ExtraOptions = {}) => {
  const { predicates, ic } = options;
  const edgeDirection: EdgeDirection = options.edgeDirection ?? 'parentToChild';

  if (!ic) {
    return 0;
  }

  if (ic.get(concept1) === undefined || ic.get(concept2) === undefined) {
    return 0;
  }

  const lcas = findLCAs(graph, concept1, concept2, predicates, edgeDirection);

  if (lcas.length === 0) {
    return 0;
  }

  let maxIC = 0;
  for (const lca of lcas) {
    const nodeIC = ic.get(lca);
    if (nodeIC !== undefined && nodeIC > maxIC) {
      maxIC = nodeIC;
    }
  }

  return maxIC;
};