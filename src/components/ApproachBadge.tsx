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
  size?: "sm" | "md";
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

  const sizeClasses = size === "sm"
    ? "text-xs px-2 py-0.5"
    : "text-sm px-2 py-1";

  const iconSize = size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5";

  const content = (
    <>
      {Icon && <Icon className={iconSize} />}
      {name}
    </>
  );

  const className = `inline-flex items-center gap-1 rounded transition-colors ${sizeClasses} ${colorClass}`;

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
