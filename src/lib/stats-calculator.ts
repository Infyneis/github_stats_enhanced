import type {
  GitHubUser,
  GitHubRepo,
  GitHubEvent,
  UserStats,
  DailyContribution,
  PeakProductivity,
  VelocityData,
  Collaborator,
  RepoHealth,
  LanguageStats,
  DateRange,
  ContributionCalendar,
} from "@/types/github";
import {
  format,
  parseISO,
  differenceInDays,
  startOfDay,
  startOfWeek,
  startOfMonth,
  eachDayOfInterval,
  subDays,
  isWithinInterval,
  getHours,
  getDay,
} from "date-fns";

export function calculateUserStats(
  user: GitHubUser,
  repos: GitHubRepo[],
  events: GitHubEvent[],
  languages: LanguageStats,
  dateRange: DateRange,
  contributions?: ContributionCalendar
): UserStats {
  // Filter events by date range
  const filteredEvents = events.filter((event) => {
    const eventDate = parseISO(event.created_at);
    return isWithinInterval(eventDate, { start: dateRange.start, end: dateRange.end });
  });

  // Calculate commits from contribution calendar (more accurate) or events (fallback)
  const pushEvents = filteredEvents.filter((e) => e.type === "PushEvent");

  // Use contribution calendar for accurate commit count
  let totalCommits = 0;
  if (contributions && contributions.days.length > 0) {
    // Filter contributions by date range
    const filteredContributions = contributions.days.filter((day) => {
      const dayDate = parseISO(day.date);
      return isWithinInterval(dayDate, { start: dateRange.start, end: dateRange.end });
    });
    totalCommits = filteredContributions.reduce((sum, day) => sum + day.count, 0);
  } else {
    // Fallback to events API
    totalCommits = pushEvents.reduce(
      (sum, e) => sum + (e.payload.commits?.length || 0),
      0
    );
  }

  // Calculate PRs
  const prEvents = filteredEvents.filter((e) => e.type === "PullRequestEvent");
  const totalPRs = prEvents.filter((e) => e.payload.action === "opened").length;
  const totalPRsMerged = prEvents.filter(
    (e) => e.payload.pull_request?.merged
  ).length;

  // Calculate Issues
  const issueEvents = filteredEvents.filter((e) => e.type === "IssuesEvent");
  const totalIssues = issueEvents.filter((e) => e.payload.action === "opened").length;
  const totalIssuesClosed = issueEvents.filter(
    (e) => e.payload.action === "closed"
  ).length;

  // Calculate Reviews
  const reviewEvents = filteredEvents.filter(
    (e) => e.type === "PullRequestReviewEvent"
  );
  const totalReviews = reviewEvents.length;

  // Calculate Stars and Forks from repos
  const ownRepos = repos.filter((r) => !r.fork);
  const totalStars = ownRepos.reduce((sum, r) => sum + r.stargazers_count, 0);
  const totalForks = ownRepos.reduce((sum, r) => sum + r.forks_count, 0);

  // Contributions by day - use calendar data if available
  const contributionsByDay = calculateDailyContributions(
    filteredEvents,
    dateRange,
    contributions
  );

  // Contributions by hour - use ALL events (not filtered) since Events API is limited to ~90 days
  // This gives us the best picture of productivity patterns
  const allPushEvents = events.filter((e) => e.type === "PushEvent");
  const contributionsByHour = calculateHourlyContributions(allPushEvents);

  // Contributions by day of week - also use all events
  const contributionsByDayOfWeek = calculateDayOfWeekContributions(allPushEvents);

  // Streaks
  const { currentStreak, longestStreak } = calculateStreaks(contributionsByDay);

  // Peak productivity - based on all events for better pattern detection
  const peakProductivity = determinePeakProductivity(
    contributionsByHour,
    contributionsByDayOfWeek
  );

  // Biggest periods
  const biggestDay = findBiggestDay(contributionsByDay);
  const biggestWeek = findBiggestWeek(contributionsByDay);
  const biggestMonth = findBiggestMonth(contributionsByDay);

  // Velocity
  const velocity = calculateVelocity(contributionsByDay);

  // Collaborators
  const collaborators = extractCollaborators(filteredEvents);

  // Repo health
  const repoHealth = calculateRepoHealth(ownRepos);

  return {
    totalCommits,
    totalPRs,
    totalPRsMerged,
    totalIssues,
    totalIssuesClosed,
    totalReviews,
    totalStars,
    totalForks,
    totalRepos: ownRepos.length,
    languages,
    currentStreak,
    longestStreak,
    contributionsByDay,
    contributionsByHour,
    contributionsByDayOfWeek,
    peakProductivity,
    biggestDay,
    biggestWeek,
    biggestMonth,
    velocity,
    collaborators,
    repoHealth,
  };
}

