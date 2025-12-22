"use client";

import { useState } from "react";
import { UserStats, GitHubUser, LevelInfo } from "@/types/github";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Swords,
  Trophy,
  Plus,
  X,
  GitCommit,
  GitPullRequest,
  Star,
  Flame,
  Code,
  Users,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { calculateCompetitionScore } from "@/lib/gamification";

interface ComparisonUser {
  user: GitHubUser;
  stats: UserStats;
  levelInfo: LevelInfo;
}

interface ComparisonViewProps {
  primaryUser: ComparisonUser;
  opponents: ComparisonUser[];
  onAddOpponent: (username: string) => void;
  onRemoveOpponent: (username: string) => void;
  isLoading?: boolean;
}

interface ComparisonMetric {
  label: string;
  icon: React.ReactNode;
  getValue: (stats: UserStats) => number;
  format?: (value: number) => string;
}

const METRICS: ComparisonMetric[] = [
  {
    label: "Commits",
    icon: <GitCommit className="h-4 w-4" />,
    getValue: (s) => s.totalCommits,
  },
  {
    label: "Pull Requests",
    icon: <GitPullRequest className="h-4 w-4" />,
    getValue: (s) => s.totalPRs,
  },
  {
    label: "Stars",
    icon: <Star className="h-4 w-4" />,
    getValue: (s) => s.totalStars,
  },
  {
    label: "Streak",
    icon: <Flame className="h-4 w-4" />,
    getValue: (s) => s.longestStreak,
    format: (v) => `${v} days`,
  },
  {
    label: "Languages",
    icon: <Code className="h-4 w-4" />,
    getValue: (s) => Object.keys(s.languages).length,
  },
  {
    label: "Repositories",
    icon: <Users className="h-4 w-4" />,
    getValue: (s) => s.totalRepos,
  },
];

const COLORS = [
  { text: "text-blue-500", border: "border-blue-500", bg: "bg-blue-500", ring: "ring-blue-500/50" },
  { text: "text-red-500", border: "border-red-500", bg: "bg-red-500", ring: "ring-red-500/50" },
  { text: "text-green-500", border: "border-green-500", bg: "bg-green-500", ring: "ring-green-500/50" },
  { text: "text-purple-500", border: "border-purple-500", bg: "bg-purple-500", ring: "ring-purple-500/50" },
];

export function ComparisonView({
  primaryUser,
  opponents,
  onAddOpponent,
  onRemoveOpponent,
  isLoading,
}: ComparisonViewProps) {
  const [newUsername, setNewUsername] = useState("");

  const allUsers = [primaryUser, ...opponents];

  // Calculate scores
  const scores = allUsers.map((u) => ({
    username: u.user.login,
    score: calculateCompetitionScore(u.stats),
  }));

  const maxScore = Math.max(...scores.map((s) => s.score));
  const winner = scores.find((s) => s.score === maxScore)?.username;

  const handleAddOpponent = () => {
    if (newUsername.trim() && opponents.length < 3) {
      onAddOpponent(newUsername.trim());
      setNewUsername("");
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Swords className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">Battle Mode</CardTitle>
          </div>
          {opponents.length > 0 && winner && (
            <Badge variant="outline" className="gap-1.5 bg-yellow-500/10 border-yellow-500/30">
              <Trophy className="h-3 w-3 text-yellow-500" />
              <span className="text-yellow-600 dark:text-yellow-400">@{winner}</span>
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-2">
        {/* User avatars row */}
        <div className="flex items-center justify-center gap-6 mb-8 flex-wrap">
          {allUsers.map((u, index) => {
            const isWinner = winner === u.user.login && opponents.length > 0;
            const color = COLORS[index % COLORS.length];
            return (
              <div key={u.user.login} className="relative group flex flex-col items-center">
                {/* Winner crown */}
                {isWinner && (
                  <Trophy className="absolute -top-4 h-5 w-5 text-yellow-500 z-10" />
                )}

                {/* Avatar container with assigned color */}
                <div className={cn(
                  "relative rounded-full p-1",
                  color.bg,
                  isWinner && "ring-2 ring-yellow-400 ring-offset-2 ring-offset-background"
                )}>
                  <Avatar className="h-14 w-14 border-2 border-background">
                    <AvatarImage src={u.user.avatar_url} />
                    <AvatarFallback className="text-sm">{u.user.login.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>

                  {/* Remove button - only for opponents */}
                  {index > 0 && (
                    <button
                      onClick={() => onRemoveOpponent(u.user.login)}
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/90"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>

                {/* Username & level */}
                <p className={cn(
                  "text-sm font-medium mt-2",
                  color.text
                )}>
                  @{u.user.login}
                </p>
                <p className="text-xs text-muted-foreground">
                  Lvl {u.levelInfo.level}
                </p>
              </div>
            );
          })}

          {/* Add opponent */}
          {opponents.length < 3 && (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Add opponent..."
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddOpponent()}
                  className="w-36 h-9"
                  disabled={isLoading}
                />
                <Button
                  size="sm"
                  onClick={handleAddOpponent}
                  disabled={!newUsername.trim() || isLoading}
                  className="h-9 px-3"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Competition score */}
        {opponents.length > 0 && (
          <>
            <div className="mb-6">
              <h4 className="text-sm font-medium text-center text-muted-foreground mb-3">
                Competition Score
              </h4>
              <div className="space-y-2">
                {scores
                  .sort((a, b) => b.score - a.score)
                  .map((s, index) => {
                    const user = allUsers.find((u) => u.user.login === s.username);
                    const percentage = (s.score / maxScore) * 100;
                    return (
                      <div key={s.username} className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user?.user.avatar_url} />
                          <AvatarFallback>{s.username.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">
                              @{s.username}
                            </span>
                            <span className="text-sm font-bold flex items-center gap-1">
                              {index === 0 && <Zap className="h-3 w-3 text-yellow-500" />}
                              {s.score.toLocaleString()}
                            </span>
                          </div>
                          <Progress
                            value={percentage}
                            className={cn(
                              "h-2",
                              index === 0 && "[&>div]:bg-gradient-to-r [&>div]:from-yellow-400 [&>div]:to-orange-500"
                            )}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Metric comparisons */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-center text-muted-foreground">
                Head-to-Head Metrics
              </h4>
              {METRICS.map((metric) => {
                const values = allUsers.map((u) => ({
                  username: u.user.login,
                  value: metric.getValue(u.stats),
                }));
                const maxValue = Math.max(...values.map((v) => v.value));
                const metricWinner = values.find((v) => v.value === maxValue)?.username;

                return (
                  <div key={metric.label} className="p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2 mb-2">
                      {metric.icon}
                      <span className="text-sm font-medium">{metric.label}</span>
                      <Badge
                        variant="outline"
                        className="ml-auto text-xs gap-1"
                      >
                        <Trophy className="h-3 w-3 text-yellow-500" />
                        @{metricWinner}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {values.map((v, index) => {
                        const color = COLORS[index % COLORS.length];
                        return (
                          <div
                            key={v.username}
                            className={cn(
                              "text-center p-2 rounded-lg",
                              v.value === maxValue
                                ? "bg-primary/10 ring-1 ring-primary"
                                : "bg-muted/50"
                            )}
                          >
                            <p className={cn("text-lg font-bold", color.text)}>
                              {metric.format
                                ? metric.format(v.value)
                                : v.value.toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              @{v.username}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {opponents.length === 0 && (
          <div className="text-center py-8">
            <Swords className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">
              Add an opponent to start comparing stats!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
