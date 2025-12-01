import { loadReviewData, loadBroadApproaches } from "@/data/loadData";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Broad Approaches | Shallow Review 2025",
  description:
    "Research methodologies and approaches used in AI alignment research",
};

export default function BroadApproachesPage() {
  const reviewData = loadReviewData();
  const { approaches } = loadBroadApproaches();

  // Build a map of approach ID -> agendas that use it
  const approachToAgendas: Record<
    string,
    { agenda: { id: string; name: string }; section: { id: string; name: string } }[]
  > = {};

  for (const approach of approaches) {
    approachToAgendas[approach.id] = [];
  }

  for (const section of reviewData.sections) {
    for (const agenda of section.agendas) {
      if (agenda.broadApproaches && Array.isArray(agenda.broadApproaches)) {
        for (const approachId of agenda.broadApproaches) {
          if (approachToAgendas[approachId]) {
            approachToAgendas[approachId].push({
              agenda: { id: agenda.id, name: agenda.name },
              section: { id: section.id, name: section.name },
            });
          }
        }
      }
    }
  }

  // Color mapping for approaches
  const approachColors: Record<string, string> = {
    engineering: "bg-blue-50 text-blue-700 hover:bg-blue-100",
    behavioral: "bg-green-50 text-green-700 hover:bg-green-100",
    cognitive: "bg-purple-50 text-purple-700 hover:bg-purple-100",
    "maths-philosophy": "bg-orange-50 text-orange-700 hover:bg-orange-100",
    theoretical: "bg-gray-100 text-gray-700 hover:bg-gray-200",
  };

  return (
    <div className="min-h-screen">
      <header className="bg-gray-900 text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/" className="text-blue-400 hover:underline text-sm">
            &larr; Back to overview
          </Link>
          <h1 className="text-3xl font-bold mt-4">Broad Approaches</h1>
          <p className="text-gray-300 mt-2">
            Research methodologies and paradigms used across AI alignment
            research agendas. Many agendas combine multiple approaches.
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {approaches.map((approach) => {
            const agendas = approachToAgendas[approach.id] || [];
            const colorClass = approachColors[approach.id] || "bg-gray-100 text-gray-700";
            return (
              <section
                key={approach.id}
                id={`approach-${approach.id}`}
                className="border-b border-gray-200 pb-8 last:border-0"
              >
                <div className="flex items-baseline gap-3">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {approach.name}
                  </h2>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    {agendas.length} agenda{agendas.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <p className="text-gray-600 mt-2">{approach.description}</p>

                {agendas.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                      Agendas using this approach
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {agendas.map(({ agenda, section }) => (
                        <Link
                          key={`${section.id}-${agenda.id}`}
                          href={`/${section.id}/${agenda.id}`}
                          className={`inline-block text-sm px-3 py-1 rounded-full transition-colors ${colorClass}`}
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
          Based on the Shallow Review of Technical AI Safety, 2025 by
          technicalities, gavento, et al.
        </div>
      </footer>
    </div>
  );
}
