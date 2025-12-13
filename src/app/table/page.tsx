import {
  loadReviewData,
  loadLabs,
  loadOrthodoxProblems,
  loadBroadApproaches,
  loadTargetCases,
  loadFunders,
  loadKeywords,
  getOrthodoxProblemsByIds,
  getBroadApproachesByIds,
  getTargetCaseByValue,
  getFundersByIds,
  getKeywordsByIds,
} from "@/lib/loadData";
import { FlattenedAgenda, FlattenedLab, Section } from "@/lib/types";
import AgendaTable from "@/components/AgendaTable";

export default function TablePage() {
  const data = loadReviewData();
  const { labs: allLabs } = loadLabs();
  const { problems: allProblems } = loadOrthodoxProblems();
  const { approaches: allApproaches } = loadBroadApproaches();
  const { cases: allCases } = loadTargetCases();
  const { funders: allFunders } = loadFunders();
  const { keywords: allKeywords } = loadKeywords();

  // Flatten agendas with resolved taxonomy data for table view
  const flattenedAgendas: FlattenedAgenda[] = data.sections.flatMap((section) =>
    (section.agendas || []).map((agenda) => ({
      ...agenda,
      sectionId: section.id,
      sectionName: section.name,
      resolvedProblems: agenda.orthodoxProblems
        ? getOrthodoxProblemsByIds(allProblems, agenda.orthodoxProblems)
        : [],
      resolvedApproaches: agenda.broadApproaches
        ? getBroadApproachesByIds(allApproaches, agenda.broadApproaches)
        : [],
      resolvedTargetCase: agenda.targetCase
        ? getTargetCaseByValue(allCases, agenda.targetCase)
        : undefined,
      resolvedFunders: agenda.fundedBy
        ? getFundersByIds(allFunders, agenda.fundedBy)
        : [],
      resolvedKeywords: agenda.keywords
        ? getKeywordsByIds(allKeywords, agenda.keywords)
        : [],
    }))
  );

  return (
    <div className="h-[calc(100vh-4rem)] md:h-screen w-full flex flex-col bg-slate-50">
      <AgendaTable 
        agendas={flattenedAgendas} 
        initialSortField="section" 
        className="flex-1" 
      />
    </div>
  );
}

