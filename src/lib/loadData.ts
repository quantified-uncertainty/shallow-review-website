import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import {
  ReviewData,
  Section,
  Agenda,
  SectionData,
  AgendaData,
  OrthodoxProblemsData,
  OrthodoxProblem,
  BroadApproachesData,
  BroadApproach,
  TargetCasesData,
  TargetCase,
  FundersData,
  Funder,
  ResearchersData,
  Researcher,
  KeywordsData,
  Keyword,
  LesswrongTagsData,
  LesswrongTag,
  LabsData,
  Lab,
} from "./types";

// Structure item can be a string (just ID) or object with children
interface StructureItem {
  id: string;
  children?: (string | StructureItem)[];
}

interface StructureData {
  structure: StructureItem[];
}

/**
 * Loads the structure file that defines ordering and nesting
 */
function loadStructure(): StructureData | null {
  try {
    const filePath = path.join(process.cwd(), "src/data/structure.yaml");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const data = yaml.load(fileContents) as StructureData;
    return data;
  } catch (error) {
    console.warn("Could not load structure file, using default ordering:", error);
    return null;
  }
}

/**
 * Flattens structure into a map of parent -> ordered children
 * Also returns parent overrides (child -> parent)
 */
function parseStructure(structure: StructureItem[]): {
  orderMap: Map<string, string[]>;
  parentOverrides: Map<string, string>;
} {
  const orderMap = new Map<string, string[]>();
  const parentOverrides = new Map<string, string>();

  function processItem(item: StructureItem, parentId: string | null) {
    if (parentId) {
      parentOverrides.set(item.id, parentId);
    }

    if (item.children && item.children.length > 0) {
      const childIds: string[] = [];
      for (const child of item.children) {
        if (typeof child === 'string') {
          childIds.push(child);
          if (item.id) {
            parentOverrides.set(child, item.id);
          }
        } else {
          childIds.push(child.id);
          processItem(child, item.id);
        }
      }
      orderMap.set(item.id, childIds);
    }
  }

  for (const item of structure) {
    processItem(item, null);
  }

  return { orderMap, parentOverrides };
}

/**
 * Loads the agenda LessWrong tags mapping from a separate file
 * This allows agendas.yaml to be regenerated from the pipeline without losing curated tags
 * @returns Record mapping agenda ID to array of LessWrong tag slugs
 */
function loadAgendaLesswrongTags(): Record<string, string[]> {
  try {
    const filePath = path.join(process.cwd(), "src/data/agendaLesswrongTags.yaml");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const data = yaml.load(fileContents) as Record<string, string[]>;
    return data || {};
  } catch (error) {
    console.warn("Could not load agenda LessWrong tags, continuing without them:", error);
    return {};
  }
}

/**
 * Loads flat sections from sections.yaml
 */
function loadSections(): SectionData[] {
  const filePath = path.join(process.cwd(), "src/data/sections.yaml");
  const fileContents = fs.readFileSync(filePath, "utf8");
  const data = yaml.load(fileContents) as SectionData[];
  return data || [];
}

/**
 * Loads flat agendas from agendas.yaml
 */
function loadAgendas(): AgendaData[] {
  const filePath = path.join(process.cwd(), "src/data/agendas.yaml");
  const fileContents = fs.readFileSync(filePath, "utf8");
  const data = yaml.load(fileContents) as AgendaData[];
  return data || [];
}

/**
 * Builds nested hierarchy from flat sections and agendas
 * - Top-level sections (no parent) become the main sections
 * - Agendas are nested under their parent section
 * - Sub-sections' agendas are collected into the parent section
 * - Agendas can have other agendas as parents (agenda trees are flattened into sections)
 */
