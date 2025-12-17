"use client";

import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  AgendaNode,
  SimilarityGraphData,
  DEFAULT_WEIGHTS,
  SimilarityWeights,
} from "@/lib/similarityTypes";

// Dynamically import to avoid SSR issues
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[600px] bg-gray-100 rounded-lg">
      <span className="text-gray-500">Loading graph...</span>
    </div>
  ),
});

// Section color palette - RGB values matching src/constants/colors.ts Tailwind classes
// (opacity applied dynamically based on paper count)
const SECTION_COLORS: Record<string, [number, number, number]> = {
  // Labs: yellow-800 (#854d0e)
  Labs: [133, 77, 14],
  // Black_box_safety: slate-700 (#334155)
  Black_box_safety: [51, 65, 85],
  // Sub-sections of Black_box_safety inherit the same color
  Iterative_alignment: [51, 65, 85],
  Model_psychology: [51, 65, 85],
  Better_data: [51, 65, 85],
  Goal_robustness: [51, 65, 85],
  // White_box_safety: sky-400 (#38bdf8)
  White_box_safety: [56, 189, 248],
  Concept_based_interpretability: [56, 189, 248],
  // Safety_by_construction: amber-600 (#d97706)
  Safety_by_construction: [217, 119, 6],
  // Make_AI_solve_it: rose-600 (#e11d48)
  Make_AI_solve_it: [225, 29, 72],
  // Theory: indigo-600 (#4f46e5)
  Theory: [79, 70, 229],
  Corrigibility: [79, 70, 229],
  Ontology_Identification: [79, 70, 229],
  // Multi_agent_first: violet-600 (#7c3aed)
  Multi_agent_first: [124, 58, 237],
  // Evals: teal-600 (#0d9488)
  Evals: [13, 148, 136],
  other: [107, 114, 128], // gray fallback
};

// Approach colors - RGB values
const APPROACH_COLORS: Record<string, [number, number, number]> = {
  "engineering": [59, 130, 246], // blue
  "behavioral": [16, 185, 129], // green
  "cognitive": [139, 92, 246], // purple
  "maths-philosophy": [245, 158, 11], // orange
  "theoretical": [107, 114, 128], // gray
  other: [107, 114, 128],
};

// Target case colors - RGB values
const TARGET_CASE_COLORS: Record<string, [number, number, number]> = {
  "pessimistic": [239, 68, 68], // red
  "optimistic": [16, 185, 129], // green
  "average-case": [59, 130, 246], // blue
  "worst-case": [139, 92, 246], // purple
  "mixed": [107, 114, 128], // gray
  other: [107, 114, 128],
};

// Calculate opacity based on paper count (0.4 to 0.9)
const getOpacityFromPaperCount = (paperCount: number) => {
  // Use sqrt scaling, cap at ~50 papers for max opacity
  const normalized = Math.min(Math.sqrt(paperCount) / Math.sqrt(50), 1);
  return 0.4 + normalized * 0.5; // 0.4 to 0.9
};

type ColorMode = "section" | "approach" | "targetCase";

// Helper function to get RGB array for a node
const getNodeRgb = (node: any, colorMode: ColorMode): [number, number, number] => {
  switch (colorMode) {
    case "section":
      return SECTION_COLORS[node.sectionId] || SECTION_COLORS.other;
    case "approach":
      const approach = node.broadApproaches?.[0];
      return approach ? (APPROACH_COLORS[approach] || APPROACH_COLORS.other) : APPROACH_COLORS.other;
    case "targetCase":
      return node.targetCase ? (TARGET_CASE_COLORS[node.targetCase] || TARGET_CASE_COLORS.other) : TARGET_CASE_COLORS.other;
    default:
      return SECTION_COLORS.other;
  }
};

