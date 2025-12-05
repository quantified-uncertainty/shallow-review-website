import { loadReviewData } from "@/lib/loadData";
import { generateSimilarityGraph, getGraphStats } from "@/lib/similarity";
import Link from "next/link";
import { Metadata } from "next";
import { APP_SHORT_TITLE } from "@/constants/app";
import { ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import SimilarityGraphClient from "./SimilarityGraphClient";

export const metadata: Metadata = {
  title: `Agenda Similarity | ${APP_SHORT_TITLE}`,
  description:
    "Interactive visualization of similarity relationships between AI alignment research agendas",
};

export default function SimilarityPage() {
  const reviewData = loadReviewData();

  // Generate similarity data with a low threshold to capture more edges
  // The client component allows filtering with a higher threshold
  const graphData = generateSimilarityGraph(reviewData.sections, undefined, 0.05);
  const stats = getGraphStats(graphData);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-700">Agenda Similarity</span>
        </nav>

        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Agenda Similarity Graph
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          Interactive visualization showing similarity relationships between
          research agendas. Agendas are connected when they share approaches,
          target problems, funders, or community tags. Drag nodes, zoom, and pan
          to explore.
        </p>

        {/* Stats summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-gray-900">{stats.nodeCount}</div>
            <div className="text-sm text-gray-500">Agendas</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-gray-900">{stats.edgeCount}</div>
            <div className="text-sm text-gray-500">Connections</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-gray-900">
              {stats.avgSimilarity.toFixed(2)}
            </div>
            <div className="text-sm text-gray-500">Avg Similarity</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-gray-900">
              {stats.avgEdgesPerNode.toFixed(1)}
            </div>
            <div className="text-sm text-gray-500">Avg Connections</div>
          </div>
        </div>

        {/* Graph component */}
        <SimilarityGraphClient data={graphData} />

        {/* Methodology note */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            How Similarity is Calculated
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Similarity between two agendas is computed as a weighted sum of
            Jaccard similarities across their shared attributes:
          </p>
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li>
              <strong>Broad Approaches</strong> (30%): Research methodology overlap
              (engineering, behavioral, cognitive, etc.)
            </li>
            <li>
              <strong>Orthodox Problems</strong> (30%): Shared AI safety problems
              being addressed
            </li>
            <li>
              <strong>Target Case</strong> (15%): Whether agendas target the same
              AI development scenario
            </li>
            <li>
              <strong>Funders</strong> (15%): Shared funding sources
            </li>
            <li>
              <strong>LessWrong Tags</strong> (10%): Community topic overlap
            </li>
          </ul>
          <p className="text-gray-500 text-xs mt-4">
            Use the controls panel to adjust these weights and the similarity
            threshold for edge display.
          </p>
        </div>
      </main>
    </div>
  );
}
