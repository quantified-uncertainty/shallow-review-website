import { loadReviewData } from "@/data/loadData";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import { ChevronRight } from "lucide-react";

interface PageProps {
  params: Promise<{ sectionId: string }>;
}

export async function generateStaticParams() {
  const data = loadReviewData();
  return data.sections.map((section) => ({
    sectionId: section.id,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { sectionId } = await params;
  const decodedSectionId = decodeURIComponent(sectionId);
  const data = loadReviewData();
  const section = data.sections.find((s) => s.id === decodedSectionId);

  if (!section) return { title: "Not Found" };

  return {
    title: `${section.name} | Shallow Review 2025`,
    description: section.description,
  };
}

export default async function SectionPage({ params }: PageProps) {
  const { sectionId } = await params;
  const decodedSectionId = decodeURIComponent(sectionId);
  const data = loadReviewData();
  const section = data.sections.find((s) => s.id === decodedSectionId);

  if (!section) {
    notFound();
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
          <span className="text-gray-700">{section.name}</span>
        </nav>

        <h1 className="text-4xl font-bold text-gray-900 mb-2">{section.name}</h1>
        {section.description && (
          <p className="text-gray-600 text-lg mb-8">{section.description}</p>
        )}
        <div className="grid gap-4">
          {section.agendas.map((agenda) => (
            <Link
              key={agenda.id}
              href={`/${sectionId}/${agenda.id}`}
              className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {agenda.name}
              </h2>
              {agenda.summary && (
                <p className="text-gray-600 line-clamp-2">{agenda.summary}</p>
              )}
              <div className="mt-3 flex gap-4 text-sm text-gray-500">
                {agenda.papers && agenda.papers.length > 0 && (
                  <span>{agenda.papers.length} papers</span>
                )}
                {agenda.estimatedFTEs && (
                  <span>{agenda.estimatedFTEs} FTEs</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
