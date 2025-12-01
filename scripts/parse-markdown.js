const fs = require('fs');
const yaml = require('js-yaml');

const content = fs.readFileSync('./reference/Shallow Review 2025.md', 'utf8');
const lines = content.split('\n');

// Major section IDs we want to capture as top-level sections
const majorSections = [
  'sec:big_labs',
  'sec:black_box',
  'sec:whitebox',
  'sec:new_safety_by_design',
  'sec:ai_solve_alignment',
  'sec:theory',
  'sec:multi_agent_first'
];

// Container sections that only organize subsections (have no papers of their own)
const containerSections = [
  'sec:iterative_alignment',
  'sec:capability_removal',
  'sec:evals',
  'sec:model_psychology',
  'sec:better_data',
  'sec:goal_robustness',
  'sec:interpretability',
  'sec:understand_learning',
  'sec:corrigibility',
  'sec:ontology_identification'
];

const sectionNames = {
  'sec:big_labs': 'Labs (giant companies)',
  'sec:black_box': 'Black-box safety',
  'sec:whitebox': 'White-box safety',
  'sec:new_safety_by_design': 'Safety by construction',
  'sec:ai_solve_alignment': 'Make AI solve it',
  'sec:theory': 'Theory',
  'sec:multi_agent_first': 'Multi-agent first'
};

const sectionDescs = {
  'sec:big_labs': 'Major AI labs and their safety efforts',
  'sec:black_box': 'Understand and control current model behaviour',
  'sec:whitebox': 'Understand and control current model internals',
  'sec:new_safety_by_design': 'Make new systems which are easier to understand and control',
  'sec:ai_solve_alignment': 'Use AI systems to help solve alignment',
  'sec:theory': 'How to understand and control current and future models',
  'sec:multi_agent_first': 'Multi-agent approaches to alignment'
};

function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/\*\*/g, '')
    .replace(/\\_/g, '_')
    .replace(/\\-/g, '-')
    .replace(/\\\./g, '.')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractId(line) {
  // Match sec:xxx or cat:xxx - handle escaped underscores like big\\_labs
  // Extract until we hit } or ] or whitespace
  const match = line.match(/(sec|cat):([a-z0-9_\\]+)/i);
  if (match) {
    const prefix = match[1];
    // Clean up: remove backslashes and trailing underscores/colons
    const id = match[2]
      .replace(/\\_/g, '_')
      .replace(/\\/g, '')
      .replace(/:$/,'')
      .replace(/_+$/,'');
    return prefix + ':' + id;
  }
  return null;
}

function extractName(line) {
  // Extract the title before [sec:...] or [cat:...] - handle escaped brackets and leading spaces
  const match = line.trim().match(/^#+\s+(.+?)\s*\\?\[/);
  if (match) {
    return cleanText(match[1]);
  }
  return '';
}

function extractPapers(outputLines) {
  const papers = [];
  const seen = new Set();

  for (const line of outputLines) {
    // Match markdown links: [title](url)
    const linkMatches = [...line.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)];
    for (const match of linkMatches) {
      let title = cleanText(match[1]);
      let url = match[2].trim();

      // Skip if it's just a reference or image or very short
      if (title.length < 5) continue;
      if (url.startsWith('#')) continue;
      if (url.includes('image')) continue;
      if (title.toLowerCase().includes('image')) continue;

      // Clean up URL
      url = url.replace(/\\$/g, '').replace(/%20/g, ' ').trim();

      // Skip duplicates
      const key = url.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);

      // Extract authors if present
      const afterLink = line.substring(line.indexOf(match[0]) + match[0].length);
      const authorMatch = afterLink.match(/,\s*\*([^*]+)\*/);

      papers.push({
        title: title,
        url: url,
        ...(authorMatch ? { authors: cleanText(authorMatch[1]) } : {})
      });
    }
  }
  return papers;
}

const sections = [];
let currentSection = null;
let currentAgenda = null;
let inOutputs = false;
let outputsBuffer = [];
let currentField = null;
let fieldValue = '';

