#!/usr/bin/env node

/**
 * Convert parsed YAML from gavento/shallow-review pipeline to website format.
 *
 * This script transforms the output of the shallow-review parsing pipeline
 * (https://github.com/gavento/shallow-review) into the format expected by
 * the shallow-review-website.
 *
 * The pipeline parses a markdown document into a flat list of items
 * (sections and agendas with their papers/outputs). This script restructures
 * that flat list into a nested hierarchy suitable for the website.
 *
 * Input format (from draft_types.py ProcessedDocument):
 * - source_file: path to the original markdown file
 * - items: array of DocumentItem objects with:
 *   - id: unique identifier (e.g., "sec:black_box" or "a:unlearning")
 *   - name: display name
 *   - header_level: markdown header level (1-6)
 *   - parent_id: ID of parent item (null for top-level)
 *   - content: markdown content/description
 *   - item_type: "section" or "agenda"
 *   - agenda_attributes (for agendas only):
 *     - outputs: array of Paper objects with link_url, title, authors, etc.
 *     - some_names, orthodox_problems, target_case_id, broad_approach_id, etc.
 *
 * Output format (for website src/data/agendas.yaml):
 * - sections: array of Section objects with:
 *   - id, name, description
 *   - agendas: array of Agenda objects with:
 *     - id, name, summary, theoryOfChange, papers[], etc.
 *
 * Usage:
 *   node scripts/convert-shallow-review-pipeline.js <input.yaml> [output.yaml]
 *
 * Example:
 *   node scripts/convert-shallow-review-pipeline.js \
 *     ~/Downloads/draft-md-parsed.yaml \
 *     src/data/agendas.yaml
 */

const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

