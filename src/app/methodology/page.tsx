import Link from "next/link";
import { Metadata } from "next";
import { APP_TITLE, APP_AUTHORS, APP_SHORT_TITLE } from "@/constants/app";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: `Methodology | ${APP_SHORT_TITLE}`,
  description:
    "Data sources, processing methods, and related reviews for the Shallow Review of Technical AI Safety",
};

export default function MethodologyPage() {
  const sources = [
    'All Arxiv papers with "AI alignment" and "AI safety" in the abstract or title',
    'All Arxiv papers with "steerability" in the abstract or title',
    "All Alignment Forum posts",
    'All LessWrong posts under "AI"',
    "Gasteiger's links",
    "Paleka's links",
    "Lenz's links",
    "Zvi's links",
    "Ad hoc Twitter for a year",
  ];

  const otherReviews = [
    { name: "aisafety.com org cards", url: "https://aisafety.com" },
    { name: "nonprofits.zone", url: "https://nonprofits.zone/" },
    { name: "Leong and Linsefors taxonomy", url: null },
    { name: "Open Philanthropy RFP", url: null },
    {
      name: "The Singapore Consensus on Global AI Safety Research Priorities",
      url: null,
    },
    {
      name: "International AI Safety Report 2025",
      url: null,
    },
    {
      name: "A Comprehensive Survey in LLM(-Agent) Full Stack Safety: Data, Training and Deployment",
      url: null,
    },
    { name: "plex's Review of AI safety funders", url: null },
    { name: "The Alignment Project", url: null },
    { name: "AI Awareness literature review", url: null },
    {
      name: "Peregrine Launchpad",
      url: "https://peregrine-launchpad.lovable.app/",
    },
    { name: "aisafety.com self-study", url: "https://www.aisafety.com/self-study" },
    { name: "Zach Stein-Perlman's list", url: null },
    { name: "IAPS", url: null },
    { name: "AI Safety Camp 10 Outputs", url: null },
    { name: "The Road to Artificial SuperIntelligence", url: null },
    { name: "AE Studio field guide", url: null },
    { name: "AI Alignment: A Contemporary Survey", url: null },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-700">Methodology</span>
        </nav>

        <h1 className="text-4xl font-bold text-gray-900 mb-2">Methodology</h1>
        <p className="text-gray-600 text-lg mb-8">
          Sources, data processing, and related reviews
        </p>
        <div className="prose prose-gray max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Sources</h2>
            <p className="text-gray-700 mb-4">
              We scraped over 3000 links (arXiv, LessWrong, several alignment publication
              lists, blogs and conferences), conservatively filtering and pre-categorizing
              them with an LLM pipeline. All curated later, many added manually.
            </p>
            <p className="text-gray-700 mb-4">
              We did a systematic Arxiv scrape on the word &quot;alignment&quot; (and filtered
              out the sequence indexing papers that fell into this pipeline).
              &quot;Steerability&quot; is one competing term used by academics.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Primary Sources</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {sources.map((source, i) => (
                <li key={i}>{source}</li>
              ))}
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
              For Critiques
            </h3>
            <p className="text-gray-700">
              We used LessWrong backlinks, Google Scholar cited-by, and Ahrefs.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Processing</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                Started with last year&apos;s list and moved any agendas without public
                outputs this year to the bottom / the Graveyard.
              </li>
              <li>
                Deleted papers that struck us as obviously low-quality (slop review papers,
                etc).
              </li>
              <li>
                Tried getting the AI to update the taxonomy bottom-up, but it wasn&apos;t
                very good.
              </li>
              <li>Many, many manual touchpoints still.</li>
              <li>
                Of the 1200 links in the raw scrape, about 700 made it in.
              </li>
            </ul>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6">
              <p className="text-amber-800 text-sm">
                <strong>Note on AI scrapers:</strong> AI scrapers miss lots of things. We did
                a proper pass with a software scraper and then an LLM pass to cluster the
                links, but this also had systematic omissions. We ended up doing a full
                manual pass. I&apos;m not aware of any proper studies of &quot;LLM
                laziness&quot; but it&apos;s known amongst power users of copilots.
              </p>
            </div>

            <p className="text-gray-700 mt-6">
              The field is growing at around 20% a year. There will come a time that this
              list isn&apos;t sensible to do manually, at this granularity anyway.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Taxonomy Classification
            </h2>
            <p className="text-gray-700 mb-4">
              We added our best guess about which of Davidad&apos;s alignment problems the
              agenda would make an impact on if it succeeded, as well as its research
              approach and implied optimism in Richard Ngo&apos;s 3×3 framework.
            </p>

            <div className="grid gap-4 mt-6">
              <Link
                href="/orthodox-problems"
                className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <h3 className="font-semibold text-blue-600">
                  Orthodox Problems &rarr;
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Which deep orthodox subproblems could this agenda ideally solve?
                </p>
              </Link>

              <Link
                href="/target-cases"
                className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <h3 className="font-semibold text-blue-600">Target Cases &rarr;</h3>
                <p className="text-gray-600 text-sm mt-1">
                  What part of the distribution over alignment difficulty do they aim to
                  help with?
                </p>
              </Link>

              <Link
                href="/broad-approaches"
                className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <h3 className="font-semibold text-blue-600">Broad Approaches &rarr;</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Roughly what kind of work is it doing, primarily?
                </p>
              </Link>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Other Reviews and Taxonomies
            </h2>
            <p className="text-gray-700 mb-4">
              This review exists in the context of many other efforts to map AI safety
              research:
            </p>
            <ul className="space-y-2">
              {otherReviews.map((review, i) => (
                <li key={i} className="text-gray-700">
                  {review.url ? (
                    <a
                      href={review.url}
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {review.name}
                    </a>
                  ) : (
                    <span>{review.name}</span>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitations</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>We only use public information.</li>
              <li>
                We mostly capture legible work on legible problems (things you can write a
                paper on already).
              </li>
              <li>
                We don&apos;t collate public funding figures.
              </li>
              <li>
                Evals is so massive that we put it into its own separate post.
              </li>
            </ul>
          </section>

          <div className="border-t border-gray-200 pt-8">
            <p className="text-gray-600">
              See also:{" "}
              <Link href="/about" className="text-blue-600 hover:underline">
                About this review
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