// Generate a URL-friendly slug from a name
function slugify(name) {
  return name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function saveAgenda() {
  if (!currentAgenda || !currentSection) return;

  // Save any pending field
  if (currentField && fieldValue) {
    currentAgenda[currentField] = cleanText(fieldValue);
  }

  // Process outputs
  if (outputsBuffer.length > 0) {
    const papers = extractPapers(outputsBuffer);
    if (papers.length > 0) {
      currentAgenda.papers = papers;
    }
  }

  // Only add if has content
  if (currentAgenda.name || currentAgenda.papers?.length > 0) {
    currentSection.agendas.push(currentAgenda);
  }

  currentAgenda = null;
  currentField = null;
  fieldValue = '';
  inOutputs = false;
  outputsBuffer = [];
}

function saveSection() {
  if (currentSection && currentSection.agendas.length > 0) {
    sections.push(currentSection);
  }
  currentSection = null;
}

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Skip table of contents area (before line 270)
  if (i < 270 && !line.startsWith('# Labs')) continue;

  // Check for major section headers (# Title [sec:xxx]) - handle escaped brackets and leading spaces
  const trimmedLine = line.trim();
  if (trimmedLine.startsWith('# ') && (trimmedLine.includes('sec:') || trimmedLine.includes('\\[sec:'))) {
    saveAgenda();
    saveSection();

    const id = extractId(line);
    if (id && majorSections.includes(id)) {
      const sectionName = sectionNames[id] || extractName(line);
      currentSection = {
        id: slugify(sectionName),
        name: sectionName,
        description: sectionDescs[id] || '',
        agendas: []
      };
    }
    continue;
  }

  // Check for agenda/subsection headers (## or ### with [sec:] or [cat:])
  if ((trimmedLine.startsWith('## ') || trimmedLine.startsWith('### ') || trimmedLine.startsWith('#### ')) &&
      (trimmedLine.includes('sec:') || trimmedLine.includes('cat:'))) {
    saveAgenda();

    const id = extractId(line);
    const name = extractName(line);

    if (id && name && currentSection) {
      // Skip container sections that only organize subsections
      if (!containerSections.includes(id)) {
        currentAgenda = {
          id: slugify(name),
          name: name,
          papers: []
        };
        // Some sections have papers directly after the header without "Outputs in 2025:"
        // Start collecting as outputs immediately for these cases
        inOutputs = true;
        outputsBuffer = [];
      }
    } else {
      inOutputs = false;
      outputsBuffer = [];
    }
    currentField = null;
    fieldValue = '';
    continue;
  }

  // Skip if no current agenda
  if (!currentAgenda) continue;

  // Parse field lines
  if (line.includes('**One-sentence summary:**')) {
    if (currentField && fieldValue) currentAgenda[currentField] = cleanText(fieldValue);
    currentField = 'summary';
    fieldValue = line.split('**One-sentence summary:**')[1] || '';
    inOutputs = false;
  }
  else if (line.includes('**Theory of change:**')) {
    if (currentField && fieldValue) currentAgenda[currentField] = cleanText(fieldValue);
    currentField = 'theoryOfChange';
    fieldValue = line.split('**Theory of change:**')[1] || '';
    inOutputs = false;
  }
  else if (line.includes('**See also:**')) {
    if (currentField && fieldValue) currentAgenda[currentField] = cleanText(fieldValue);
    currentField = null;
    fieldValue = '';
    // Extract "See also" content - can contain links and plain text
    const seeAlsoText = line.split('**See also:**')[1] || '';
    // Clean and store - keep links intact
    if (seeAlsoText.trim()) {
      currentAgenda.seeAlso = seeAlsoText.trim();
    }
    inOutputs = false;
  }
  else if (line.includes('**Orthodox problems:**')) {
    if (currentField && fieldValue) currentAgenda[currentField] = cleanText(fieldValue);
    currentField = 'orthodoxProblems';
    fieldValue = line.split('**Orthodox problems:**')[1] || '';
    inOutputs = false;
  }
  else if (line.includes('**Target case:**')) {
    if (currentField && fieldValue) currentAgenda[currentField] = cleanText(fieldValue);
    currentField = 'targetCase';
    fieldValue = line.split('**Target case:**')[1] || '';
    inOutputs = false;
  }
  else if (line.includes('**Broad approach:**')) {
    if (currentField && fieldValue) currentAgenda[currentField] = cleanText(fieldValue);
    currentField = 'broadApproach';
    fieldValue = line.split('**Broad approach:**')[1] || '';
    inOutputs = false;
  }
  else if (line.includes('**Some names:**') || line.includes('**Key people:**')) {
    if (currentField && fieldValue) currentAgenda[currentField] = cleanText(fieldValue);
    currentField = null;
    fieldValue = '';
    const namesText = line.split(/\*\*(Some names|Key people):\*\*/)[2] || '';
    const names = namesText.split(',').map(n => cleanText(n)).filter(n => n.length > 1);
    if (names.length > 0) currentAgenda.someNames = names;
    inOutputs = false;
  }
  else if (line.includes('**Estimated FTEs:**')) {
    if (currentField && fieldValue) currentAgenda[currentField] = cleanText(fieldValue);
    currentField = null;
    fieldValue = '';
    currentAgenda.estimatedFTEs = cleanText(line.split('**Estimated FTEs:**')[1] || '');
    inOutputs = false;
  }
  else if (line.includes('**Critiques:**')) {
    if (currentField && fieldValue) currentAgenda[currentField] = cleanText(fieldValue);
    currentField = null;
    fieldValue = '';
    const critiquesText = line.split('**Critiques:**')[1] || '';
    const critiqueLinks = [];
    const matches = [...critiquesText.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)];
    for (const m of matches) {
      critiqueLinks.push(`[${cleanText(m[1])}](${m[2]})`);
    }
    if (critiqueLinks.length > 0) currentAgenda.critiques = critiqueLinks;
    inOutputs = false;
  }
  else if (line.includes('**Funded by:**')) {
    if (currentField && fieldValue) currentAgenda[currentField] = cleanText(fieldValue);
    currentField = null;
    fieldValue = '';
    const fundedText = line.split('**Funded by:**')[1] || '';
    const funders = fundedText.split(',').map(f => cleanText(f)).filter(f => f.length > 1);
    if (funders.length > 0) currentAgenda.fundedBy = funders;
    // After Funded by, some sections have papers listed directly without "Outputs in 2025:"
    // Start collecting as outputs in case this section has that pattern
    inOutputs = true;
    outputsBuffer = [];
  }
  else if (line.includes('**Outputs in 2025:**') || line.includes('**Outputs:**')) {
    if (currentField && fieldValue) currentAgenda[currentField] = cleanText(fieldValue);
    currentField = null;
    fieldValue = '';
    inOutputs = true;
    outputsBuffer = [];
  }
  else if (inOutputs) {
    // We're collecting output lines
    // Handle lines that start with *, -, or contain links
    // Also handle lines that are just links without bullets (like in sec:theory_other)
    if (line.startsWith('*') || line.startsWith('-') || line.includes('](http') || line.includes('](https')) {
      outputsBuffer.push(line);
    } else if (line.match(/^#{1,4}\s/) || line.includes('---')) {
      // End of section
      inOutputs = false;
    } else if (line.trim() && line.trim().startsWith('[')) {
      // Line starts with a link (common in some sections)
      outputsBuffer.push(line);
    } else if (line.trim()) {
      // Continue output collection for multi-line entries
      outputsBuffer.push(line);
    }
  }
  else if (currentField) {
    // Continue collecting field value
    if (!line.startsWith('#') && !line.includes('---') && !line.includes('**')) {
      fieldValue += ' ' + line;
    }
  }
}

// Save final
saveAgenda();
saveSection();

// Build output
const data = { sections };

// Generate YAML
const yamlContent = yaml.dump(data, {
  lineWidth: -1,
  quotingType: '"',
  forceQuotes: false,
  noRefs: true,
  sortKeys: false
});

fs.writeFileSync('./src/data/papers.yaml', yamlContent);

console.log(`Parsed ${sections.length} sections:`);
let totalAgendas = 0;
let totalPapers = 0;
sections.forEach(s => {
  const paperCount = s.agendas.reduce((acc, a) => acc + (a.papers?.length || 0), 0);
  totalAgendas += s.agendas.length;
  totalPapers += paperCount;
  console.log(`  ${s.name}: ${s.agendas.length} agendas, ${paperCount} papers`);
});
console.log(`Total: ${totalAgendas} agendas, ${totalPapers} papers`);
