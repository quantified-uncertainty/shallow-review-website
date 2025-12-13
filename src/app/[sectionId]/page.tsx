import { loadReviewData, loadLabs } from "@/lib/loadData";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Route, Building2 } from "lucide-react";
import { Section } from "@/lib/types";

interface PageProps {
  params: Promise<{ sectionId: string }>;
}

export async function generateStaticParams() {
  const data = loadReviewData();
  // Include both agenda sections and the virtual labs section
  return [
    { sectionId: "labs" },
    ...data.sections.map((section) => ({
      sectionId: section.id,
    })),
  ];
}

export async function generateMetadata({ params }: PageProps) {
  const { sectionId } = await params;
  const decodedSectionId = decodeURIComponent(sectionId);

  // Handle labs section specially
  if (decodedSectionId === "labs") {
    return {
      title: "Labs (giant companies) | Shallow Review 2025",
      description: "Major AI labs and their safety efforts",
    };
  }

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

  let section: Section | undefined;

  // Handle labs section specially
  if (decodedSectionId === "labs") {
    const { labs } = loadLabs();
    section = {
      id: "labs",
      name: "Labs (giant companies)",
      description: "Major AI labs and their safety efforts",
      labs: labs,
    };
  } else {
    const data = loadReviewData();
    section = data.sections.find((s) => s.id === decodedSectionId);
  }

  if (!section) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
          {/* Render labs if present */}
          {section.labs?.map((lab) => (
            <Link
              key={lab.id}
              href={`/labs/${lab.id}`}
              className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                {lab.name}
              </h2>
              <div className="mt-3 flex gap-4 text-sm text-gray-500">
                {lab.papers && lab.papers.length > 0 && (
                  <span>{lab.papers.length} papers</span>
                )}
              </div>
            </Link>
          ))}
          {/* Render agendas if present */}
          {section.agendas?.map((agenda) => (
            <Link
              key={agenda.id}
              href={`/${sectionId}/${agenda.id}`}
              className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Route className="w-5 h-5 text-blue-600" />
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
