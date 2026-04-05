// src/lib/helpers.ts
function findEdgeWithPredicate(graph, source, target, predicates, direction = "both") {
  const allEdges = graph.edges(source, target);
  if (allEdges.length === 0) return null;
  const sortedEdges = allEdges.sort((a, b) => {
    const predA = graph.getEdgeAttributes(a)?.predicate ?? "";
    const predB = graph.getEdgeAttributes(b)?.predicate ?? "";
    const predCompare = predA.localeCompare(predB);
    if (predCompare !== 0) return predCompare;
    return a.localeCompare(b);
  });
  const predArray = predicates ? Array.isArray(predicates) ? predicates : [predicates] : null;
  for (const edgeKey of sortedEdges) {
    if (direction !== "both") {
      const src = graph.source(edgeKey);
      const tgt = graph.target(edgeKey);
      if (direction === "forward" && !(src === source && tgt === target)) continue;
      if (direction === "reverse" && !(src === target && tgt === source)) continue;
    }
    const attrs = graph.getEdgeAttributes(edgeKey);
    if (!attrs) continue;
    if (predArray) {
      const edgePred = attrs.predicate;
      if (!edgePred) continue;
      if (predArray.includes(edgePred)) {
        return attrs;
      }
    } else {
      return attrs;
    }
  }
  return null;
}
function bfsShortestPath(graph, source, target, predicates) {
  if (!graph.hasNode(source) || !graph.hasNode(target)) {
    return null;
  }
  const visited = /* @__PURE__ */ new Set();
  const queue = [source];
  const parent = /* @__PURE__ */ new Map();
  visited.add(source);
  while (queue.length > 0) {
    const current = queue.shift();
    if (current === target) {
      const path = [];
      let node = target;
      while (node) {
        path.unshift(node);
        node = parent.get(node);
      }
      return path;
    }
    const neighbors = [
      ...graph.outboundNeighbors(current),
      ...graph.inboundNeighbors(current)
    ];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        const edge = findEdgeWithPredicate(graph, current, neighbor, predicates);
        if (!edge) continue;
        visited.add(neighbor);
        parent.set(neighbor, current);
        queue.push(neighbor);
      }
    }
  }
  return null;
}
function getShortestPathLength(graph, source, target, predicates) {
  const path = bfsShortestPath(graph, source, target, predicates);
  return path ? path.length - 1 : null;
}
function getDepth(graph, node, predicates, edgeDirection = "parentToChild") {
  if (!graph.hasNode(node)) {
    return 0;
  }
  const getUpNeighbors = (n) => edgeDirection === "parentToChild" ? graph.inboundNeighbors(n) : graph.outboundNeighbors(n);
  let maxDepth = 0;
  const visited = /* @__PURE__ */ new Set();
  const queue = [[node, 0]];
  visited.add(node);
  while (queue.length > 0) {
    const [current, depth] = queue.shift();
    maxDepth = Math.max(maxDepth, depth);
    for (const neighbor of getUpNeighbors(current)) {
      if (!visited.has(neighbor)) {
        const direction = edgeDirection === "parentToChild" ? "reverse" : "forward";
        const edge = findEdgeWithPredicate(graph, current, neighbor, predicates, direction);
        if (!edge) continue;
        visited.add(neighbor);
        queue.push([neighbor, depth + 1]);
      }
    }
  }
  return maxDepth;
}
function findLCAs(graph, node1, node2, predicates, edgeDirection = "parentToChild") {
  if (!graph.hasNode(node1) || !graph.hasNode(node2)) {
    return [];
  }
  const getUpNeighbors = (n) => edgeDirection === "parentToChild" ? graph.inboundNeighbors(n) : graph.outboundNeighbors(n);
  const ancestors1 = /* @__PURE__ */ new Set();
  const queue1 = [node1];
  while (queue1.length > 0) {
    const current = queue1.shift();
    ancestors1.add(current);
    for (const neighbor of getUpNeighbors(current)) {
      if (!ancestors1.has(neighbor)) {
        const direction = edgeDirection === "parentToChild" ? "reverse" : "forward";
        const edge = findEdgeWithPredicate(graph, current, neighbor, predicates, direction);
        if (!edge) continue;
        queue1.push(neighbor);
      }
    }
  }
  const lcas = /* @__PURE__ */ new Set();
  const queue2 = [node2];
  const visited2 = /* @__PURE__ */ new Set();
  visited2.add(node2);
  while (queue2.length > 0) {
    const current = queue2.shift();
    if (ancestors1.has(current)) {
      lcas.add(current);
    }
    for (const neighbor of getUpNeighbors(current)) {
      if (!visited2.has(neighbor)) {
        const direction = edgeDirection === "parentToChild" ? "reverse" : "forward";
        const edge = findEdgeWithPredicate(graph, current, neighbor, predicates, direction);
        if (!edge) continue;
        visited2.add(neighbor);
        queue2.push(neighbor);
      }
    }
  }
  return Array.from(lcas);
}
function getAncestorSet(graph, node, predicates, edgeDirection = "parentToChild") {
  if (!graph.hasNode(node)) {
    return /* @__PURE__ */ new Set();
  }
  const getUpNeighbors = (n) => edgeDirection === "parentToChild" ? graph.inboundNeighbors(n) : graph.outboundNeighbors(n);
  const ancestors = /* @__PURE__ */ new Set();
  const queue = [node];
  while (queue.length > 0) {
    const current = queue.shift();
    ancestors.add(current);
    for (const neighbor of getUpNeighbors(current)) {
      if (!ancestors.has(neighbor)) {
        const direction = edgeDirection === "parentToChild" ? "reverse" : "forward";
        const edge = findEdgeWithPredicate(graph, current, neighbor, predicates, direction);
        if (!edge) continue;
        queue.push(neighbor);
      }
    }
  }
  return ancestors;
}
function getPathLengthToAncestor(graph, node, ancestor, predicates, edgeDirection = "parentToChild") {
  const getUpNeighbors = (n) => edgeDirection === "parentToChild" ? graph.inboundNeighbors(n) : graph.outboundNeighbors(n);
  const visited = /* @__PURE__ */ new Set();
  const queue = [[node, 0]];
  visited.add(node);
  while (queue.length > 0) {
    const [current, dist] = queue.shift();
    if (current === ancestor) {
      return dist;
    }
    for (const neighbor of getUpNeighbors(current)) {
      if (!visited.has(neighbor)) {
        const direction = edgeDirection === "parentToChild" ? "reverse" : "forward";
        const edge = findEdgeWithPredicate(graph, current, neighbor, predicates, direction);
        if (!edge) continue;
        visited.add(neighbor);
        queue.push([neighbor, dist + 1]);
      }
    }
  }
  return null;
}

