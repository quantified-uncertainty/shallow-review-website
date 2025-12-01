import { loadReviewData } from "@/data/loadData";
import Link from "next/link";
import { APP_TITLE, APP_DESCRIPTION, APP_AUTHORS } from "@/constants/app";

export default function Home() {
  const data = loadReviewData();

  const totalPapers = data.sections.reduce(
    (acc, section) =>
      acc +
      section.agendas.reduce((acc2, agenda) => acc2 + (agenda.papers?.length || 0), 0),
    0
  );

  const totalAgendas = data.sections.reduce(
    (acc, section) => acc + section.agendas.length,
    0
  );

  return (
    <div className="min-h-screen">
      <header className="bg-gray-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold">{APP_TITLE}</h1>
          <p className="text-gray-300 mt-4 text-lg">{APP_DESCRIPTION}</p>
          <div className="mt-6 flex gap-6 text-sm text-gray-400">
            <span>{data.sections.length} sections</span>
            <span>{totalAgendas} research agendas</span>
            <span>{totalPapers} papers</span>
            <Link
              href="/orthodox-problems"
              className="text-blue-400 hover:text-blue-300"
            >
              Orthodox Problems &rarr;
            </Link>
            <Link
              href="/broad-approaches"
              className="text-blue-400 hover:text-blue-300"
            >
              Broad Approaches &rarr;
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-8">
          {data.sections.map((section) => (
            <section key={section.id} className="border-b border-gray-200 pb-8 last:border-0">
              <Link
                href={`/${section.id}`}
                className="block group"
              >
                <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {section.name}
                </h2>
                {section.description && (
                  <p className="text-gray-600 mt-1">{section.description}</p>
                )}
              </Link>

              <div className="mt-4 grid gap-2">
                {section.agendas.map((agenda) => (
                  <Link
                    key={agenda.id}
                    href={`/${section.id}/${agenda.id}`}
                    className="flex justify-between items-center py-2 px-3 -mx-3 rounded hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-gray-700 hover:text-blue-600">
                      {agenda.name}
                    </span>
                    <span className="text-sm text-gray-400">
                      {agenda.papers?.length || 0} papers
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
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
