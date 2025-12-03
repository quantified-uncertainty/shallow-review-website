import { loadReviewData, loadResearchers } from "@/data/loadData";
import Link from "next/link";
import { Metadata } from "next";
import { APP_SHORT_TITLE } from "@/constants/app";
import { ChevronRight } from "lucide-react";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: `Researchers | ${APP_SHORT_TITLE}`,
  description: "Researchers and individuals working on AI safety research agendas",
};

export default function ResearchersPage() {
  const reviewData = loadReviewData();
  const { researchers } = loadResearchers();

  // Build a map of researcher ID -> agendas they're associated with
  const researcherToAgendas: Record<
    string,
    { agenda: { id: string; name: string }; section: { id: string; name: string } }[]
  > = {};

  for (const researcher of researchers) {
    researcherToAgendas[researcher.id] = [];
  }

  for (const section of reviewData.sections) {
    for (const agenda of section.agendas) {
      if (agenda.someNames?.length) {
        for (const researcherId of agenda.someNames) {
          if (researcherToAgendas[researcherId]) {
            researcherToAgendas[researcherId].push({
              agenda: { id: agenda.id, name: agenda.name },
              section: { id: section.id, name: section.name },
            });
          }
        }
      }
    }
  }

  // Sort researchers by number of agendas (descending), then by name
  const sortedResearchers = [...researchers].sort((a, b) => {
    const countDiff = (researcherToAgendas[b.id]?.length || 0) - (researcherToAgendas[a.id]?.length || 0);
    if (countDiff !== 0) return countDiff;
    return a.name.localeCompare(b.name);
  });

  // Only show researchers with at least one agenda
  const activeResearchers = sortedResearchers.filter(r => researcherToAgendas[r.id]?.length > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-700">Researchers</span>
        </nav>

        <h1 className="text-4xl font-bold text-gray-900 mb-2">Researchers</h1>
        <p className="text-gray-600 text-lg mb-8">
          People associated with AI safety research agendas. Sorted by number of associated agendas.
        </p>

        <p className="text-sm text-gray-500 mb-6">
          {activeResearchers.length} researchers across {reviewData.sections.reduce((acc, s) => acc + s.agendas.length, 0)} agendas
        </p>

        <div className="space-y-6">
          {activeResearchers.map((researcher) => {
            const agendas = researcherToAgendas[researcher.id] || [];
            return (
              <section
                key={researcher.id}
                id={`researcher-${researcher.id}`}
                className="border-b border-gray-200 pb-6 last:border-0"
              >
                <div className="flex items-baseline gap-3">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {researcher.name}
                  </h2>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    {agendas.length} agenda{agendas.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {agendas.length > 0 && (
                  <div className="mt-3">
                    <div className="flex flex-wrap gap-2">
                      {agendas.map(({ agenda, section }) => (
                        <Link
                          key={`${section.id}-${agenda.id}`}
                          href={`/${section.id}/${agenda.id}`}
                          className="inline-block text-sm px-3 py-1 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                        >
                          {agenda.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}
