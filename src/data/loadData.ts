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

export function loadReviewData(): ReviewData {
  const filePath = path.join(process.cwd(), "src/data/papers.yaml");
  const fileContents = fs.readFileSync(filePath, "utf8");
  const data = yaml.load(fileContents) as ReviewData;
  return data;
}

export function loadOrthodoxProblems(): OrthodoxProblemsData {
  const filePath = path.join(process.cwd(), "src/data/orthodoxProblems.yaml");
  const fileContents = fs.readFileSync(filePath, "utf8");
  const data = yaml.load(fileContents) as OrthodoxProblemsData;
  return data;
}

export function getOrthodoxProblemById(
  problems: OrthodoxProblem[],
  id: string
): OrthodoxProblem | undefined {
  return problems.find((p) => p.id === id);
}

export function getOrthodoxProblemsByIds(
  problems: OrthodoxProblem[],
  ids: string[]
): OrthodoxProblem[] {
  return ids
    .map((id) => problems.find((p) => p.id === id))
    .filter((p): p is OrthodoxProblem => p !== undefined);
}

export function loadBroadApproaches(): BroadApproachesData {
  const filePath = path.join(process.cwd(), "src/data/broadApproaches.yaml");
  const fileContents = fs.readFileSync(filePath, "utf8");
  const data = yaml.load(fileContents) as BroadApproachesData;
  return data;
}

export function getBroadApproachById(
  approaches: BroadApproach[],
  id: string
): BroadApproach | undefined {
  return approaches.find((a) => a.id === id);
}

export function getBroadApproachesByIds(
  approaches: BroadApproach[],
  ids: string[]
): BroadApproach[] {
  return ids
    .map((id) => approaches.find((a) => a.id === id))
    .filter((a): a is BroadApproach => a !== undefined);
}
