"use client";

import { useState } from "react";
import { Agenda } from "@/data/types";
import PaperCard from "./PaperCard";

interface AgendaSectionProps {
  agenda: Agenda;
}

export default function AgendaSection({ agenda }: AgendaSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50"
      >
        <div>
          <h3 className="font-semibold text-lg">{agenda.name}</h3>
          {agenda.summary && (
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
              {agenda.summary}
            </p>
          )}
        </div>
        <span className="text-gray-400 text-xl ml-4">
          {isExpanded ? "−" : "+"}
        </span>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <div className="grid gap-4 mt-4">
            {agenda.theoryOfChange && (
              <div>
                <h4 className="font-medium text-sm text-gray-500 uppercase tracking-wide">
                  Theory of Change
                </h4>
                <p className="text-gray-700 mt-1">{agenda.theoryOfChange}</p>
              </div>
            )}

            {agenda.orthodoxProblems && agenda.orthodoxProblems.length > 0 && (
              <div>
                <h4 className="font-medium text-sm text-gray-500 uppercase tracking-wide">
                  Orthodox Problems
                </h4>
                <p className="text-gray-700 mt-1">
                  {agenda.orthodoxProblems.join(", ")}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {agenda.targetCase && (
                <div>
                  <h4 className="font-medium text-sm text-gray-500 uppercase tracking-wide">
                    Target Case
                  </h4>
                  <p className="text-gray-700 mt-1">{agenda.targetCase}</p>
                </div>
              )}

              {agenda.broadApproaches && agenda.broadApproaches.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm text-gray-500 uppercase tracking-wide">
                    Broad Approach
                  </h4>
                  <p className="text-gray-700 mt-1">
                    {agenda.broadApproaches.join(", ")}
                  </p>
                </div>
              )}

              {agenda.estimatedFTEs && (
                <div>
                  <h4 className="font-medium text-sm text-gray-500 uppercase tracking-wide">
                    Estimated FTEs
                  </h4>
                  <p className="text-gray-700 mt-1">{agenda.estimatedFTEs}</p>
                </div>
              )}
            </div>

            {agenda.someNames && agenda.someNames.length > 0 && (
              <div>
                <h4 className="font-medium text-sm text-gray-500 uppercase tracking-wide">
                  Some Names
                </h4>
                <p className="text-gray-700 mt-1">
                  {agenda.someNames.join(", ")}
                </p>
              </div>
            )}

            {agenda.fundedBy && agenda.fundedBy.length > 0 && (
              <div>
                <h4 className="font-medium text-sm text-gray-500 uppercase tracking-wide">
                  Funded By
                </h4>
                <p className="text-gray-700 mt-1">
                  {agenda.fundedBy.join(", ")}
                </p>
              </div>
            )}

            {agenda.critiques && agenda.critiques.length > 0 && (
              <div>
                <h4 className="font-medium text-sm text-gray-500 uppercase tracking-wide">
                  Critiques
                </h4>
                <ul className="text-gray-700 mt-1 list-disc list-inside">
                  {agenda.critiques.map((critique, i) => (
                    <li key={i} dangerouslySetInnerHTML={{ __html: critique.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>') }} />
                  ))}
                </ul>
              </div>
            )}

            {agenda.papers && agenda.papers.length > 0 && (
              <div>
                <h4 className="font-medium text-sm text-gray-500 uppercase tracking-wide">
                  Papers ({agenda.papers.length})
                </h4>
                <ul className="mt-2 space-y-1">
                  {agenda.papers.map((paper, i) => (
                    <PaperCard key={i} paper={paper} />
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
