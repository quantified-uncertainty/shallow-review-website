import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shallow Review of Technical AI Safety, 2025",
  description: "A comprehensive taxonomy of AI safety research with paper links organized into hierarchical categories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}
