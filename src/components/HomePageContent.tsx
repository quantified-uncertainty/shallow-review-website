"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Section, FlattenedAgenda, FlattenedLab } from "@/lib/types";
import AgendaTable from "./AgendaTable";
import { APP_TITLE, APP_DESCRIPTION } from "@/constants/app";

interface HomePageContentProps {
  sections: Section[];
  flattenedAgendas: FlattenedAgenda[];
  flattenedLabs: FlattenedLab[];
  totalAgendas: number;
  totalLabs: number;
  totalPapers: number;
}

export default function HomePageContent({
  sections,
  flattenedAgendas,
  flattenedLabs,
  totalAgendas,
  totalLabs,
  totalPapers,
}: HomePageContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const initialView = searchParams.get("view") === "table" ? "table" : "list";
  const [viewMode, setViewMode] = useState<"list" | "table">(initialView);

  useEffect(() => {
    setViewMode(searchParams.get("view") === "table" ? "table" : "list");
  }, [searchParams]);

  const handleViewChange = (mode: "list" | "table") => {
    setViewMode(mode);
    const params = new URLSearchParams(searchParams.toString());
    if (mode === "table") {
      params.set("view", "table");
    } else {
      params.delete("view");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div
          className={`mx-auto px-4 py-12 ${viewMode === "table" ? "max-w-full" : "max-w-4xl"}`}
        >
          <h1 className="text-4xl font-bold text-gray-900">{APP_TITLE}</h1>
          <p className="text-gray-600 mt-4 text-lg">{APP_DESCRIPTION}</p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
            <span>{sections.length} sections</span>
            <span>{totalLabs} labs</span>
            <span>{totalAgendas} research agendas</span>
            <span>{totalPapers} papers</span>
          </div>
          <div className="mt-4 flex items-center">
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => handleViewChange("list")}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  viewMode === "list"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                List
              </button>
              <button
                onClick={() => handleViewChange("table")}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  viewMode === "table"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Table
              </button>
            </div>
          </div>
        </div>
      </div>

      <main
        className={`mx-auto px-4 py-8 ${viewMode === "table" ? "max-w-full" : "max-w-4xl"}`}
      >
        {viewMode === "list" ? (
          <div className="grid gap-8">
            {sections.map((section) => (
              <section
                key={section.id}
                className="border-b border-gray-200 pb-8 last:border-0"
              >
                <Link href={`/${section.id}`} className="block group">
                  <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {section.name}
                  </h2>
                  {section.description && (
                    <p className="text-gray-600 mt-1">{section.description}</p>
                  )}
                </Link>

                <div className="mt-4 grid gap-2">
                  {/* Render labs if present */}
                  {section.labs?.map((lab) => (
                    <Link
                      key={lab.id}
                      href={`/labs/${lab.id}`}
                      className="flex justify-between items-center py-2 px-3 -mx-3 rounded hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-gray-700 hover:text-blue-600">
                        {lab.name}
                      </span>
                      <span className="text-sm text-gray-400">
                        {lab.papers?.length || 0} papers
                      </span>
                    </Link>
                  ))}
                  {/* Render agendas if present */}
                  {section.agendas?.map((agenda) => (
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
        ) : (
          <AgendaTable agendas={flattenedAgendas} />
        )}
      </main>
    </div>
  );
}
