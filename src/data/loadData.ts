import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import {
  ReviewData,
  OrthodoxProblemsData,
  OrthodoxProblem,
  BroadApproachesData,
  BroadApproach,
  TargetCasesData,
  TargetCase,
} from "./types";

/**
 * Loads the main review data containing sections and agendas
 * @throws Error if the YAML file is missing or malformed
 */
export function loadReviewData(): ReviewData {
  try {
    const filePath = path.join(process.cwd(), "src/data/papers.yaml");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const data = yaml.load(fileContents) as ReviewData;

    if (!data?.sections || !Array.isArray(data.sections)) {
      throw new Error("Invalid ReviewData structure: missing sections array");
    }

    return data;
  } catch (error) {
    console.error("Failed to load review data:", error);
    throw new Error(
      `Failed to load review data: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
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
