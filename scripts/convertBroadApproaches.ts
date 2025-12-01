import fs from "fs";
import path from "path";
import yaml from "js-yaml";

interface Paper {
  title: string;
  url: string;
  authors?: string;
}

interface Agenda {
  id: string;
  name: string;
  summary?: string;
  theoryOfChange?: string;
  seeAlso?: string;
  orthodoxProblems?: string[];
  targetCase?: string;
  broadApproach?: string;
  broadApproaches?: string[];
  someNames?: string[];
  estimatedFTEs?: string;
  critiques?: string[];
  fundedBy?: string[];
  papers: Paper[];
}

interface Section {
  id: string;
  name: string;
  description?: string;
  agendas: Agenda[];
}

interface ReviewData {
  sections: Section[];
}

// Mapping of text patterns to approach IDs
const approachPatterns: { pattern: RegExp; id: string }[] = [
  { pattern: /\bengineering\b/i, id: "engineering" },
  { pattern: /\bbehaviou?ral\b/i, id: "behavioral" },
  { pattern: /\bcognitive\b/i, id: "cognitive" },
  { pattern: /\bcognitivist\b/i, id: "cognitive" },
  { pattern: /\bmaths?\/philosophy\b/i, id: "maths-philosophy" },
  { pattern: /\bmath\/philosophy\b/i, id: "maths-philosophy" },
  { pattern: /\btheoretical\b/i, id: "theoretical" },
];

function parseBroadApproach(text: string): string[] {
  if (!text || text.trim() === "" || text === '""') {
    return [];
  }

  const ids = new Set<string>();

  for (const { pattern, id } of approachPatterns) {
    if (pattern.test(text)) {
      ids.add(id);
    }
  }

  // If no patterns matched but there's text, log it for review
  if (ids.size === 0 && text.trim().length > 0) {
    // Check for known non-approach text
    if (text.toLowerCase().includes("varies")) {
      return [];
    }
    console.log(`Unmatched broadApproach text: "${text}"`);
  }

  return Array.from(ids);
}

function convertData(data: ReviewData): ReviewData {
  for (const section of data.sections) {
    for (const agenda of section.agendas) {
      if (typeof agenda.broadApproach === "string") {
        const ids = parseBroadApproach(agenda.broadApproach);
        if (ids.length > 0) {
          agenda.broadApproaches = ids;
        }
        delete agenda.broadApproach;
      }
    }
  }
  return data;
}

// Main execution
const inputPath = path.join(process.cwd(), "src/data/papers.yaml");
const outputPath = path.join(process.cwd(), "src/data/papers.yaml");

const fileContents = fs.readFileSync(inputPath, "utf8");
const data = yaml.load(fileContents) as ReviewData;

const convertedData = convertData(data);

// Custom YAML dump options for better formatting
const yamlOutput = yaml.dump(convertedData, {
  lineWidth: 200,
  noRefs: true,
  quotingType: '"',
  forceQuotes: false,
  indent: 2,
  flowLevel: -1,
});

fs.writeFileSync(outputPath, yamlOutput, "utf8");
console.log("Conversion complete!");

console.log("\nStats:");
let converted = 0;
let removed = 0;
for (const section of convertedData.sections) {
  for (const agenda of section.agendas) {
    if (Array.isArray(agenda.broadApproaches) && agenda.broadApproaches.length > 0) {
      converted++;
    } else if (!agenda.broadApproaches) {
      removed++;
    }
  }
}
console.log(`Converted to arrays: ${converted}`);
console.log(`Removed (empty/unmatched): ${removed}`);