// src/lib/measures/shortestPath.ts
var shortestPath = (graph, concept1, concept2, options = {}) => {
  const pathLength = getShortestPathLength(graph, concept1, concept2, options.predicates);
  return pathLength ?? 0;
};

// src/lib/measures/radaSimilarity.ts
var radaSimilarity = (graph, concept1, concept2, options = {}) => {
  const pathLength = getShortestPathLength(graph, concept1, concept2, options.predicates);
  if (pathLength === null) {
    return 0;
  }
  return 1 / (1 + pathLength);
};

// src/lib/measures/resnikPath.ts
var resnikEdge = (graph, concept1, concept2, options = {}) => {
  const { maxDepth } = options;
  const pathLength = getShortestPathLength(graph, concept1, concept2, options.predicates);
  if (pathLength === null || maxDepth === void 0) {
    return 0;
  }
  return 2 * maxDepth - pathLength;
};

// src/lib/measures/resnikIC.ts
var resnikIC = (graph, concept1, concept2, options = {}) => {
  const { predicates, ic } = options;
  const edgeDirection = options.edgeDirection ?? "parentToChild";
  if (!ic) {
    return 0;
  }
  if (ic.get(concept1) === void 0 || ic.get(concept2) === void 0) {
    return 0;
  }
  const lcas = findLCAs(graph, concept1, concept2, predicates, edgeDirection);
  if (lcas.length === 0) {
    return 0;
  }
  let maxIC = 0;
  for (const lca of lcas) {
    const nodeIC = ic.get(lca);
    if (nodeIC !== void 0 && nodeIC > maxIC) {
      maxIC = nodeIC;
    }
  }
  return maxIC;
};