function calculateDailyContributions(
  events: GitHubEvent[],
  dateRange: DateRange,
  contributions?: ContributionCalendar
): DailyContribution[] {
  const days = eachDayOfInterval({ start: dateRange.start, end: dateRange.end });
  const contributionMap = new Map<string, DailyContribution>();

  // Initialize all days
  days.forEach((day) => {
    const dateStr = format(day, "yyyy-MM-dd");
    contributionMap.set(dateStr, {
      date: dateStr,
      count: 0,
      commits: 0,
      prs: 0,
      issues: 0,
      reviews: 0,
    });
  });

  // First, populate from contribution calendar if available (more accurate for commits)
  if (contributions && contributions.days.length > 0) {
    contributions.days.forEach((day) => {
      const contribution = contributionMap.get(day.date);
      if (contribution) {
        contribution.commits = day.count;
        contribution.count = day.count;
      }
    });
  }

  // Then, overlay events data (for PRs, issues, reviews, and commits if no calendar)
  events.forEach((event) => {
    const dateStr = format(parseISO(event.created_at), "yyyy-MM-dd");
    const contribution = contributionMap.get(dateStr);
    if (!contribution) return;

    if (event.type === "PushEvent") {
      // Only add commits from events if we don't have calendar data
      if (!contributions || contributions.days.length === 0) {
        const commitCount = event.payload.commits?.length || 0;
        contribution.commits += commitCount;
        contribution.count += commitCount;
      }
    } else if (event.type === "PullRequestEvent") {
      contribution.prs++;
      contribution.count++;
    } else if (event.type === "IssuesEvent") {
      contribution.issues++;
      contribution.count++;
    } else if (event.type === "PullRequestReviewEvent") {
      contribution.reviews++;
      contribution.count++;
    }
  });

  return Array.from(contributionMap.values()).sort(
    (a, b) => a.date.localeCompare(b.date)
  );
}

function calculateHourlyContributions(pushEvents: GitHubEvent[]): number[] {
  const hours = new Array(24).fill(0);
  pushEvents.forEach((event) => {
    const hour = getHours(parseISO(event.created_at));
    // Count commits if available, otherwise count the push event itself as 1
    const count = event.payload.commits?.length || event.payload.size || 1;
    hours[hour] += count;
  });
  return hours;
}

function calculateDayOfWeekContributions(pushEvents: GitHubEvent[]): number[] {
  const days = new Array(7).fill(0);
  pushEvents.forEach((event) => {
    const day = getDay(parseISO(event.created_at));
    // Count commits if available, otherwise count the push event itself as 1
    const count = event.payload.commits?.length || event.payload.size || 1;
    days[day] += count;
  });
  return days;
}

