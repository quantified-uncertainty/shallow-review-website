"use client";

import { Section } from "@/data/types";

interface CategoryNavProps {
  sections: Section[];
  activeSection?: string;
}

export default function CategoryNav({ sections, activeSection }: CategoryNavProps) {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="sticky top-4">
      <h2 className="font-bold text-lg mb-4">Sections</h2>
      <ul className="space-y-2">
        {sections.map((section) => (
          <li key={section.id}>
            <button
              onClick={() => scrollToSection(section.id)}
              className={`text-left w-full px-3 py-2 rounded-md text-sm transition-colors ${
                activeSection === section.id
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              {section.name}
              <span className="text-gray-400 ml-2 text-xs">
                ({section.agendas.length})
              </span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
