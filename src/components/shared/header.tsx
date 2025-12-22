"use client";

import Link from "next/link";
import { Github, BarChart3 } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <BarChart3 className="h-7 w-7 text-primary transition-transform group-hover:scale-110" />
            <div className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            GitStats
          </span>
          <span className="hidden sm:inline-block text-xs font-medium text-muted-foreground px-2 py-0.5 rounded-full bg-muted">
            Enhanced
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <Github className="h-5 w-5" />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
