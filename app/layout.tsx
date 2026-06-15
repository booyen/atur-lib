import type { Metadata } from "next";
import { Sora, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/shell/AppShell";
import { Toaster } from "@/components/ui/sonner";
import { getAllSections, getCategories } from "@/lib/sections";

const sora = Sora({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Atur — Web Section Library",
  description:
    "A curated library of copy-paste web sections. Grab the HTML/Tailwind code or copy a ready-made AI prompt.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sections = getAllSections();
  const categories = getCategories().map((name) => ({
    name,
    count: sections.filter((s) => s.category === name).length,
  }));

  return (
    <html
      lang="en"
      className={`dark ${sora.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <AppShell categories={categories} total={sections.length}>
          {children}
        </AppShell>
        <Toaster />
      </body>
    </html>
  );
}
