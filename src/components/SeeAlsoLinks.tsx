import Link from 'next/link';

import { Agenda } from '@/lib/types';

// Minimal section shape needed for resolution
interface SubSectionLike {
  id: string;
  name: string;
}

interface SectionLike {
  id: string;
  name: string;
  agendas?: Agenda[];
  subSections?: SubSectionLike[];
}

interface SeeAlsoLinksProps {
  seeAlso: string;
  sections: SectionLike[];
  currentSectionId?: string;
}

interface ParsedReference {
  type: 'section' | 'agenda' | 'text';
  id?: string;
  text: string;
  url?: string;
}

/**
 * Parses a seeAlso string and extracts references
 * Handles formats like:
 * - sec:section_id -> link to section
 * - a:agenda_id -> link to agenda
 * - [title](url) -> external link
 * - plain text -> rendered as-is
 */
function parseSeeAlso(seeAlso: string, sections: SectionLike[]): ParsedReference[] {
  const references: ParsedReference[] = [];

  // Build lookup maps
  const sectionById = new Map<string, SectionLike>();
  const subSectionById = new Map<string, { subSection: SubSectionLike; parentSectionId: string }>();
  const agendaById = new Map<string, { agenda: Agenda; sectionId: string }>();

  for (const section of sections) {
    sectionById.set(section.id, section);
    // Index sub-sections
    for (const subSection of section.subSections || []) {
      subSectionById.set(subSection.id, { subSection, parentSectionId: section.id });
    }
    // Index agendas
    for (const agenda of section.agendas || []) {
      agendaById.set(agenda.id, { agenda, sectionId: section.id });
    }
  }

  // Split by comma and process each part
  const parts = seeAlso.split(',').map(p => p.trim()).filter(Boolean);

  for (const part of parts) {
    // Check for sec:xxx pattern - can be a section, sub-section, or an agenda acting as a category
    const secMatch = part.match(/^sec:(\S+)$/);
    if (secMatch) {
      const id = secMatch[1];
      // First check if it's a real section
      const section = sectionById.get(id);
      if (section) {
        references.push({
          type: 'section',
          id: id,
          text: section.name,
          url: `/${id}`,
        });
        continue;
      }
      // Check if it's a sub-section (links to anchor within parent section)
      const subSectionInfo = subSectionById.get(id);
      if (subSectionInfo) {
        references.push({
          type: 'section',
          id: id,
          text: subSectionInfo.subSection.name,
          url: `/${subSectionInfo.parentSectionId}#${id}`,
        });
        continue;
      }
      // Otherwise check if it's an agenda (some "sections" are actually parent agendas)
      const agendaInfo = agendaById.get(id);
      if (agendaInfo) {
        references.push({
          type: 'agenda',
          id: id,
          text: agendaInfo.agenda.name,
          url: `/${agendaInfo.sectionId}/${id}`,
        });
        continue;
      }
      // Not found, render as text
      references.push({ type: 'text', text: part });
      continue;
    }

    // Check for a:xxx pattern
    const agendaMatch = part.match(/^a:(\S+)$/);
    if (agendaMatch) {
      const agendaId = agendaMatch[1];
      const agendaInfo = agendaById.get(agendaId);
      if (agendaInfo) {
        references.push({
          type: 'agenda',
          id: agendaId,
          text: agendaInfo.agenda.name,
          url: `/${agendaInfo.sectionId}/${agendaId}`,
        });
      } else {
        // Agenda not found, render as text
        references.push({ type: 'text', text: part });
      }
      continue;
    }

    // Check for markdown link [title](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      references.push({
        type: 'text',
        text: linkMatch[1],
        url: linkMatch[2],
      });
      continue;
    }

    // Plain text
    references.push({ type: 'text', text: part });
  }

  return references;
}

export default function SeeAlsoLinks({ seeAlso, sections, currentSectionId }: SeeAlsoLinksProps) {
  const references = parseSeeAlso(seeAlso, sections);

  return (
    <span className="inline">
      {references.map((ref, i) => (
        <span key={i}>
          {ref.url ? (
            ref.url.startsWith('/') ? (
              <Link
                href={ref.url}
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                {ref.text}
              </Link>
            ) : (
              <a
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                {ref.text}
              </a>
            )
          ) : (
            <span>{ref.text}</span>
          )}
          {i < references.length - 1 && <span className="text-gray-400">, </span>}
        </span>
      ))}
    </span>
  );
}
