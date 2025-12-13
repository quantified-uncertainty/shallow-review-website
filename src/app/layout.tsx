import type { Metadata } from "next";
import { Crimson_Pro, Inter } from "next/font/google";
import "./globals.css";
import { APP_TITLE, APP_DESCRIPTION } from "@/constants/app";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";

const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  variable: "--font-crimson",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: APP_TITLE,
  description: APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${crimsonPro.variable} ${inter.variable}`}>
      <body className="antialiased bg-slate-50 text-slate-800 font-serif">
        <Sidebar />
        <MobileHeader />
        <div className="md:pl-96 min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
