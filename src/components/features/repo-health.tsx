"use client";

import { RepoHealth } from "@/types/github";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Heart,
  TrendingUp,
  TrendingDown,
  Minus,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RepoHealthListProps {
  repos: RepoHealth[];
}

export function RepoHealthList({ repos }: RepoHealthListProps) {
  if (repos.length === 0) {
    return null;
  }

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-500";
    if (score >= 40) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBg = (score: number) => {
    if (score >= 70) return "[&>div]:bg-green-500";
    if (score >= 40) return "[&>div]:bg-yellow-500";
    return "[&>div]:bg-red-500";
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="h-3 w-3 text-green-500" />;
      case "declining":
        return <TrendingDown className="h-3 w-3 text-red-500" />;
      default:
        return <Minus className="h-3 w-3 text-muted-foreground" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-lg">Repository Health</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {repos.map((repo, index) => (
            <div
              key={repo.name}
              className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group"
            >
              {/* Rank */}
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-bold">
                {index + 1}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <a
                    href={`https://github.com/${repo.fullName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:text-primary transition-colors truncate flex items-center gap-1"
                  >
                    {repo.name}
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                  <Badge variant="outline" className="gap-1 text-xs">
                    {getTrendIcon(repo.trend)}
                    {repo.trend}
                  </Badge>
                </div>
                <Progress
                  value={repo.score}
                  className={cn("h-1.5", getScoreBg(repo.score))}
                />
              </div>

              {/* Score */}
              <div className={cn("text-2xl font-bold", getScoreColor(repo.score))}>
                {repo.score}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>Healthy (70+)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <span>Needs attention (40-69)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span>At risk (&lt;40)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
