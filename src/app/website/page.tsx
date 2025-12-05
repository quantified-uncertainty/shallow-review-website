import Link from "next/link";
import { Metadata } from "next";
import { APP_SHORT_TITLE, GITHUB_REPO_URL, GITHUB_DATA_URL } from "@/constants/app";
import Header from "@/components/Header";
import { ChevronRight, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: `Website | ${APP_SHORT_TITLE}`,
  description:
    "Technical details about how this website is built and maintained",
};

export default function WebsitePage() {
  const techStack = [
    { name: "Next.js 15", url: "https://nextjs.org/", description: "React framework with App Router" },
    { name: "React 19", url: "https://react.dev/", description: "UI library" },
    { name: "TypeScript", url: "https://www.typescriptlang.org/", description: "Type-safe JavaScript" },
    { name: "Tailwind CSS", url: "https://tailwindcss.com/", description: "Utility-first CSS framework" },
    { name: "Lucide Icons", url: "https://lucide.dev/", description: "Icon library" },
    { name: "shadcn/ui", url: "https://ui.shadcn.com/", description: "UI component library" },
  ];

  const dataFormats = [
    { name: "YAML", description: "Primary data format for agendas, researchers, funders, and classifications" },
    { name: "JSON", description: "Lookup tables and cached data (e.g., LessWrong tags)" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-700">Website</span>
        </nav>

        <h1 className="text-4xl font-bold text-gray-900 mb-2">Website</h1>
        <p className="text-gray-600 text-lg mb-8">
          Technical details about how this website is built
        </p>

        <div className="prose prose-gray max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Source Code</h2>
            <p className="text-gray-700 mb-4">
              The source code for this website is available on GitHub:
            </p>
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              View on GitHub
              <ExternalLink className="w-4 h-4" />
            </a>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Architecture</h2>
            <p className="text-gray-700 mb-4">
              All content is stored as structured data files, making it easy to update and maintain:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              {dataFormats.map((format) => (
                <li key={format.name}>
                  <strong>{format.name}:</strong> {format.description}
                </li>
              ))}
            </ul>
            <p className="text-gray-700 mt-4">
              The site is fully statically generated at build time. There is no database or server-side
              rendering — all pages are pre-rendered HTML files that can be served from any CDN.
            </p>
            <a
              href={GITHUB_DATA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:underline mt-4"
            >
              Browse the data files on GitHub
              <ExternalLink className="w-4 h-4" />
            </a>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Development</h2>
            <p className="text-gray-700 mb-4">
              The website was developed with assistance from Claude Code, an AI coding assistant.
              Most of the codebase was written or edited through conversational prompts.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <p className="text-blue-800 text-sm">
                <strong>Contributing:</strong> If you notice errors in the data or have suggestions
                for improvements, please open an issue or pull request on GitHub.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tech Stack</h2>
            <p className="text-gray-700 mb-4">
              This website is a statically-generated site built with modern web technologies:
            </p>
            <div className="grid gap-3 mt-4">
              {techStack.map((tech) => (
                <div key={tech.name} className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                  <div>
                    <a
                      href={tech.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      {tech.name}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <p className="text-gray-600 text-sm">{tech.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="border-t border-gray-200 pt-8">
            <p className="text-gray-600">
              See also:{" "}
              <Link href="/about" className="text-blue-600 hover:underline">
                About this review
              </Link>
              {" · "}
              <Link href="/methodology" className="text-blue-600 hover:underline">
                Methodology
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
