/**
 * Server-side similarity calculation functions
 * For types and constants, import from ./similarityTypes
 */
import { Section } from "./types";
import { normalizeTargetCaseId } from "./loadData";
import {
  AgendaNode,
  SimilarityEdge,
  SimilarityGraphData,
  SimilarityWeights,
  DEFAULT_WEIGHTS,
} from "./similarityTypes";

// Re-export types for convenience in server components
export type { AgendaNode, SimilarityEdge, SimilarityGraphData, SimilarityWeights };
export { DEFAULT_WEIGHTS };

/**
 * Calculates Jaccard similarity between two sets
 * Returns 0 if both sets are empty
 */
function jaccardSimilarity(setA: string[], setB: string[]): number {
  if (setA.length === 0 && setB.length === 0) return 0;

  const a = new Set(setA);
  const b = new Set(setB);

  const intersection = new Set([...a].filter((x) => b.has(x)));
  const union = new Set([...a, ...b]);

  return intersection.size / union.size;
}

/**
 * Converts sections data into flat agenda nodes for graph visualization
 */
export function sectionsToNodes(sections: Section[]): AgendaNode[] {
  const nodes: AgendaNode[] = [];

  for (const section of sections) {
    for (const agenda of section.agendas || []) {
      nodes.push({
        id: agenda.id,
        name: agenda.name,
        sectionId: section.id,
        sectionName: section.name,
        broadApproaches: agenda.broadApproaches || [],
        orthodoxProblems: agenda.orthodoxProblems || [],
        targetCase: agenda.targetCase
          ? normalizeTargetCaseId(agenda.targetCase)
          : null,
        fundedBy: agenda.fundedBy || [],
        lesswrongTags: agenda.lesswrongTags || [],
        researchers: agenda.someNames || [],
        keywords: agenda.keywords || [],
        paperCount: agenda.papers?.length || 0,
      });
    }
  }

  return nodes;
}

/**
 * Calculates similarity between two agendas
 */
export function calculateAgendaSimilarity(
  a: AgendaNode,
  b: AgendaNode,
  weights: SimilarityWeights = DEFAULT_WEIGHTS
): SimilarityEdge {
  const approachSimilarity = jaccardSimilarity(a.broadApproaches, b.broadApproaches);
  const problemSimilarity = jaccardSimilarity(a.orthodoxProblems, b.orthodoxProblems);
  const targetCaseMatch = a.targetCase !== null && a.targetCase === b.targetCase;
  const funderSimilarity = jaccardSimilarity(a.fundedBy, b.fundedBy);
  const tagSimilarity = jaccardSimilarity(a.lesswrongTags, b.lesswrongTags);
  const researcherSimilarity = jaccardSimilarity(a.researchers, b.researchers);
  const keywordSimilarity = jaccardSimilarity(a.keywords, b.keywords);

  const similarity =
    weights.broadApproaches * approachSimilarity +
    weights.orthodoxProblems * problemSimilarity +
    weights.targetCase * (targetCaseMatch ? 1 : 0) +
    weights.fundedBy * funderSimilarity +
    weights.lesswrongTags * tagSimilarity +
    weights.researchers * researcherSimilarity +
    weights.keywords * keywordSimilarity;

  return {
    source: a.id,
    target: b.id,
    similarity,
    approachSimilarity,
    problemSimilarity,
    targetCaseMatch,
    funderSimilarity,
    tagSimilarity,
    researcherSimilarity,
    keywordSimilarity,
  };
}

/**
 * Generates all pairwise similarity edges above a threshold
 */
export function generateSimilarityEdges(
  nodes: AgendaNode[],
  weights: SimilarityWeights = DEFAULT_WEIGHTS,
  threshold: number = 0.1
): SimilarityEdge[] {
  const edges: SimilarityEdge[] = [];

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const edge = calculateAgendaSimilarity(nodes[i], nodes[j], weights);
      if (edge.similarity >= threshold) {
        edges.push(edge);
      }
    }
  }

  return edges;
}

/**
 * Generates full similarity graph data from sections
 */
export function generateSimilarityGraph(
  sections: Section[],
  weights: SimilarityWeights = DEFAULT_WEIGHTS,
  threshold: number = 0.1
): SimilarityGraphData {
  const nodes = sectionsToNodes(sections);
  const edges = generateSimilarityEdges(nodes, weights, threshold);

  return { nodes, edges };
}

/**
 * Get statistics about the similarity graph
 */
export function getGraphStats(graph: SimilarityGraphData) {
  const similarities = graph.edges.map((e) => e.similarity);
  const avgSimilarity =
    similarities.length > 0
      ? similarities.reduce((a, b) => a + b, 0) / similarities.length
      : 0;
  const maxSimilarity = similarities.length > 0 ? Math.max(...similarities) : 0;
  const minSimilarity = similarities.length > 0 ? Math.min(...similarities) : 0;

  // Count edges per node
  const edgeCounts = new Map<string, number>();
  for (const edge of graph.edges) {
    edgeCounts.set(edge.source, (edgeCounts.get(edge.source) || 0) + 1);
    edgeCounts.set(edge.target, (edgeCounts.get(edge.target) || 0) + 1);
  }

  const isolatedNodes = graph.nodes.filter(
    (n) => !edgeCounts.has(n.id)
  ).length;

  return {
    nodeCount: graph.nodes.length,
    edgeCount: graph.edges.length,
    avgSimilarity,
    maxSimilarity,
    minSimilarity,
    isolatedNodes,
    avgEdgesPerNode:
      graph.nodes.length > 0
        ? (graph.edges.length * 2) / graph.nodes.length
        : 0,
  };
}
