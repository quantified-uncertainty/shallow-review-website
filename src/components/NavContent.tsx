"use client";

import Link from "next/link";
import { cn, getNameWithoutParentheses } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import ArbLogo from "./ArbLogo";
import { getSectionColors } from "@/constants/colors";

interface SectionInfo {
  id: string;
  name: string;
}

interface NavContentProps {
  onNavigate?: () => void;
  className?: string;
  sections?: SectionInfo[];
}

export default function NavContent({ onNavigate, className, sections = [] }: NavContentProps) {
  return (
    <div className={cn("py-4 font-sans h-full flex flex-col", className)}>
      <div className="space-y-6 px-3 flex flex-col items-center text-center flex-1">
        {/* Main Views */}
        <div className="space-y-3">
          <div className="flex flex-wrap gap-x-2.5 gap-y-1.5 justify-center text-slate-700">
            <Link href="/table" className="hover:text-blue-600 font-semibold text-base transition-colors" onClick={onNavigate}>
              table
            </Link>
            <span className="text-slate-300 font-bold">·</span>
            <Link href="/sunburst" className="hover:text-blue-600 font-semibold text-base transition-colors" onClick={onNavigate}>
              sunburst
            </Link>
            <span className="text-slate-300 font-bold">·</span>
            <Link href="/similarity" className="hover:text-blue-600 font-semibold text-base transition-colors" onClick={onNavigate}>
              clusters
            </Link>
          </div>

          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">
              classifications
            </span>
            <div className="flex flex-wrap gap-x-2.5 gap-y-1.5 justify-center text-slate-700">
              <Link href="/orthodox-problems" className="hover:text-blue-600 font-semibold text-sm transition-colors" onClick={onNavigate}>
                problems
              </Link>
              <span className="text-slate-300 font-bold">·</span>
              <Link href="/target-cases" className="hover:text-blue-600 font-semibold text-sm transition-colors" onClick={onNavigate}>
                target cases
              </Link>
              <span className="text-slate-300 font-bold">·</span>
              <Link href="/broad-approaches" className="hover:text-blue-600 font-semibold text-sm transition-colors" onClick={onNavigate}>
                approaches
              </Link>
            </div>
          </div>
        </div>

        {/* External Links */}
        <div className="space-y-2 flex flex-col items-center text-sm">
          <span className="flex items-center gap-1.5 text-slate-400 cursor-not-allowed font-medium" title="URL TBD">
            LessWrong post
            <ExternalLink className="w-3.5 h-3.5" />
          </span>
          
          <a
            href="https://www.lesswrong.com/posts/Q9ewXs8pQSAX5vL7H/ai-in-2025-gestalt"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-slate-700 hover:text-blue-600 font-semibold transition-colors"
            onClick={onNavigate}
          >
            AI in 2025: gestalt
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Internal Pages - Single Line */}
        <div className="flex flex-wrap gap-x-2.5 gap-y-1.5 justify-center text-slate-700 text-sm">
          <Link href="/methodology" className="hover:text-blue-600 font-semibold transition-colors" onClick={onNavigate}>
            Methods
          </Link>
          <span className="text-slate-300 font-bold">·</span>
          <Link href="/data" className="hover:text-blue-600 font-semibold transition-colors" onClick={onNavigate}>
            Data
          </Link>
          <span className="text-slate-300 font-bold">·</span>
          <Link href="/about" className="hover:text-blue-600 font-semibold transition-colors" onClick={onNavigate}>
            About
          </Link>
        </div>

        {/* Categories (Sections) - Colorful Buttons */}
        {sections.length > 0 && (
          <div className="pt-6 border-t-2 border-slate-200 w-full">
             <div className="space-y-2.5 flex flex-col px-0">
                {sections.map(s => {
                  const colors = getSectionColors(s.id);
                  return (
                    <Link
                      key={s.id}
                      href={`/${s.id}`}
                      className={`w-full ${colors.bg} text-white px-5 py-3.5 rounded-xl font-bold text-sm transition-all hover:shadow-lg hover:scale-[1.02] active:scale-100 flex items-center justify-between group`}
                      onClick={onNavigate}
                    >
                      <span className="text-left leading-tight">{getNameWithoutParentheses(s.name)}</span>
                      <svg className="w-4 h-4 opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  );
                })}
             </div>
          </div>
        )}
      </div>
      
      {/* Arb Logo */}
      <div className="mt-auto pt-8 pb-4 flex justify-center border-t-2 border-slate-200">
        <a 
          href="https://arb.research" 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-4 hover:opacity-70 transition-opacity"
        >
           <ArbLogo />
        </a>
      </div>
    </div>
  );
}