// src/lib/measures/wuPalmer.ts
var wuPalmer = (graph, concept1, concept2, options = {}) => {
  const edgeDirection = options.edgeDirection ?? "parentToChild";
  const lcas = findLCAs(graph, concept1, concept2, options.predicates, edgeDirection);
  if (lcas.length === 0) {
    return 0;
  }
  let bestScore = 0;
  for (const lca of lcas) {
    const depthLCA = getDepth(graph, lca, options.predicates, edgeDirection);
    const path1 = getPathLengthToAncestor(graph, concept1, lca, options.predicates, edgeDirection);
    const path2 = getPathLengthToAncestor(graph, concept2, lca, options.predicates, edgeDirection);
    if (path1 !== null && path2 !== null) {
      const denominator = 2 * depthLCA + path1 + path2;
      if (denominator === 0) {
        bestScore = 1;
      } else {
        const score = 2 * depthLCA / denominator;
        bestScore = Math.max(bestScore, score);
      }
    }
  }
  return bestScore;
};

// src/lib/measures/pekarStaab.ts
var pekarStaab = (graph, concept1, concept2, options = {}) => {
  const edgeDirection = options.edgeDirection ?? "parentToChild";
  const lcas = findLCAs(graph, concept1, concept2, options.predicates, edgeDirection);
  if (lcas.length === 0) {
    return 0;
  }
  let bestScore = 0;
  for (const lca of lcas) {
    const depthLCA = getDepth(graph, lca, options.predicates, edgeDirection);
    const path1 = getPathLengthToAncestor(graph, concept1, lca, options.predicates, edgeDirection);
    const path2 = getPathLengthToAncestor(graph, concept2, lca, options.predicates, edgeDirection);
    if (depthLCA > 0 && path1 !== null && path2 !== null) {
      const score = depthLCA / (path1 + path2 + depthLCA);
      bestScore = Math.max(bestScore, score);
    }
  }
  return bestScore;
};

// src/lib/measures/leacockChodorow.ts
var leacockChodorow = (graph, concept1, concept2, options = {}) => {
  const { maxDepth } = options;
  const edgeDirection = options.edgeDirection ?? "parentToChild";
  if (maxDepth === void 0 || maxDepth <= 0) {
    return 0;
  }
  const lcas = findLCAs(graph, concept1, concept2, options.predicates, edgeDirection);
  if (lcas.length === 0) {
    return 0;
  }
  let shortestPath2 = Infinity;
  for (const lca of lcas) {
    const path1 = getPathLengthToAncestor(graph, concept1, lca, options.predicates, edgeDirection);
    const path2 = getPathLengthToAncestor(graph, concept2, lca, options.predicates, edgeDirection);
    if (path1 !== null && path2 !== null) {
      shortestPath2 = Math.min(shortestPath2, path1 + path2);
    }
  }
  if (shortestPath2 === Infinity) {
    return 0;
  }
  const n = shortestPath2 + 1;
  return Math.log(2 * maxDepth) - Math.log(n);
};

