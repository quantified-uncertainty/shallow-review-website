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
  keywords: string[];
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
  keywordSimilarity: number;
}

export interface SimilarityGraphData {
  nodes: AgendaNode[];
  edges: SimilarityEdge[];
}

// Weights for different similarity components (uniform by default)
export const DEFAULT_WEIGHTS = {
  broadApproaches: 0.2,
  orthodoxProblems: 0.2,
  targetCase: 0.2,
  fundedBy: 0.2,
  lesswrongTags: 0.2,
  researchers: 0.2,
  keywords: 0.2,
};

export type SimilarityWeights = typeof DEFAULT_WEIGHTS;
