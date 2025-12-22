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

const COLORS = ["text-blue-500", "text-red-500", "text-green-500", "text-purple-500"];

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
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Swords className="h-5 w-5" />
            <CardTitle className="text-lg">Battle Mode</CardTitle>
          </div>
          {opponents.length > 0 && (
            <Badge variant="secondary" className="gap-1">
              <Trophy className="h-3 w-3 text-yellow-500" />
              Winner: @{winner}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* User avatars row */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {allUsers.map((u, index) => (
            <div key={u.user.login} className="relative group">
              <div
                className={cn(
                  "absolute -inset-1 rounded-full blur opacity-50",
                  winner === u.user.login
                    ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                    : "bg-gradient-to-r from-gray-400 to-gray-600"
                )}
              />
              <Avatar className="relative h-16 w-16 border-2 border-background">
                <AvatarImage src={u.user.avatar_url} />
                <AvatarFallback>{u.user.login.slice(0, 2)}</AvatarFallback>
              </Avatar>
              {index > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onRemoveOpponent(u.user.login)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
              {winner === u.user.login && (
                <Trophy className="absolute -top-3 left-1/2 -translate-x-1/2 h-6 w-6 text-yellow-500" />
              )}
              <p className="text-center text-sm font-medium mt-2">
                @{u.user.login}
              </p>
              <p className="text-center text-xs text-muted-foreground">
                Lvl {u.levelInfo.level}
              </p>
            </div>
          ))}

          {/* VS dividers */}
          {opponents.length > 0 && (
            <div className="absolute left-1/2 -translate-x-1/2 hidden">
              <span className="text-xl font-black text-muted-foreground">VS</span>
            </div>
          )}

          {/* Add opponent */}
          {opponents.length < 3 && (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddOpponent()}
                  className="w-32"
                  disabled={isLoading}
                />
                <Button
                  size="icon"
                  onClick={handleAddOpponent}
                  disabled={!newUsername.trim() || isLoading}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-xs text-muted-foreground">Add opponent</span>
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
                      {values.map((v, index) => (
                        <div
                          key={v.username}
                          className={cn(
                            "text-center p-2 rounded-lg",
                            v.value === maxValue
                              ? "bg-primary/10 ring-1 ring-primary"
                              : "bg-muted/50"
                          )}
                        >
                          <p className={cn("text-lg font-bold", COLORS[index])}>
                            {metric.format
                              ? metric.format(v.value)
                              : v.value.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            @{v.username}
                          </p>
                        </div>
                      ))}
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
