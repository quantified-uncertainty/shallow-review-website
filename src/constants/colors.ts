/**
 * Color schemes for agenda sections - main categories
 * Using complete class strings for Tailwind purging
 */
export const SECTION_COLORS: Record<
  string,
  {
    text: string;
    heading: string;
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
  }
> = {
  // Labs - warm brown (stone)
  big_labs: {
    text: "text-stone-600",
    heading: "text-yellow-950",
    bg: "bg-yellow-700",
    border: "border-stone-200",
    borderLeft: "border-l-stone-600",
    hover: "hover:text-yellow-950",
    groupHover: "group-hover:text-yellow-800",
    bgLight: "bg-stone-100",
    accent: "bg-yellow-800",
    gradient: "from-stone-50 to-transparent",
    dot: "bg-yellow-800",
    navHover: "hover:text-yellow-950",
  },
  labs: {
    text: "text-stone-600",
    heading: "text-stone-900",
    bg: "bg-stone-600",
    border: "border-stone-200",
    borderLeft: "border-l-stone-600",
    hover: "hover:text-stone-600",
    groupHover: "group-hover:text-stone-600",
    bgLight: "bg-stone-100",
    accent: "bg-stone-600",
    gradient: "from-stone-50 to-transparent",
    dot: "bg-stone-600",
    navHover: "hover:text-stone-600",
  },
  // Black-box safety - darker slate/charcoal
  black_box: {
    text: "text-slate-700",
    heading: "text-slate-900",
    bg: "bg-slate-700",
    border: "border-slate-200",
    borderLeft: "border-l-slate-700",
    hover: "hover:text-slate-700",
    groupHover: "group-hover:text-slate-700",
    bgLight: "bg-slate-100",
    accent: "bg-slate-700",
    gradient: "from-slate-50 to-transparent",
    dot: "bg-slate-700",
    navHover: "hover:text-slate-700",
  },
  // Black-box child sections inherit the same color
  model_psychology: {
    text: "text-slate-700",
    heading: "text-slate-900",
    bg: "bg-slate-700",
    border: "border-slate-200",
    borderLeft: "border-l-slate-700",
    hover: "hover:text-slate-700",
    groupHover: "group-hover:text-slate-700",
    bgLight: "bg-slate-100",
    accent: "bg-slate-700",
    gradient: "from-slate-50 to-transparent",
    dot: "bg-slate-700",
    navHover: "hover:text-slate-700",
  },
  better_data: {
    text: "text-slate-700",
    heading: "text-slate-900",
    bg: "bg-slate-700",
    border: "border-slate-200",
    borderLeft: "border-l-slate-700",
    hover: "hover:text-slate-700",
    groupHover: "group-hover:text-slate-700",
    bgLight: "bg-slate-100",
    accent: "bg-slate-700",
    gradient: "from-slate-50 to-transparent",
    dot: "bg-slate-700",
    navHover: "hover:text-slate-700",
  },
  goal_robustness: {
    text: "text-slate-700",
    heading: "text-slate-900",
    bg: "bg-slate-700",
    border: "border-slate-200",
    borderLeft: "border-l-slate-700",
    hover: "hover:text-slate-700",
    groupHover: "group-hover:text-slate-700",
    bgLight: "bg-slate-100",
    accent: "bg-slate-700",
    gradient: "from-slate-50 to-transparent",
    dot: "bg-slate-700",
    navHover: "hover:text-slate-700",
  },
  // White-box safety - light blue
  whitebox: {
    text: "text-sky-400",
    heading: "text-sky-600",
    bg: "bg-sky-400",
    border: "border-sky-200",
    borderLeft: "border-l-sky-400",
    hover: "hover:text-sky-500",
    groupHover: "group-hover:text-sky-500",
    bgLight: "bg-sky-50/30",
    accent: "bg-sky-400",
    gradient: "from-sky-50/30 to-transparent",
    dot: "bg-sky-400",
    navHover: "hover:text-sky-500",
  },
  // White-box child sections inherit the same color
  interpretability: {
    text: "text-sky-400",
    heading: "text-sky-600",
    bg: "bg-sky-400",
    border: "border-sky-200",
    borderLeft: "border-l-sky-400",
    hover: "hover:text-sky-500",
    groupHover: "group-hover:text-sky-500",
    bgLight: "bg-sky-50/30",
    accent: "bg-sky-400",
    gradient: "from-sky-50/30 to-transparent",
    dot: "bg-sky-400",
    navHover: "hover:text-sky-500",
  },
  // Safety by construction - amber/orange
  safety_by_construction: {
    text: "text-amber-600",
    heading: "text-amber-900",
    bg: "bg-amber-600",
    border: "border-amber-200",
    borderLeft: "border-l-amber-600",
    hover: "hover:text-amber-600",
    groupHover: "group-hover:text-amber-600",
    bgLight: "bg-amber-50/30",
    accent: "bg-amber-600",
    gradient: "from-amber-50 to-transparent",
    dot: "bg-amber-600",
    navHover: "hover:text-amber-600",
  },
  // Make AI solve it - rose/red
  ai_solve_alignment: {
    text: "text-rose-600",
    heading: "text-rose-900",
    bg: "bg-rose-600",
    border: "border-rose-200",
    borderLeft: "border-l-rose-600",
    hover: "hover:text-rose-600",
    groupHover: "group-hover:text-rose-600",
    bgLight: "bg-rose-50/30",
    accent: "bg-rose-600",
    gradient: "from-rose-50 to-transparent",
    dot: "bg-rose-600",
    navHover: "hover:text-rose-600",
  },
  // Theory - indigo/blue-purple
  theory: {
    text: "text-indigo-600",
    heading: "text-indigo-900",
    bg: "bg-indigo-600",
    border: "border-indigo-200",
    borderLeft: "border-l-indigo-600",
    hover: "hover:text-indigo-600",
    groupHover: "group-hover:text-indigo-600",
    bgLight: "bg-indigo-50/30",
    accent: "bg-indigo-600",
    gradient: "from-indigo-50 to-transparent",
    dot: "bg-indigo-600",
    navHover: "hover:text-indigo-600",
  },
  // Theory child sections inherit the same color
  corrigibility: {
    text: "text-indigo-600",
    heading: "text-indigo-900",
    bg: "bg-indigo-600",
    border: "border-indigo-200",
    borderLeft: "border-l-indigo-600",
    hover: "hover:text-indigo-600",
    groupHover: "group-hover:text-indigo-600",
    bgLight: "bg-indigo-50/30",
    accent: "bg-indigo-600",
    gradient: "from-indigo-50 to-transparent",
    dot: "bg-indigo-600",
    navHover: "hover:text-indigo-600",
  },
  ontology_identification: {
    text: "text-indigo-600",
    heading: "text-indigo-900",
    bg: "bg-indigo-600",
    border: "border-indigo-200",
    borderLeft: "border-l-indigo-600",
    hover: "hover:text-indigo-600",
    groupHover: "group-hover:text-indigo-600",
    bgLight: "bg-indigo-50/30",
    accent: "bg-indigo-600",
    gradient: "from-indigo-50 to-transparent",
    dot: "bg-indigo-600",
    navHover: "hover:text-indigo-600",
  },
  // Multi-agent first - violet/purple
  multi_agent_first: {
    text: "text-violet-600",
    heading: "text-violet-900",
    bg: "bg-violet-600",
    border: "border-violet-200",
    borderLeft: "border-l-violet-600",
    hover: "hover:text-violet-600",
    groupHover: "group-hover:text-violet-600",
    bgLight: "bg-violet-50/30",
    accent: "bg-violet-600",
    gradient: "from-violet-50 to-transparent",
    dot: "bg-violet-600",
    navHover: "hover:text-violet-600",
  },
  // Evals - teal/cyan
  evals: {
    text: "text-teal-600",
    heading: "text-teal-900",
    bg: "bg-teal-600",
    border: "border-teal-200",
    borderLeft: "border-l-teal-600",
    hover: "hover:text-teal-600",
    groupHover: "group-hover:text-teal-600",
    bgLight: "bg-teal-50/30",
    accent: "bg-teal-600",
    gradient: "from-teal-50 to-transparent",
    dot: "bg-teal-600",
    navHover: "hover:text-teal-600",
  },
};

/**
 * Get section color classes
 */
export function getSectionColors(sectionId: string) {
  return (
    SECTION_COLORS[sectionId] || {
      text: "text-slate-600",
      heading: "text-slate-900",
      bg: "bg-slate-600",
      border: "border-slate-200",
      borderLeft: "border-l-slate-600",
      hover: "hover:text-slate-600",
      groupHover: "group-hover:text-slate-600",
      bgLight: "bg-slate-100",
      accent: "bg-slate-600",
      gradient: "from-slate-50 to-transparent",
      dot: "bg-slate-600",
      navHover: "hover:text-slate-600",
    }
  );
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
export const PROBLEM_COLORS =
  "bg-indigo-50 text-indigo-700 border border-indigo-200";
