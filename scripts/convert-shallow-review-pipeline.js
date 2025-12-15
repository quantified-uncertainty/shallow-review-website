#!/usr/bin/env node

/**
 * Convert pipeline YAML from gavento/shallow-review into flat data files.
 *
 * This script transforms the output of the shallow-review parsing pipeline
 * (https://github.com/gavento/shallow-review) into flat YAML files for the
 * shallow-review-website.
 *
 * Input:  src/data/pipelineData.yaml  (copy from pipeline output)
 * Output: src/data/sections.yaml      (flat list of sections)
 *         src/data/agendas.yaml       (flat list of agendas with parent refs)
 *
 * The hierarchy is built at runtime by loadData.ts when the website loads.
 *
 * Usage:
 *   npm run convert-pipeline
 *   # or directly:
 *   node scripts/convert-shallow-review-pipeline.js
 */

const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const INPUT_FILE = path.join(DATA_DIR, 'pipelineData.yaml');
const ADJUSTMENTS_FILE = path.join(DATA_DIR, 'pipelineAdjustments.yaml');
const SECTIONS_FILE = path.join(DATA_DIR, 'sections.yaml');
const AGENDAS_FILE = path.join(DATA_DIR, 'agendas.yaml');

/**
 * Load adjustments from pipelineAdjustments.yaml
 * These override item_type and parent_id during conversion
 */
function loadAdjustments() {
  if (!fs.existsSync(ADJUSTMENTS_FILE)) {
    return {};
  }
  try {
    const content = fs.readFileSync(ADJUSTMENTS_FILE, 'utf8');
    const data = yaml.load(content);
    return data?.adjustments || {};
  } catch (error) {
    console.warn(`Warning: Could not load adjustments file: ${error.message}`);
    return {};
  }
}

// File header for generated files
const GENERATED_HEADER = `# GENERATED FILE - Do not edit manually
# Source: src/data/pipelineData.yaml
# Regenerate with: npm run convert-pipeline
#
# This file is regenerated from the shallow-review pipeline output.
# Manual edits will be overwritten.

`;

// Clean the ID (remove prefixes like "sec:" or "a:")
function cleanId(id) {
  return id.replace(/^(sec:|a:)/, '').replace(/:$/, '');
}

