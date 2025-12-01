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
  orthodoxProblems?: string | string[];
  targetCase?: string;
  broadApproach?: string;
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

// Mapping of text patterns to problem IDs
const problemPatterns: { pattern: RegExp; id: string }[] = [
  { pattern: /1\.\s*Value is fragile/i, id: "1" },
  { pattern: /value is fragile/i, id: "1" },
  { pattern: /2\.\s*Corrigibility is anti-natural/i, id: "2" },
  { pattern: /corrigibility is anti-natural/i, id: "2" },
  { pattern: /3\.\s*Pivotal processes require dangerous/i, id: "3" },
  { pattern: /pivotal processes require dangerous/i, id: "3" },
  { pattern: /4\.\s*Goals misgeneralize/i, id: "4" },
  { pattern: /goals misgeneralize/i, id: "4" },
  { pattern: /5\.\s*Instrumental [Cc]onvergence/i, id: "5" },
  { pattern: /instrumental convergence/i, id: "5" },
  { pattern: /6\.\s*Mesa-optimization/i, id: "6" },
  { pattern: /mesa-optimization/i, id: "6" },
  { pattern: /7\.\s*Superintelligence can fool human/i, id: "7" },
  { pattern: /superintelligence can fool human/i, id: "7" },
  { pattern: /8\.\s*Superintelligence can hack software/i, id: "8" },
  { pattern: /superintelligence can hack software/i, id: "8" },
  { pattern: /9\.\s*Humans cannot be first-class/i, id: "9" },
  { pattern: /humans cannot be first-class/i, id: "9" },
  { pattern: /10\.\s*Humanlike minds/i, id: "10" },
  { pattern: /humanlike minds/i, id: "10" },
  { pattern: /11\.\s*Deceptive alignment/i, id: "11" },
  { pattern: /deceptive alignment/i, id: "11" },
  { pattern: /12\.\s*A boxed AGI/i, id: "12" },
  { pattern: /boxed AGI might exfiltrate/i, id: "12" },
  { pattern: /13\.\s*Fair,?\s*sane pivotal/i, id: "13" },
  { pattern: /fair,?\s*sane pivotal/i, id: "13" },
  { pattern: /someone else will deploy unsafe/i, id: "14" },
];

function parseOrthodoxProblems(text: string): string[] {
  if (!text || text.trim() === "" || text === '""') {
    return [];
  }

  const ids = new Set<string>();

  for (const { pattern, id } of problemPatterns) {
    if (pattern.test(text)) {
      ids.add(id);
    }
  }

  // If no patterns matched but there's text, log it for review
  if (ids.size === 0 && text.trim().length > 0) {
    // Check if it's a meta-comment about the framing
    if (
      text.toLowerCase().includes("implicitly questions") ||
      text.toLowerCase().includes("skeptical of the framing")
    ) {
      // Return empty - these are commentary, not problem references
      return [];
    }
    console.log(`Unmatched orthodoxProblems text: "${text}"`);
  }

  return Array.from(ids).sort((a, b) => parseInt(a) - parseInt(b));
}

function convertData(data: ReviewData): ReviewData {
  for (const section of data.sections) {
    for (const agenda of section.agendas) {
      if (typeof agenda.orthodoxProblems === "string") {
        const ids = parseOrthodoxProblems(agenda.orthodoxProblems);
        if (ids.length > 0) {
          (agenda as { orthodoxProblems: string[] }).orthodoxProblems = ids;
        } else {
          delete agenda.orthodoxProblems;
        }
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
    if (Array.isArray(agenda.orthodoxProblems)) {
      converted++;
    } else if (!agenda.orthodoxProblems) {
      removed++;
    }
  }
}
console.log(`Converted to arrays: ${converted}`);
console.log(`Removed (empty/unmatched): ${removed}`);
