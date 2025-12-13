"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { APP_TITLE, APP_DESCRIPTION } from "@/constants/app";
import NavContent from "./NavContent";
import { cn } from "@/lib/utils";

export default function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // If menu is open, don't hide the header
      if (isOpen) {
        setIsVisible(true);
        return;
      }

      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 64) {
        // Scrolling down & past header height
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        // Scrolling up
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 transition-transform duration-300 md:hidden",
          isVisible ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div className="flex items-center justify-between px-4 h-16">
          <Link 
            href="/" 
            className="font-bold text-lg text-gray-900 truncate pr-4"
            onClick={() => setIsOpen(false)}
          >
            {APP_TITLE}
          </Link>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-md focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Dropdown Menu Content */}
        {isOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-xl max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="p-4">
              <p className="text-sm text-gray-500 mb-4 px-3">
                {APP_DESCRIPTION}
              </p>
              <NavContent onNavigate={() => setIsOpen(false)} />
            </div>
          </div>
        )}
      </header>

      {/* Spacer for fixed header on mobile */}
      <div className="h-16 md:hidden" />
    </>
  );
}
