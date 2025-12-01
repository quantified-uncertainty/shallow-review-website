import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import {
  ReviewData,
  OrthodoxProblemsData,
  OrthodoxProblem,
  BroadApproachesData,
  BroadApproach,
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
