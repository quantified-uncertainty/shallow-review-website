import { loadReviewData } from "@/lib/loadData";
import Link from "next/link";
import { getSectionColors } from "@/constants/colors";
import { getNameWithoutParentheses } from "@/lib/utils";

export const metadata = {
  title: "Overview | Shallow Review 2025",
  description: "All research agendas organized by section",
};

export default function OverviewPage() {
  const data = loadReviewData();

  const totalAgendas = data.sections.reduce((sum, s) => sum + (s.agendas?.length || 0), 0);

  return (
    <div className="min-h-screen bg-white p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-slate-900 font-serif mb-2">
            All Agendas
          </h1>
          <p className="text-slate-500">
            {totalAgendas} research agendas across {data.sections.length} sections
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {data.sections.map((section) => {
            const colors = getSectionColors(section.id);
            const agendas = section.agendas || [];

            return (
              <div
                key={section.id}
                className="flex gap-6 md:gap-10 py-6 first:pt-0"
              >
                {/* Section label - fixed width on left */}
                <div className="w-36 md:w-44 flex-shrink-0">
                  <Link
                    href={`/${section.id}`}
                    className={`${colors.text} font-semibold hover:underline transition-colors block leading-snug`}
                  >
                    {getNameWithoutParentheses(section.name)}
                  </Link>
                  <span className="text-xs text-slate-400 mt-1 block">
                    {agendas.length} agendas
                  </span>
                </div>

                {/* Agendas flowing to the right */}
                <div className="flex flex-wrap gap-x-4 gap-y-2 flex-1 pt-0.5">
                  {agendas.map((agenda, i) => (
                    <Link
                      key={agenda.id}
                      href={`/${section.id}/${agenda.id}`}
                      className={`text-sm text-slate-600 ${colors.hover} hover:underline transition-colors`}
                    >
                      {agenda.name}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
