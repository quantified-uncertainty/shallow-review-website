import Link from "next/link";
import { APP_TITLE } from "@/constants/app";
import HeaderNav from "./HeaderNav";

export default function Header() {
  return (
    <header className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold hover:text-gray-200">
            {APP_TITLE}
          </Link>
          <HeaderNav />
        </div>
      </div>
    </header>
  );
}