function buildHierarchy(
  sectionsData: SectionData[],
  agendasData: AgendaData[],
  agendaTags: Record<string, string[]>
): Section[] {
  // Build maps for quick lookup
  const sectionsById = new Map<string, SectionData>();
  for (const section of sectionsData) {
    sectionsById.set(section.id, section);
  }

  const agendasById = new Map<string, AgendaData>();
  for (const agenda of agendasData) {
    agendasById.set(agenda.id, agenda);
  }

  // Find top-level sections (no parent)
  const topLevelSections = sectionsData.filter(s => !s.parent);

  // Collect all section IDs that belong to each top-level section (including nested)
  function getAllDescendantSectionIds(sectionId: string): string[] {
    const result: string[] = [sectionId];
    const children = sectionsData.filter(s => s.parent === sectionId);
    for (const child of children) {
      result.push(...getAllDescendantSectionIds(child.id));
    }
    return result;
  }

  // Check if an agenda belongs to a section tree (following agenda-parent chains)
  function agendaBelongsToSectionTree(agendaData: AgendaData, sectionIds: Set<string>): boolean {
    let current: AgendaData | undefined = agendaData;
    const visited = new Set<string>();

    while (current && current.parent) {
      // Prevent infinite loops
      if (visited.has(current.id)) break;
      visited.add(current.id);

      // Check if parent is a section in our tree
      if (sectionIds.has(current.parent)) {
        return true;
      }

      // Check if parent is an agenda (follow the chain)
      current = agendasById.get(current.parent);
    }

    return false;
  }

  // Convert AgendaData to Agenda
  function convertAgenda(agendaData: AgendaData, topSectionId: string): Agenda {
    // Check if parent is another agenda (not a section)
    const parentAgendaId = agendaData.parent && agendasById.has(agendaData.parent)
      ? agendaData.parent
      : undefined;

    // Check if parent is a sub-section (not the top-level section, and is a section)
    const parentSectionId = agendaData.parent &&
      sectionsById.has(agendaData.parent) &&
      agendaData.parent !== topSectionId
      ? agendaData.parent
      : undefined;

    const agenda: Agenda = {
      id: agendaData.id,
      name: agendaData.name,
      parentAgendaId,
      parentSectionId,
      summary: agendaData.summary,
      description: agendaData.description,
      theoryOfChange: agendaData.theoryOfChange,
      seeAlso: agendaData.seeAlso,
      orthodoxProblems: agendaData.orthodoxProblems,
      targetCase: agendaData.targetCase,
      broadApproaches: agendaData.broadApproaches,
      someNames: agendaData.someNames,
      estimatedFTEs: agendaData.estimatedFTEs,
      critiques: agendaData.critiques,
      fundedBy: agendaData.fundedBy,
      fundedByText: agendaData.fundedByText,
      keywords: agendaData.keywords,
      resources: agendaData.resources,
      wikipedia: agendaData.wikipedia,
      // Lab-specific fields
      structure: agendaData.structure,
      teams: agendaData.teams,
      publicAlignmentAgenda: agendaData.publicAlignmentAgenda,
      framework: agendaData.framework,
      papers: agendaData.papers,
    };

    // Merge lesswrongTags from separate file
    if (agendaTags[agenda.id]) {
      agenda.lesswrongTags = agendaTags[agenda.id];
    }

    return agenda;
  }

  // Build the nested structure
  const sections: Section[] = [];

  for (const topSection of topLevelSections) {
    // Get all section IDs in this tree
    const allSectionIds = getAllDescendantSectionIds(topSection.id);
    const allSectionIdsSet = new Set(allSectionIds);

    // Find all agendas that belong to this section tree
    // (either directly or through agenda-parent chains)
    const sectionAgendas: Agenda[] = [];
    for (const agendaData of agendasData) {
      if (agendaBelongsToSectionTree(agendaData, allSectionIdsSet)) {
        sectionAgendas.push(convertAgenda(agendaData, topSection.id));
      }
    }

    // Get direct child sub-sections
    const subSections = sectionsData
      .filter(s => s.parent === topSection.id)
      .map(s => ({ id: s.id, name: s.name, description: s.description }));

    // Only add sections that have agendas
    if (sectionAgendas.length > 0) {
      sections.push({
        id: topSection.id,
        name: topSection.name,
        description: topSection.description,
        agendas: sectionAgendas,
        subSections: subSections.length > 0 ? subSections : undefined,
      });
    }
  }

  return sections;
}

export interface StructureInfo {
  // Map from parent ID to ordered list of child IDs
  orderMap: Map<string, string[]>;
  // Map from child ID to its parent ID (from structure file)
  parentOverrides: Map<string, string>;
}

/**
 * Loads and parses the structure file for ordering and nesting
 */
export function loadStructureInfo(): StructureInfo {
  const structureData = loadStructure();
  if (!structureData) {
    return { orderMap: new Map(), parentOverrides: new Map() };
  }
  return parseStructure(structureData.structure);
}

/**
 * Loads the main review data containing sections and agendas
 * Reads from flat files (sections.yaml and agendas.yaml) and builds hierarchy
 * Also merges in lesswrongTags from the separate agendaLesswrongTags.yaml file
 * @throws Error if the YAML files are missing or malformed
 */
