/**
 * Color schemes for agenda sections - main categories
 * Using complete class strings for Tailwind purging
 */
export const SECTION_COLORS: Record<string, {
  text: string;
  bg: string;
  border: string;
  borderLeft: string;
  hover: string;
  groupHover: string;
  bgLight: string;
  accent: string;
  gradient: string;
  dot: string;
  navHover: string;
}> = {
  "black-box-safety": {
    text: "text-sky-600",
    bg: "bg-sky-600",
    border: "border-sky-200",
    borderLeft: "border-l-sky-600",
    hover: "hover:text-sky-600",
    groupHover: "group-hover:text-sky-600",
    bgLight: "bg-sky-50",
    accent: "bg-sky-600",
    gradient: "from-sky-50 to-transparent",
    dot: "bg-sky-600",
    navHover: "hover:text-sky-600",
  },
  "white-box-safety": {
    text: "text-emerald-600",
    bg: "bg-emerald-600",
    border: "border-emerald-200",
    borderLeft: "border-l-emerald-600",
    hover: "hover:text-emerald-600",
    groupHover: "group-hover:text-emerald-600",
    bgLight: "bg-emerald-50",
    accent: "bg-emerald-600",
    gradient: "from-emerald-50 to-transparent",
    dot: "bg-emerald-600",
    navHover: "hover:text-emerald-600",
  },
  "safety-by-construction": {
    text: "text-amber-600",
    bg: "bg-amber-600",
    border: "border-amber-200",
    borderLeft: "border-l-amber-600",
    hover: "hover:text-amber-600",
    groupHover: "group-hover:text-amber-600",
    bgLight: "bg-amber-50",
    accent: "bg-amber-600",
    gradient: "from-amber-50 to-transparent",
    dot: "bg-amber-600",
    navHover: "hover:text-amber-600",
  },
  "make-ai-solve-it": {
    text: "text-rose-600",
    bg: "bg-rose-600",
    border: "border-rose-200",
    borderLeft: "border-l-rose-600",
    hover: "hover:text-rose-600",
    groupHover: "group-hover:text-rose-600",
    bgLight: "bg-rose-50",
    accent: "bg-rose-600",
    gradient: "from-rose-50 to-transparent",
    dot: "bg-rose-600",
    navHover: "hover:text-rose-600",
  },
  "theory": {
    text: "text-indigo-600",
    bg: "bg-indigo-600",
    border: "border-indigo-200",
    borderLeft: "border-l-indigo-600",
    hover: "hover:text-indigo-600",
    groupHover: "group-hover:text-indigo-600",
    bgLight: "bg-indigo-50",
    accent: "bg-indigo-600",
    gradient: "from-indigo-50 to-transparent",
    dot: "bg-indigo-600",
    navHover: "hover:text-indigo-600",
  },
  "multi-agent-first": {
    text: "text-violet-600",
    bg: "bg-violet-600",
    border: "border-violet-200",
    borderLeft: "border-l-violet-600",
    hover: "hover:text-violet-600",
    groupHover: "group-hover:text-violet-600",
    bgLight: "bg-violet-50",
    accent: "bg-violet-600",
    gradient: "from-violet-50 to-transparent",
    dot: "bg-violet-600",
    navHover: "hover:text-violet-600",
  },
};

/**
 * Get section color classes
 */
export function getSectionColors(sectionId: string) {
  return SECTION_COLORS[sectionId] || {
    text: "text-slate-600",
    bg: "bg-slate-600",
    border: "border-slate-200",
    borderLeft: "border-l-slate-600",
    hover: "hover:text-slate-600",
    groupHover: "group-hover:text-slate-600",
    bgLight: "bg-slate-50",
    accent: "bg-slate-600",
    gradient: "from-slate-50 to-transparent",
    dot: "bg-slate-600",
    navHover: "hover:text-slate-600",
  };
}

/**
 * Color schemes for broad approach badges
 */
export const APPROACH_COLORS: Record<string, string> = {
  engineering: "bg-teal-50 text-teal-700 border border-teal-200",
  behavioral: "bg-teal-50 text-teal-700 border border-teal-200",
  cognitive: "bg-teal-50 text-teal-700 border border-teal-200",
  "maths-philosophy": "bg-teal-50 text-teal-700 border border-teal-200",
  theoretical: "bg-teal-50 text-teal-700 border border-teal-200",
};

/**
 * Color schemes for target case badges
 */
export const TARGET_CASE_COLORS: Record<string, string> = {
  pessimistic: "bg-violet-50 text-violet-700 border border-violet-200",
  optimistic: "bg-violet-50 text-violet-700 border border-violet-200",
  "average-case": "bg-violet-50 text-violet-700 border border-violet-200",
  "worst-case": "bg-violet-50 text-violet-700 border border-violet-200",
  mixed: "bg-violet-50 text-violet-700 border border-violet-200",
};

/**
 * Default color scheme for funder badges - now just text styling
 */
export const FUNDER_COLORS = "text-sky-700 hover:text-sky-900 hover:underline";

/**
 * Default color scheme for problem badges
 */
export const PROBLEM_COLORS = "bg-indigo-50 text-indigo-700 border border-indigo-200";
