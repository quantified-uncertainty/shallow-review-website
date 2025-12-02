/**
 * Color schemes for broad approach badges
 */
export const APPROACH_COLORS: Record<string, string> = {
  engineering: "bg-blue-50 text-blue-700 hover:bg-blue-100",
  behavioral: "bg-green-50 text-green-700 hover:bg-green-100",
  cognitive: "bg-purple-50 text-purple-700 hover:bg-purple-100",
  "maths-philosophy": "bg-orange-50 text-orange-700 hover:bg-orange-100",
  theoretical: "bg-gray-100 text-gray-700 hover:bg-gray-200",
};

/**
 * Color schemes for target case badges
 */
export const TARGET_CASE_COLORS: Record<string, string> = {
  pessimistic: "bg-red-50 text-red-800 hover:bg-red-100",
  optimistic: "bg-green-50 text-green-800 hover:bg-green-100",
  "average-case": "bg-blue-50 text-blue-800 hover:bg-blue-100",
  "worst-case": "bg-purple-50 text-purple-800 hover:bg-purple-100",
  mixed: "bg-gray-100 text-gray-800 hover:bg-gray-200",
};

/**
 * Default color scheme for funder badges
 */
export const FUNDER_COLORS = "bg-teal-50 text-teal-800 hover:bg-teal-100";
