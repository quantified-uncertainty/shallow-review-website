import Link from "next/link";
import { APP_TITLE } from "@/constants/app";

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
            <Link href="/" className="text-gray-300 hover:text-white">
              Agendas
            </Link>
            <Link href="/orthodox-problems" className="text-gray-300 hover:text-white">
              Problems
            </Link>
            <Link href="/broad-approaches" className="text-gray-300 hover:text-white">
              Approaches
            </Link>
            <Link href="/funders" className="text-gray-300 hover:text-white">
              Funders
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
