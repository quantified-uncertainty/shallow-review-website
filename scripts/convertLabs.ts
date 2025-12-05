import fs from "fs";
import path from "path";
import yaml from "js-yaml";

interface Lab {
  id: string;
  name: string;
  teams?: string;
  publicAlignmentAgenda?: string;
  publicPlan?: string;
  structure?: string;
  framework?: string;
  hostOrgStructure?: string;
  seeAlso?: string;
  someNames?: string[];
  critiques?: string[];
  fundedBy?: string[];
  lesswrongTags?: string[];
  keywords?: string[];
  resources?: { title: string; url: string }[];
  wikipedia?: string;
  papers?: { title: string; url: string; authors?: string }[];
}

interface LabsData {
  labs: Lab[];
}

// Read existing labs.yaml
const inputPath = path.join(process.cwd(), "src/data/labs.yaml");
const fileContents = fs.readFileSync(inputPath, "utf8");
const data = yaml.load(fileContents) as LabsData;

// Update each lab with the additional fields from the reference document
const labUpdates: Record<string, Partial<Lab>> = {
  "openai-safety": {
    hostOrgStructure: "public benefit corp",
    teams: "Alignment, Safety Systems (Interpretability, Safety Oversight, Pretraining Safety, Robustness, Safety Research, Trustworthy AI, new Misalignment Research team [coming](https://archive.is/eDB1D)), Preparedness, Model Policy, Safety and Security Committee, Safety Advisory Group. The [Persona Features](https://www.arxiv.org/pdf/2506.19823) paper had a distinct author list. No named successor to Superalignment.",
    publicAlignmentAgenda: "[None](https://openai.com/safety/how-we-think-about-safety-alignment/). Barak [offers](https://www.lesswrong.com/posts/3jnziqCF3vA2NXAKp/six-thoughts-on-ai-safety) personal [views](https://windowsontheory.org/2025/06/24/machines-of-faithful-obedience/).",
    publicPlan: "[Preparedness Framework](https://cdn.openai.com/pdf/18a02b5d-6b67-4cec-ab64-68cdfbddebcd/preparedness-framework-v2.pdf)",
  },
  "deepmind-responsibility-safety": {
    structure: "research laboratory subsidiary of a for-profit",
    teams: "[ASAT](https://www.alignmentforum.org/posts/wqz5CRzqWkvzoatBG/agi-safety-and-alignment-google-deepmind-is-hiring) (\"AGI Alignment\", amplified oversight and interpretability; plus \"Frontier Safety\", framework development and implementation), Gemini Safety, [Voices of All in Alignment](https://www.edinburgh-robotics.org/events/whose-gold-aligning-ai-diverse-views-what%E2%80%99s-safe-aligned-and-beneficial), AGI Safety Council, Responsibility and Safety Council. Sort-of the [Causal Incentives Working Group](https://causalincentives.com/) too.",
    publicAlignmentAgenda: "[An Approach to Technical AGI Safety](https://storage.googleapis.com/deepmind-media/DeepMind.com/Blog/evaluating-potential-cybersecurity-threats-of-advanced-ai/An_Approach_to_Technical_AGI_Safety_Apr_2025.pdf)",
    framework: "[Frontier Safety Framework](https://storage.googleapis.com/deepmind-media/DeepMind.com/Blog/updating-the-frontier-safety-framework/Frontier%20Safety%20Framework%202.0.pdf)",
    someNames: [
      "rohin-shah",
      "allan-dafoe",
      "anca-dragan",
      "dave-orr",
      "alex-irpan",
      "alex-turner",
      "anna-wang",
      "arthur-conmy",
      "david-lindner",
      "jonah-brown-cohen",
      "lewis-ho",
      "neel-nanda",
      "raluca-ada-popa",
      "rishub-jain",
      "rory-greig",
      "scott-emmons",
      "sebastian-farquhar",
      "senthooran-rajamanoharan",
      "sophie-bridgers",
      "tobi-ijitoye",
      "tom-everitt",
      "victoria-krakovna",
      "vikrant-varma",
      "vladimir-mikulik",
      "zac-kenton",
      "noah-goodman",
      "four-flynn",
    ],
  },
  "anthropic-safety": {
    hostOrgStructure: "public-benefit corp",
    teams: "Scalable Alignment (Leike), Alignment Evals (Bowman), [Interpretability](https://transformer-circuits.pub/) (Olah), Model Psychiatry (Lindsey), Character (Askell), Alignment Stress-Testing (Hubinger), Frontier Red Team (Graham), Safeguards (Sharma), Trust and Safety (Sanderford), Model Welfare (Fish).",
    publicAlignmentAgenda: "[directions](https://alignment.anthropic.com/2025/recommended-directions/), [bumpers](https://alignment.anthropic.com/2025/bumpers/), [checklist](https://sleepinyourhat.github.io/checklist/), [old vague view](https://www.anthropic.com/news/core-views-on-ai-safety)",
    framework: "[RSP](https://www-cdn.anthropic.com/872c653b2d0501d6ab44cf87f43e1dc4853e4d37.pdf)",
  },
  "xai": {
    hostOrgStructure: "[for-profit](https://www.cnbc.com/amp/2025/08/25/elon-musk-xai-dropped-public-benefit-corp-status-while-fighting-openai.html)",
    teams: "[Applied Safety](https://job-boards.greenhouse.io/xai/jobs/4944324007), Model Evaluation. Nominally focussed on misuse.",
    publicAlignmentAgenda: "None.",
    framework: "[Risk Management Framework](https://data.x.ai/2025-08-20-xai-risk-management-framework.pdf)",
  },
  "meta": {
    hostOrgStructure: "for-profit",
    teams: "Safety \"integrated into\" capabilities research, Meta Superintelligence Lab. But also FAIR Alignment, [Brain and AI](https://www.metacareers.com/jobs/1319148726628205).",
    publicAlignmentAgenda: "None.",
    framework: "[FAF](https://ai.meta.com/static-resource/meta-frontier-ai-framework/?utm_source=newsroom&utm_medium=web&utm_content=Frontier_AI_Framework_PDF&utm_campaign=Our_Approach_to_Frontier_AI_blog)",
  },
};

// Apply updates
for (const lab of data.labs) {
  const updates = labUpdates[lab.id];
  if (updates) {
    Object.assign(lab, updates);
  }
}

// Custom YAML dump options for better formatting
const yamlOutput = yaml.dump(data, {
  lineWidth: 200,
  noRefs: true,
  quotingType: '"',
  forceQuotes: false,
  indent: 2,
  flowLevel: -1,
});

const outputPath = path.join(process.cwd(), "src/data/labs.yaml");
fs.writeFileSync(outputPath, yamlOutput, "utf8");
console.log("Labs conversion complete!");

// Print summary
console.log("\nUpdated labs:");
for (const lab of data.labs) {
  console.log(`- ${lab.name}`);
  if (lab.teams) console.log(`  Teams: ${lab.teams.substring(0, 50)}...`);
  if (lab.publicAlignmentAgenda) console.log(`  Agenda: ${lab.publicAlignmentAgenda.substring(0, 50)}...`);
  if (lab.framework) console.log(`  Framework: ${lab.framework.substring(0, 50)}...`);
}
