export interface Paper {
  title: string;
  url: string;
  authors?: string;
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

export interface TargetCasesData {
  cases: TargetCase[];
}

export interface AgendaResource {
  title: string;
  url: string;
}

export interface Agenda {
  id: string;
  name: string;
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
  lesswrongTags?: string[];
  resources?: AgendaResource[];
  wikipedia?: string;
  papers: Paper[];
}

export interface Section {
  id: string;
  name: string;
  description?: string;
  agendas: Agenda[];
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
}
