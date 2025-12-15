"use client";

import { useState } from 'react';
import Link from 'next/link';
import {
  ExternalLink,
  FileText,
  Users,
  DollarSign,
  X,
  AlertTriangle,
  Target,
  Settings,
  BookOpen,
  MessageSquare,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';

import { Agenda } from '@/lib/types';
import { getNameWithoutParentheses } from '@/lib/utils';

interface SectionColors {
  text: string;
  heading: string;
  bg: string;
  border: string;
  borderLeft: string;
  hover: string;
  groupHover: string;
  bgLight: string;
  bgNav: string;
  accent: string;
  gradient: string;
  dot: string;
  navHover: string;
}

interface PreparedSection {
  id: string;
  name: string;
  agendas: Agenda[];
  colors: SectionColors;
  hasHierarchy: boolean;
  groups: { id: string; name: string; children: Agenda[] }[];
  standaloneAgendas: Agenda[];
}

interface ExperimentClientProps {
  sections: PreparedSection[];
  totalAgendas: number;
  sectionCount: number;
}

interface SelectedAgenda {
  agenda: Agenda;
  sectionId: string;
  colors: SectionColors;
}

export default function ExperimentClient({
  sections,
  totalAgendas,
  sectionCount,
}: ExperimentClientProps) {
  // Hovered agenda (temporary, on mouse enter)
  const [hoveredAgenda, setHoveredAgenda] = useState<SelectedAgenda | null>(null);
  // Pinned agenda (persistent, on click)
  const [pinnedAgenda, setPinnedAgenda] = useState<SelectedAgenda | null>(null);

  // Display pinned agenda if set, otherwise hovered
  const displayedAgenda = pinnedAgenda || hoveredAgenda;

  function AgendaItem({
    agenda,
    sectionId,
    colors,
  }: {
    agenda: Agenda;
    sectionId: string;
    colors: SectionColors;
  }) {
    const isSelected = displayedAgenda?.agenda.id === agenda.id;

    return (
      <span
        onMouseEnter={() => {
          if (!pinnedAgenda) {
            setHoveredAgenda({ agenda, sectionId, colors });
          }
        }}
        onClick={() => {
          // Toggle: if already pinned, unpin; otherwise pin
          if (pinnedAgenda?.agenda.id === agenda.id) {
            setPinnedAgenda(null);
          } else {
            setPinnedAgenda({ agenda, sectionId, colors });
          }
        }}
        className={`text-xs transition-colors cursor-pointer rounded px-1 -mx-1 ${
          isSelected
            ? 'bg-slate-200 text-slate-900'
            : `text-slate-600 ${colors.hover} hover:bg-slate-100`
        }`}
      >
        {agenda.name}
      </span>
    );
  }

  return (
    <div className="h-screen bg-white flex overflow-hidden">
      {/* Main content - fluid width */}
      <div className="w-[40%] min-w-[300px] p-4 md:p-6 border-r border-slate-100 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-slate-900 font-display mb-1">
            All Agendas
          </h1>
          <p className="text-slate-500 text-sm">
            {totalAgendas} research agendas across {sectionCount} sections
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {sections.map((section) => {
            const { colors, agendas, hasHierarchy, groups, standaloneAgendas } = section;

            return (
              <div
                key={section.id}
                className="flex gap-4 md:gap-6 py-4 first:pt-0"
              >
                {/* Section label - fixed width on left */}
                <div className="w-28 md:w-32 flex-shrink-0">
                  <Link
                    href={`/${section.id}`}
                    className={`${colors.text} font-display text-sm font-black hover:underline transition-colors block leading-snug`}
                  >
                    {getNameWithoutParentheses(section.name)}
                  </Link>
                  <span className="text-[10px] text-slate-400 mt-0.5 block font-sans">
                    {agendas.length} agendas
                  </span>
                </div>

                {/* Agendas with hierarchy */}
                <div className="flex-1 space-y-2">
                  {hasHierarchy ? (
                    <>
                      {groups.map((group) => (
                        <div key={group.id} className="mb-3">
                          <div className="text-xs font-semibold text-slate-400 mb-0.5">
                            {getNameWithoutParentheses(group.name)}
                          </div>
                          <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                            {group.children.map((child) => (
                              <AgendaItem
                                key={child.id}
                                agenda={child}
                                sectionId={section.id}
                                colors={colors}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                      {standaloneAgendas.length > 0 && (
                        <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                          {standaloneAgendas.map((agenda) => (
                            <AgendaItem
                              key={agenda.id}
                              agenda={agenda}
                              sectionId={section.id}
                              colors={colors}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                      {agendas.map((agenda) => (
                        <AgendaItem
                          key={agenda.id}
                          agenda={agenda}
                          sectionId={section.id}
                          colors={colors}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sidebar - shows on hover/click */}
      <div className={`w-[60%] p-6 overflow-y-auto relative ${displayedAgenda ? displayedAgenda.colors.bgLight : 'bg-slate-50'}`}>
        {displayedAgenda ? (
          <div className="space-y-4">
            {/* Close button - only show when pinned */}
            {pinnedAgenda && (
              <button
                onClick={() => setPinnedAgenda(null)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Section indicator */}
            <div className={`text-xs font-semibold ${displayedAgenda.colors.text}`}>
              {sections.find(s => s.id === displayedAgenda.sectionId)?.name}
            </div>

            {/* Agenda name */}
            <h2 className={`text-xl font-bold ${displayedAgenda.colors.heading} pr-8`}>
              {displayedAgenda.agenda.name}
            </h2>

            {/* Summary */}
            {displayedAgenda.agenda.summary && (
              <p className="text-sm text-slate-600 leading-relaxed">
                {displayedAgenda.agenda.summary}
              </p>
            )}

            {/* Theory of Change */}
            {displayedAgenda.agenda.theoryOfChange && (
              <div className="text-sm">
                <div className="flex items-center gap-2 text-slate-500 font-medium mb-1">
                  <Lightbulb className="w-4 h-4" />
                  <span>Theory of Change</span>
                </div>
                <p className="text-slate-600 leading-relaxed pl-6">
                  {displayedAgenda.agenda.theoryOfChange}
                </p>
              </div>
            )}

            {/* Classification section */}
            {(displayedAgenda.agenda.broadApproaches?.length || displayedAgenda.agenda.targetCase || displayedAgenda.agenda.orthodoxProblems?.length) && (
              <div className="space-y-2 text-sm border-t border-slate-200 pt-4">
                {/* Broad Approaches */}
                {displayedAgenda.agenda.broadApproaches && displayedAgenda.agenda.broadApproaches.length > 0 && (
                  <div className="flex items-start gap-2">
                    <Settings className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-slate-500">Approach: </span>
                      <span className="text-slate-700">{displayedAgenda.agenda.broadApproaches.join(', ')}</span>
                    </div>
                  </div>
                )}

                {/* Target Case */}
                {displayedAgenda.agenda.targetCase && (
                  <div className="flex items-start gap-2">
                    <Target className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-slate-500">Target Case: </span>
                      <span className="text-slate-700">{displayedAgenda.agenda.targetCase}</span>
                    </div>
                  </div>
                )}

                {/* Orthodox Problems */}
                {displayedAgenda.agenda.orthodoxProblems && displayedAgenda.agenda.orthodoxProblems.length > 0 && (
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-slate-500">Problems: </span>
                      <span className="text-slate-700">{displayedAgenda.agenda.orthodoxProblems.join(', ')}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* People & Funding section */}
            {(displayedAgenda.agenda.someNames?.length || displayedAgenda.agenda.fundedBy?.length || displayedAgenda.agenda.fundedByText || displayedAgenda.agenda.estimatedFTEs) && (
              <div className="space-y-2 text-sm border-t border-slate-200 pt-4">
                {/* Researchers */}
                {displayedAgenda.agenda.someNames && displayedAgenda.agenda.someNames.length > 0 && (
                  <div className="flex items-start gap-2">
                    <Users className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-slate-500">People: </span>
                      <span className="text-slate-700">{displayedAgenda.agenda.someNames.join(', ')}</span>
                    </div>
                  </div>
                )}

                {/* Funded By */}
                {(displayedAgenda.agenda.fundedBy?.length || displayedAgenda.agenda.fundedByText) && (
                  <div className="flex items-start gap-2">
                    <DollarSign className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-slate-500">Funded by: </span>
                      <span className="text-slate-700">
                        {displayedAgenda.agenda.fundedBy?.join(', ') || displayedAgenda.agenda.fundedByText}
                      </span>
                    </div>
                  </div>
                )}

                {/* FTEs */}
                {displayedAgenda.agenda.estimatedFTEs && (
                  <div className="flex items-start gap-2">
                    <Users className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-slate-500">Estimated FTEs: </span>
                      <span className="text-slate-700">{displayedAgenda.agenda.estimatedFTEs}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Critiques */}
            {displayedAgenda.agenda.critiques && displayedAgenda.agenda.critiques.length > 0 && (
              <div className="text-sm border-t border-slate-200 pt-4">
                <div className="flex items-center gap-2 text-slate-500 font-medium mb-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Critiques</span>
                </div>
                <ul className="space-y-1 pl-6">
                  {displayedAgenda.agenda.critiques.map((critique, i) => (
                    <li key={i} className="text-slate-600 text-sm">{critique}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* See Also */}
            {displayedAgenda.agenda.seeAlso && (
              <div className="flex items-start gap-2 text-sm border-t border-slate-200 pt-4">
                <ArrowRight className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-slate-500">See Also: </span>
                  <span className="text-slate-700">{displayedAgenda.agenda.seeAlso}</span>
                </div>
              </div>
            )}

            {/* Resources */}
            {(displayedAgenda.agenda.resources?.length || displayedAgenda.agenda.wikipedia || displayedAgenda.agenda.lesswrongTags?.length) && (
              <div className="text-sm border-t border-slate-200 pt-4">
                <div className="flex items-center gap-2 text-slate-500 font-medium mb-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Resources</span>
                </div>
                <div className="flex flex-wrap gap-2 pl-6">
                  {displayedAgenda.agenda.wikipedia && (
                    <a
                      href={displayedAgenda.agenda.wikipedia}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      Wikipedia
                    </a>
                  )}
                  {displayedAgenda.agenda.resources?.map((resource, i) => (
                    <a
                      key={i}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {resource.title}
                    </a>
                  ))}
                  {displayedAgenda.agenda.lesswrongTags?.map((tag) => (
                    <a
                      key={tag}
                      href={`https://www.lesswrong.com/tag/${tag}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      LW: {tag}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Papers */}
            {displayedAgenda.agenda.papers && displayedAgenda.agenda.papers.length > 0 && (
              <div className="text-sm border-t border-slate-200 pt-4">
                <div className="flex items-center gap-2 text-slate-500 font-medium mb-2">
                  <FileText className="w-4 h-4" />
                  <span>Papers ({displayedAgenda.agenda.papers.length})</span>
                </div>
                <div className="space-y-2 pl-6">
                  {displayedAgenda.agenda.papers.map((paper, i) => (
                    <div key={i}>
                      <a
                        href={paper.url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-700 hover:text-blue-600 transition-colors line-clamp-2"
                      >
                        {paper.title}
                      </a>
                      {paper.authors && (
                        <div className="text-xs text-slate-400 mt-0.5">{paper.authors}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Link to full page */}
            <div className="border-t border-slate-200 pt-4">
              <Link
                href={`/${displayedAgenda.sectionId}/${displayedAgenda.agenda.id}`}
                className={`inline-flex items-center gap-1.5 text-sm font-medium ${displayedAgenda.colors.text} ${displayedAgenda.colors.hover} transition-colors`}
              >
                View full page
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400 text-sm">
            Hover over an agenda to see details
          </div>
        )}
      </div>
    </div>
  );
}
