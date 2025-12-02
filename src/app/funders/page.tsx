import { loadReviewData, loadFunders } from "@/data/loadData";
import Link from "next/link";
import { Metadata } from "next";
import { FUNDER_COLORS } from "@/constants/colors";
import { APP_TITLE, APP_AUTHORS, APP_SHORT_TITLE } from "@/constants/app";

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
    for (const agenda of section.agendas) {
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
    <div className="min-h-screen">
      <header className="bg-gray-900 text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/" className="text-blue-400 hover:underline text-sm">
            &larr; Back to overview
          </Link>
          <h1 className="text-3xl font-bold mt-4">Funders</h1>
          <p className="text-gray-300 mt-2">
            Organizations and individuals that fund AI safety research agendas.
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
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
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        Website
                      </a>
                    )}
                    {funder.wikipedia && (
                      <a
                        href={funder.wikipedia}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
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
                        <Link
                          key={`${section.id}-${agenda.id}`}
                          href={`/${section.id}/${agenda.id}`}
                          className={`inline-block text-sm px-3 py-1 rounded-full transition-colors ${FUNDER_COLORS}`}
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

      <footer className="bg-gray-100 py-6 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center text-gray-600 text-sm">
          Based on the {APP_TITLE} by {APP_AUTHORS}.
        </div>
      </footer>
    </div>
  );
}