// src/lib/measures/hirstStOnge.ts
function getValidEdges(graph, from, outboundIsUp, whitelist) {
  if (!graph.hasNode(from)) return [];
  const edges = [];
  for (const outEdge of graph.outEdges(from)) {
    const predicate = graph.getEdgeAttribute(outEdge, "predicate");
    if (whitelist && !whitelist.has(predicate)) continue;
    edges.push({ neighbor: graph.target(outEdge), dir: outboundIsUp ? "UP" : "DOWN" });
  }
  for (const inEdge of graph.inEdges(from)) {
    const predicate = graph.getEdgeAttribute(inEdge, "predicate");
    if (whitelist && !whitelist.has(predicate)) continue;
    edges.push({ neighbor: graph.source(inEdge), dir: outboundIsUp ? "DOWN" : "UP" });
  }
  return edges;
}
var hirstStOnge = (graph, concept1, concept2, options) => {
  if (!graph.hasNode(concept1) || !graph.hasNode(concept2)) {
    return 0;
  }
  const C = options?.C ?? 8;
  const k = options?.kHSO ?? 1;
  const maxLength = options?.maxLength ?? 5;
  const edgeDirection = options?.edgeDirection ?? "parentToChild";
  const predicates = options?.predicates ? new Set(Array.isArray(options.predicates) ? options.predicates : [options.predicates]) : void 0;
  const outboundIsUp = edgeDirection === "childToParent";
  let bestScore = 0;
  const queue = [{
    node: concept1,
    path: [concept1],
    prevDir: null,
    changes: 0
  }];
  while (queue.length) {
    const { node, path, prevDir, changes: d } = queue.shift();
    const length = path.length - 1;
    if (length > maxLength) continue;
    if (node === concept2) {
      const score = C - length - k * d;
      bestScore = Math.max(bestScore, score);
      continue;
    }
    const edges = getValidEdges(graph, node, outboundIsUp, predicates);
    for (const { neighbor, dir } of edges) {
      if (path.includes(neighbor)) continue;
      let newD = d;
      if (prevDir && dir !== prevDir) {
        newD += 1;
      }
      queue.push({
        node: neighbor,
        path: [...path, neighbor],
        prevDir: dir,
        changes: newD
      });
    }
  }
  return Math.max(bestScore, 0);
};

// src/lib/measures/nguyenAlMubaid.ts
var nguyenAlMubaid = (graph, concept1, concept2, options = {}) => {
  const { maxDepth, predicates } = options;
  const edgeDirection = options.edgeDirection ?? "parentToChild";
  if (maxDepth === void 0 || maxDepth <= 0) {
    return 0;
  }
  const spLength = getShortestPathLength(graph, concept1, concept2, predicates);
  if (spLength === null || spLength <= 0) {
    return 0;
  }
  const lcas = findLCAs(graph, concept1, concept2, predicates, edgeDirection);
  if (lcas.length === 0) {
    return 0;
  }
  let maxDepthLCA = 0;
  for (const lca of lcas) {
    const depthLCA = getDepth(graph, lca, predicates, edgeDirection);
    maxDepthLCA = Math.max(maxDepthLCA, depthLCA);
  }
  const d = maxDepthLCA;
  const value = 2 + (spLength - 1) * (maxDepth - d);
  if (value <= 0) {
    return 0;
  }
  return Math.log(value);
};

// src/lib/measures/batet.ts
var batet = (graph, concept1, concept2, options = {}) => {
  const edgeDirection = options.edgeDirection ?? "parentToChild";
  const value = _batetCommonInfo(graph, concept1, concept2, options, edgeDirection);
  if (value <= 0) {
    return 0;
  }
  return -Math.log2(value) || 0;
};
function _batetCommonInfo(graph, concept1, concept2, options, edgeDirection) {
  const { predicates } = options;
  const ancestors1 = getAncestorSet(graph, concept1, predicates, edgeDirection);
  const ancestors2 = getAncestorSet(graph, concept2, predicates, edgeDirection);
  if (ancestors1.size === 0 || ancestors2.size === 0) {
    return 0;
  }
  const union = /* @__PURE__ */ new Set([...ancestors1, ...ancestors2]);
  const intersection = new Set([...ancestors1].filter((x) => ancestors2.has(x)));
  const unionSize = union.size;
  const intersectionSize = intersection.size;
  if (unionSize === 0) {
    return 0;
  }
  const numerator = unionSize - intersectionSize;
  return numerator / unionSize;
}

