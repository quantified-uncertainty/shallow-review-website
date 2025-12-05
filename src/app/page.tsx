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
import HomePageContent from "@/components/HomePageContent";

export default function Home() {
  const data = loadReviewData();
  const { labs: allLabs } = loadLabs();
  const { problems: allProblems } = loadOrthodoxProblems();
  const { approaches: allApproaches } = loadBroadApproaches();
  const { cases: allCases } = loadTargetCases();
  const { funders: allFunders } = loadFunders();
  const { keywords: allKeywords } = loadKeywords();

  // Create a virtual "Labs" section for display
  const labsSection: Section = {
    id: "labs",
    name: "Labs (giant companies)",
    description: "Major AI labs and their safety efforts",
    labs: allLabs,
  };

  // Combine labs section with agenda sections
  const allSections = [labsSection, ...data.sections];

  const agendaPapers = data.sections.reduce(
    (acc, section) =>
      acc +
      (section.agendas || []).reduce(
        (acc2, agenda) => acc2 + (agenda.papers?.length || 0),
        0
      ),
    0
  );

  const labPapers = allLabs.reduce(
    (acc, lab) => acc + (lab.papers?.length || 0),
    0
  );

  const totalPapers = agendaPapers + labPapers;

  const totalAgendas = data.sections.reduce(
    (acc, section) => acc + (section.agendas?.length || 0),
    0
  );

  const totalLabs = allLabs.length;

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

  // Flatten labs with resolved taxonomy data
  const flattenedLabs: FlattenedLab[] = allLabs.map((lab) => ({
    ...lab,
    sectionId: "labs",
    sectionName: "Labs (giant companies)",
    resolvedFunders: lab.fundedBy
      ? getFundersByIds(allFunders, lab.fundedBy)
      : [],
    resolvedKeywords: lab.keywords
      ? getKeywordsByIds(allKeywords, lab.keywords)
      : [],
  }));

  return (
    <HomePageContent
      sections={allSections}
      flattenedAgendas={flattenedAgendas}
      flattenedLabs={flattenedLabs}
      totalAgendas={totalAgendas}
      totalLabs={totalLabs}
      totalPapers={totalPapers}
    />
  );
}
