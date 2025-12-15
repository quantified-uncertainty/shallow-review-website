import { getSectionColors } from '@/constants/colors';
import {
  loadReviewData,
  loadStructureInfo,
} from '@/lib/loadData';
import { Agenda, Section } from '@/lib/types';
import { getNameWithoutParentheses } from '@/lib/utils';

import ExperimentClient from './ExperimentClient';

export const metadata = {
  title: "Experiment | Shallow Review 2025",
  description: "Experimental view with hover details",
};

// Prepare section data with colors and hierarchy for client
function prepareSectionData(sections: Section[], orderMap: Map<string, string[]>, parentOverrides: Map<string, string>) {
  return sections.map((section) => {
    const colors = getSectionColors(section.id);
    const agendas = section.agendas || [];
    const agendasById = new Map(agendas.map((a) => [a.id, a]));
    const subSections = section.subSections || [];

    // Get top-level items from structure
    const topLevelIds = orderMap.get(section.id) || [];

    // Group agendas by their parent
    const childrenByParent = new Map<string, Agenda[]>();
    for (const agenda of agendas) {
      const parent = parentOverrides.get(agenda.id);
      if (parent && parent !== section.id) {
        const children = childrenByParent.get(parent) || [];
        children.push(agenda);
        childrenByParent.set(parent, children);
      }
    }

    // Sort children by structure order
    for (const [parentId, children] of childrenByParent) {
      const order = orderMap.get(parentId);
      if (order) {
        const orderIndex = new Map(order.map((id, i) => [id, i]));
        children.sort(
          (a, b) =>
            (orderIndex.get(a.id) ?? Infinity) -
            (orderIndex.get(b.id) ?? Infinity)
        );
      }
    }

    // Check if section has subsections/parent agendas with children
    const hasHierarchy = topLevelIds.some(
      (id) =>
        childrenByParent.has(id) || subSections.some((s) => s.id === id)
    );

    // Build grouped structure for rendering
    const groups: { id: string; name: string; children: Agenda[] }[] = [];
    const standaloneAgendas: Agenda[] = [];

    if (hasHierarchy) {
      topLevelIds.forEach((itemId) => {
        const agenda = agendasById.get(itemId);
        const subSection = subSections.find((s) => s.id === itemId);
        const children = childrenByParent.get(itemId) || [];

        if ((subSection || agenda) && children.length > 0) {
          groups.push({
            id: itemId,
            name: subSection?.name || agenda?.name || itemId,
            children,
          });
        } else if (agenda && children.length === 0) {
          standaloneAgendas.push(agenda);
        }
      });
    }

    return {
      id: section.id,
      name: section.name,
      agendas,
      colors,
      hasHierarchy,
      groups,
      standaloneAgendas,
    };
  });
}

export default function ExperimentPage() {
  const data = loadReviewData();
  const { orderMap, parentOverrides } = loadStructureInfo();

  const totalAgendas = data.sections.reduce(
    (sum, s) => sum + (s.agendas?.length || 0),
    0
  );

  const preparedSections = prepareSectionData(data.sections, orderMap, parentOverrides);

  return (
    <ExperimentClient
      sections={preparedSections}
      totalAgendas={totalAgendas}
      sectionCount={data.sections.length}
    />
  );
}
