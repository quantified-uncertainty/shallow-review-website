"use client";

import { useState } from "react";
import Link from "next/link";
import { Section, FlattenedAgenda } from "@/data/types";
import AgendaTable from "./AgendaTable";
import { APP_TITLE, APP_DESCRIPTION, APP_AUTHORS } from "@/constants/app";

interface HomePageContentProps {
  sections: Section[];
  flattenedAgendas: FlattenedAgenda[];
  totalAgendas: number;
  totalPapers: number;
}

export default function HomePageContent({
  sections,
  flattenedAgendas,
  totalAgendas,
  totalPapers,
}: HomePageContentProps) {
  const [viewMode, setViewMode] = useState<"list" | "table">("list");

  return (
    <div className="min-h-screen">
      <header className="bg-gray-900 text-white py-12">
        <div
          className={`mx-auto px-4 ${viewMode === "table" ? "max-w-full" : "max-w-4xl"}`}
        >
          <h1 className="text-4xl font-bold">{APP_TITLE}</h1>
          <p className="text-gray-300 mt-4 text-lg">{APP_DESCRIPTION}</p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400">
            <span>{sections.length} sections</span>
            <span>{totalAgendas} research agendas</span>
            <span>{totalPapers} papers</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm items-center">
            <Link
              href="/about"
              className="text-blue-400 hover:text-blue-300"
            >
              About
            </Link>
            <Link
              href="/methodology"
              className="text-blue-400 hover:text-blue-300"
            >
              Methodology
            </Link>
            <Link
              href="/orthodox-problems"
              className="text-blue-400 hover:text-blue-300"
            >
              Orthodox Problems
            </Link>
            <Link
              href="/broad-approaches"
              className="text-blue-400 hover:text-blue-300"
            >
              Broad Approaches
            </Link>
            <Link
              href="/target-cases"
              className="text-blue-400 hover:text-blue-300"
            >
              Target Cases
            </Link>
            <div className="ml-auto flex gap-1 bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  viewMode === "list"
                    ? "bg-gray-700 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  viewMode === "table"
                    ? "bg-gray-700 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Table
              </button>
            </div>
          </div>
        </div>
      </header>

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
        ) : (
          <AgendaTable agendas={flattenedAgendas} />
        )}
      </main>

      <footer className="bg-gray-100 py-6 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center text-gray-600 text-sm">
          Based on the {APP_TITLE} by {APP_AUTHORS}.
        </div>
      </footer>
    </div>
  );
}
