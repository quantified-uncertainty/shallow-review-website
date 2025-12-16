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

  // Extract section order from data (preserves YAML file order)
  let sectionOrder = data.sections.map((s) => s.id);
  sectionOrder.splice(sectionOrder.indexOf("Labs"), 1);
  sectionOrder.push("Labs");

  return (
    <div className="fixed top-16 md:top-0 left-0 md:left-80 xl:left-96 right-0 bottom-0 flex flex-col bg-slate-50 p-6">
      <AgendaTable
        agendas={flattenedAgendas}
        initialSortField="section"
        sectionOrder={sectionOrder}
        className="flex-1 min-h-0"
      />
    </div>
  );
}

