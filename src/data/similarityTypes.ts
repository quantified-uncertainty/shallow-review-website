/**
 * Types and constants for similarity calculations - safe for client-side use
 */

export interface AgendaNode {
  id: string;
  name: string;
  sectionId: string;
  sectionName: string;
  broadApproaches: string[];
  orthodoxProblems: string[];
  targetCase: string | null;
  fundedBy: string[];
  lesswrongTags: string[];
  researchers: string[];
  paperCount: number;
}

export interface SimilarityEdge {
  source: string;
  target: string;
  similarity: number;
  // Breakdown of similarity components
  approachSimilarity: number;
  problemSimilarity: number;
  targetCaseMatch: boolean;
  funderSimilarity: number;
  tagSimilarity: number;
  researcherSimilarity: number;
}

export interface SimilarityGraphData {
  nodes: AgendaNode[];
  edges: SimilarityEdge[];
}

// Weights for different similarity components
export const DEFAULT_WEIGHTS = {
  broadApproaches: 0.25,
  orthodoxProblems: 0.25,
  targetCase: 0.1,
  fundedBy: 0.1,
  lesswrongTags: 0.1,
  researchers: 0.2,
};

export type SimilarityWeights = typeof DEFAULT_WEIGHTS;
