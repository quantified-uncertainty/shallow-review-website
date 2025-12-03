"use client";

import { useEffect, useState } from "react";
import {
  Lightbulb,
  Tag,
  Users,
  FileText,
  BookOpen,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface TOCItem {
  id: string;
  label: string;
  icon?: string;
  count?: number;
}

const iconMap: Record<string, LucideIcon> = {
  "theory-of-change": Lightbulb,
  "classification": Tag,
  "people-funding": Users,
  "online-info": BookOpen,
  "papers": FileText,
};

interface TableOfContentsProps {
  items: TOCItem[];
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first section that is intersecting
        const intersecting = entries.filter((entry) => entry.isIntersecting);
        if (intersecting.length > 0) {
          // Sort by their position in the viewport, pick the topmost
          const sorted = intersecting.sort((a, b) => {
            return a.boundingClientRect.top - b.boundingClientRect.top;
          });
          setActiveId(sorted[0].target.id);
        }
      },
      {
        rootMargin: "-80px 0px -70% 0px",
        threshold: 0,
      }
    );

    // Observe all sections
    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [items]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Account for any fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // Update URL hash without jumping
      window.history.pushState(null, "", `#${id}`);
    }
  };

  return (
    <nav>
      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
        Table of Contents
      </h4>
      <ul className="space-y-0.5">
        {items.map((item) => {
          const Icon = iconMap[item.id];
          const isActive = activeId === item.id;

          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                className={`flex items-center gap-2 text-sm py-2 px-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {Icon && (
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 ${
                      isActive ? "text-blue-600" : "text-gray-400"
                    }`}
                  />
                )}
                <span className="flex-1">{item.label}</span>
                {item.count !== undefined && (
                  <span
                    className={`text-xs ${
                      isActive ? "text-blue-500" : "text-gray-400"
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
