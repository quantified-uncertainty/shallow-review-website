"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface NavContentProps {
  onNavigate?: () => void;
  className?: string;
}

export default function NavContent({ onNavigate, className }: NavContentProps) {
  return (
    <div className={cn("py-4 text-sm font-sans", className)}>
      <div className="space-y-4 px-3 flex flex-col items-center text-center">
        {/* Line 1: Table · Sunburst · Clusters */}
        <div className="flex flex-wrap gap-x-1.5 justify-center text-slate-600">
          <Link href="/table" className="hover:text-blue-600 hover:underline" onClick={onNavigate}>
            table
          </Link>
          <span className="text-slate-300">·</span>
          <Link href="/sunburst" className="hover:text-blue-600 hover:underline" onClick={onNavigate}>
            sunburst
          </Link>
          <span className="text-slate-300">·</span>
          <Link href="/similarity" className="hover:text-blue-600 hover:underline" onClick={onNavigate}>
            clusters
          </Link>
        </div>

        {/* Line 2: LW post · Gestalt · Data */}
        <div className="flex flex-wrap gap-x-1.5 justify-center text-slate-600">
          <span className="text-slate-400 cursor-not-allowed" title="URL TBD">
            LW post
          </span>
          <span className="text-slate-300">·</span>
          <a
            href="https://www.lesswrong.com/posts/Q9ewXs8pQSAX5vL7H/ai-in-2025-gestalt"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 hover:underline"
            onClick={onNavigate}
          >
            gestalt
          </a>
          <span className="text-slate-300">·</span>
          <Link href="/data" className="hover:text-blue-600 hover:underline" onClick={onNavigate}>
            Data
          </Link>
        </div>

        {/* Line 3: Problems · Target Cases · Approaches */}
        <div className="flex flex-wrap gap-x-1.5 justify-center text-slate-600">
          <Link href="/orthodox-problems" className="hover:text-blue-600 hover:underline" onClick={onNavigate}>
            problems
          </Link>
          <span className="text-slate-300">·</span>
          <Link href="/target-cases" className="hover:text-blue-600 hover:underline" onClick={onNavigate}>
            target cases
          </Link>
          <span className="text-slate-300">·</span>
          <Link href="/broad-approaches" className="hover:text-blue-600 hover:underline" onClick={onNavigate}>
            approaches
          </Link>
        </div>
      </div>
    </div>
  );
}