// src/lib/measures/zhong.ts
var zhong = (graph, concept1, concept2, options = {}) => {
  const edgeDirection = options.edgeDirection ?? "parentToChild";
  const k = options.kZhong ?? 2;
  if (k <= 1) {
    return 0;
  }
  const lcas = findLCAs(graph, concept1, concept2, options.predicates, edgeDirection);
  if (lcas.length === 0) {
    return 0;
  }
  const depth1 = getDepth(graph, concept1, options.predicates, edgeDirection);
  const depth2 = getDepth(graph, concept2, options.predicates, edgeDirection);
  if (depth1 === 0 || depth2 === 0) {
    return 0;
  }
  let bestScore = -Infinity;
  for (const lca of lcas) {
    const depthLCA = getDepth(graph, lca, options.predicates, edgeDirection);
    if (depthLCA > 0) {
      const score = 2 * (1 / (2 * Math.pow(k, depthLCA))) - 1 / (2 * Math.pow(k, depth1)) - 1 / (2 * Math.pow(k, depth2));
      bestScore = Math.max(bestScore, score);
    }
  }
  return bestScore > 0 ? bestScore : 0;
};

// src/lib/measures/simTBK.ts
function computeLambda(graph, concept1, concept2, predicates, edgeDirection = "parentToChild") {
  if (concept1 === concept2) {
    return 1;
  }
  const ancestors1 = getAncestorSet(graph, concept1, predicates, edgeDirection);
  const ancestors2 = getAncestorSet(graph, concept2, predicates, edgeDirection);
  const isSameHierarchy = ancestors1.has(concept2) || ancestors2.has(concept1);
  return isSameHierarchy ? 0 : 1;
}
var simTBK = (graph, concept1, concept2, options = {}) => {
  const edgeDirection = options.edgeDirection ?? "parentToChild";
  const lcas = findLCAs(graph, concept1, concept2, options.predicates, edgeDirection);
  if (lcas.length === 0) {
    return 0;
  }
  const depth1 = getDepth(graph, concept1, options.predicates, edgeDirection);
  const depth2 = getDepth(graph, concept2, options.predicates, edgeDirection);
  if (depth1 === 0 || depth2 === 0) {
    return 0;
  }
  const lambda = computeLambda(graph, concept1, concept2, options.predicates, edgeDirection);
  let bestScore = 0;
  for (const lca of lcas) {
    const depthLCA = getDepth(graph, lca, options.predicates, edgeDirection);
    const path1 = Math.abs(depth1 - depthLCA);
    const path2 = Math.abs(depth2 - depthLCA);
    if (depthLCA > 0 && path1 !== null && path2 !== null) {
      const N1 = depth1;
      const N2 = depth2;
      const N = depthLCA;
      const wuPalmerFactor = 2 * N / (N1 + N2);
      const PF = lambda === 0 ? 1 : 1 / (Math.abs(N1 - N2) + 1);
      const score = wuPalmerFactor * PF;
      bestScore = Math.max(bestScore, score);
    }
  }
  return bestScore;
};

// src/lib/measures/li.ts
var li = (graph, concept1, concept2, options = {}) => {
  const { alpha = 0.2, beta = 0.45 } = options;
  const edgeDirection = options.edgeDirection ?? "parentToChild";
  const lcas = findLCAs(graph, concept1, concept2, options.predicates, edgeDirection);
  if (lcas.length === 0) {
    return 0;
  }
  const pathLength = getShortestPathLength(graph, concept1, concept2, options.predicates);
  if (pathLength === null) {
    return 0;
  }
  let bestScore = 0;
  for (const lca of lcas) {
    const depthLCA = getDepth(graph, lca, options.predicates, edgeDirection);
    if (depthLCA > 0) {
      const expPart = Math.exp(-alpha * pathLength);
      const expBetaH = Math.exp(beta * depthLCA);
      const expNegBetaH = Math.exp(-beta * depthLCA);
      const df = (expBetaH - expNegBetaH) / (expBetaH + expNegBetaH);
      const score = expPart * df;
      bestScore = Math.max(bestScore, score);
    }
  }
  return bestScore;
};

