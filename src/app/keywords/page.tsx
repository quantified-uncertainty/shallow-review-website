import { loadReviewData, loadKeywords, loadLesswrongTags, createTagsLookup } from "@/lib/loadData";
import Link from "next/link";
import { Metadata } from "next";
import { APP_SHORT_TITLE } from "@/constants/app";
import Header from "@/components/Header";
import { ChevronRight, ExternalLink } from "lucide-react";
import AgendaLink from "@/components/AgendaLink";

export const metadata: Metadata = {
  title: `Keywords | ${APP_SHORT_TITLE}`,
  description:
    "Key technical concepts, methods, and phenomena in AI safety research",
};

export default function KeywordsPage() {
  const reviewData = loadReviewData();
  const { keywords, categories } = loadKeywords();
  const { tags } = loadLesswrongTags();
  const tagsLookup = createTagsLookup(tags);

  // Build a map of keyword ID -> agendas that reference it
  const keywordToAgendas: Record<
    string,
    { agenda: { id: string; name: string }; section: { id: string; name: string } }[]
  > = {};

  for (const keyword of keywords) {
    keywordToAgendas[keyword.id] = [];
  }

  for (const section of reviewData.sections) {
    for (const agenda of section.agendas || []) {
      if (agenda.keywords?.length) {
        for (const keywordId of agenda.keywords) {
          if (keywordToAgendas[keywordId]) {
            keywordToAgendas[keywordId].push({
              agenda: { id: agenda.id, name: agenda.name },
              section: { id: section.id, name: section.name },
            });
          }
        }
      }
    }
  }

  // Group keywords by category
  const keywordsByCategory: Record<string, typeof keywords> = {};
  for (const category of categories) {
    keywordsByCategory[category.id] = keywords.filter(k => k.category === category.id);
  }

  // Count total keywords with agendas
  const keywordsWithAgendas = keywords.filter(k => keywordToAgendas[k.id].length > 0).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-700">Keywords</span>
        </nav>

        <h1 className="text-4xl font-bold text-gray-900 mb-2">Keywords</h1>
        <p className="text-gray-600 text-lg mb-4">
          Key technical concepts, methods, and phenomena that appear across AI safety research.
          Keywords help identify what specific topics each research agenda addresses.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          {keywords.length} keywords across {categories.length} categories
          {keywordsWithAgendas < keywords.length && (
            <span> ({keywordsWithAgendas} currently used by agendas)</span>
          )}
        </p>

        {/* Category navigation */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((category) => {
            const categoryKeywords = keywordsByCategory[category.id] || [];
            const usedCount = categoryKeywords.filter(k => keywordToAgendas[k.id].length > 0).length;
            return (
              <a
                key={category.id}
                href={`#category-${category.id}`}
                className="inline-block text-sm bg-slate-100 text-slate-700 px-3 py-1.5 rounded hover:bg-slate-200 transition-colors"
              >
                {category.name}
                <span className="ml-1.5 text-slate-500">({usedCount})</span>
              </a>
            );
          })}
        </div>

        <div className="space-y-12">
          {categories.map((category) => {
            const categoryKeywords = keywordsByCategory[category.id] || [];
            if (categoryKeywords.length === 0) return null;

            return (
              <div key={category.id} id={`category-${category.id}`}>
                <div className="border-b border-gray-300 pb-2 mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
                  <p className="text-gray-500 text-sm mt-1">{category.description}</p>
                </div>

                <div className="space-y-6">
                  {categoryKeywords.map((keyword) => {
                    const agendas = keywordToAgendas[keyword.id] || [];
                    return (
                      <section
                        key={keyword.id}
                        id={`keyword-${keyword.id}`}
                        className="border-b border-gray-100 pb-6 last:border-0"
                      >
                        <div className="flex items-baseline gap-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {keyword.name}
                          </h3>
                          {agendas.length > 0 && (
                            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                              {agendas.length} agenda{agendas.length !== 1 ? "s" : ""}
                            </span>
                          )}
                        </div>

                        <p className="text-gray-600 mt-1">{keyword.description}</p>

                        {keyword.lesswrongTags && keyword.lesswrongTags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                            {keyword.lesswrongTags.map((slug) => {
                              const tagInfo = tagsLookup[slug];
                              const displayName = tagInfo?.name || slug;
                              const postCount = tagInfo?.postCount;
                              return (
                                <a
                                  key={slug}
                                  href={`https://www.lesswrong.com/tag/${slug}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  LessWrong: {displayName}
                                  {postCount !== undefined && (
                                    <span className="text-xs text-blue-400">
                                      ({postCount} posts)
                                    </span>
                                  )}
                                </a>
                              );
                            })}
                          </div>
                        )}

                        {agendas.length > 0 && (
                          <div className="mt-3">
                            <div className="flex flex-wrap gap-2">
                              {agendas.map(({ agenda, section }) => (
                                <AgendaLink
                                  key={`${section.id}-${agenda.id}`}
                                  sectionId={section.id}
                                  agendaId={agenda.id}
                                  name={agenda.name}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </section>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
