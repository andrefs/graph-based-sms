# Graph-Based Semantic Measures

Graph (path and feature-based) semantic similarity and relatedness measures using graphology MultiDirectedGraphs.

> This package replaces `graph-edge-sms`. The original package only included edge-based measures; this package extends it to also include feature-based measures as long as they require only information from the graph.

## Installation

```bash
npm install
```

## Usage

```typescript
import { MultiDirectedGraph } from 'graphology';
import {
  shortestPath,
  radaSimilarity,
  resnikEdge,
  resnikIC,
  wuPalmer,
  pekarStaab,
  leacockChodorow,
  hirstStOnge,
  nguyenAlMubaid,
  batet,
  zhong,
  simTBK,
  li,
  sanchez,
  lin,
  jiangConrath,
} from 'graph-based-sms';

const graph = new MultiDirectedGraph();
graph.addNode('animal', 'mammal', 'bird', 'dog', 'cat');
// Edges from parent to child (default direction)
graph.addEdge('animal', 'mammal', { predicate: 'is-a' });
graph.addEdge('animal', 'bird', { predicate: 'is-a' });
graph.addEdge('mammal', 'dog', { predicate: 'is-a' });
graph.addEdge('mammal', 'cat', { predicate: 'is-a' });

// Shortest path (Rada Distance)
shortestPath(graph, 'dog', 'cat'); // 2

// Rada Similarity
radaSimilarity(graph, 'dog', 'cat'); // 0.333...

// Resnik Edge (requires maxDepth)
resnikEdge(graph, 'dog', 'cat', { maxDepth: 3 }); // 4

// Wu-Palmer
wuPalmer(graph, 'dog', 'cat'); // 0.5

// Leacock-Chodorow (requires maxDepth)
leacockChodorow(graph, 'dog', 'cat', { maxDepth: 3 }); // 0.693...

// Hirst-St-Onge
hirstStOnge(graph, 'dog', 'cat', { C: 8, kHSO: 1, maxLength: 5 }); // 5

// Pekar-Staab
pekarStaab(graph, 'dog', 'cat'); // 0.333...

// Nguyen-AlMubaid (requires maxDepth)
nguyenAlMubaid(graph, 'dog', 'cat', { maxDepth: 3 }); // 0.693...

// Batet
batet(graph, 'dog', 'cat'); // 1

// Zhong (requires k)
zhong(graph, 'dog', 'cat', { kZhong: 2 }); // 0.125

// simTBK
simTBK(graph, 'dog', 'cat'); // 0.5

// Li et al. (optional alpha and beta)
li(graph, 'dog', 'cat'); // 0.283...

// Sánchez et al. (dissimilarity)
sanchez(graph, 'dog', 'cat'); // 0.585...

// Resnik IC (requires ic Map)
const ic = new Map([['animal', 0], ['mammal', 1], ['bird', 1], ['dog', 2], ['cat', 2]]);
resnikIC(graph, 'dog', 'cat', { ic }); // 1

// Lin (requires ic Map)
lin(graph, 'dog', 'cat', { ic }); // 0.5

// Jiang-Conrath (requires ic Map)
jiangConrath(graph, 'dog', 'cat', { ic }); // 2
```

**Note on edge direction:** By default, this package assumes edges go from **parent to child** (`edgeDirection: 'parentToChild'`). This is the most common way to build taxonomies. If your graph has edges in the opposite direction (child to parent), pass `{ edgeDirection: 'childToParent' }` as an option to any measure function.

## Semantic Measures

This package covers measures that can be calculated from the graph, with no additional semantic evidence necessary. These include path-based measures, where the strength of the relation is evaluated through the analysis of paths between the two concepts, their ancestors or the graph root; and feature-based measures in which the feature sets are derived from the graph, e.g. the sets of ancestors or siblings.

**Note on measure types:** This package includes both **distance** measures (0 = identical, higher values = less similar) and **similarity** measures (higher values = more similar). Each measure's description indicates its type below.

### Path-based measures

This package implements well-known edge-based semantic similarity and relatedness measures from the literature.

#### Shortest Path (Rada Distance)

Rada et al. define the conceptual **distance** between two concepts based on the shortest path between them in a taxonomy:

$$\mathrm{m}(c_1,c_2) = \mathrm{length}(\mathrm{sp}(c_1,c_2))$$