function calculateStreaks(
  contributions: DailyContribution[]
): { currentStreak: number; longestStreak: number } {
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  // Sort by date descending for current streak
  const sorted = [...contributions].sort((a, b) => b.date.localeCompare(a.date));

  // Calculate current streak (from today backwards)
  for (const contribution of sorted) {
    if (contribution.count > 0) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Calculate longest streak
  const chronological = [...contributions].sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  for (const contribution of chronological) {
    if (contribution.count > 0) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }

  return { currentStreak, longestStreak };
}

function determinePeakProductivity(
  hourly: number[],
  dayOfWeek: number[]
): PeakProductivity {
  const peakHour = hourly.indexOf(Math.max(...hourly));
  const peakDay = dayOfWeek.indexOf(Math.max(...dayOfWeek));

  // Determine label
  let label = "Day Worker";
  const nightCommits = hourly.slice(22, 24).reduce((a, b) => a + b, 0) +
    hourly.slice(0, 6).reduce((a, b) => a + b, 0);
  const morningCommits = hourly.slice(5, 9).reduce((a, b) => a + b, 0);
  const dayCommits = hourly.slice(9, 17).reduce((a, b) => a + b, 0);
  const eveningCommits = hourly.slice(17, 22).reduce((a, b) => a + b, 0);
  const weekendCommits = dayOfWeek[0] + dayOfWeek[6];
  const weekdayCommits = dayOfWeek.slice(1, 6).reduce((a, b) => a + b, 0);

  const total = hourly.reduce((a, b) => a + b, 0);

  if (total === 0) {
    label = "Getting Started";
  } else if (nightCommits / total > 0.4) {
    label = "Night Owl";
  } else if (morningCommits / total > 0.3) {
    label = "Early Bird";
  } else if (weekendCommits / (weekendCommits + weekdayCommits) > 0.5) {
    label = "Weekend Warrior";
  } else if (eveningCommits / total > 0.4) {
    label = "Evening Coder";
  } else if (dayCommits / total > 0.6) {
    label = "9-to-5 Developer";
  }

  return { hour: peakHour, dayOfWeek: peakDay, label };
}

function findBiggestDay(
  contributions: DailyContribution[]
): { date: string; count: number } {
  const biggest = contributions.reduce(
    (max, c) => (c.commits > max.count ? { date: c.date, count: c.commits } : max),
    { date: "", count: 0 }
  );
  return biggest;
}

function findBiggestWeek(
  contributions: DailyContribution[]
): { startDate: string; count: number } {
  const weeklyTotals = new Map<string, number>();

  contributions.forEach((c) => {
    const weekStart = format(startOfWeek(parseISO(c.date)), "yyyy-MM-dd");
    weeklyTotals.set(weekStart, (weeklyTotals.get(weekStart) || 0) + c.commits);
  });

  let biggest = { startDate: "", count: 0 };
  weeklyTotals.forEach((count, startDate) => {
    if (count > biggest.count) {
      biggest = { startDate, count };
    }
  });

  return biggest;
}

function findBiggestMonth(
  contributions: DailyContribution[]
): { month: string; count: number } {
  const monthlyTotals = new Map<string, number>();

  contributions.forEach((c) => {
    const month = format(parseISO(c.date), "yyyy-MM");
    monthlyTotals.set(month, (monthlyTotals.get(month) || 0) + c.commits);
  });

  let biggest = { month: "", count: 0 };
  monthlyTotals.forEach((count, month) => {
    if (count > biggest.count) {
      biggest = { month, count };
    }
  });

  return biggest;
}

function calculateVelocity(contributions: DailyContribution[]): VelocityData {
  const daily = contributions.map((c) => c.commits);

  // Calculate weekly averages
  const weekly: number[] = [];
  for (let i = 0; i < contributions.length; i += 7) {
    const weekSlice = contributions.slice(i, i + 7);
    const weekTotal = weekSlice.reduce((sum, c) => sum + c.commits, 0);
    weekly.push(weekTotal);
  }

  // Calculate monthly averages
  const monthlyMap = new Map<string, number>();
  contributions.forEach((c) => {
    const month = format(parseISO(c.date), "yyyy-MM");
    monthlyMap.set(month, (monthlyMap.get(month) || 0) + c.commits);
  });
  const monthly = Array.from(monthlyMap.values());

  // Determine trend from last 4 weeks
  const recentWeeks = weekly.slice(-4);
  let trend: "increasing" | "stable" | "decreasing" = "stable";

  if (recentWeeks.length >= 2) {
    const firstHalf = recentWeeks.slice(0, Math.floor(recentWeeks.length / 2));
    const secondHalf = recentWeeks.slice(Math.floor(recentWeeks.length / 2));
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

    if (secondAvg > firstAvg * 1.1) trend = "increasing";
    else if (secondAvg < firstAvg * 0.9) trend = "decreasing";
  }

  const average = daily.length > 0
    ? daily.reduce((a, b) => a + b, 0) / daily.length
    : 0;

  return { daily, weekly, monthly, trend, average };
}

function extractCollaborators(events: GitHubEvent[]): Collaborator[] {
  const collaboratorMap = new Map<
    string,
    { interactions: number; repos: Set<string> }
  >();

  events.forEach((event) => {
    if (
      event.type === "PullRequestEvent" ||
      event.type === "PullRequestReviewEvent"
    ) {
      // Extract repo name as a proxy for collaboration
      const repoName = event.repo.name;
      const existing = collaboratorMap.get(repoName) || {
        interactions: 0,
        repos: new Set<string>(),
      };
      existing.interactions++;
      existing.repos.add(repoName);
      collaboratorMap.set(repoName, existing);
    }
  });

  // Note: GitHub public events API doesn't expose other users' info directly
  // This is a simplified version - in reality you'd need more API calls
  return [];
}

function calculateRepoHealth(repos: GitHubRepo[]): RepoHealth[] {
  return repos
    .slice(0, 10)
    .map((repo) => {
      const daysSinceUpdate = differenceInDays(
        new Date(),
        parseISO(repo.pushed_at)
      );

      // Calculate factors
      const recentActivity = Math.max(0, 100 - daysSinceUpdate * 2);
      const stars = Math.min(100, repo.stargazers_count);
      const issueResponseRate = repo.open_issues_count === 0 ? 100 :
        Math.max(0, 100 - repo.open_issues_count * 5);

      // Overall score (weighted)
      const score = Math.round(
        recentActivity * 0.4 +
        stars * 0.3 +
        issueResponseRate * 0.3
      );

      // Determine trend based on days since update
      let trend: "improving" | "stable" | "declining" = "stable";
      if (daysSinceUpdate < 7) trend = "improving";
      else if (daysSinceUpdate > 90) trend = "declining";

      return {
        name: repo.name,
        fullName: repo.full_name,
        score,
        factors: {
          recentActivity,
          issueResponseRate,
          stars,
          hasReadme: true, // Would need additional API call
          hasLicense: true, // Would need additional API call
        },
        trend,
      };
    })
    .sort((a, b) => b.score - a.score);
}

// Utility to create date range
export function createDateRange(preset: string): DateRange {
  const end = new Date();
  let start: Date;

  switch (preset) {
    case "7d":
      start = subDays(end, 7);
      break;
    case "30d":
      start = subDays(end, 30);
      break;
    case "90d":
      start = subDays(end, 90);
      break;
    case "365d":
      start = subDays(end, 365);
      break;
    case "year":
      start = new Date(end.getFullYear(), 0, 1);
      break;
    case "all":
    default:
      start = subDays(end, 365 * 5); // 5 years
      break;
  }

  return { start: startOfDay(start), end: startOfDay(end) };
}
