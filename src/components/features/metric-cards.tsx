"use client";

import { UserStats } from "@/types/github";
import { Card, CardContent } from "@/components/ui/card";
import {
  GitCommit,
  GitPullRequest,
  AlertCircle,
  Star,
  GitFork,
  Eye,
  Flame,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardsProps {
  stats: UserStats;
}

interface MetricCardData {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  trend?: "up" | "down" | "stable";
  subValue?: string;
}

export function MetricCards({ stats }: MetricCardsProps) {
  const metrics: MetricCardData[] = [
    {
      label: "Total Commits",
      value: stats.totalCommits,
      icon: <GitCommit className="h-5 w-5" />,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      trend: stats.velocity.trend === "increasing" ? "up" : stats.velocity.trend === "decreasing" ? "down" : "stable",
    },
    {
      label: "Pull Requests",
      value: stats.totalPRs,
      icon: <GitPullRequest className="h-5 w-5" />,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      subValue: `${stats.totalPRsMerged} merged`,
    },
    {
      label: "Issues",
      value: stats.totalIssues,
      icon: <AlertCircle className="h-5 w-5" />,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      subValue: `${stats.totalIssuesClosed} closed`,
    },
    {
      label: "Code Reviews",
      value: stats.totalReviews,
      icon: <Eye className="h-5 w-5" />,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Stars Earned",
      value: stats.totalStars,
      icon: <Star className="h-5 w-5" />,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      label: "Forks",
      value: stats.totalForks,
      icon: <GitFork className="h-5 w-5" />,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
    },
    {
      label: "Current Streak",
      value: stats.currentStreak,
      icon: <Flame className="h-5 w-5" />,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      subValue: `Best: ${stats.longestStreak} days`,
    },
    {
      label: "Repositories",
      value: stats.totalRepos,
      icon: <GitFork className="h-5 w-5" />,
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <Card
          key={metric.label}
          className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {/* Background gradient on hover */}
          <div
            className={cn(
              "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
              metric.bgColor
            )}
          />

          <CardContent className="relative p-4 md:p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={cn("p-2 rounded-lg", metric.bgColor, metric.color)}>
                {metric.icon}
              </div>
              {metric.trend && (
                <div
                  className={cn(
                    "flex items-center gap-1 text-xs font-medium",
                    metric.trend === "up" && "text-green-500",
                    metric.trend === "down" && "text-red-500",
                    metric.trend === "stable" && "text-muted-foreground"
                  )}
                >
                  {metric.trend === "up" && <TrendingUp className="h-3 w-3" />}
                  {metric.trend === "down" && <TrendingDown className="h-3 w-3" />}
                  {metric.trend === "stable" && <Minus className="h-3 w-3" />}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <p className="text-2xl md:text-3xl font-bold tabular-nums">
                {metric.value.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              {metric.subValue && (
                <p className="text-xs text-muted-foreground/70">{metric.subValue}</p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