export function loadReviewData(): ReviewData {
  try {
    const sectionsData = loadSections();
    const agendasData = loadAgendas();
    const agendaTags = loadAgendaLesswrongTags();

    const sections = buildHierarchy(sectionsData, agendasData, agendaTags);

    return { sections };
  } catch (error) {
    console.error("Failed to load review data:", error);
    throw new Error(
      `Failed to load review data: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Loads the labs data from labs.yaml
 * @throws Error if the YAML file is missing or malformed
 */
export function loadLabs(): LabsData {
  try {
    const filePath = path.join(process.cwd(), "src/data/labs.yaml");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const data = yaml.load(fileContents) as LabsData;

    if (!data?.labs || !Array.isArray(data.labs)) {
      throw new Error("Invalid LabsData structure: missing labs array");
    }

    return data;
  } catch (error) {
    console.error("Failed to load labs:", error);
    throw new Error(
      `Failed to load labs: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Retrieves Labs by their IDs
 * @param labs - Array of all available labs
 * @param ids - Array of lab IDs to retrieve
 * @returns Array of matching labs, excluding not-found items
 */
export function getLabsByIds(labs: Lab[], ids: string[]): Lab[] {
  return ids
    .map((id) => labs.find((l) => l.id === id))
    .filter((l): l is Lab => l !== undefined);
}

/**
 * Loads the orthodox problems taxonomy
 * @throws Error if the YAML file is missing or malformed
 */
export function loadOrthodoxProblems(): OrthodoxProblemsData {
  try {
    const filePath = path.join(
      process.cwd(),
      "src/data/orthodoxProblems.yaml"
    );
    const fileContents = fs.readFileSync(filePath, "utf8");
    const data = yaml.load(fileContents) as OrthodoxProblemsData;

    if (!data?.problems || !Array.isArray(data.problems)) {
      throw new Error(
        "Invalid OrthodoxProblemsData structure: missing problems array"
      );
    }

    return data;
  } catch (error) {
    console.error("Failed to load orthodox problems:", error);
    throw new Error(
      `Failed to load orthodox problems: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Retrieves Orthodox Problems by their IDs
 * @param problems - Array of all available problems
 * @param ids - Array of problem IDs to retrieve
 * @returns Array of matching problems, excluding not-found items
 */
export function getOrthodoxProblemsByIds(
  problems: OrthodoxProblem[],
  ids: string[]
): OrthodoxProblem[] {
  return ids
    .map((id) => problems.find((p) => p.id === id))
    .filter((p): p is OrthodoxProblem => p !== undefined);
}

/**
 * Loads the broad approaches taxonomy
 * @throws Error if the YAML file is missing or malformed
 */
export function loadBroadApproaches(): BroadApproachesData {
  try {
    const filePath = path.join(process.cwd(), "src/data/broadApproaches.yaml");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const data = yaml.load(fileContents) as BroadApproachesData;

    if (!data?.approaches || !Array.isArray(data.approaches)) {
      throw new Error(
        "Invalid BroadApproachesData structure: missing approaches array"
      );
    }

    return data;
  } catch (error) {
    console.error("Failed to load broad approaches:", error);
    throw new Error(
      `Failed to load broad approaches: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Retrieves Broad Approaches by their IDs
 * @param approaches - Array of all available approaches
 * @param ids - Array of approach IDs to retrieve
 * @returns Array of matching approaches, excluding not-found items
 */
export function getBroadApproachesByIds(
  approaches: BroadApproach[],
  ids: string[]
): BroadApproach[] {
  return ids
    .map((id) => approaches.find((a) => a.id === id))
    .filter((a): a is BroadApproach => a !== undefined);
}

/**
 * Loads the target cases taxonomy
 * @throws Error if the YAML file is missing or malformed
 */
export function loadTargetCases(): TargetCasesData {
  try {
    const filePath = path.join(process.cwd(), "src/data/targetCases.yaml");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const data = yaml.load(fileContents) as TargetCasesData;

    if (!data?.cases || !Array.isArray(data.cases)) {
      throw new Error(
        "Invalid TargetCasesData structure: missing cases array"
      );
    }

    return data;
  } catch (error) {
    console.error("Failed to load target cases:", error);
    throw new Error(
      `Failed to load target cases: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Normalizes a target case string to match a canonical ID
 * Handles variations like "pessimistic.", "Pessimistic", "worst-case", etc.
 */
export function normalizeTargetCaseId(targetCase: string): string | null {
  const normalized = targetCase.toLowerCase().replace(/[.*?]/g, "").trim();

  if (normalized.includes("pessimistic")) return "pessimistic";
  if (normalized.includes("optimistic")) return "optimistic";
  if (normalized.includes("worst") || normalized.includes("worst-case")) return "worst-case";
  if (normalized.includes("average")) return "average-case";
  if (normalized.includes("mixed") || normalized.includes("varies")) return "mixed";

  return null;
}

/**
 * Retrieves a Target Case by a raw string value
 * @param cases - Array of all available cases
 * @param rawValue - Raw target case string from agenda data
 * @returns Matching case or undefined
 */
export function getTargetCaseByValue(
  cases: TargetCase[],
  rawValue: string
): TargetCase | undefined {
  const normalizedId = normalizeTargetCaseId(rawValue);
  if (!normalizedId) return undefined;
  return cases.find((c) => c.id === normalizedId);
}

/**
 * Loads the funders taxonomy
 * @throws Error if the YAML file is missing or malformed
 */
export function loadFunders(): FundersData {
  try {
    const filePath = path.join(process.cwd(), "src/data/funders.yaml");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const data = yaml.load(fileContents) as FundersData;

    if (!data?.funders || !Array.isArray(data.funders)) {
      throw new Error("Invalid FundersData structure: missing funders array");
    }

    return data;
  } catch (error) {
    console.error("Failed to load funders:", error);
    throw new Error(
      `Failed to load funders: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Retrieves Funders by their IDs
 * @param funders - Array of all available funders
 * @param ids - Array of funder IDs to retrieve
 * @returns Array of matching funders, excluding not-found items
 */
export function getFundersByIds(funders: Funder[], ids: string[]): Funder[] {
  return ids
    .map((id) => funders.find((f) => f.id === id))
    .filter((f): f is Funder => f !== undefined);
}

/**
 * Loads the researchers taxonomy
 * @throws Error if the YAML file is missing or malformed
 */
export function loadResearchers(): ResearchersData {
  try {
    const filePath = path.join(process.cwd(), "src/data/researchers.yaml");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const data = yaml.load(fileContents) as ResearchersData;

    if (!data?.researchers || !Array.isArray(data.researchers)) {
      throw new Error("Invalid ResearchersData structure: missing researchers array");
    }

    return data;
  } catch (error) {
    console.error("Failed to load researchers:", error);
    throw new Error(
      `Failed to load researchers: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Retrieves Researchers by their IDs
 * @param researchers - Array of all available researchers
 * @param ids - Array of researcher IDs to retrieve
 * @returns Array of matching researchers, excluding not-found items
 */
export function getResearchersByIds(researchers: Researcher[], ids: string[]): Researcher[] {
  return ids
    .map((id) => researchers.find((r) => r.id === id))
    .filter((r): r is Researcher => r !== undefined);
}

/**
 * Loads the keywords taxonomy
 * @throws Error if the YAML file is missing or malformed
 */
export function loadKeywords(): KeywordsData {
  try {
    const filePath = path.join(process.cwd(), "src/data/keywords.yaml");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const data = yaml.load(fileContents) as KeywordsData;

    if (!data?.keywords || !Array.isArray(data.keywords)) {
      throw new Error("Invalid KeywordsData structure: missing keywords array");
    }

    return data;
  } catch (error) {
    console.error("Failed to load keywords:", error);
    throw new Error(
      `Failed to load keywords: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Retrieves Keywords by their IDs
 * @param keywords - Array of all available keywords
 * @param ids - Array of keyword IDs to retrieve
 * @returns Array of matching keywords, excluding not-found items
 */
export function getKeywordsByIds(keywords: Keyword[], ids: string[]): Keyword[] {
  return ids
    .map((id) => keywords.find((k) => k.id === id))
    .filter((k): k is Keyword => k !== undefined);
}

/**
 * Loads the LessWrong tags lookup data
 * @throws Error if the YAML file is missing or malformed
 */
export function loadLesswrongTags(): LesswrongTagsData {
  try {
    const filePath = path.join(process.cwd(), "src/data/lesswrongTags.yaml");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const data = yaml.load(fileContents) as LesswrongTagsData;

    if (!data?.tags || !Array.isArray(data.tags)) {
      throw new Error("Invalid LesswrongTagsData structure: missing tags array");
    }

    return data;
  } catch (error) {
    console.error("Failed to load LessWrong tags:", error);
    throw new Error(
      `Failed to load LessWrong tags: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Creates a lookup map from slug to tag info
 * @param tags - Array of LessWrong tags
 * @returns Record mapping slug to { name, postCount }
 */
export function createTagsLookup(tags: LesswrongTag[]): Record<string, { name: string; postCount: number }> {
  return tags.reduce((acc, tag) => {
    acc[tag.slug] = { name: tag.name, postCount: tag.postCount };
    return acc;
  }, {} as Record<string, { name: string; postCount: number }>);
}
