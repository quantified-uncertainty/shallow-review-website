"use client";

import Link from "next/link";
import {
  Route,
  AlertTriangle,
  Waypoints,
  Landmark,
  ChevronDown,
  Tags,
  Users,
  Crosshair,
  Info,
  BookOpen,
  Globe,
  Database,
  Network,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function HeaderNav() {
  return (
    <nav className="flex items-center gap-6 text-sm">
      <Link
        href="/"
        className="text-gray-300 hover:text-white inline-flex items-center gap-1.5"
      >
        <Route className="w-4 h-4" />
        Agendas
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger className="text-gray-300 hover:text-white inline-flex items-center gap-1 focus:outline-none">
          Classifications
          <ChevronDown className="w-4 h-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuItem asChild>
            <Link
              href="/orthodox-problems"
              className="flex items-center gap-2 cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4" />
              Problems
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/broad-approaches"
              className="flex items-center gap-2 cursor-pointer"
            >
              <Waypoints className="w-4 h-4" />
              Approaches
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/target-cases"
              className="flex items-center gap-2 cursor-pointer"
            >
              <Crosshair className="w-4 h-4" />
              Target Cases
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/keywords"
              className="flex items-center gap-2 cursor-pointer"
            >
              <Tags className="w-4 h-4" />
              Keywords
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/similarity"
              className="flex items-center gap-2 cursor-pointer"
            >
              <Network className="w-4 h-4" />
              Similarity Graph
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger className="text-gray-300 hover:text-white inline-flex items-center gap-1 focus:outline-none">
          Entities
          <ChevronDown className="w-4 h-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuItem asChild>
            <Link
              href="/funders"
              className="flex items-center gap-2 cursor-pointer"
            >
              <Landmark className="w-4 h-4" />
              Funders
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/researchers"
              className="flex items-center gap-2 cursor-pointer"
            >
              <Users className="w-4 h-4" />
              Researchers
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger className="text-gray-300 hover:text-white inline-flex items-center gap-1 focus:outline-none">
          About
          <ChevronDown className="w-4 h-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem asChild>
            <Link
              href="/about"
              className="flex items-center gap-2 cursor-pointer"
            >
              <Info className="w-4 h-4" />
              About
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/methodology"
              className="flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              Methodology
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/website"
              className="flex items-center gap-2 cursor-pointer"
            >
              <Globe className="w-4 h-4" />
              Website
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a
              href="https://github.com/quantified-uncertainty/shallow-review-website/tree/main/src/data"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 cursor-pointer"
            >
              <Database className="w-4 h-4" />
              Source Files
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
