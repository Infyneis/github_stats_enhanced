"use client";

import useSWR from "swr";
import {
  fetchUser,
  fetchAllUserRepos,
  fetchAllUserEvents,
  fetchUserLanguages,
  getRateLimitInfo,
} from "@/lib/github-api";
import { calculateUserStats, createDateRange } from "@/lib/stats-calculator";
import { calculateXP, calculateLevel, calculateBadges } from "@/lib/gamification";
import { calculatePredictions } from "@/lib/predictions";
import type {
  GitHubUser,
  GitHubRepo,
  UserStats,
  LevelInfo,
  Badge,
  Predictions,
  DateRangePreset,
} from "@/types/github";
import { useState, useMemo, useCallback } from "react";

interface UseGitHubDataResult {
  user: GitHubUser | null;
  repos: GitHubRepo[];
  stats: UserStats | null;
  levelInfo: LevelInfo | null;
  badges: Badge[];
  predictions: Predictions | null;
  isLoading: boolean;
  error: Error | null;
  dateRange: DateRangePreset;
  setDateRange: (range: DateRangePreset) => void;
  rateLimitInfo: ReturnType<typeof getRateLimitInfo>;
  refresh: () => void;
}

async function fetchGitHubData(username: string) {
  const [user, repos, events] = await Promise.all([
    fetchUser(username),
    fetchAllUserRepos(username),
    fetchAllUserEvents(username),
  ]);

  const languages = await fetchUserLanguages(username, repos);

  return { user, repos, events, languages };
}

export function useGitHubData(username: string): UseGitHubDataResult {
  const [dateRange, setDateRange] = useState<DateRangePreset>("year");

  const { data, error, isLoading, mutate } = useSWR(
    username ? ["github-data", username] : null,
    () => fetchGitHubData(username),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // 1 minute
    }
  );

  const computedData = useMemo(() => {
    if (!data) {
      return {
        stats: null,
        levelInfo: null,
        badges: [],
        predictions: null,
      };
    }

    const range = createDateRange(dateRange);
    const stats = calculateUserStats(
      data.user,
      data.repos,
      data.events,
      data.languages,
      range
    );

    const totalXP = calculateXP(stats);
    const levelInfo = calculateLevel(totalXP);
    const badges = calculateBadges(stats);
    const predictions = calculatePredictions(stats, levelInfo);

    return { stats, levelInfo, badges, predictions };
  }, [data, dateRange]);

  const refresh = useCallback(() => {
    mutate();
  }, [mutate]);

  return {
    user: data?.user || null,
    repos: data?.repos || [],
    stats: computedData.stats,
    levelInfo: computedData.levelInfo,
    badges: computedData.badges,
    predictions: computedData.predictions,
    isLoading,
    error: error || null,
    dateRange,
    setDateRange,
    rateLimitInfo: getRateLimitInfo(),
    refresh,
  };
}

// Hook for comparison mode
export function useComparisonData(usernames: string[]) {
  const results = usernames.map((username) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useGitHubData(username);
  });

  const isLoading = results.some((r) => r.isLoading);
  const hasError = results.some((r) => r.error);

  return {
    users: results.map((r) => ({
      user: r.user,
      stats: r.stats,
      levelInfo: r.levelInfo,
    })),
    isLoading,
    hasError,
  };
}
