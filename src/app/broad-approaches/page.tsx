import { loadReviewData, loadBroadApproaches } from "@/data/loadData";
import Link from "next/link";
import { Metadata } from "next";
import { APPROACH_COLORS } from "@/constants/colors";
import { APP_TITLE, APP_AUTHORS, APP_SHORT_TITLE } from "@/constants/app";
import { Wrench, Activity, Brain, Sigma, Waypoints, LucideIcon, ChevronRight } from "lucide-react";
import Header from "@/components/Header";

const APPROACH_ICONS: Record<string, LucideIcon> = {
  engineering: Wrench,
  behavioral: Activity,
  cognitive: Brain,
  "maths-philosophy": Sigma,
  theoretical: Waypoints,
};

export const metadata: Metadata = {
  title: `Broad Approaches | ${APP_SHORT_TITLE}`,
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
      if (agenda.broadApproaches?.length) {
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
          <span className="text-gray-700">Broad Approaches</span>
        </nav>

        <h1 className="text-4xl font-bold text-gray-900 mb-2">Broad Approaches</h1>
        <p className="text-gray-600 text-lg mb-8">
          Research methodologies and paradigms used across AI alignment
          research agendas. Many agendas combine multiple approaches.
        </p>
        <div className="space-y-8">
          {approaches.map((approach) => {
            const agendas = approachToAgendas[approach.id] || [];
            const colorClass = APPROACH_COLORS[approach.id] || "bg-gray-100 text-gray-700";
            const Icon = APPROACH_ICONS[approach.id];
            return (
              <section
                key={approach.id}
                id={`approach-${approach.id}`}
                className="border-b border-gray-200 pb-8 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    {Icon && <Icon className="w-5 h-5" />}
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
    </div>
  );
}