// Helper functions defined outside component to avoid recreation
const getNodeColorByMode = (node: any, colorMode: ColorMode) => {
  const rgb = getNodeRgb(node, colorMode);
  const opacity = getOpacityFromPaperCount(node.paperCount || 1);
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity})`;
};

const getNodeSize = (node: any) => {
  // Size based on paper count
  // Small nodes ~2.5 (5px diameter), large nodes ~10 (20px diameter) = 4x range
  const paperCount = node.paperCount || 1;
  const base = Math.sqrt(paperCount) * 1.5;
  return Math.max(2.5, Math.min(base, 10));
};

const getLinkColor = () => "rgba(150, 150, 150, 0.3)";
const getLinkWidth = () => 0.5;

interface SimilarityGraphProps {
  data: SimilarityGraphData;
  width?: number;
  height?: number;
}

export default function SimilarityGraph({
  data,
  width = 900,
  height = 600,
}: SimilarityGraphProps) {
  const graphRef = useRef<any>(null);
  const [threshold, setThreshold] = useState(0.15);
  const [maxEdgesPerNode, setMaxEdgesPerNode] = useState(5);
  const [showEdges, setShowEdges] = useState(false);
  const [colorMode, setColorMode] = useState<ColorMode>("section");
  const [weights, setWeights] = useState<SimilarityWeights>(DEFAULT_WEIGHTS);
  const [hoveredNode, setHoveredNode] = useState<AgendaNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<AgendaNode | null>(null);
  const [showControls, setShowControls] = useState(false);

  // Memoize graph data - only recompute when filters change
  const graphData = useMemo(() => {
    // Calculate all similarities
    const edgesWithSimilarity = data.edges.map((edge) => {
      const similarity =
        weights.broadApproaches * edge.approachSimilarity +
        weights.orthodoxProblems * edge.problemSimilarity +
        weights.targetCase * (edge.targetCaseMatch ? 1 : 0) +
        weights.fundedBy * edge.funderSimilarity +
        weights.lesswrongTags * edge.tagSimilarity +
        weights.researchers * edge.researcherSimilarity +
        weights.keywords * (edge.keywordSimilarity || 0);
      return { ...edge, similarity };
    });

    // For each node, find its best connection (ensures connectivity)
    const bestEdgePerNode = new Map<string, { target: string; similarity: number }>();
    for (const edge of edgesWithSimilarity) {
      const currentBestSource = bestEdgePerNode.get(edge.source);
      if (!currentBestSource || edge.similarity > currentBestSource.similarity) {
        bestEdgePerNode.set(edge.source, { target: edge.target, similarity: edge.similarity });
      }
      const currentBestTarget = bestEdgePerNode.get(edge.target);
      if (!currentBestTarget || edge.similarity > currentBestTarget.similarity) {
        bestEdgePerNode.set(edge.target, { target: edge.source, similarity: edge.similarity });
      }
    }

    // Build edge set: best edge per node + top edges by similarity
    const edgeSet = new Set<string>();
    const selectedEdges: typeof edgesWithSimilarity = [];

    // Add best edge for each node
    for (const [nodeId, best] of bestEdgePerNode) {
      const key = [nodeId, best.target].sort().join('|');
      if (!edgeSet.has(key)) {
        edgeSet.add(key);
        const edge = edgesWithSimilarity.find(
          (e) => (e.source === nodeId && e.target === best.target) ||
                 (e.target === nodeId && e.source === best.target)
        );
        if (edge) selectedEdges.push(edge);
      }
    }

    // Add additional top edges up to limit
    const additionalEdges = edgesWithSimilarity
      .filter((e) => e.similarity >= threshold)
      .sort((a, b) => b.similarity - a.similarity);

    for (const edge of additionalEdges) {
      if (selectedEdges.length >= maxEdgesPerNode * data.nodes.length / 2) break;
      const key = [edge.source, edge.target].sort().join('|');
      if (!edgeSet.has(key)) {
        edgeSet.add(key);
        selectedEdges.push(edge);
      }
    }

    return {
      nodes: data.nodes.map((n) => ({ ...n })),
      links: selectedEdges.map((e) => ({
        source: e.source,
        target: e.target,
        similarity: e.similarity,
      })),
    };
  }, [data, threshold, maxEdgesPerNode, weights]);

  // Flag to track if we've done initial zoom
  const hasZoomedRef = useRef(false);

  // Set initial zoom on mount
  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.zoom(0.7);
    }
  }, []);

  // Zoom to fit when simulation stops
  const handleEngineStop = useCallback(() => {
    if (graphRef.current && !hasZoomedRef.current) {
      hasZoomedRef.current = true;
      graphRef.current.zoomToFit(400, 50);
    }
  }, []);

  const handleNodeClick = useCallback((node: any) => {
    setSelectedNode((prev) => (prev?.id === node.id ? null : node));
  }, []);

  const handleNodeHover = useCallback((node: any) => {
    setHoveredNode(node || null);
  }, []);

  // Memoize color function to avoid graph resets
  const nodeColorFn = useCallback(
    (node: any) => getNodeColorByMode(node, colorMode),
    [colorMode]
  );

  const WeightSlider = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: number;
    onChange: (v: number) => void;
  }) => (
    <div className="flex items-center gap-2">
      <label className="text-xs text-gray-600 w-28">{label}</label>
      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-24 h-1"
      />
      <span className="text-xs text-gray-500 w-8">{value.toFixed(2)}</span>
    </div>
  );

  const displayNode = selectedNode || hoveredNode;

  // Main sections for legend (excludes sub-sections that inherit parent colors)
  const MAIN_SECTIONS = [
    "Labs",
    "Black_box_safety",
    "White_box_safety",
    "Safety_by_construction",
    "Make_AI_solve_it",
    "Theory",
    "Multi_agent_first",
    "Evals",
  ];

  // Get current legend based on color mode (convert RGB to rgba string)
  const currentLegend = useMemo(() => {
    const toRgba = (rgb: [number, number, number]) => `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.9)`;
    switch (colorMode) {
      case "section":
        return MAIN_SECTIONS.map((key) => [key, toRgba(SECTION_COLORS[key] || SECTION_COLORS.other)] as [string, string]);
      case "approach":
        return Object.entries(APPROACH_COLORS)
          .filter(([key]) => key !== "other")
          .map(([key, rgb]) => [key, toRgba(rgb)] as [string, string]);
      case "targetCase":
        return Object.entries(TARGET_CASE_COLORS)
          .filter(([key]) => key !== "other")
          .map(([key, rgb]) => [key, toRgba(rgb)] as [string, string]);
      default:
        return [];
    }
  }, [colorMode]);

  return (
    <div className="relative">
      {/* Color mode toggle */}
      <div className="mb-3 flex items-center gap-2">
        <span className="text-sm text-gray-600">Color by:</span>
        <div className="flex gap-1">
          {[
            { value: "section", label: "Section" },
            { value: "approach", label: "Approach" },
            { value: "targetCase", label: "Target Case" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setColorMode(option.value as ColorMode)}
              className={`px-3 py-1 text-sm rounded ${
                colorMode === option.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Controls toggle */}
      <button
        onClick={() => setShowControls(!showControls)}
        className="absolute top-2 right-2 z-10 bg-white px-3 py-1 rounded shadow text-sm hover:bg-gray-50"
      >
        {showControls ? "Hide Controls" : "Show Controls"}
      </button>

      {/* Controls panel */}
      {showControls && (
        <div className="absolute top-10 right-2 z-10 bg-white p-4 rounded-lg shadow-lg w-72">
          <h3 className="font-medium text-sm mb-3">Graph Controls</h3>

          <div className="mb-4">
            <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={showEdges}
                onChange={(e) => setShowEdges(e.target.checked)}
                className="rounded"
              />
              Show edges
            </label>
          </div>

          <div className="mb-4">
            <label className="text-xs text-gray-600 block mb-1">
              Similarity Threshold: {threshold.toFixed(2)}
            </label>
            <input
              type="range"
              min="0.1"
              max="0.6"
              step="0.01"
              value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              className="w-full h-1"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>More edges</span>
              <span>Fewer edges</span>
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs text-gray-600 block mb-1">
              Max edges per node: {maxEdgesPerNode}
            </label>
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={maxEdgesPerNode}
              onChange={(e) => setMaxEdgesPerNode(parseInt(e.target.value))}
              className="w-full h-1"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>Sparser</span>
              <span>Denser</span>
            </div>
          </div>

          <div className="border-t pt-3">
            <h4 className="text-xs font-medium text-gray-700 mb-2">Weights</h4>
            <div className="space-y-2">
              <WeightSlider
                label="Approaches"
                value={weights.broadApproaches}
                onChange={(v) =>
                  setWeights({ ...weights, broadApproaches: v })
                }
              />
              <WeightSlider
                label="Problems"
                value={weights.orthodoxProblems}
                onChange={(v) =>
                  setWeights({ ...weights, orthodoxProblems: v })
                }
              />
              <WeightSlider
                label="Target Case"
                value={weights.targetCase}
                onChange={(v) => setWeights({ ...weights, targetCase: v })}
              />
              <WeightSlider
                label="Funders"
                value={weights.fundedBy}
                onChange={(v) => setWeights({ ...weights, fundedBy: v })}
              />
              <WeightSlider
                label="LW Tags"
                value={weights.lesswrongTags}
                onChange={(v) =>
                  setWeights({ ...weights, lesswrongTags: v })
                }
              />
              <WeightSlider
                label="Researchers"
                value={weights.researchers}
                onChange={(v) =>
                  setWeights({ ...weights, researchers: v })
                }
              />
              <WeightSlider
                label="Keywords"
                value={weights.keywords}
                onChange={(v) =>
                  setWeights({ ...weights, keywords: v })
                }
              />
            </div>
            <button
              onClick={() => setWeights(DEFAULT_WEIGHTS)}
              className="mt-2 text-xs text-blue-600 hover:underline"
            >
              Reset to defaults
            </button>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-2 left-2 z-10 bg-white/90 p-2 rounded text-xs">
        <div className="font-medium mb-1 capitalize">{colorMode === "targetCase" ? "Target Case" : colorMode}</div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
          {currentLegend.map(([key, color]) => (
            <div key={key} className="flex items-center gap-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="capitalize text-[10px]">
                {key.replace(/[-_]/g, " ")}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-2 text-gray-500">
          {graphData.nodes.length} nodes, {graphData.links.length} edges
        </div>
      </div>

      {/* Info panel for selected/hovered node */}
      {displayNode && (
        <div className="absolute top-2 left-2 z-10 bg-white p-3 rounded-lg shadow-lg max-w-xs">
          <h4 className="font-medium text-sm">{displayNode.name}</h4>
          <p className="text-xs text-gray-500 mt-1">
            Section: {displayNode.sectionName}
          </p>
          <p className="text-xs text-gray-500">
            Papers: {displayNode.paperCount}
          </p>
          {displayNode.broadApproaches && displayNode.broadApproaches.length > 0 && (
            <p className="text-xs text-gray-500">
              Approaches: {displayNode.broadApproaches.join(", ")}
            </p>
          )}
          {displayNode.keywords && displayNode.keywords.length > 0 && (
            <p className="text-xs text-gray-500">
              Keywords: {displayNode.keywords.slice(0, 5).join(", ")}{displayNode.keywords.length > 5 ? "..." : ""}
            </p>
          )}
          {selectedNode && (
            <button
              onClick={() => setSelectedNode(null)}
              className="mt-2 text-xs text-blue-600 hover:underline"
            >
              Clear selection
            </button>
          )}
        </div>
      )}

      {/* Graph */}
      <div className="border rounded-lg overflow-hidden bg-gray-50">
        <ForceGraph2D
          ref={graphRef}
          graphData={graphData}
          width={width}
          height={height}
          nodeId="id"
          nodeLabel="name"
          nodeColor={nodeColorFn}
          nodeVal={getNodeSize}
          linkColor={showEdges ? getLinkColor : () => "rgba(0,0,0,0)"}
          linkWidth={showEdges ? getLinkWidth : () => 0}
          onNodeClick={handleNodeClick}
          onNodeHover={handleNodeHover}
          onEngineStop={handleEngineStop}
          cooldownTicks={100}
          warmupTicks={50}
          d3AlphaDecay={0.05}
          d3VelocityDecay={0.3}
          minZoom={0.3}
          maxZoom={10}
          enableNodeDrag={true}
          enableZoomInteraction={true}
          enablePanInteraction={true}
        />
      </div>
    </div>
  );
}
