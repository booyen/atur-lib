"use client";

import { useState } from "react";
import Link from "next/link";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { LibraryFilterProvider } from "./LibraryFilterContext";
import AppSidebar from "./AppSidebar";

type Props = {
  categories: { name: string; count: number }[];
  total: number;
  children: React.ReactNode;
};

export default function AppShell({ categories, total, children }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <LibraryFilterProvider>
      {/* Desktop rail */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border bg-card/30 md:block">
        <AppSidebar categories={categories} total={total} />
      </aside>

      {/* Mobile top bar + drawer */}
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur md:hidden">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-emerald-600 text-xs font-bold text-white">
            A
          </span>
          Atur
        </Link>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={<Button variant="ghost" size="icon" aria-label="Open menu" />}
          >
            <HamburgerMenuIcon className="size-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <AppSidebar categories={categories} total={total} onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main content */}
      <div className="flex min-h-[100dvh] flex-col md:pl-64">{children}</div>
    </LibraryFilterProvider>
  );
}
