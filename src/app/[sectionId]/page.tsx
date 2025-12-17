import { loadReviewData, loadLabs, loadStructureInfo } from "@/lib/loadData";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/lib/types";
import { getSectionColors } from "@/constants/colors";
import { getNameWithoutParentheses, getParentheticalPart } from "@/lib/utils";
import Markdown from "@/components/Markdown";

interface PageProps {
  params: Promise<{ sectionId: string }>;
}

export async function generateStaticParams() {
  const data = loadReviewData();
  // Include both agenda sections and the virtual labs section
  return [
    { sectionId: "labs" },
    ...data.sections.map((section) => ({
      sectionId: section.id,
    })),
  ];
}

export async function generateMetadata({ params }: PageProps) {
  const { sectionId } = await params;
  const decodedSectionId = decodeURIComponent(sectionId);

  // Handle labs section specially
  if (decodedSectionId === "labs") {
    return {
      title: "Labs (giant companies) | Shallow Review 2025",
      description: "Major AI labs and their safety efforts",
    };
  }

  const data = loadReviewData();
  const section = data.sections.find((s) => s.id === decodedSectionId);

  if (!section) return { title: "Not Found" };

  return {
    title: `${section.name} | Shallow Review 2025`,
    description: section.description,
  };
}

export default async function SectionPage({ params }: PageProps) {
  const { sectionId } = await params;
  const decodedSectionId = decodeURIComponent(sectionId);

  let section: Section | undefined;

  // Handle labs section specially
  if (decodedSectionId === "labs") {
    const { labs } = loadLabs();
    section = {
      id: "labs",
      name: "Labs (giant companies)",
      description: "Major AI labs and their safety efforts",
      labs: labs,
    };
  } else {
    const data = loadReviewData();
    section = data.sections.find((s) => s.id === decodedSectionId);
  }

  if (!section) {
    notFound();
  }

  const sectionColors = getSectionColors(decodedSectionId);

  // Load structure for ordering and nesting
  const { orderMap, parentOverrides } = loadStructureInfo();

  // Group agendas by parent for hierarchical display
  const agendas = section.agendas || [];
  const subSections = section.subSections || [];
  const subSectionIds = new Set(subSections.map(s => s.id));
  const agendasById = new Map(agendas.map(a => [a.id, a]));

  // Get effective parent for an agenda (structure overrides data)
  function getEffectiveParent(agendaId: string): string | undefined {
    return parentOverrides.get(agendaId);
  }

  // Sort items by structure order, with unordered items at the end
  function sortByStructure(items: typeof agendas, parentId: string): typeof agendas {
    const order = orderMap.get(parentId);
    if (!order) return items;

    const orderIndex = new Map(order.map((id, i) => [id, i]));
    return [...items].sort((a, b) => {
      const aIndex = orderIndex.get(a.id) ?? Infinity;
      const bIndex = orderIndex.get(b.id) ?? Infinity;
      return aIndex - bIndex;
    });
  }

  // Get children for a parent from structure
  function getStructureChildren(parentId: string): string[] {
    return orderMap.get(parentId) || [];
  }

  // Build the display structure from structure.yaml
  const sectionOrder = getStructureChildren(decodedSectionId);

  // Collect items that are in structure vs not
  const itemsInStructure = new Set<string>();
  function collectStructureItems(parentId: string) {
    const children = getStructureChildren(parentId);
    for (const childId of children) {
      itemsInStructure.add(childId);
      collectStructureItems(childId);
    }
  }
  collectStructureItems(decodedSectionId);

  // Top-level items for this section (from structure, or fallback to all without parents)
  const topLevelIds = sectionOrder.length > 0
    ? sectionOrder
    : agendas.filter(a => !a.parentAgendaId && !a.parentSectionId).map(a => a.id);

  // Children by parent (using structure)
  const childrenByParent = new Map<string, typeof agendas>();
  for (const agenda of agendas) {
    const parent = getEffectiveParent(agenda.id);
    if (parent && parent !== decodedSectionId) {
      const children = childrenByParent.get(parent) || [];
      children.push(agenda);
      childrenByParent.set(parent, children);
    }
  }

  // Sort children by structure order
  for (const [parentId, children] of childrenByParent) {
    childrenByParent.set(parentId, sortByStructure(children, parentId));
  }

  return (
    <div className={`min-h-screen ${sectionColors.bgLight} md:pl-8`}>
      <main className="max-w-4xl px-4 py-8 pl-12 lg:pl-16">
        {/* Spacer to maintain alignment with agenda pages */}
        <div className="mb-8"></div>

        {/* Colored accent bar */}
        <div className={`w-16 h-1.5 ${sectionColors.accent} rounded-full mb-6`}></div>

        <h1 className={`text-5xl font-bold mb-3 font-serif leading-tight tracking-tight ${sectionColors.heading}`}>
          {getNameWithoutParentheses(section.name)}
          {getParentheticalPart(section.name) && (
            <span className="text-gray-400 font-normal text-4xl"> {getParentheticalPart(section.name)}</span>
          )}
        </h1>
        {section.description && (
          <div className="text-gray-700 text-xl mb-10 font-serif italic prose prose-xl prose-gray max-w-none">
            <Markdown inline={false}>{section.description}</Markdown>
          </div>
        )}
        <div className="space-y-4">
          {/* Render labs if present */}
          {section.labs?.map((lab) => (
            <Link
              key={lab.id}
              href={`/labs/${lab.id}`}
              className="block py-2 hover:bg-white/50 rounded-lg px-2 -mx-2 transition-colors group"
            >
              <div className="flex items-baseline gap-3">
                <h2 className={`text-lg font-semibold text-gray-900 ${sectionColors.groupHover} transition-colors`}>
                  {lab.name}
                </h2>
                {lab.papers && lab.papers.length > 0 && (
                  <span className="text-sm text-gray-400">
                    {lab.papers.length} papers
                  </span>
                )}
              </div>
            </Link>
          ))}
          {/* Render items using structure-based hierarchy */}
          {topLevelIds.map((itemId) => {
            // Check if it's an agenda or sub-section
            const agenda = agendasById.get(itemId);
            const subSection = subSections.find(s => s.id === itemId);
            const children = childrenByParent.get(itemId) || [];
            const hasChildren = children.length > 0;

            // It's a sub-section header
            if (subSection) {
              if (children.length === 0) return null;
              return (
                <div key={itemId} className="space-y-2">
                  <div id={itemId} className="text-gray-400 font-medium scroll-mt-8">
                    {subSection.name}
                  </div>
                  <div className="pl-5 space-y-3 border-l-2 border-gray-200">
                    {children.map((child) => {
                      const grandchildren = childrenByParent.get(child.id) || [];
                      if (grandchildren.length > 0) {
                        return (
                          <div key={child.id} className="space-y-2">
                            <Link
                              href={`/${sectionId}/${child.id}`}
                              className="block text-gray-400 font-medium hover:text-gray-600 transition-colors text-sm"
                            >
                              {child.name}
                            </Link>
                            <div className="pl-4 space-y-2 border-l border-gray-200">
                              {grandchildren.map((gc) => (
                                <Link
                                  key={gc.id}
                                  href={`/${sectionId}/${gc.id}`}
                                  className="block py-2 hover:bg-white/50 rounded-lg px-2 transition-colors group"
                                >
                                  <div className="flex items-baseline gap-3 flex-wrap">
                                    <h2 className={`text-lg font-semibold text-gray-900 ${sectionColors.groupHover} transition-colors`}>
                                      {gc.name}
                                    </h2>
                                    {gc.papers && gc.papers.length > 0 && (
                                      <span className="text-sm text-gray-400">{gc.papers.length} papers</span>
                                    )}
                                  </div>
                                  {gc.summary && <p className="text-gray-500 text-sm mt-1 line-clamp-1">{gc.summary}</p>}
                                </Link>
                              ))}
                            </div>
                          </div>
                        );
                      }
                      return (
                        <Link
                          key={child.id}
                          href={`/${sectionId}/${child.id}`}
                          className="block py-2 hover:bg-white/50 rounded-lg px-2 transition-colors group"
                        >
                          <div className="flex items-baseline gap-3 flex-wrap">
                            <h2 className={`text-lg font-semibold text-gray-900 ${sectionColors.groupHover} transition-colors`}>
                              {child.name}
                            </h2>
                            {child.papers && child.papers.length > 0 && (
                              <span className="text-sm text-gray-400">{child.papers.length} papers</span>
                            )}
                          </div>
                          {child.summary && <p className="text-gray-500 text-sm mt-1 line-clamp-1">{child.summary}</p>}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            }

            // It's an agenda with children (parent agenda)
            if (agenda && hasChildren) {
              return (
                <div key={itemId} className="space-y-2">
                  <Link
                    href={`/${sectionId}/${agenda.id}`}
                    className="block text-gray-400 font-medium hover:text-gray-600 transition-colors"
                  >
                    {agenda.name}
                  </Link>
                  <div className="pl-5 space-y-3 border-l-2 border-gray-200">
                    {children.map((child) => (
                      <Link
                        key={child.id}
                        href={`/${sectionId}/${child.id}`}
                        className="block py-2 hover:bg-white/50 rounded-lg px-2 transition-colors group"
                      >
                        <div className="flex items-baseline gap-3 flex-wrap">
                          <h2 className={`text-lg font-semibold text-gray-900 ${sectionColors.groupHover} transition-colors`}>
                            {child.name}
                          </h2>
                          {child.papers && child.papers.length > 0 && (
                            <span className="text-sm text-gray-400">{child.papers.length} papers</span>
                          )}
                        </div>
                        {child.summary && <p className="text-gray-500 text-sm mt-1 line-clamp-1">{child.summary}</p>}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }

            // Regular agenda without children
            if (agenda) {
              return (
                <Link
                  key={itemId}
                  href={`/${sectionId}/${agenda.id}`}
                  className="block py-2 hover:bg-white/50 rounded-lg px-2 -mx-2 transition-colors group"
                >
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <h2 className={`text-lg font-semibold text-gray-900 ${sectionColors.groupHover} transition-colors`}>
                      {agenda.name}
                    </h2>
                    {agenda.papers && agenda.papers.length > 0 && (
                      <span className="text-sm text-gray-400">{agenda.papers.length} papers</span>
                    )}
                  </div>
                  {agenda.summary && (
                    <p className="text-gray-500 text-sm mt-1 line-clamp-1">{agenda.summary}</p>
                  )}
                </Link>
              );
            }

            return null;
          })}
        </div>
      </main>
    </div>
  );
}
