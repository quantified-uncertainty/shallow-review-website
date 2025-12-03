import {
  loadReviewData,
  loadOrthodoxProblems,
  getOrthodoxProblemsByIds,
  loadBroadApproaches,
  getBroadApproachesByIds,
  loadTargetCases,
  getTargetCaseByValue,
  loadFunders,
  getFundersByIds,
} from "@/data/loadData";
import Link from "next/link";
import { notFound } from "next/navigation";
import PaperCard from "@/components/PaperCard";
import { TARGET_CASE_COLORS, FUNDER_COLORS } from "@/constants/colors";
import Markdown from "@/components/Markdown";
import lesswrongTagsLookup from "@/data/lesswrongTagsLookup.json";
import {
  ExternalLink,
  BookOpen,
  ChevronRight,
  Lightbulb,
  Tag,
  Users,
  FileText,
} from "lucide-react";
import ApproachBadge from "@/components/ApproachBadge";
import TableOfContents, { TOCItem } from "@/components/TableOfContents";
import Section from "@/components/Section";
import Header from "@/components/Header";

const tagsLookup = lesswrongTagsLookup as Record<string, { name: string; postCount: number }>;

interface PageProps {
  params: Promise<{ sectionId: string; agendaId: string }>;
}

export async function generateStaticParams() {
  const data = loadReviewData();
  const params: { sectionId: string; agendaId: string }[] = [];

  data.sections.forEach((section) => {
    section.agendas.forEach((agenda) => {
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
  const agenda = section?.agendas.find((a) => a.id === decodedAgendaId);

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
  const section = data.sections.find((s) => s.id === decodedSectionId);
  const agenda = section?.agendas.find((a) => a.id === decodedAgendaId);

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

  // Computed flags
  const hasResources = agenda.resources || agenda.wikipedia || (agenda.lesswrongTags && agenda.lesswrongTags.length > 0);
  const hasClassification = orthodoxProblems.length > 0 || targetCase || broadApproaches.length > 0;
  const hasPeopleFunding = (agenda.someNames && agenda.someNames.length > 0) || funders.length > 0 || agenda.estimatedFTEs;
  const hasCritiques = agenda.critiques && agenda.critiques.length > 0;

  // Build TOC items based on available content
  const tocItems: TOCItem[] = [];

  if (agenda.theoryOfChange) {
    tocItems.push({ id: "theory-of-change", label: "Theory of Change" });
  }
  if (hasClassification) {
    tocItems.push({ id: "classification", label: "Classification" });
  }
  if (hasPeopleFunding) {
    tocItems.push({ id: "people-funding", label: "People & Funding" });
  }
  if (hasResources || hasCritiques) {
    tocItems.push({ id: "online-info", label: "Online Info" });
  }
  if (agenda.papers && agenda.papers.length > 0) {
    tocItems.push({ id: "papers", label: "Papers & Outputs", count: agenda.papers.length });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-12">
          {/* Sticky TOC Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-8">
              <TableOfContents items={tocItems} />
            </div>
          </aside>

          {/* Main Content */}
          <main className="min-w-0">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Link href="/" className="hover:text-blue-600">
                Home
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link href={`/${sectionId}`} className="hover:text-blue-600">
                {section.name}
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-semibold">{agenda.name}</span>
            </nav>

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              {agenda.name.includes('(') ? (
                <>
                  {agenda.name.split('(')[0].trim()}
                  <span className="text-gray-400 font-normal"> ({agenda.name.split('(').slice(1).join('(')}</span>
                </>
              ) : (
                agenda.name
              )}
            </h1>

            {/* Summary - always visible, not in TOC */}
            {agenda.summary && (
              <div className="mb-10">
                <Markdown className="text-lg text-gray-600 leading-relaxed">
                  {agenda.summary}
                </Markdown>
              </div>
            )}

            <div className="space-y-10">
              {/* Theory of Change */}
              {agenda.theoryOfChange && (
                <Section id="theory-of-change" title="Theory of Change" icon={Lightbulb}>
                  <Markdown className="text-gray-700">{agenda.theoryOfChange}</Markdown>

                  {/* See Also inline within Theory of Change card */}
                  {agenda.seeAlso && (
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        See Also
                      </h3>
                      <Markdown className="text-gray-700">{agenda.seeAlso}</Markdown>
                    </div>
                  )}
                </Section>
              )}

              {/* Classification */}
              {hasClassification && (
                <Section id="classification" title="Classification" icon={Tag} card>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                    {broadApproaches.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          <Link href="/broad-approaches" className="hover:text-blue-600">
                            Broad Approach
                          </Link>
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {broadApproaches.map((approach) => (
                            <ApproachBadge
                              key={approach.id}
                              id={approach.id}
                              name={approach.name}
                              description={approach.description}
                              size="md"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {targetCase && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          <Link href="/target-cases" className="hover:text-blue-600">
                            Target Case
                          </Link>
                        </h3>
                        <Link
                          href={`/target-cases#case-${targetCase.id}`}
                          className={`inline-block text-sm px-2 py-1 rounded transition-colors ${TARGET_CASE_COLORS[targetCase.id] || "bg-gray-100 text-gray-700"}`}
                          title={targetCase.description}
                        >
                          {targetCase.name}
                        </Link>
                      </div>
                    )}

                    {orthodoxProblems.length > 0 && (
                      <div className="sm:col-span-2">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          <Link href="/orthodox-problems" className="hover:text-blue-600">
                            Orthodox Problems
                          </Link>
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {orthodoxProblems.map((problem) => (
                            <Link
                              key={problem.id}
                              href={`/orthodox-problems#problem-${problem.id}`}
                              className="inline-block text-sm bg-amber-50 text-amber-800 px-2 py-1 rounded hover:bg-amber-100 transition-colors"
                              title={problem.description}
                            >
                              {problem.id}. {problem.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Section>
              )}

              {/* People & Funding */}
              {hasPeopleFunding && (
                <Section id="people-funding" title="People & Funding" icon={Users} card>
                  <div className="space-y-4">
                    {funders.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          <Link href="/funders" className="hover:text-blue-600">
                            Funded By
                          </Link>
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {funders.map((funder) => (
                            <Link
                              key={funder.id}
                              href={`/funders#funder-${funder.id}`}
                              className={`inline-block text-sm px-2 py-1 rounded transition-colors ${FUNDER_COLORS}`}
                              title={funder.description}
                            >
                              {funder.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {agenda.someNames && agenda.someNames.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          Some Names
                        </h3>
                        <p className="text-gray-700">{agenda.someNames.join(", ")}</p>
                      </div>
                    )}

                    {agenda.estimatedFTEs && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          Estimated FTEs
                        </h3>
                        <p className="text-gray-700">{agenda.estimatedFTEs}</p>
                      </div>
                    )}
                  </div>
                </Section>
              )}

              {/* Online Info (Resources + Critiques) */}
              {(hasResources || (agenda.critiques && agenda.critiques.length > 0)) && (
                <Section id="online-info" title="Online Info" icon={BookOpen} card>
                  <div className="space-y-6">
                    {hasResources && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          Resources
                        </h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                          {agenda.wikipedia && (
                            <a
                              href={agenda.wikipedia}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                              Wikipedia
                            </a>
                          )}
                          {agenda.resources?.map((resource, i) => (
                            <a
                              key={i}
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              {resource.title}
                            </a>
                          ))}
                          {agenda.lesswrongTags?.map((slug) => {
                            const tagInfo = tagsLookup[slug];
                            const displayName = tagInfo?.name || slug;
                            const postCount = tagInfo?.postCount;
                            return (
                              <a
                                key={slug}
                                href={`https://www.lesswrong.com/tag/${slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                LessWrong: {displayName}
                                {postCount !== undefined && (
                                  <span className="text-xs text-blue-400">
                                    ({postCount} posts)
                                  </span>
                                )}
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {agenda.critiques && agenda.critiques.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          Critiques
                        </h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                          {agenda.critiques.map((critique, i) => (
                            <span key={i} className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 [&_a]:hover:underline">
                              <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                              <Markdown>{critique}</Markdown>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Section>
              )}

              {/* Papers & Outputs */}
              {agenda.papers && agenda.papers.length > 0 && (
                <Section id="papers" title={`Papers & Outputs (${agenda.papers.length})`} icon={FileText} card>
                  <ul className="space-y-2 divide-y divide-gray-100">
                    {agenda.papers.map((paper, i) => (
                      <li key={i} className="pt-2 first:pt-0">
                        <PaperCard paper={paper} />
                      </li>
                    ))}
                  </ul>
                </Section>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