**Source:** Definition 1, p. 20 in [[3]](#ref-3). Also Equation (1), p. 2 in [[2]](#ref-2); Equation (3.12), p. 88 in [[6]](#ref-6).

#### Rada Similarity

Often Rada's distance is converted to a similarity measure using the formula:

$$\mathrm{m}(c_1,c_2) = \frac{1}{1 + \mathrm{length}(\mathrm{sp}(c_1,c_2))}$$

**Source:** Equation (1), p. 334 in [[4]](#ref-4). Also Equation (1), p. 6 in [[5]](#ref-5); Equation (3.13), p. 88 in [[6]](#ref-6).

#### Resnik (Edge)

While Resnik's original paper focuses on information-based measures, it also includes an edge-based measure defined as:

$$\mathrm{m}(c_1,c_2) = 2 \times \mathrm{D}-\mathrm{length}(sp(c1,c2))$$

where:
- $\mathrm{D}$ is the depth of the taxonomy
- $\mathrm{sp}(c1,c2)$ is the shortest path between concepts $c1$ and $c2$

**Source:** Equation (5), p. 101 in [[1]](#ref-1). Also Equation (3.14), p. 89 in [[6]](#ref-6).

#### Wu-Palmer

Wu and Palmer define a similarity measure based on the depth of the least common subsumer (LCS) of two concepts and the lengths of the shortest paths from each concept to the LCS:

$$\mathrm{m}(c_1,c_2) = \frac{2 \times \mathrm{depth}(LCS(c_1,c_2))}{2 \times \mathrm{depth}(LCS(c_1,c_2)) + \mathrm{length}(\mathrm{sp}(c_1,LCS(c_1,c_2))) + \mathrm{length}(\mathrm{sp}(c_2,LCS(c_1,c_2)))}$$

**Source:** Unnumbered equation in p. 136 in [[7]](#ref-7). Also Equation (3), p. 3 in [[2]](#ref-2); Equation (3.16), p. 89 in [[6]](#ref-6).

#### Pekar-Staab

A variation of Wu-Palmer with different normalization:

$$\mathrm{m(c_1,c_2)} = \frac{depth(LCS(c_1,c_2))}{\mathrm{length}(\mathrm{sp}(c_1,LCS(c_1,c_2))) + \mathrm{length}(\mathrm{sp}(c_2,LCS(c_1,c_2))) + depth(LCS(c_1,c_2))}$$

**Source:** Equation (2) in the third page in [[14]](#ref-14). Also in Equation (3.17), p. 89 in [[6]](#ref-6).

#### simTBK

An adaptation of Wu-Palmer which penalizes concepts defined in the neighborhood:

$$\mathrm{m(c_1,c_2)} = \frac{2 \cdot N}{N_1 + N_2} \times PF(c_1,c_2)$$

where:

- the first multiplying factor is the Wu-Palmer function
- $N_1$, $N_2$ and $N$ are, respectively, the depths of nodes $c_1$, $c_2$ and of their LCS
- $$PF$$ is the penalization factor given by $$PF(c_1,c_2) =$$
  - 1, if $$\lambda = 0$$
  - $$\frac{1}{|N1-N2|+1}$$, if $$\lambda = 1$$
- $$\lambda$$ is 
  - 0 when $c_1$ and $c_2$ are in the same hierarchy
  - 1 when $c_1$ and $c_2$ are two concepts in neighborhood


**Source**: This measure was first published in an unnumbered equation, p. 775 in [[16]](#ref-16). This original formula has $PF = (1-\lambda)(\min(N_1,N_2)-N) + \lambda(|N_1-N_2|+1)^{-1}$, which gives $PF=0$ for all ancestor-descendant pairs ($\lambda=0$), contradicting the paper's own examples.
In a later publication the authors provided an updated version, which is the one we used here, where $PF=1$ for $\lambda=0$: unnumbered equation in p. 6 in [[22]](#ref-22). Also Equations (11) and (12), p. 6 in [[23]](#ref-23).

#### Zhong

Zhong et al. also take into account the notion of depth, defining a **distance** measure:

$$\mathrm{m(c_1,c_2)} = 2 \cdot \frac{1}{2k^{\mathrm{depth}(LCS(c_1,c_2))}} - \frac{1}{2k^{\mathrm{depth}(c_1)}}  - \frac{1}{2k^{\mathrm{depth}(c_2)}}$$

where:

- $k : {k\in \mathbb{R}∣k>1}$ defines the contribution of the depth

**Source:** Unnumbered equation on the fifth page in [[15]](#ref-15). Also Equation (3.18), p. 90 in [[6]](#ref-6).


#### Leacock-Chodorow

Defined as the negative log of the shortest path distance normalized by the taxonomy depth:

$$\mathrm{m}(c_1,c_2) = \log (2 \times D) - \log(N)$$

where:
- $D$ is the depth of the taxonomy
- $N$ is the cardinality of the union of sets of nodes involved in the shortest paths $sp(c_1, LCA(c_1,c_2))$ and $sp(c_2, LCA(c_1,c_2))$

**Source:** Unnumbered equation in p. 275 in [[8]](#ref-8). Also Equation (3.15), p. 89 in [[6]](#ref-6).

#### Hirst-St-Onge

A measure that combines shortest path length with the number of direction changes in the path:

$$\mathrm{m}(c_1,c_2) = C - \mathrm{length}(sp(c_1,c_2)) - k \times d$$

where:
- $C$ is a constant (default: 8)
- $k$ is a constant for weighting direction changes (default: 1)
- $d$ is the number of direction changes in the path

**Source:** Unnumbered equation in p.4 in [[9]](#ref-9). Also Equation (2), p. 4 in [[12]](#ref-12).

#### Nguyen and Al-Mubaid

This **distance** measure takes into account the depth of the taxonomy and the depth of the LCS.

$$\mathrm{m(c_1,c_2) = log(2+(sp(c_1,c_2)-1)*(D-d))}$$

where:

- $D$ is the depth of the taxonomy
- $d$ is the depth of $LCS(c_1, c_2)$

**Source:** Equation (1) in p.625 in [[10]](#ref-10). Also Equation (4), p. 884 in [[11]](#ref-11).

#### Li et al.

This measure also takes into account the length of the shortest path and the depth of the LCA:

$$\mathrm{m(c_1,c_2)} = e^{-\alpha \cdot \mathrm{length}(sp(c_1,c_2))} \times df(c_1,c_2)$$

where:

- $$df(c_1,c_2) = \frac{e^{\beta h}-e^{-\beta h}}{e^{\beta h}+e^{-\beta h}}$$
- $$h = \mathrm{depth}(LCS(c_1,c_2))$$
- $$\beta > 0$$ is used to tune the depth factor $$df$$
- $$\alpha \geqslant 0$$ controls the importance of the taxonomic distance

**Source:** Equation (5), p. 14 in [[17]](#ref-17). Also Equation (3.19), p. 90 in [[6]](#ref-6).


### Feature-based

#### Batet et al.

This measure considers that the number of shared *superconcepts* (ancestors) an indication of proximity, and the amount of non-shared *superconcepts* as an indication of **distance**. 

$$\mathrm{m(c_1,c_2) = -log_2 \frac{|T(c_1) \cup  T(c_2)|-|T(c_1)\cap T(c_2)|}{|T(c_1) \cup  T(c_2)|}}$$

where:

- $T(c_i)$ is the set of superconcepts of $c_i$

**Source:** Equation (14) in p. 122 in [[13]](#ref-13). Also Equation (5), p. 884 in [[11]](#ref-11).

#### Sánchez et al.

A measure of **dissimilarity** given by the cardinality of the set of differential features between both nodes:

$$d(c_1,c_2) = log_2  \left(1+   \frac{|\phi(c_1) \backslash \phi(c_2)| +|\phi(c_2) \backslash \phi(c_1)|}{|\phi(c_1) \backslash \phi(c_2)| +|\phi(c_2) \backslash \phi(c_1)| + |\phi(c_1) \cap \phi(c_2)|} \right) $$

where:

- $$\phi(a)$$ are the *taxonomical features* (i.e. the subsumers) of node $$a$$
- $$\phi(a) \backslash \phi(b)$$ represents the subsumers of $$a$$ that are not subsumers of $$b$$

**Source:** Equation (24), p. 7723 in [[18]](#ref-18).

### Information-content-based

These measures take into account the information content (IC) of each node. This metric can be calculated using external sources (extrinsic IC), e.g. by measuring the frequency of each node and their homonym* in a corpus; or from the graph itself (intrinsic IC), e.g. by counting the number of descendants of each node in the graph.

#### Resnik (IC)

The similarity between two nodes is given simply by the information content of their LCS.

$$m(c_1,c_2) = \mathrm{max}[-\mathrm{log~ p}(c)], c \in {S(c_1,c_2)]}$$

where:

- $$\mathrm{p}(c)$$ is the probability of encountering an instance of concept $$c$$
- $$S(c_1,c_2)$$ is the set of subsumers of both $$c_1$$ and $$c_2$$.

In practice, this is often simplified as $$m(c_1,c_2) = IC(LCS(c_1,c_2))$$, with $$IC$$ being a function that maps each node to their information content value.

**Source:** Equation (1), p. 449 in [[19]](#ref-19). Also Equation (1), p. 97 in [[1]](#ref-1); Equation (16), p. 7721 in [[18]](#ref-18).

#### Lin

Takes the IC-based measure from Resnik but also incorporates the IC from each node:

$$m(c_1,c_2) = \frac{2 \times \mathrm{resnik_{IC}}(c_1,c_2)}{(IC(c_1)+IC(c_2))}$$

where:

- $$\mathrm{resnik_{IC}}(c_1,c_2)$$ is the IC-based measure from Resnik
- $$IC(a)$$ is the information content value of node $$a$$

**Source:** Unnumbered equation on the sixth page in [[21]](#ref-21). Also Equation (17), p. 7721 in [[18]](#ref-18); Equation (3.29), p. 94 in [[6]](#ref-6).

#### Jiang and Conrath

Similar to Lin, this **distance** measure improves upon the Resnik IC measure by also including the nodes ICs.

$$m(c_1,c_2) = IC(c_1) + IC(c_2) - 2 \cdot \mathrm{resnik_{IC}}(c_1,c_2)$$

**Source:**  Equation (15), p. 26 in [[20]](#ref-20). Also Equation (18), p. 7721 in [[18]](#ref-18); Equation (3.30), p. 94 in [[6]](#ref-6).


## Options

All measures accept an optional `ExtraOptions` object:

- `edgeDirection?: 'parentToChild' | 'childToParent'` - Direction of edges in the taxonomy. Default: `'parentToChild'`.
- `predicates?: string | string[]` - Filter edges by predicate(s)
- `maxDepth?: number` - Maximum depth of the taxonomy (required for Resnik Edge, Leacock-Chodorow, and Nguyen-AlMubaid)
- `ic?: Map<string, number>` - Information content values for nodes (required for Resnik IC, Lin, and Jiang-Conrath)
- `kZhong?: number` - Depth factor for Zhong (default: 2)
- `alpha?: number` - Distance weight for Li et al. (default: 0.2)
- `beta?: number` - Depth factor for Li et al. (default: 0.45)
- `C?: number` - Constant for Hirst-St-Onge (default: 8)
- `kHSO?: number` - Direction change weight for Hirst-St-Onge (default: 1)
- `maxLength?: number` - Maximum path length for Hirst-St-Onge (default: 5)

## References

- <a id="ref-1"></a>[1] P. Resnik, "Semantic similarity in a taxonomy: An information-based measure and its application to problems of ambiguity in natural language", Journal of artificial intelligence research, vol. 11, pp. 95–130, 1999.
- <a id="ref-2"></a>[2] S. Harispe, D. Sánchez, S. Ranwez, S. Janaqi, and J. Montmain, "A framework for unifying ontology-based semantic similarity measures: A study in the biomedical domain", Journal of biomedical informatics, vol. 48, pp. 38–53, 2014.
- <a id="ref-3"></a>[3] R. Rada, H. Mili, E. Bicknell, and M. Blettner, "Development and application of a metric on semantic Nets", IEEE transactions on systems, man, and cybernetics, vol. 19, no. 1, pp. 17–30, 1989.
- <a id="ref-4"></a>[4] K. Rezgui, H. Mhiri, and K. Ghédira, "Theoretical formulas of semantic measure: a survey", Journal of Emerging Technologies in Web Intelligence, vol. 5, no. 4, pp. 333–342, 2013.
- <a id="ref-5"></a>[5] D. Chandrasekaran and V. Mago, "Evolution of Semantic Similarity -- A Survey", ACM Comput. Surv., vol. 54, no. 2, pp. 1–37, Mar. 2022, doi: 10.1145/3440755.
- <a id="ref-6"></a>[6] S. Harispe, S. Ranwez, S. Janaqi, and J. Montmain, "Semantic similarity from natural language and ontology analysis", Synthesis Lectures on Human Language Technologies, vol. 8, no. 1, pp. 1–254, 2015.
- <a id="ref-7"></a>[7] Z. Wu and M. Palmer, "Verb Semantics and Lexical Selection", in 32nd Annual Meeting of the Association for Computational Linguistics, 1994, pp. 133–138.
- <a id="ref-8"></a>[8] C. Leacock and M. Chodorow, "Combining Local Context and WordNet Similarity for Word Sense", WordNet: An electronic lexical database, p. 265, 1998.
- <a id="ref-9"></a>[9] G. Hirst and D. St-Onge, "Lexical Chains as Representations of Context for the Detection and Correction of Malapropisms," WordNet: An electronic lexical database, vol. 305, pp. 305–332, 1998.
- <a id="ref-10"></a>[10] H. A. Nguyen and H. Al-Mubaid, "New ontology-based semantic similarity measure for the biomedical domain," in 2006 IEEE International Conference on Granular Computing, pp. 623–628, 2006.
- <a id="ref-11"></a>[11] B. T. McInnes, T. Pedersen, Y. Liu, G. B. Melton, and S. V. Pakhomov, "U-path: An undirected path-based measure of semantic similarity," in AMIA Annual Symposium Proceedings, vol. 2014, p. 882, 2014.
- <a id="ref-12"></a>[12] T. Slimani, "Description and Evaluation of Semantic Similarity Measures Approaches," International Journal of Computer Applications, vol. 80, no. 10, pp. 25–33, 2013.
- <a id="ref-13"></a>[13] M. Batet, D. Sánchez, and A. Valls, "An Ontology-Based Measure to Compute Semantic Similarity in Biomedicine," Journal of biomedical informatics, vol. 44, no. 1, pp. 118–125, 2011.
- <a id="ref-14"></a>[14] V. Pekar and S. Staab, "Taxonomy learning-factoring the structure of a taxonomy into a semantic classification decision," in COLING 2002: The 19th International Conference on Computational Linguistics, 2002.
- <a id="ref-15"></a>[15] J. Zhong, H. Zhu, J. Li, and Y. Yu, "Conceptual graph matching for semantic search," in International Conference on Conceptual Structures, pp. 92–106, 2002.
- <a id="ref-16"></a>[16] T. Slimani, B. B. Yaghlane, and K. Mellouli, "A New Similarity Measure Based on Edge Counting," World Academy of Science, Engineering and Technology, vol. 23, no. 2006, pp. 34–38, 2006.
- <a id="ref-17"></a>[17] Y. Li, D. McLean, Z. A. Bandar, J. D. O'shea, and K. Crockett, "Sentence Similarity Based on Semantic Nets and Corpus Statistics," IEEE transactions on knowledge and data engineering, vol. 18, no. 8, pp. 1138–1150, 2006.
- <a id="ref-18"></a>[18] D. Sánchez, M. Batet, D. Isern, and A. Valls, "Ontology-based semantic similarity: A new feature-based approach," Expert systems with applications, vol. 39, no. 9, pp. 7718–7728, 2012.
- <a id="ref-19"></a>[19] P. Resnik, "Using Information Content to Evaluate Semantic Similarity in a Taxonomy," in Proceedings of the 14th International Joint Conference on Artificial Intelligence-Volume 1, 1995, pp. 448--453.
- <a id="ref-20"></a>[20] J. J. Jiang and D. W. Conrath, "Semantic similarity based on corpus statistics and lexical taxonomy," in Proceedings of the 10th research on computational linguistics international conference, 1997, pp. 19--33.
- <a id="ref-21"></a>[21] D. Lin, "An Information-Theoretic Definition of Similarity," in Proceedings of the Fifteenth International Conference on Machine Learning, 1998, pp. 296--304.
-  <a id="ref-22"></a>[22] T. Slimani, B. BenYaghlane, and K. Mellouli, "Une extension de mesure de similarité entre les concepts d'une ontologie," in International Conference on Sciences of Electronic, Technologies of Information and Telecommunications, pp. 1–10, 2007.
-  <a id="ref-23"></a>[23] A. N. Ngom, "Étude des mesures de similarité sémantique basées sur les arcs," in CORIA, pp. 535–544, 2015.