// src/lib/measures/sanchez.ts
var sanchez = (graph, concept1, concept2, options = {}) => {
  const edgeDirection = options.edgeDirection ?? "parentToChild";
  const { TFSanchez, predicates } = options;
  let set_c1;
  let set_c2;
  if (TFSanchez && TFSanchez.has(concept1) && TFSanchez.has(concept2)) {
    set_c1 = TFSanchez.get(concept1);
    set_c2 = TFSanchez.get(concept2);
  } else {
    set_c1 = getAncestorSet(graph, concept1, predicates, edgeDirection);
    set_c2 = getAncestorSet(graph, concept2, predicates, edgeDirection);
  }
  if (set_c1.size === 0 || set_c2.size === 0) {
    return 1;
  }
  const diff_c1_c2 = /* @__PURE__ */ new Set();
  for (const item of set_c1) {
    if (!set_c2.has(item)) diff_c1_c2.add(item);
  }
  const diff_c2_c1 = /* @__PURE__ */ new Set();
  for (const item of set_c2) {
    if (!set_c1.has(item)) diff_c2_c1.add(item);
  }
  const intersection = new Set([...set_c1].filter((x) => set_c2.has(x)));
  const denominator = diff_c1_c2.size + diff_c2_c1.size + intersection.size;
  if (denominator === 0) {
    return 1;
  }
  return Math.log2(1 + (diff_c1_c2.size + diff_c2_c1.size) / denominator);
};

// src/lib/measures/lin.ts
var lin = (graph, concept1, concept2, options = {}) => {
  const { predicates, ic } = options;
  const edgeDirection = options.edgeDirection ?? "parentToChild";
  if (!ic) {
    return 0;
  }
  const concept1IC = ic.get(concept1);
  const concept2IC = ic.get(concept2);
  if (concept1IC === void 0 || concept2IC === void 0) {
    return 0;
  }
  const sumIC = concept1IC + concept2IC;
  if (sumIC === 0) {
    return 0;
  }
  const lcas = findLCAs(graph, concept1, concept2, predicates, edgeDirection);
  if (lcas.length === 0) {
    return 0;
  }
  let maxIC = 0;
  for (const lca of lcas) {
    const lcaIC = ic.get(lca);
    if (lcaIC !== void 0 && lcaIC > maxIC) {
      maxIC = lcaIC;
    }
  }
  return 2 * maxIC / sumIC;
};

// src/lib/measures/jiangConrath.ts
var jiangConrath = (graph, concept1, concept2, options = {}) => {
  const { predicates, ic } = options;
  const edgeDirection = options.edgeDirection ?? "parentToChild";
  if (!ic) {
    return 0;
  }
  const concept1IC = ic.get(concept1);
  const concept2IC = ic.get(concept2);
  if (concept1IC === void 0 || concept2IC === void 0) {
    return 0;
  }
  const lcas = findLCAs(graph, concept1, concept2, predicates, edgeDirection);
  if (lcas.length === 0) {
    return 0;
  }
  let maxIC = 0;
  for (const lca of lcas) {
    const lcaIC = ic.get(lca);
    if (lcaIC !== void 0 && lcaIC > maxIC) {
      maxIC = lcaIC;
    }
  }
  return concept1IC + concept2IC - 2 * maxIC;
};
export {
  _batetCommonInfo,
  batet,
  computeLambda,
  hirstStOnge,
  jiangConrath,
  leacockChodorow,
  li,
  lin,
  nguyenAlMubaid,
  pekarStaab,
  radaSimilarity,
  resnikEdge,
  resnikIC,
  sanchez,
  shortestPath,
  simTBK,
  wuPalmer,
  zhong
};
//# sourceMappingURL=index.js.map