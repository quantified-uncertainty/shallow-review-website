import Link from "next/link";
import { APP_TITLE } from "@/constants/app";
import { Route, AlertTriangle, Waypoints, Landmark } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold hover:text-gray-200">
            {APP_TITLE}
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/about" className="text-gray-300 hover:text-white">
              About
            </Link>
            <Link href="/methodology" className="text-gray-300 hover:text-white">
              Methodology
            </Link>
            <Link href="/" className="text-gray-300 hover:text-white inline-flex items-center gap-1.5">
              <Route className="w-4 h-4" />
              Agendas
            </Link>
            <Link href="/orthodox-problems" className="text-gray-300 hover:text-white inline-flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              Problems
            </Link>
            <Link href="/broad-approaches" className="text-gray-300 hover:text-white inline-flex items-center gap-1.5">
              <Waypoints className="w-4 h-4" />
              Approaches
            </Link>
            <Link href="/funders" className="text-gray-300 hover:text-white inline-flex items-center gap-1.5">
              <Landmark className="w-4 h-4" />
              Funders
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
