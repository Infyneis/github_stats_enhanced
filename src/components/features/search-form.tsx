"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { isValidUsername } from "@/lib/github-api";

export function SearchForm() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      setError("Please enter a GitHub username");
      return;
    }

    if (!isValidUsername(trimmedUsername)) {
      setError("Invalid GitHub username format");
      return;
    }

    setIsLoading(true);
    router.push(`/${trimmedUsername}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 via-purple-500/50 to-pink-500/50 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative flex items-center gap-2 p-2 rounded-xl bg-background border border-border shadow-lg">
          <div className="flex items-center gap-2 flex-1 px-3">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Enter GitHub username..."
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-lg placeholder:text-muted-foreground/60"
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            size="lg"
            className="rounded-lg px-6 gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          >
            {isLoading ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span className="hidden sm:inline">Analyze</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </Button>
        </div>
      </div>
      {error && (
        <p className="mt-3 text-sm text-red-500 text-center animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
      <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Sparkles className="h-4 w-4" />
        <span>Try: octocat, torvalds, gaearon</span>
      </div>
    </form>
  );
}
