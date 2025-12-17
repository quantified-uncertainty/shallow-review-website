import {
  AlertTriangle,
  ArrowRight,
  BarChart,
  BookOpen,
  Building2,
  ChevronLeft,
  ChevronRight,
  Crosshair,
  DollarSign,
  FileText,
  Lightbulb,
  LucideIcon,
  MessageSquare,
  Settings,
  Shield,
  Target,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import ApproachBadge from '@/components/ApproachBadge';
import Markdown from '@/components/Markdown';
import SeeAlsoLinks from '@/components/SeeAlsoLinks';
import {
  getSectionColors,
  PROBLEM_COLORS,
  TARGET_CASE_COLORS,
} from '@/constants/colors';
import {
  createTagsLookup,
  getBroadApproachesByIds,
  getFundersByIds,
  getOrthodoxProblemsByIds,
  getResearchersByIds,
  getTargetCaseByValue,
  loadBroadApproaches,
  loadFunders,
  loadLesswrongTags,
  loadOrthodoxProblems,
  loadResearchers,
  loadReviewData,
  loadStructureInfo,
  loadTargetCases,
} from '@/lib/loadData';
import { getNameWithoutParentheses } from '@/lib/utils';

// Helper component for rows with hanging icons and wrapping text
function AttributeRow({
  icon: Icon,
  label,
  children,
  className = "",
  iconColor,
}: {
  icon?: LucideIcon;
  label: string;
  children: React.ReactNode;
  className?: string;
  iconColor?: string;
}) {
  return (
    <div className={`relative pl-0 ${className}`}>
      {Icon && (
        <div
          className={`absolute -left-10 top-1.5 ${
            iconColor || "text-gray-400"
          } flex items-start justify-center w-6`}
        >
          <Icon className="w-5 h-5" />
        </div>
      )}
      <div className="text-gray-900 leading-relaxed font-serif text-lg">
        <span className="font-serif italic text-gray-500 mr-2 font-medium">
          {label}
        </span>
        {children}
      </div>
    </div>
  );
}

interface PageProps {
  params: Promise<{ sectionId: string; agendaId: string }>;
}

export async function generateStaticParams() {
  const data = loadReviewData();
  const params: { sectionId: string; agendaId: string }[] = [];

  data.sections.forEach((section) => {
    (section.agendas || []).forEach((agenda) => {
      params.push({
        sectionId: section.id,
        agendaId: agenda.id,
      });
    });
  });

  return params;
}

export async function generateMetadata({ params }: PageProps) {
  const { sectionId, agendaId } = await params;
  const decodedSectionId = decodeURIComponent(sectionId);
  const decodedAgendaId = decodeURIComponent(agendaId);
  const data = loadReviewData();
  const section = data.sections.find((s) => s.id === decodedSectionId);
  const agenda = section?.agendas?.find((a) => a.id === decodedAgendaId);

  if (!agenda) return { title: "Not Found" };

  return {
    title: `${agenda.name} | Shallow Review 2025`,
    description: agenda.summary,
  };
}

export default async function AgendaPage({ params }: PageProps) {
  const { sectionId, agendaId } = await params;
  const decodedSectionId = decodeURIComponent(sectionId);
  const decodedAgendaId = decodeURIComponent(agendaId);
  const data = loadReviewData();
  const { problems: allProblems } = loadOrthodoxProblems();
  const { approaches: allApproaches } = loadBroadApproaches();
  const { cases: allCases } = loadTargetCases();
  const { funders: allFunders } = loadFunders();
  const { researchers: allResearchers } = loadResearchers();
  const { tags } = loadLesswrongTags();
  const tagsLookup = createTagsLookup(tags);
  const section = data.sections.find((s) => s.id === decodedSectionId);
  const agenda = section?.agendas?.find((a) => a.id === decodedAgendaId);

  if (!section || !agenda) {
    notFound();
  }

  const orthodoxProblems = agenda.orthodoxProblems
    ? getOrthodoxProblemsByIds(allProblems, agenda.orthodoxProblems)
    : [];

  const broadApproaches = agenda.broadApproaches
    ? getBroadApproachesByIds(allApproaches, agenda.broadApproaches)
    : [];

  const targetCase = agenda.targetCase
    ? getTargetCaseByValue(allCases, agenda.targetCase)
    : undefined;

  const funders = agenda.fundedBy
    ? getFundersByIds(allFunders, agenda.fundedBy)
    : [];

  const researchers = agenda.someNames
    ? getResearchersByIds(allResearchers, agenda.someNames)
    : [];

  // Build flat list of all agendas for prev/next navigation
  const allAgendas: { sectionId: string; agendaId: string; name: string }[] =
    [];
  for (const s of data.sections) {
    for (const a of s.agendas || []) {
      allAgendas.push({ sectionId: s.id, agendaId: a.id, name: a.name });
    }
  }
  const currentIndex = allAgendas.findIndex(
    (a) => a.sectionId === decodedSectionId && a.agendaId === decodedAgendaId
  );
  const prevAgenda = currentIndex > 0 ? allAgendas[currentIndex - 1] : null;
  const nextAgenda =
    currentIndex < allAgendas.length - 1 ? allAgendas[currentIndex + 1] : null;

  // Computed flags
  const hasResources =
    agenda.resources ||
    agenda.wikipedia ||
    (agenda.lesswrongTags && agenda.lesswrongTags.length > 0);
  const hasClassification =
    orthodoxProblems.length > 0 || targetCase || broadApproaches.length > 0;
  const hasPeopleFunding =
    (agenda.someNames && agenda.someNames.length > 0) ||
    funders.length > 0 ||
    agenda.estimatedFTEs;

  const sectionColors = getSectionColors(decodedSectionId);

  // Find current agenda index within this section
  const sectionAgendas = section.agendas || [];
  const subSections = section.subSections || [];
  const currentAgendaIndex = sectionAgendas.findIndex(
    (a) => a.id === decodedAgendaId
  );

  // Load structure to find parent hierarchy
  const { parentOverrides } = loadStructureInfo();

  // Build breadcrumb hierarchy from structure
  // Walk up the parent chain until we hit the section
  const breadcrumbItems: { id: string; name: string; hasPage: boolean }[] = [];
  let currentParentId = parentOverrides.get(decodedAgendaId);

  while (currentParentId && currentParentId !== decodedSectionId) {
    // Check if this parent is an agenda (has a page) or a sub-section (no page)
    const parentAsAgenda = sectionAgendas.find((a) => a.id === currentParentId);
    const parentAsSubSection = subSections.find(
      (s) => s.id === currentParentId
    );

    if (parentAsAgenda) {
      breadcrumbItems.unshift({
        id: parentAsAgenda.id,
        name: parentAsAgenda.name,
        hasPage: true,
      });
    } else if (parentAsSubSection) {
      breadcrumbItems.unshift({
        id: parentAsSubSection.id,
        name: parentAsSubSection.name,
        hasPage: false,
      });
    } else {
      // It's defined in structure but not in data - use the ID as name
      breadcrumbItems.unshift({
        id: currentParentId,
        name: currentParentId.replace(/_/g, " "),
        hasPage: false,
      });
    }

    // Move up to the next parent
    currentParentId = parentOverrides.get(currentParentId);
  }

  return (
    <div className={`min-h-screen ${sectionColors.bgLight} md:pl-8`}>
      <div className="max-w-4xl px-4 py-8 pl-12 lg:pl-16">
        {/* Breadcrumbs, Progress indicator, and Navigation */}
        <nav className="flex items-center justify-between mb-8 font-sans">
          <div className="flex items-center gap-4">
            <div className="text-sm flex items-center flex-wrap">
              <Link
                href={`/${sectionId}`}
                className={`${sectionColors.text} ${sectionColors.hover} transition-colors font-medium`}
              >
                {getNameWithoutParentheses(section.name)}
              </Link>
              {breadcrumbItems.map((item) => (
                <span key={item.id} className="flex items-center">
                  <span className={`mx-2 ${sectionColors.text} opacity-50`}>
                    /
                  </span>
                  {item.hasPage ? (
                    <Link
                      href={`/${sectionId}/${item.id}`}
                      className={`${sectionColors.text} ${sectionColors.hover} transition-colors font-medium`}
                    >
                      {getNameWithoutParentheses(item.name)}
                    </Link>
                  ) : (
                    <span className={`${sectionColors.text} opacity-70`}>
                      {getNameWithoutParentheses(item.name)}
                    </span>
                  )}
                </span>
              ))}
              <span className={`mx-2 ${sectionColors.text} opacity-50`}>
                &gt;
              </span>
            </div>
          </div>
          {/* Progress indicator - one bar per agenda in section */}
          <div className="flex gap-1 flex-1 justify-end mr-4">
            {sectionAgendas.map((a, i) => (
              <Link
                key={a.id}
                href={`/${sectionId}/${a.id}`}
                className={`h-3 w-2 rounded-full transition-all ${
                  i === currentAgendaIndex
                    ? sectionColors.accent
                    : `${sectionColors.accent} opacity-20 hover:opacity-40`
                }`}
                title={a.name}
              />
            ))}
          </div>
          <div className="flex items-center gap-1">
            {prevAgenda ? (
              <Link
                href={`/${prevAgenda.sectionId}/${prevAgenda.agendaId}`}
                className={`p-2 ${sectionColors.text} opacity-60 hover:opacity-100 hover:bg-gray-100 rounded-lg transition-all`}
                title={prevAgenda.name}
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
            ) : (
              <span className={`p-2 ${sectionColors.text} opacity-20 cursor-not-allowed`}>
                <ChevronLeft className="w-5 h-5" />
              </span>
            )}
            {nextAgenda ? (
              <Link
                href={`/${nextAgenda.sectionId}/${nextAgenda.agendaId}`}
                className={`p-2 ${sectionColors.text} opacity-60 hover:opacity-100 hover:bg-gray-100 rounded-lg transition-all`}
                title={nextAgenda.name}
              >
                <ChevronRight className="w-5 h-5" />
              </Link>
            ) : (
              <span className={`p-2 ${sectionColors.text} opacity-20 cursor-not-allowed`}>
                <ChevronRight className="w-5 h-5" />
              </span>
            )}
          </div>
        </nav>

        {/* Title */}
        <h1
          className={`text-4xl font-bold font-serif leading-tight tracking-tight mb-4 ${sectionColors.heading}`}
        >
          {agenda.name.includes("(") ? (
            <>
              {agenda.name.split("(")[0].trim()}
              <span className="text-gray-400 font-normal text-4xl">
                {" "}
                ({agenda.name.split("(").slice(1).join("(")}
              </span>
            </>
          ) : (
            agenda.name
          )}
        </h1>

        {/* Summary */}
        {agenda.summary && (
          <div className="mb-10">
            <Markdown className="text-xl text-gray-700 leading-relaxed font-serif italic">
              {agenda.summary}
            </Markdown>
          </div>
        )}

        {/* Description (longer content, e.g., for lab entries like "Others") */}
        {agenda.description && (
          <div className="mb-10 prose prose-gray max-w-none">
            <Markdown inline={false}>
              {agenda.description}
            </Markdown>
          </div>
        )}

        <div className="space-y-6">
          {/* Lab-specific fields */}
          {agenda.structure && (
            <AttributeRow icon={Building2} label="Structure:">
              <Markdown inline>{agenda.structure}</Markdown>
            </AttributeRow>
          )}
          {agenda.teams && (
            <AttributeRow icon={Users} label="Safety teams:">
              <Markdown inline={false}>{agenda.teams}</Markdown>
            </AttributeRow>
          )}
          {agenda.publicAlignmentAgenda && (
            <AttributeRow icon={BookOpen} label="Public alignment agenda:">
              <Markdown inline>{agenda.publicAlignmentAgenda}</Markdown>
            </AttributeRow>
          )}
          {agenda.framework && (
            <AttributeRow icon={Shield} label="Framework:">
              <Markdown inline>{agenda.framework}</Markdown>
            </AttributeRow>
          )}

          {/* Theory of Change */}
          {agenda.theoryOfChange && (
            <AttributeRow icon={Lightbulb} label="Theory of Change:">
              <Markdown inline>{agenda.theoryOfChange}</Markdown>
            </AttributeRow>
          )}

          {/* General Approach */}
          {broadApproaches.length > 0 && (
            <AttributeRow icon={Settings} label="General Approach:">
              <span className="inline-flex flex-wrap gap-2 items-center align-middle">
                {broadApproaches.map((approach) => (
                  <ApproachBadge
                    key={approach.id}
                    id={approach.id}
                    name={approach.name}
                    description={approach.description}
                    size="lg"
                  />
                ))}
              </span>
            </AttributeRow>
          )}

          {/* Target Case */}
          {targetCase && (
            <AttributeRow icon={Target} label="Target Case:">
              <Link
                href={`/target-cases#case-${targetCase.id}`}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-base font-medium border border-opacity-50 transition-colors ${
                  TARGET_CASE_COLORS[targetCase.id] ||
                  "bg-gray-100 text-gray-700 border-gray-200"
                }`}
              >
                <Crosshair className="w-4 h-4" />
                {targetCase.name}
              </Link>
            </AttributeRow>
          )}

          {/* Orthodox Problems */}
          {orthodoxProblems.length > 0 && (
            <AttributeRow icon={AlertTriangle} label="Orthodox Problems:">
              <div className="inline-flex flex-wrap gap-2 items-center align-middle">
                {orthodoxProblems.map((problem) => (
                  <Link
                    key={problem.id}
                    href={`/orthodox-problems#problem-${problem.id}`}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-base font-medium border border-opacity-50 transition-colors ${PROBLEM_COLORS}`}
                    title={problem.description}
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span className="opacity-75 text-sm">{problem.id}.</span>
                    {problem.name}
                  </Link>
                ))}
              </div>
            </AttributeRow>
          )}

          {/* See Also (includes resources) */}
          {(agenda.seeAlso || hasResources) && (
            <AttributeRow icon={ArrowRight} label="See Also:">
              <div className="inline">
                {agenda.seeAlso && (
                  <SeeAlsoLinks
                    seeAlso={agenda.seeAlso}
                    sections={data.sections}
                    currentSectionId={decodedSectionId}
                  />
                )}
                {agenda.seeAlso && hasResources && (
                  <span className="text-gray-400">, </span>
                )}
                {agenda.wikipedia && (
                  <>
                    <a
                      href={agenda.wikipedia}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      Wikipedia
                    </a>
                    {(agenda.resources?.length || agenda.lesswrongTags?.length) && (
                      <span className="text-gray-400">, </span>
                    )}
                  </>
                )}
                {agenda.resources?.map((resource, i) => (
                  <span key={i}>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {resource.title}
                    </a>
                    {(i < (agenda.resources?.length || 0) - 1 || agenda.lesswrongTags?.length) && (
                      <span className="text-gray-400">, </span>
                    )}
                  </span>
                ))}
                {agenda.lesswrongTags?.map((slug, i) => {
                  const tagInfo = tagsLookup[slug];
                  const displayName = tagInfo?.name || slug;
                  return (
                    <span key={slug}>
                      <a
                        href={`https://www.lesswrong.com/tag/${slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        LessWrong: {displayName}
                      </a>
                      {i < (agenda.lesswrongTags?.length || 0) - 1 && (
                        <span className="text-gray-400">, </span>
                      )}
                    </span>
                  );
                })}
              </div>
            </AttributeRow>
          )}

          {/* Key People */}
          {researchers.length > 0 && (
            <AttributeRow icon={Users} label="Some names:">
              <span className="text-gray-900">
                {researchers.map((researcher, i) => (
                  <span key={researcher.id}>
                    {researcher.name}
                    {i < researchers.length - 1 && ", "}
                  </span>
                ))}
              </span>
            </AttributeRow>
          )}

          {/* Funded By */}
          {funders.length > 0 && (
            <AttributeRow icon={DollarSign} label="Funded By:">
              <span className="text-gray-900">
                {funders.map((funder, i) => (
                  <span key={funder.id}>
                    {funder.name}
                    {i < funders.length - 1 && ", "}
                  </span>
                ))}
              </span>
            </AttributeRow>
          )}

          {/* Estimated FTEs */}
          {agenda.estimatedFTEs && (
            <AttributeRow icon={BarChart} label="Estimated FTEs:">
              {agenda.estimatedFTEs}
            </AttributeRow>
          )}

          {/* Critiques */}
          {agenda.critiques && agenda.critiques.length > 0 && (
            <AttributeRow icon={MessageSquare} label="Critiques:">
              <div className="inline">
                {agenda.critiques.map((critique, i) => (
                  <div key={i} className={i === 0 ? "inline" : "block mt-1"}>
                    <Markdown inline>{critique}</Markdown>
                  </div>
                ))}
              </div>
            </AttributeRow>
          )}

          {/* Outputs */}
          {agenda.papers && agenda.papers.length > 0 && (
            <div className="pt-4 border-t border-gray-100">
              <AttributeRow icon={FileText} label="Outputs:">
                <div className="mt-2 space-y-3">
                  {agenda.papers.map((paper, i) => (
                    <div key={i}>
                      <Link
                        href={paper.url || "#"}
                        target="_blank"
                        className="border-b border-gray-300 hover:border-blue-600 hover:text-blue-800 transition-colors font-medium"
                      >
                        {paper.title}
                      </Link>
                      {paper.authors && (
                        <span className="text-gray-500 ml-2">
                          — {paper.authors}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </AttributeRow>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