// Helper to convert snake_case to camelCase
function toCamelCase(str) {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

// Convert a name to a slug ID (e.g., "Black-box safety" -> "black-box-safety")
function toSlugId(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Clean the ID (remove prefixes like "sec:" or "a:")
function cleanId(id) {
  return id.replace(/^(sec:|a:)/, '').replace(/:$/, '');
}

// Convert output item to Paper format
function convertOutputToPaper(output) {
  // Skip items without a link URL (these are just notes/comments)
  if (!output.link_url) {
    return null;
  }

  const paper = {
    title: output.title || output.link_text || 'Untitled',
    url: output.link_url,
  };

  // Add authors if present (join array to string)
  if (output.authors && output.authors.length > 0) {
    paper.authors = output.authors.join(', ');
  }

  // Optionally add more metadata
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

// Convert see_also array to string
function convertSeeAlso(seeAlso) {
  if (!seeAlso || seeAlso.length === 0) return undefined;
  return seeAlso.join(', ');
}

// Convert critiques to array format
function convertCritiques(critiques) {
  if (!critiques) return undefined;
  if (Array.isArray(critiques)) return critiques;
  // If it's a string, return as single-item array
  return [critiques];
}

// Convert funded_by to array of IDs
function convertFundedBy(fundedBy) {
  if (!fundedBy) return undefined;
  if (Array.isArray(fundedBy)) {
    // Already an array - convert to IDs
    return fundedBy.map(f => toSlugId(f));
  }
  // If it's a string, it might be a comma-separated list or markdown links
  // For now, just return as a note
  return undefined; // Will need manual curation
}

// Convert names array to researcher IDs
function convertNames(names) {
  if (!names || names.length === 0) return undefined;
  return names.map(name => toSlugId(name));
}

// Map of orthodox problem names to IDs (from orthodoxProblems.yaml)
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
    // Check if it's already a numeric ID
    if (/^\d+$/.test(pStr)) {
      result.push(pStr);
    } else if (ORTHODOX_PROBLEM_MAP[pStr]) {
      // Map named problem to ID
      result.push(ORTHODOX_PROBLEM_MAP[pStr]);
    }
    // Skip "Other: ..." entries
  }
  return result.length > 0 ? result : undefined;
}

// Convert target_case_id to website format
function convertTargetCase(targetCaseId) {
  if (!targetCaseId) return undefined;
  // Map common values (input format -> website format)
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
  // Map input values to website IDs (from broadApproaches.yaml)
  const mapping = {
    'engineering': 'engineering',
    'behavioral': 'behavioral',
    'behaviorist_science': 'behavioral',  // Pipeline uses this variant
    'cognitivist_science': 'cognitive',
    'cognitive': 'cognitive',
    'maths_philosophy': 'maths-philosophy',
    'maths-philosophy': 'maths-philosophy',
    'theoretical': 'theoretical',
  };
  const mapped = mapping[broadApproachId] || broadApproachId;
  return [mapped];
}

// Main conversion function
function convertToWebsiteFormat(inputData) {
  const items = inputData.items;

  // Build a map of items by ID for parent lookups
  const itemsById = new Map();
  items.forEach(item => {
    itemsById.set(item.id, item);
  });

  // Find all top-level sections (parent_id is null and item_type is section)
  const topLevelSections = items.filter(
    item => item.item_type === 'section' && item.parent_id === null
  );

  // Find all sub-sections (sections with a parent)
  const subSections = items.filter(
    item => item.item_type === 'section' && item.parent_id !== null
  );

  // Find all agendas
  const agendas = items.filter(item => item.item_type === 'agenda');

  // Build section hierarchy
  const sections = [];

  // Process each top-level section
  for (const topSection of topLevelSections) {
    const section = {
      id: cleanId(topSection.id),
      name: topSection.name,
      description: topSection.content || undefined,
      agendas: [],
    };

    // Find agendas that belong directly to this section
    const directAgendas = agendas.filter(a => a.parent_id === topSection.id);

    // Find sub-sections of this top-level section
    const childSubSections = subSections.filter(s => s.parent_id === topSection.id);

    // For each sub-section, find its agendas and add them
    // We'll flatten the hierarchy: sub-section agendas go into the parent section
    for (const subSection of childSubSections) {
      const subAgendas = agendas.filter(a => a.parent_id === subSection.id);
      directAgendas.push(...subAgendas);

      // Also check for deeper nesting (sub-sub-sections)
      const deeperSections = subSections.filter(s => s.parent_id === subSection.id);
      for (const deeperSection of deeperSections) {
        const deeperAgendas = agendas.filter(a => a.parent_id === deeperSection.id);
        directAgendas.push(...deeperAgendas);
      }
    }

    // Convert each agenda to website format
    for (const agenda of directAgendas) {
      const attrs = agenda.agenda_attributes || {};

      // Convert outputs to papers
      const papers = (attrs.outputs || [])
        .map(convertOutputToPaper)
        .filter(p => p !== null);

      const convertedAgenda = {
        id: cleanId(agenda.id),
        name: agenda.name,
      };

      // Add optional fields only if they exist
      if (attrs.one_sentence_summary) {
        convertedAgenda.summary = attrs.one_sentence_summary;
      }
      if (attrs.theory_of_change) {
        convertedAgenda.theoryOfChange = attrs.theory_of_change;
      }

      const seeAlso = convertSeeAlso(attrs.see_also);
      if (seeAlso) {
        convertedAgenda.seeAlso = seeAlso;
      }

      const orthodoxProblems = convertOrthodoxProblems(attrs.orthodox_problems);
      if (orthodoxProblems && orthodoxProblems.length > 0) {
        convertedAgenda.orthodoxProblems = orthodoxProblems;
      }

      const targetCase = convertTargetCase(attrs.target_case_id);
      if (targetCase) {
        convertedAgenda.targetCase = targetCase;
      }

      const broadApproaches = convertBroadApproaches(attrs.broad_approach_id);
      if (broadApproaches) {
        convertedAgenda.broadApproaches = broadApproaches;
      }

      const someNames = convertNames(attrs.some_names);
      if (someNames && someNames.length > 0) {
        convertedAgenda.someNames = someNames;
      }

      if (attrs.estimated_ftes) {
        convertedAgenda.estimatedFTEs = attrs.estimated_ftes;
      }

      const critiques = convertCritiques(attrs.critiques);
      if (critiques && critiques.length > 0) {
        convertedAgenda.critiques = critiques;
      }

      // Papers are required, but might be empty
      convertedAgenda.papers = papers;

      section.agendas.push(convertedAgenda);
    }

    // Only add sections that have agendas
    if (section.agendas.length > 0) {
      sections.push(section);
    }
  }

  return { sections };
}

// Main execution
async function main() {
  const inputPath = process.argv[2];
  const outputPath = process.argv[3] || 'converted-agendas.yaml';

  if (!inputPath) {
    console.error('Usage: node convert-parsed-yaml.js <input.yaml> [output.yaml]');
    console.error('');
    console.error('Example:');
    console.error('  node convert-parsed-yaml.js ~/Downloads/draft-md-20251208-to-parse-parsed.yaml src/data/agendas.yaml');
    process.exit(1);
  }

  try {
    console.log(`Reading input from: ${inputPath}`);
    const inputContent = fs.readFileSync(inputPath, 'utf8');
    const inputData = yaml.load(inputContent);

    console.log(`Found ${inputData.items.length} items`);

    const sectionCount = inputData.items.filter(i => i.item_type === 'section').length;
    const agendaCount = inputData.items.filter(i => i.item_type === 'agenda').length;
    console.log(`  - ${sectionCount} sections`);
    console.log(`  - ${agendaCount} agendas`);

    console.log('Converting to website format...');
    const outputData = convertToWebsiteFormat(inputData);

    console.log(`Converted to ${outputData.sections.length} top-level sections`);
    let totalAgendas = 0;
    let totalPapers = 0;
    for (const section of outputData.sections) {
      totalAgendas += section.agendas.length;
      for (const agenda of section.agendas) {
        totalPapers += agenda.papers.length;
      }
    }
    console.log(`  - ${totalAgendas} agendas total`);
    console.log(`  - ${totalPapers} papers total`);

    console.log(`Writing output to: ${outputPath}`);
    const outputContent = yaml.dump(outputData, {
      lineWidth: 120,
      noRefs: true,
      quotingType: '"',
      forceQuotes: false,
    });
    fs.writeFileSync(outputPath, outputContent, 'utf8');

    console.log('Done!');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