// Convert a name to a slug ID
function toSlugId(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Convert output item to Paper format
function convertOutputToPaper(output) {
  if (!output.link_url) {
    return null;
  }

  const paper = {
    title: output.title || output.link_text || 'Untitled',
    url: output.link_url,
  };

  if (output.authors && output.authors.length > 0) {
    paper.authors = output.authors.join(', ');
  }
  if (output.published_year) {
    paper.year = output.published_year;
  }
  if (output.venue) {
    paper.venue = output.venue;
  }
  if (output.kind) {
    paper.kind = output.kind;
  }

  return paper;
}

// Map of orthodox problem names to IDs
const ORTHODOX_PROBLEM_MAP = {
  'value_fragile': '1',
  'corrigibility_unnatural': '2',
  'pivotal_dangerous': '3',
  'goals_misgeneralize': '4',
  'instrumental_convergence': '5',
  'plans_incomprehensible': '6',
  'fool_supervisors': '7',
  'hack_supervisors': '8',
  'no_value_handshake': '9',
  'humanlike_minds_not_safe': '10',
  'race_dynamics': '11',
  'exfiltration': '12',
  'fair_pivotal': '13',
};

// Convert orthodox_problems to array of problem IDs
function convertOrthodoxProblems(problems) {
  if (!problems || problems.length === 0) return undefined;

  const result = [];
  for (const p of problems) {
    const pStr = p.toString();
    if (/^\d+$/.test(pStr)) {
      result.push(pStr);
    } else if (ORTHODOX_PROBLEM_MAP[pStr]) {
      result.push(ORTHODOX_PROBLEM_MAP[pStr]);
    }
  }
  return result.length > 0 ? result : undefined;
}

// Convert target_case_id to website format
function convertTargetCase(targetCaseId) {
  if (!targetCaseId) return undefined;
  const mapping = {
    'average_case': 'average-case',
    'worst_case': 'worst-case',
    'pessimistic_case': 'pessimistic',
    'pessimistic': 'pessimistic',
    'optimistic_case': 'optimistic',
    'optimistic': 'optimistic',
    'mixed': 'mixed',
    'mixed_case': 'mixed',
  };
  return mapping[targetCaseId] || targetCaseId;
}

// Convert broad_approach_id to array
function convertBroadApproaches(broadApproachId) {
  if (!broadApproachId) return undefined;
  const mapping = {
    'engineering': 'engineering',
    'behavioral': 'behavioral',
    'behaviorist_science': 'behavioral',
    'cognitivist_science': 'cognitive',
    'cognitive': 'cognitive',
    'maths_philosophy': 'maths-philosophy',
    'maths-philosophy': 'maths-philosophy',
    'theoretical': 'theoretical',
  };
  const mapped = mapping[broadApproachId] || broadApproachId;
  return [mapped];
}

// Convert see_also array to string
function convertSeeAlso(seeAlso) {
  if (!seeAlso || seeAlso.length === 0) return undefined;
  return seeAlso.join(', ');
}

// Convert names to slugs
function convertNames(names) {
  if (!names || names.length === 0) return undefined;
  return names.map(name => toSlugId(name));
}

// Convert critiques to array
function convertCritiques(critiques) {
  if (!critiques) return undefined;
  if (Array.isArray(critiques)) return critiques;
  return [critiques];
}

/**
 * Main conversion function - outputs two flat files
 * @param inputData - The parsed pipeline YAML data
 * @param adjustments - Overrides for item_type and parent
 */
function convertToFlatFormat(inputData, adjustments = {}) {
  const items = inputData.items;
  const sections = [];
  const agendas = [];

  // Process all items
  for (const item of items) {
    const cleanedId = cleanId(item.id);
    let parentId = item.parent_id ? cleanId(item.parent_id) : null;

    // Check for adjustments
    const adjustment = adjustments[cleanedId];
    let itemType = item.item_type;

    if (adjustment) {
      if (adjustment.item_type) {
        itemType = adjustment.item_type;
      }
      if (adjustment.parent !== undefined) {
        parentId = adjustment.parent;
      }
    }

    if (itemType === 'section') {
      const section = {
        id: cleanedId,
        name: item.name,
      };

      if (item.content) {
        section.description = item.content;
      }
      if (parentId) {
        section.parent = parentId;
      }

      sections.push(section);

    } else if (itemType === 'agenda') {
      const attrs = item.agenda_attributes || {};

      // Convert outputs to papers
      const papers = (attrs.outputs || [])
        .map(convertOutputToPaper)
        .filter(p => p !== null);

      const agenda = {
        id: cleanedId,
        name: item.name,
        parent: parentId,
      };

      // Add optional fields only if they exist
      // Note: If a section was converted to agenda via adjustments,
      // use item.content as the summary (sections don't have agenda_attributes)
      if (attrs.one_sentence_summary) {
        agenda.summary = attrs.one_sentence_summary;
      } else if (item.content && item.item_type === 'section') {
        // Section converted to agenda - use content as description
        agenda.summary = item.content;
      }
      if (attrs.theory_of_change) {
        agenda.theoryOfChange = attrs.theory_of_change;
      }

      const seeAlso = convertSeeAlso(attrs.see_also);
      if (seeAlso) {
        agenda.seeAlso = seeAlso;
      }

      const orthodoxProblems = convertOrthodoxProblems(attrs.orthodox_problems);
      if (orthodoxProblems && orthodoxProblems.length > 0) {
        agenda.orthodoxProblems = orthodoxProblems;
      }

      const targetCase = convertTargetCase(attrs.target_case_id);
      if (targetCase) {
        agenda.targetCase = targetCase;
      }

      const broadApproaches = convertBroadApproaches(attrs.broad_approach_id);
      if (broadApproaches) {
        agenda.broadApproaches = broadApproaches;
      }

      const someNames = convertNames(attrs.some_names);
      if (someNames && someNames.length > 0) {
        agenda.someNames = someNames;
      }

      if (attrs.estimated_ftes) {
        agenda.estimatedFTEs = attrs.estimated_ftes;
      }

      const critiques = convertCritiques(attrs.critiques);
      if (critiques && critiques.length > 0) {
        agenda.critiques = critiques;
      }

      // Papers array (may be empty)
      agenda.papers = papers;

      agendas.push(agenda);
    }
  }

  return { sections, agendas };
}

// Main execution
async function main() {
  try {
    // Check if input file exists
    if (!fs.existsSync(INPUT_FILE)) {
      console.error(`Error: Input file not found: ${INPUT_FILE}`);
      console.error('');
      console.error('To use this script:');
      console.error('1. Copy the pipeline output to src/data/pipelineData.yaml');
      console.error('2. Run: npm run convert-pipeline');
      process.exit(1);
    }

    console.log(`Reading input from: ${INPUT_FILE}`);
    const inputContent = fs.readFileSync(INPUT_FILE, 'utf8');
    const inputData = yaml.load(inputContent);

    console.log(`Found ${inputData.items.length} items`);
    const sectionCount = inputData.items.filter(i => i.item_type === 'section').length;
    const agendaCount = inputData.items.filter(i => i.item_type === 'agenda').length;
    console.log(`  - ${sectionCount} sections (in pipeline)`);
    console.log(`  - ${agendaCount} agendas (in pipeline)`);

    // Load adjustments
    const adjustments = loadAdjustments();
    const adjustmentCount = Object.keys(adjustments).length;
    if (adjustmentCount > 0) {
      console.log(`Applying ${adjustmentCount} adjustments from pipelineAdjustments.yaml`);
      for (const [id, adj] of Object.entries(adjustments)) {
        const changes = [];
        if (adj.item_type) changes.push(`type→${adj.item_type}`);
        if (adj.parent !== undefined) changes.push(`parent→${adj.parent}`);
        console.log(`  - ${id}: ${changes.join(', ')}`);
      }
    }

    console.log('Converting to flat format...');
    const { sections, agendas } = convertToFlatFormat(inputData, adjustments);

    // Count total papers
    let totalPapers = 0;
    for (const agenda of agendas) {
      totalPapers += agenda.papers.length;
    }
    console.log(`  - ${totalPapers} papers total`);

    // Write sections.yaml
    console.log(`Writing: ${SECTIONS_FILE}`);
    const sectionsContent = GENERATED_HEADER + yaml.dump(sections, {
      lineWidth: 120,
      noRefs: true,
      quotingType: '"',
      forceQuotes: false,
    });
    fs.writeFileSync(SECTIONS_FILE, sectionsContent, 'utf8');

    // Write agendas.yaml
    console.log(`Writing: ${AGENDAS_FILE}`);
    const agendasContent = GENERATED_HEADER + yaml.dump(agendas, {
      lineWidth: 120,
      noRefs: true,
      quotingType: '"',
      forceQuotes: false,
    });
    fs.writeFileSync(AGENDAS_FILE, agendasContent, 'utf8');

    console.log('');
    console.log('Done! Generated files:');
    console.log(`  - ${sections.length} sections in sections.yaml`);
    console.log(`  - ${agendas.length} agendas in agendas.yaml`);
    console.log('');
    console.log('Run "npm run build" to verify the conversion worked correctly.');

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
