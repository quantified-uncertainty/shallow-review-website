import { loadReviewData, loadFunders } from "@/lib/loadData";
import Link from "next/link";
import { Metadata } from "next";
import { APP_TITLE, APP_AUTHORS, APP_SHORT_TITLE } from "@/constants/app";
import { ExternalLink, BookOpen, ChevronRight } from "lucide-react";
import AgendaLink from "@/components/AgendaLink";

export const metadata: Metadata = {
  title: `Funders | ${APP_SHORT_TITLE}`,
  description: "Organizations and individuals funding AI safety research",
};

export default function FundersPage() {
  const reviewData = loadReviewData();
  const { funders } = loadFunders();

  // Build a map of funder ID -> agendas that are funded by it
  const funderToAgendas: Record<
    string,
    { agenda: { id: string; name: string }; section: { id: string; name: string } }[]
  > = {};

  for (const funder of funders) {
    funderToAgendas[funder.id] = [];
  }

  for (const section of reviewData.sections) {
    for (const agenda of section.agendas || []) {
      if (agenda.fundedBy?.length) {
        for (const funderId of agenda.fundedBy) {
          if (funderToAgendas[funderId]) {
            funderToAgendas[funderId].push({
              agenda: { id: agenda.id, name: agenda.name },
              section: { id: section.id, name: section.name },
            });
          }
        }
      }
    }
  }

  // Sort funders by number of agendas they fund (descending)
  const sortedFunders = [...funders].sort((a, b) => {
    return (funderToAgendas[b.id]?.length || 0) - (funderToAgendas[a.id]?.length || 0);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-700">Funders</span>
        </nav>

        <h1 className="text-4xl font-bold text-gray-900 mb-2">Funders</h1>
        <p className="text-gray-600 text-lg mb-8">
          Organizations and individuals that fund AI safety research agendas.
        </p>
        <div className="space-y-8">
          {sortedFunders.map((funder) => {
            const agendas = funderToAgendas[funder.id] || [];
            return (
              <section
                key={funder.id}
                id={`funder-${funder.id}`}
                className="border-b border-gray-200 pb-8 last:border-0"
              >
                <div className="flex items-baseline gap-3">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {funder.name}
                  </h2>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    {agendas.length} agenda{agendas.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <p className="text-gray-600 mt-2">{funder.description}</p>

                {(funder.website || funder.wikipedia) && (
                  <div className="mt-2 flex gap-4 text-sm">
                    {funder.website && (
                      <a
                        href={funder.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Website
                      </a>
                    )}
                    {funder.wikipedia && (
                      <a
                        href={funder.wikipedia}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        Wikipedia
                      </a>
                    )}
                  </div>
                )}

                {agendas.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                      Funded agendas
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {agendas.map(({ agenda, section }) => (
                        <AgendaLink
                          key={`${section.id}-${agenda.id}`}
                          sectionId={section.id}
                          agendaId={agenda.id}
                          name={agenda.name}
                        />
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
