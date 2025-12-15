export interface Paper {
  title: string;
  url: string;
  authors?: string;
  year?: number;
  venue?: string;
  kind?: string;
}

// Flat section data (as stored in YAML files)
export interface SectionData {
  id: string;
  name: string;
  description?: string;
  parent?: string; // parent section ID (for sub-sections)
}

// Flat agenda data (as stored in YAML files)
export interface AgendaData {
  id: string;
  name: string;
  parent: string; // parent section or agenda ID
  summary?: string;
  theoryOfChange?: string;
  seeAlso?: string;
  orthodoxProblems?: string[];
  targetCase?: string;
  broadApproaches?: string[];
  someNames?: string[];
  estimatedFTEs?: string;
  critiques?: string[];
  fundedBy?: string[];
  fundedByText?: string; // Plain text funding info from pipeline
  lesswrongTags?: string[];
  keywords?: string[];
  resources?: AgendaResource[];
  wikipedia?: string;
  papers: Paper[];
}

export interface OrthodoxProblem {
  id: string;
  name: string;
  description: string;
  seeAlso?: { title: string; url: string }[];
}

export interface OrthodoxProblemsSource {
  title: string;
  url: string;
  author: string;
  date: string;
}

export interface OrthodoxProblemsData {
  source: OrthodoxProblemsSource;
  problems: OrthodoxProblem[];
}

export interface BroadApproach {
  id: string;
  name: string;
  description: string;
}

export interface BroadApproachesData {
  approaches: BroadApproach[];
}

export interface TargetCase {
  id: string;
  name: string;
  description: string;
}

export interface Funder {
  id: string;
  name: string;
  description: string;
  website?: string;
  wikipedia?: string;
}

export interface FundersData {
  funders: Funder[];
}

export interface Researcher {
  id: string;
  name: string;
}

export interface ResearchersData {
  researchers: Researcher[];
}

export interface TargetCasesData {
  cases: TargetCase[];
}

export interface AgendaResource {
  title: string;
  url: string;
}

export interface Keyword {
  id: string;
  name: string;
  description: string;
  category: string;
  lesswrongTags?: string[];
}

export interface KeywordCategory {
  id: string;
  name: string;
  description: string;
}

export interface KeywordsData {
  keywords: Keyword[];
  categories: KeywordCategory[];
}

export interface Agenda {
  id: string;
  name: string;
  parentAgendaId?: string; // ID of parent agenda (if this is a sub-agenda)
  parentSectionId?: string; // ID of parent sub-section (if under a sub-section)
  summary?: string;
  theoryOfChange?: string;
  seeAlso?: string;
  orthodoxProblems?: string[];
  targetCase?: string;
  broadApproaches?: string[];
  someNames?: string[];
  estimatedFTEs?: string;
  critiques?: string[];
  fundedBy?: string[];
  fundedByText?: string; // Plain text funding info from pipeline
  lesswrongTags?: string[];
  keywords?: string[];
  resources?: AgendaResource[];
  wikipedia?: string;
  papers: Paper[];
}

export interface Lab {
  id: string;
  name: string;
  description?: string;
  teams?: string;
  publicAlignmentAgenda?: string;
  publicPlan?: string;
  structure?: string;
  framework?: string;
  hostOrgStructure?: string;
  someNames?: string[];
  critiques?: string[];
  fundedBy?: string[];
  lesswrongTags?: string[];
  keywords?: string[];
  resources?: AgendaResource[];
  wikipedia?: string;
  papers?: Paper[];
}

export interface SubSection {
  id: string;
  name: string;
  description?: string;
}

export interface Section {
  id: string;
  name: string;
  description?: string;
  agendas?: Agenda[];
  labs?: Lab[];
  subSections?: SubSection[];
}

export interface ReviewData {
  sections: Section[];
}

export interface FlattenedAgenda extends Agenda {
  sectionId: string;
  sectionName: string;
  resolvedProblems: OrthodoxProblem[];
  resolvedApproaches: BroadApproach[];
  resolvedTargetCase: TargetCase | undefined;
  resolvedFunders: Funder[];
  resolvedKeywords: Keyword[];
  fundedByText?: string; // Plain text funding info
}

export interface FlattenedLab extends Lab {
  sectionId: string;
  sectionName: string;
  resolvedFunders: Funder[];
  resolvedKeywords: Keyword[];
}

export interface LabsData {
  labs: Lab[];
}

export interface LesswrongTag {
  slug: string;
  name: string;
  postCount: number;
}

export interface LesswrongTagsData {
  tags: LesswrongTag[];
}
