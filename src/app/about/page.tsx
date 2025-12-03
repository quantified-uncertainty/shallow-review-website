import Link from "next/link";
import { Metadata } from "next";
import { APP_TITLE, APP_AUTHORS, APP_SHORT_TITLE } from "@/constants/app";
import Header from "@/components/Header";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: `About | ${APP_SHORT_TITLE}`,
  description:
    "About the Shallow Review of Technical AI Safety - scope, structure, and acknowledgments",
};

export default function AboutPage() {
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
          <span className="text-gray-700">About</span>
        </nav>

        <h1 className="text-4xl font-bold text-gray-900 mb-2">About This Review</h1>
        <p className="text-gray-600 text-lg mb-8">
          Background, scope, and acknowledgments for the {APP_SHORT_TITLE}
        </p>
        <div className="prose prose-gray max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What is This?</h2>
            <p className="text-gray-700 mb-4">
              This is a comprehensive taxonomy of technical AI safety research, organizing
              research agendas into a tree structure. People and work can appear in multiple
              nodes, so it&apos;s not a strict partition.
            </p>
            <p className="text-gray-700 mb-4">
              The level of analysis for each node is the &quot;research agenda&quot; — an
              abstraction spanning multiple papers and organisations in a messy many-to-many
              relationship. What makes something an agenda? Similar methods, similar aims, or
              something sociological about leaders and collaborators. Agendas vary greatly in
              their degree of coherent agency, from the very coherent Anthropic Circuits work
              to the enormous, leaderless and unselfconscious &quot;iterative alignment&quot;.
            </p>
            <p className="text-gray-700">
              For an org-first view, see{" "}
              <a
                href="https://aisafety.com"
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                aisafety.com
              </a>
              .
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Scope</h2>
            <p className="text-gray-700 mb-4">
              <strong>Time period:</strong> 30th November 2024 – 30th November 2025.
            </p>
            <p className="text-gray-700 mb-4">
              We focus on <strong>&quot;technical AGI safety&quot;</strong>. We thus ignore a
              lot of work relevant to the overall risk: misuse, policy, strategy, OSINT,
              resilience and indirect risk, AI rights, general capabilities evals, and things
              closer to &quot;technical policy&quot; like products (standards, legislation, SL4
              datacentres, and automated cybersecurity). We also mostly focus on papers and
              blogposts rather than underground gdoc samizdat or Discords.
            </p>
            <p className="text-gray-700 mb-4">
              We only use public information, so we are off by some additional unknown factor.
            </p>
            <p className="text-gray-700">
              We try to include things which are early-stage and illegible — but in general we
              fail and mostly capture legible work on legible problems (i.e. things you can
              write a paper on already).
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Classification Dimensions</h2>
            <p className="text-gray-700 mb-4">
              We classify each agenda along three dimensions:
            </p>

            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  <Link href="/orthodox-problems" className="text-blue-600 hover:underline">
                    Orthodox Problems
                  </Link>{" "}
                  <span className="text-gray-500 font-normal">(via Davidad)</span>
                </h3>
                <p className="text-gray-600 text-sm">
                  Which deep alignment subproblems could this agenda ideally help solve?
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  <Link href="/target-cases" className="text-blue-600 hover:underline">
                    Target Case
                  </Link>{" "}
                  <span className="text-gray-500 font-normal">(via Ngo)</span>
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  What part of the distribution over alignment difficulty do they aim to help with?
                </p>
                <ul className="text-gray-600 text-sm list-disc list-inside space-y-1">
                  <li>
                    <strong>Optimistic:</strong> CoT is faithful, pretraining as value loading,
                    no stable mesa-optimizers, relevant scary capabilities are harder than
                    alignment, zero-shot deception is hard, goals are myopic, etc.
                  </li>
                  <li>
                    <strong>Pessimistic:</strong> In-between optimistic and worst-case
                  </li>
                  <li>
                    <strong>Worst-case:</strong> Power-seeking is rife, zero-shot deceptive
                    alignment, steganography, gradient hacking, weird machines, weird
                    coordination, deep deceptiveness
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  <Link href="/broad-approaches" className="text-blue-600 hover:underline">
                    Broad Approach
                  </Link>{" "}
                  <span className="text-gray-500 font-normal">(via Ngo)</span>
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  Roughly what kind of work is it doing, primarily?
                </p>
                <ul className="text-gray-600 text-sm list-disc list-inside space-y-1">
                  <li>
                    <strong>Engineering:</strong> Iterating over outputs
                  </li>
                  <li>
                    <strong>Behavioural:</strong> Understanding the input-output relationship
                  </li>
                  <li>
                    <strong>Cognitive:</strong> Understanding the algorithms
                  </li>
                  <li>
                    <strong>Maths/Philosophy:</strong> Providing concepts for the other approaches
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes This Year</h2>
            <p className="text-gray-700 mb-4">
              A few major changes to the taxonomy: the top-level split is now
              &quot;black-box&quot; vs &quot;white-box&quot; instead of &quot;control&quot; vs
              &quot;understanding&quot;.
            </p>
            <p className="text-gray-700 mb-4">
              This review has over 700 links compared to ~300 in 2024 and ~200 in 2023. We
              looked harder and the field has grown. The field is growing at around 20% a year.
            </p>
            <p className="text-gray-700">
              New sections include: &quot;Labs&quot;, &quot;Multi-agent First&quot;,
              &quot;Better data&quot;, &quot;Model specs&quot;, &quot;Character training&quot;,
              and &quot;Representation geometry&quot;.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Acknowledgments</h2>
            <p className="text-gray-700">
              Thanks to Seb Krier, Yuxi Liu, Ben Todd, Ege Erdil, Tan Zhi-Xuan, Mateusz
              Bagiński, Vojta Kovařík, David Hyland, plex, Shoshannah Tekofsky, Fin Moorhouse,
              and Misha Yagudin for helpful comments.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">More Information</h2>
            <p className="text-gray-700">
              See our{" "}
              <Link href="/methodology" className="text-blue-600 hover:underline">
                Methodology
              </Link>{" "}
              page for details on sources, data processing, and other reviews in this space.
            </p>
          </section>

          <section className="border-t border-gray-200 pt-8 mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Epigrams</h2>
            <div className="space-y-6">
              <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600">
                <p className="mb-2">
                  &quot;No punting — we can&apos;t keep building nanny products. Our products
                  are overrun with filters and punts of various kinds. We need capable products
                  and [to] trust our users.&quot;
                </p>
                <footer className="text-sm text-gray-500 not-italic">— Sergey Brin</footer>
              </blockquote>

              <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600">
                <p className="mb-2">
                  &quot;Over the decade I&apos;ve spent working on AI safety, I&apos;ve felt an
                  overall trend of divergence; research partnerships starting out with a sense
                  of a common project, then slowly drifting apart over time… eventually, two
                  researchers are going to have some deep disagreement in matters of taste,
                  which sends them down different paths.
                </p>
                <p className="mb-2">
                  Until the spring of this year, that is… something seemed to shift, subtly at
                  first. After I gave a talk — roughly the same talk I had been giving for the
                  past year — I had an excited discussion about it with Scott Garrabrant.
                  Looking back, it wasn&apos;t so different from previous chats we had had, but
                  the impact was different; it felt more concrete, more actionable, something
                  that really touched my research rather than remaining hypothetical. In the
                  subsequent weeks, discussions with my usual circle of colleagues took on a
                  different character — somehow it seemed that, after all our diverse
                  explorations, we had arrived at a shared space.&quot;
                </p>
                <footer className="text-sm text-gray-500 not-italic">— Abram Demski</footer>
              </blockquote>
            </div>

            <p className="text-gray-500 text-sm mt-8 italic">
              Brought to you by the Arb Corporation: skin clear, crops thriving, grades up.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
