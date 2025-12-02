import {
  loadReviewData,
  loadOrthodoxProblems,
  loadBroadApproaches,
  loadTargetCases,
  loadFunders,
  getOrthodoxProblemsByIds,
  getBroadApproachesByIds,
  getTargetCaseByValue,
  getFundersByIds,
} from "@/data/loadData";
import { FlattenedAgenda } from "@/data/types";
import HomePageContent from "@/components/HomePageContent";

export default function Home() {
  const data = loadReviewData();
  const { problems: allProblems } = loadOrthodoxProblems();
  const { approaches: allApproaches } = loadBroadApproaches();
  const { cases: allCases } = loadTargetCases();
  const { funders: allFunders } = loadFunders();

  const totalPapers = data.sections.reduce(
    (acc, section) =>
      acc +
      section.agendas.reduce(
        (acc2, agenda) => acc2 + (agenda.papers?.length || 0),
        0
      ),
    0
  );

  const totalAgendas = data.sections.reduce(
    (acc, section) => acc + section.agendas.length,
    0
  );

  // Flatten agendas with resolved taxonomy data for table view
  const flattenedAgendas: FlattenedAgenda[] = data.sections.flatMap((section) =>
    section.agendas.map((agenda) => ({
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
    }))
  );

  return (
    <HomePageContent
      sections={data.sections}
      flattenedAgendas={flattenedAgendas}
      totalAgendas={totalAgendas}
      totalPapers={totalPapers}
    />
  );
}
