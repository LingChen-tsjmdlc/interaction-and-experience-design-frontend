"use client";

import { Navbar } from "@/components/navbar";

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex flex-col min-h-screen">
      <Navbar />
      <main className="container mx-auto w-screen flex-grow pt-16">{children}</main>
      <footer className="w-full flex items-center justify-center py-3 text-default-400 text-sm">
        <span>© {new Date().getFullYear()} Jerry Lu. All rights reserved.</span>
      </footer>
    </div>
  );
}
