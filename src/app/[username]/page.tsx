"use client";

import { useRef, useState, useCallback, use } from "react";
import { useGitHubData } from "@/hooks/use-github-data";
import { ProfileHeader } from "@/components/features/profile-header";
import { LevelDisplay } from "@/components/features/level-display";
import { DateRangeSelector } from "@/components/features/date-range-selector";
import { MetricCards } from "@/components/features/metric-cards";
import { ContributionHeatmap } from "@/components/charts/contribution-heatmap";
import { ActivityChart } from "@/components/charts/activity-chart";
import { LanguageChart } from "@/components/charts/language-chart";
import { ProductivityHeatmap } from "@/components/charts/productivity-heatmap";
import { VelocityChart } from "@/components/charts/velocity-chart";
import { ProductivityBadge } from "@/components/features/productivity-badge";
import { BadgeWall } from "@/components/features/badge-wall";
import { PredictionsPanel } from "@/components/features/predictions-panel";
import { RepoHealthList } from "@/components/features/repo-health";
import { ComparisonView } from "@/components/features/comparison-view";
import { ExportShare } from "@/components/features/export-share";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { fetchUser, fetchAllUserRepos, fetchAllUserEvents, fetchUserLanguages, fetchContributionCalendar } from "@/lib/github-api";
import { calculateUserStats, createDateRange } from "@/lib/stats-calculator";
import { calculateXP, calculateLevel, calculateBadges } from "@/lib/gamification";
import { calculatePredictions } from "@/lib/predictions";
import type { GitHubUser, UserStats, LevelInfo } from "@/types/github";

interface ComparisonUser {
  user: GitHubUser;
  stats: UserStats;
  levelInfo: LevelInfo;
}

export default function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  const exportRef = useRef<HTMLDivElement>(null);
  const [opponents, setOpponents] = useState<ComparisonUser[]>([]);
  const [loadingOpponent, setLoadingOpponent] = useState(false);

  const {
    user,
    stats,
    levelInfo,
    badges,
    predictions,
    isLoading,
    error,
    dateRange,
    setDateRange,
    rateLimitInfo,
    refresh,
  } = useGitHubData(username);

  const handleAddOpponent = useCallback(async (opponentUsername: string) => {
    if (opponents.find((o) => o.user.login.toLowerCase() === opponentUsername.toLowerCase())) {
      return;
    }

    setLoadingOpponent(true);
    try {
      const [opponentUser, opponentRepos, opponentEvents, opponentContributions] = await Promise.all([
        fetchUser(opponentUsername),
        fetchAllUserRepos(opponentUsername),
        fetchAllUserEvents(opponentUsername),
        fetchContributionCalendar(opponentUsername),
      ]);

      const languages = await fetchUserLanguages(opponentUsername, opponentRepos);
      const range = createDateRange(dateRange);
      const opponentStats = calculateUserStats(
        opponentUser,
        opponentRepos,
        opponentEvents,
        languages,
        range,
        opponentContributions
      );
      const xp = calculateXP(opponentStats);
      const opponentLevel = calculateLevel(xp);

      setOpponents((prev) => [
        ...prev,
        { user: opponentUser, stats: opponentStats, levelInfo: opponentLevel },
      ]);
    } catch (err) {
      console.error("Failed to load opponent:", err);
    } finally {
      setLoadingOpponent(false);
    }
  }, [opponents, dateRange]);

  const handleRemoveOpponent = useCallback((opponentUsername: string) => {
    setOpponents((prev) =>
      prev.filter((o) => o.user.login !== opponentUsername)
    );
  }, []);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} username={username} />;
  }

  if (!user || !stats || !levelInfo || !predictions) {
    return <ErrorState error={new Error("User not found")} username={username} />;
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            API: {rateLimitInfo.remaining}/{rateLimitInfo.limit}
          </span>
          <Button variant="outline" size="sm" onClick={refresh} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <ExportShare username={username} exportRef={exportRef} />
        </div>
      </div>

      {/* Main content - exportable area */}
      <div ref={exportRef} className="space-y-8">
        {/* Profile header */}
        <ProfileHeader user={user} />

        {/* Level display */}
        <LevelDisplay levelInfo={levelInfo} />

        {/* Date range selector */}
        <div className="flex justify-center">
          <DateRangeSelector selected={dateRange} onChange={setDateRange} />
        </div>

        {/* Metric cards */}
        <MetricCards stats={stats} />

        {/* Productivity badge */}
        <ProductivityBadge
          productivity={stats.peakProductivity}
          biggestDay={stats.biggestDay}
          biggestWeek={stats.biggestWeek}
          biggestMonth={stats.biggestMonth}
        />

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ContributionHeatmap contributions={stats.contributionsByDay} />
          <ActivityChart contributions={stats.contributionsByDay} />
        </div>

        {/* More charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LanguageChart languages={stats.languages} />
          <VelocityChart velocity={stats.velocity} />
        </div>

        {/* Productivity heatmap */}
        <ProductivityHeatmap
          hourlyData={stats.contributionsByHour}
          dayOfWeekData={stats.contributionsByDayOfWeek}
        />

        {/* Badges and predictions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BadgeWall badges={badges} />
          <PredictionsPanel predictions={predictions} />
        </div>

        {/* Repo health */}
        <RepoHealthList repos={stats.repoHealth} />
      </div>

      {/* Comparison (outside exportable area) */}
      <ComparisonView
        primaryUser={{ user, stats, levelInfo }}
        opponents={opponents}
        onAddOpponent={handleAddOpponent}
        onRemoveOpponent={handleRemoveOpponent}
        isLoading={loadingOpponent}
      />
    </div>
  );
}

function LoadingState() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Skeleton className="h-40 w-full rounded-2xl" />
      <Skeleton className="h-32 w-full rounded-2xl" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-64 w-full rounded-2xl" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-80 rounded-2xl" />
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    </div>
  );
}

function ErrorState({ error, username }: { error: Error; username: string }) {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 text-destructive mb-6">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Oops!</h1>
        <p className="text-muted-foreground mb-6">
          {error.message === "User not found"
            ? `We couldn't find a GitHub user named "${username}".`
            : error.message.includes("Rate limit")
              ? "GitHub API rate limit exceeded. Please try again later."
              : "Something went wrong while fetching the data."}
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </Link>
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}
