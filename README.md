# Graph-Based Semantic Measures

Graph (path and feature-based) semantic similarity and relatedness measures using graphology MultiDirectedGraphs.

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
  wuPalmer,
  leacockChodorow,
  hirstStOnge,
} from 'graph-based-sms';

const graph = new MultiDirectedGraph();
graph.addNode('animal', 'mammal', 'bird', 'dog', 'cat');
graph.addEdge('mammal', 'animal', { predicate: 'is-a' });
graph.addEdge('bird', 'animal', { predicate: 'is-a' });
graph.addEdge('dog', 'mammal', { predicate: 'is-a' });
graph.addEdge('cat', 'mammal', { predicate: 'is-a' });

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
hirstStOnge(graph, 'dog', 'cat', { C: 8, k: 1, maxLength: 5 }); // 5
```

## Semantic Measures

This package covers measures that can be calculated from the graph, with no additional semantic evidence necessary. These include path-based measures, where the strength of the relation is evaluated through the analysis of paths between the two concepts, their ancestors or the graph root; and feature-based measures in which the feature sets are derived from the graph, e.g. the sets of ancestors or siblings.

### Path-based measures

This package implements well-known edge-based semantic similarity and relatedness measures from the literature.

#### Shortest Path (Rada Distance)

Rada et al. define the conceptual distance between two concepts based on the shortest path between them in a taxonomy:

$$\mathrm{m}(c_1,c_2) = \mathrm{length}(\mathrm{sp}(c_1,c_2))$$

**Source:** Definition 1, p. 20 in Rada et al. (1989). Also Equation (1), p. 2 in Harispe et al. (2014), Equation (3.12), p. 88 in Harispe et al. (2015).

#### Rada Similarity

Often Rada's distance is converted to a similarity measure using the formula:

$$\mathrm{m}(c_1,c_2) = \frac{1}{1 + \mathrm{length}(\mathrm{sp}(c_1,c_2))}$$

**Source:** Equation (1), p. 334 in Rezgui et al. (2013). Also Equation (1), p. 6 in Chandrasekaran & Mago (2022), Equation (3.13), p. 88 in Harispe et al. (2015).

#### Resnik (Edge)

While Resnik's original paper focuses on information-based measures, it also includes an edge-based measure defined as:

$$\mathrm{m}(c_1,c_2) = 2 \times \mathrm{D}-\mathrm{length}(sp(c1,c2))$$

where:
- $\mathrm{D}$ is the depth of the taxonomy
- $\mathrm{sp}(c1,c2)$ is the shortest path between concepts $c1$ and $c2$

**Source:** Equation (5), p. 101 in Resnik (1999). Also Equation (3.14), p. 89 in Harispe et al. (2015).

#### Wu-Palmer

Wu and Palmer define a similarity measure based on the depth of the least common subsumer (LCS) of two concepts and the lengths of the shortest paths from each concept to the LCS:

$$\mathrm{m}(c_1,c_2) = \frac{2 \times \mathrm{depth}(LCS(c_1,c_2))}{2 \times \mathrm{depth}(LCS(c_1,c_2)) + \mathrm{length}(\mathrm{sp}(c_1,LCS(c_1,c_2))) + \mathrm{length}(\mathrm{sp}(c_2,LCS(c_1,c_2)))}$$

**Source:** Unnumbered equation in p. 136 in Wu & Palmer (1994). Also Equation (3), p. 3 in Harispe et al. (2014), Equation (3.16), p. 89 in Harispe et al. (2015).

#### Leacock-Chodorow

Defined as the negative log of the shortest path distance normalized by the taxonomy depth:

$$\mathrm{m}(c_1,c_2) = \log (2 \times D) - \log(N)$$

where:
- $D$ is the depth of the taxonomy
- $N$ is the cardinality of the union of sets of nodes involved in the shortest paths $sp(c_1, LCA(c_1,c_2))$ and $sp(c_2, LCA(c_1,c_2))$

**Source:** Unnumbered equation in p. 275 in Leacock & Chodorow (1998). Also Equation (3.15), p. 89 in Harispe et al. (2015).

#### Hirst-St-Onge

A measure that combines shortest path length with the number of direction changes in the path:

$$\mathrm{m}(c_1,c_2) = C - \mathrm{length}(sp(c_1,c_2)) - k \times d$$

where:
- $C$ is a constant (default: 8)
- $k$ is a constant for weighting direction changes (default: 1)
- $d$ is the number of direction changes in the path

**Source:** Unnumbered equation in p.4 in Hirst & St-Onge (1998). Also Equation (2) in 
p. 4 in Slimani (2013).

#### Nguyen and Al-Mubaid

This measure takes into account the depth of the taxonomy and the depth of the LCS.

$$\mathrm{m(c_1,c_2) = log(2+(sp(c_1,c_2)-1)*(D-d))}$$

where:

- $D$ is the depth of the taxonomy
- $d$ is the depth of $LCS(c_1, c_2)$

**Source:** Equation (1) in p.625 in Nguyen and Al-Mubaid (2006). Also Equation (3) in 
p. 884 in McInnes et al. (2014).

### Feature-based

#### Batet et al.

This measure considers that the number of shared *superconcepts* (ancestors) an indication of proximity, and the amount of non-shared *superconcepts* as an indication of distance. 

$$\mathrm{m(c_1,c_2) = -log_2 \frac{|T(c_1) \cup  T(c_2)|-|T(c_1)\cap T(c_2)|}{|T(c_1) \cup  T(c_2)|}}$$

where:

- $T(c_i)$ is the set of superconcepts of $c_i$

**Source:** Equation (14) in p. 122 in Batet et al. (2011).


## Options

All measures accept an optional `ExtraOptions` object:

- `predicates?: string | string[]` - Filter edges by predicate(s)
- `maxDepth?: number` - Maximum depth of the taxonomy (required for Resnik Edge and Leacock-Chodorow)

Additional options for Hirst-St-Onge:

- `C?: number` - Constant (default: 8)
- `k?: number` - Direction change weight (default: 1)
- `maxLength?: number` - Maximum path length (default: 5)

## References

- [1] P. Resnik, "Semantic similarity in a taxonomy: An information-based measure and its application to problems of ambiguity in natural language", Journal of artificial intelligence research, vol. 11, pp. 95–130, 1999.
- [2] S. Harispe, D. Sánchez, S. Ranwez, S. Janaqi, and J. Montmain, "A framework for unifying ontology-based semantic similarity measures: A study in the biomedical domain", Journal of biomedical informatics, vol. 48, pp. 38–53, 2014.
- [3] R. Rada, H. Mili, E. Bicknell, and M. Blettner, "Development and application of a metric on semantic Nets", IEEE transactions on systems, man, and cybernetics, vol. 19, no. 1, pp. 17–30, 1989.
- [4] K. Rezgui, H. Mhiri, and K. Ghédira, "Theoretical formulas of semantic measure: a survey", Journal of Emerging Technologies in Web Intelligence, vol. 5, no. 4, pp. 333–342, 2013.
- [5] D. Chandrasekaran and V. Mago, "Evolution of Semantic Similarity -- A Survey", ACM Comput. Surv., vol. 54, no. 2, pp. 1–37, Mar. 2022, doi: 10.1145/3440755.
- [6] S. Harispe, S. Ranwez, S. Janaqi, and J. Montmain, "Semantic similarity from natural language and ontology analysis", Synthesis Lectures on Human Language Technologies, vol. 8, no. 1, pp. 1–254, 2015.
- [7] Z. Wu and M. Palmer, "Verb Semantics and Lexical Selection", in 32nd Annual Meeting of the Association for Computational Linguistics, 1994, pp. 133–138.
- [8] C. Leacock and M. Chodorow, "Combining Local Context and WordNet Similarity for Word Sense", WordNet: An electronic lexical database, p. 265, 1998.
- [9] G. Hirst and D. St-Onge, "Lexical Chains as Representations of Context for the Detection and Correction of Malapropisms," WordNet: An electronic lexical database, vol. 305, pp. 305–332, 1998.
- [10] H. A. Nguyen and H. Al-Mubaid, "New ontology-based semantic similarity measure for the biomedical domain," in 2006 IEEE International Conference on Granular Computing, pp. 623–628, 2006.
- [11] B. T. McInnes, T. Pedersen, Y. Liu, G. B. Melton, and S. V. Pakhomov, "U-path: An undirected path-based measure of semantic similarity," in AMIA Annual Symposium Proceedings, vol. 2014, p. 882, 2014.
- [12] T. Slimani, "Description and evaluation of semantic similarity measures approaches," arXiv preprint arXiv:1310.8059, 2013.
- [13] M. Batet, D. Sánchez, and A. Valls, "An Ontology-Based Measure to Compute Semantic Similarity in Biomedicine," Journal of biomedical informatics, vol. 44, no. 1, pp. 118–125, 2011.
