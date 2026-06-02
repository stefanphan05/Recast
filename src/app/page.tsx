"use client";

import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import RewriteWorkspace from "@/components/rewrite/RewriteWorkspace";

export default function Home() {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <AppHeader />
      <div className="flex min-h-0 flex-1 flex-col px-5 pb-2 pt-14 sm:pb-4 sm:pt-24">
        <RewriteWorkspace />
      </div>
      <div className="shrink-0">
        <Footer />
      </div>
    </div>
  );
}
