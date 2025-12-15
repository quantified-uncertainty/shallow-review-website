"use client";

import Link from "next/link";
import { Wrench, Activity, Brain, Sigma, Waypoints, LucideIcon } from "lucide-react";
import { APPROACH_COLORS } from "@/constants/colors";

export const APPROACH_ICONS: Record<string, LucideIcon> = {
  engineering: Wrench,
  behavioral: Activity,
  cognitive: Brain,
  "maths-philosophy": Sigma,
  theoretical: Waypoints,
};

interface ApproachBadgeProps {
  id: string;
  name: string;
  description?: string;
  size?: "sm" | "md" | "lg";
  asLink?: boolean;
}

export default function ApproachBadge({
  id,
  name,
  description,
  size = "sm",
  asLink = true,
}: ApproachBadgeProps) {
  const Icon = APPROACH_ICONS[id];
  const colorClass = APPROACH_COLORS[id] || "bg-slate-100 text-slate-700 hover:bg-slate-200";

  let sizeClasses = "";
  let iconSize = "";

  switch (size) {
    case "lg":
      sizeClasses = "text-base px-3 py-1";
      iconSize = "w-4 h-4";
      break;
    case "md":
      sizeClasses = "text-sm px-2 py-1";
      iconSize = "w-3.5 h-3.5";
      break;
    case "sm":
    default:
      sizeClasses = "text-xs px-2 py-0.5";
      iconSize = "w-3 h-3";
      break;
  }

  const content = (
    <>
      {Icon && <Icon className={iconSize} />}
      {name}
    </>
  );

  const className = `inline-flex items-center gap-1.5 rounded-full transition-colors font-medium border ${sizeClasses} ${colorClass.replace("border ", "border-opacity-50 ")}`;

  if (asLink) {
    return (
      <Link
        href={`/broad-approaches#approach-${id}`}
        className={className}
        title={description}
      >
        {content}
      </Link>
    );
  }

  return (
    <span className={className} title={description}>
      {content}
    </span>
  );
}
