import { loadReviewData, loadLabs } from "@/lib/loadData";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Route, Building2 } from "lucide-react";
import { Section } from "@/lib/types";
import { getSectionColors } from "@/constants/colors";
import { getNameWithoutParentheses, getParentheticalPart } from "@/lib/utils";

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

  const sectionColors = getSectionColors(decodedSectionId);

  return (
    <div className={`min-h-screen ${sectionColors.bgLight} md:pl-8`}>
      <main className="max-w-4xl px-4 py-8 pl-12 lg:pl-16">
        {/* Spacer to maintain alignment with agenda pages */}
        <div className="mb-8"></div>

        {/* Colored accent bar */}
        <div className={`w-16 h-1.5 ${sectionColors.accent} rounded-full mb-6`}></div>

        <h1 className={`text-5xl font-bold mb-3 font-serif leading-tight tracking-tight ${sectionColors.heading}`}>
          {getNameWithoutParentheses(section.name)}
          {getParentheticalPart(section.name) && (
            <span className="text-gray-400 font-normal text-4xl"> {getParentheticalPart(section.name)}</span>
          )}
        </h1>
        {section.description && (
          <p className="text-gray-700 text-xl mb-10 font-serif italic">{section.description}</p>
        )}
        <div className="grid gap-5 -ml-6 md:-ml-6">
          {/* Render labs if present */}
          {section.labs?.map((lab) => (
            <Link
              key={lab.id}
              href={`/labs/${lab.id}`}
              className={`block pl-6 pr-6 py-6 bg-white border-l-4 ${sectionColors.borderLeft} border-t border-r border-b border-gray-200 rounded-lg hover:shadow-lg transition-all group`}
            >
              <h2 className={`text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2 font-serif ${sectionColors.groupHover} transition-colors`}>
                <Building2 className={`w-5 h-5 ${sectionColors.text}`} />
                {lab.name}
              </h2>
              {lab.papers && lab.papers.length > 0 && (
                <div className="mt-3 text-sm text-gray-500 font-sans font-medium">
                  {lab.papers.length} papers
                </div>
              )}
            </Link>
          ))}
          {/* Render agendas if present */}
          {section.agendas?.map((agenda) => (
            <Link
              key={agenda.id}
              href={`/${sectionId}/${agenda.id}`}
              className={`block pl-6 pr-6 py-6 bg-white border-l-4 ${sectionColors.borderLeft} border-t border-r border-b border-gray-200 rounded-lg hover:shadow-lg transition-all group`}
            >
              <h2 className={`text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2 font-serif ${sectionColors.groupHover} transition-colors`}>
                <Route className={`w-5 h-5 ${sectionColors.text}`} />
                {agenda.name}
              </h2>
              {agenda.summary && (
                <p className="text-gray-600 line-clamp-2 font-serif">{agenda.summary}</p>
              )}
              {agenda.papers && agenda.papers.length > 0 && (
                <div className="mt-3 text-sm text-gray-500 font-sans font-medium">
                  {agenda.papers.length} papers
                </div>
              )}
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
