"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
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
    <div className={cn("py-4 text-sm font-sans h-full flex flex-col", className)}>
      <div className="space-y-6 px-3 flex flex-col items-center text-center flex-1">
        {/* Main Views */}
        <div className="space-y-2">
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

          <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">
              classifications
            </span>
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

        {/* External Links */}
        <div className="space-y-2 flex flex-col items-center">
          <span className="flex items-center gap-1 text-slate-400 cursor-not-allowed" title="URL TBD">
            LessWrong post
            <ExternalLink className="w-3 h-3" />
          </span>
          
          <a
            href="https://www.lesswrong.com/posts/Q9ewXs8pQSAX5vL7H/ai-in-2025-gestalt"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-slate-600 hover:text-blue-600 hover:underline"
            onClick={onNavigate}
          >
            AI in 2025: gestalt
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Internal Pages - Single Line */}
        <div className="flex flex-wrap gap-x-1.5 justify-center text-slate-600">
          <Link href="/methodology" className="hover:text-blue-600 hover:underline" onClick={onNavigate}>
            Methods
          </Link>
          <span className="text-slate-300">·</span>
          <Link href="/data" className="hover:text-blue-600 hover:underline" onClick={onNavigate}>
            Data
          </Link>
          <span className="text-slate-300">·</span>
          <Link href="/about" className="hover:text-blue-600 hover:underline" onClick={onNavigate}>
            About
          </Link>
        </div>

        {/* Categories (Sections) */}
        {sections.length > 0 && (
          <div className="pt-4 border-t border-slate-100 w-full">
             <div className="space-y-2 flex flex-col items-center text-slate-600">
                {sections.map(s => {
                  const colors = getSectionColors(s.id);
                  return (
                    <Link 
                      key={s.id} 
                      href={`/${s.id}`} 
                      className={`${colors.navHover} hover:underline font-medium transition-colors flex items-center gap-2`}
                      onClick={onNavigate}
                    >
                      <span className={`inline-block w-2 h-2 rounded-full ${colors.dot}`}></span>
                      {s.name}
                    </Link>
                  );
                })}
             </div>
          </div>
        )}
      </div>
      
      {/* Arb Logo */}
      <div className="mt-auto pt-8 pb-4 flex justify-center">
        <a href="https://arb.research" target="_blank" rel="noopener noreferrer">
           <ArbLogo />
        </a>
      </div>
    </div>
  );
}
