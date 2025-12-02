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
import { APPROACH_COLORS, TARGET_CASE_COLORS, FUNDER_COLORS } from "@/constants/colors";
import Markdown from "@/components/Markdown";

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

  return (
    <div className="min-h-screen">
      <header className="bg-gray-900 text-white py-6">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-2 text-sm text-gray-400 mb-2">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span>/</span>
            <Link href={`/${sectionId}`} className="hover:text-white">
              {section.name}
            </Link>
          </div>
          <h1 className="text-3xl font-bold">{agenda.name}</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {agenda.summary && (
          <div className="mb-8">
            <Markdown className="text-lg text-gray-700 leading-relaxed">
              {agenda.summary}
            </Markdown>
          </div>
        )}

        <div className="grid gap-8">
          {agenda.theoryOfChange && (
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Theory of Change
              </h2>
              <Markdown className="text-gray-700">{agenda.theoryOfChange}</Markdown>
            </section>
          )}

          {agenda.seeAlso && (
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                See Also
              </h2>
              <Markdown className="text-gray-700">{agenda.seeAlso}</Markdown>
            </section>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {orthodoxProblems.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
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

            {agenda.targetCase && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  <Link href="/target-cases" className="hover:text-blue-600">
                    Target Case
                  </Link>
                </h3>
                {targetCase ? (
                  <Link
                    href={`/target-cases#case-${targetCase.id}`}
                    className={`inline-block text-sm px-2 py-1 rounded transition-colors ${TARGET_CASE_COLORS[targetCase.id] || "bg-gray-100 text-gray-700"}`}
                    title={targetCase.description}
                  >
                    {targetCase.name}
                  </Link>
                ) : (
                  <p className="text-gray-700">{agenda.targetCase}</p>
                )}
              </div>
            )}

            {broadApproaches.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  <Link href="/broad-approaches" className="hover:text-blue-600">
                    Broad Approach
                  </Link>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {broadApproaches.map((approach) => (
                    <Link
                      key={approach.id}
                      href={`/broad-approaches#approach-${approach.id}`}
                      className={`inline-block text-sm px-2 py-1 rounded transition-colors ${APPROACH_COLORS[approach.id] || "bg-gray-100 text-gray-700"}`}
                      title={approach.description}
                    >
                      {approach.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {agenda.estimatedFTEs && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Estimated FTEs
                </h3>
                <p className="text-gray-700">{agenda.estimatedFTEs}</p>
              </div>
            )}
          </div>

          {agenda.someNames && agenda.someNames.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Some Names
              </h2>
              <p className="text-gray-700">{agenda.someNames.join(", ")}</p>
            </section>
          )}

          {funders.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                <Link href="/funders" className="hover:text-blue-600">
                  Funded By
                </Link>
              </h2>
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
            </section>
          )}

          {agenda.critiques && agenda.critiques.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Critiques
              </h2>
              <ul className="space-y-1">
                {agenda.critiques.map((critique, i) => (
                  <li key={i} className="text-gray-700">
                    <Markdown>{critique}</Markdown>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {agenda.papers && agenda.papers.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Papers & Outputs ({agenda.papers.length})
              </h2>
              <ul className="space-y-2 divide-y divide-gray-100">
                {agenda.papers.map((paper, i) => (
                  <li key={i} className="pt-2 first:pt-0">
                    <PaperCard paper={paper} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
