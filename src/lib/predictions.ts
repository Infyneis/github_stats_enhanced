import type {
  UserStats,
  Predictions,
  Milestone,
  ProductiveDayPrediction,
  LevelInfo,
} from "@/types/github";
import { format, addDays } from "date-fns";

// Linear regression helper
function linearRegression(data: number[]): { slope: number; intercept: number } {
  const n = data.length;
  if (n < 2) return { slope: 0, intercept: data[0] || 0 };

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;

  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += data[i];
    sumXY += i * data[i];
    sumX2 += i * i;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return { slope: isNaN(slope) ? 0 : slope, intercept: isNaN(intercept) ? 0 : intercept };
}

// Standard deviation helper
function standardDeviation(data: number[]): number {
  if (data.length === 0) return 0;
  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  const squaredDiffs = data.map((x) => Math.pow(x - mean, 2));
  return Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / data.length);
}

export function calculatePredictions(
  stats: UserStats,
  levelInfo: LevelInfo
): Predictions {
  return {
    commits30Days: predictCommits30Days(stats),
    streakProbability: predictStreakProbability(stats),
    milestones: predictMilestones(stats, levelInfo),
    productiveDays: predictProductiveDays(stats),
  };
}

function predictCommits30Days(stats: UserStats): Predictions["commits30Days"] {
  const dailyCommits = stats.contributionsByDay.map((d) => d.commits);

  // Use last 90 days for prediction
  const last90Days = dailyCommits.slice(-90);

  if (last90Days.length < 7) {
    return {
      predicted: 0,
      confidence: [0, 0],
      trend: "stable",
    };
  }

  const { slope, intercept } = linearRegression(last90Days);

  // Predict next 30 days
  let predicted = 0;
  for (let i = 0; i < 30; i++) {
    const dayIndex = last90Days.length + i;
    predicted += Math.max(0, slope * dayIndex + intercept);
  }
  predicted = Math.round(predicted);

  // Calculate confidence interval
  const stdDev = standardDeviation(last90Days);
  const confidence: [number, number] = [
    Math.max(0, Math.round(predicted - stdDev * 30)),
    Math.round(predicted + stdDev * 30),
  ];

  // Determine trend
  let trend: "increasing" | "stable" | "decreasing" = "stable";
  if (slope > 0.1) trend = "increasing";
  else if (slope < -0.1) trend = "decreasing";

  return { predicted, confidence, trend };
}

function predictStreakProbability(
  stats: UserStats
): Predictions["streakProbability"] {
  const contributions = stats.contributionsByDay;

  // Calculate historical streak breaks
  let totalDays = contributions.length;
  let activeDays = contributions.filter((c) => c.count > 0).length;

  if (totalDays === 0) {
    return { next7Days: 0, next14Days: 0, next30Days: 0 };
  }

  // Daily maintenance rate
  const dailyRate = activeDays / totalDays;

  // Probability of maintaining streak for N days
  const next7Days = Math.round(Math.pow(dailyRate, 7) * 100);
  const next14Days = Math.round(Math.pow(dailyRate, 14) * 100);
  const next30Days = Math.round(Math.pow(dailyRate, 30) * 100);

  return { next7Days, next14Days, next30Days };
}

function predictMilestones(stats: UserStats, levelInfo: LevelInfo): Milestone[] {
  const milestones: Milestone[] = [];

  // Calculate daily velocity
  const contributions = stats.contributionsByDay;
  const recentDays = contributions.slice(-30);
  const recentCommits = recentDays.reduce((sum, d) => sum + d.commits, 0);
  const dailyVelocity = recentDays.length > 0 ? recentCommits / recentDays.length : 0;

  // Daily XP velocity (rough estimate)
  const xpPerCommit = 10;
  const dailyXPVelocity = dailyVelocity * xpPerCommit;

  // Next level milestone
  if (levelInfo.level < 100) {
    const xpNeeded = levelInfo.xpForNextLevel - levelInfo.currentXP;
    const daysToLevel = dailyXPVelocity > 0
      ? Math.ceil(xpNeeded / dailyXPVelocity)
      : 365;

    milestones.push({
      name: `Level ${levelInfo.level + 1}`,
      current: levelInfo.currentXP,
      target: levelInfo.xpForNextLevel,
      estimatedDays: daysToLevel,
      estimatedDate: format(addDays(new Date(), daysToLevel), "MMM d, yyyy"),
    });
  }

  // Commit milestones
  const commitMilestones = [100, 500, 1000, 5000, 10000, 50000];
  for (const target of commitMilestones) {
    if (stats.totalCommits < target) {
      const remaining = target - stats.totalCommits;
      const daysToMilestone = dailyVelocity > 0
        ? Math.ceil(remaining / dailyVelocity)
        : 365;

      milestones.push({
        name: `${target.toLocaleString()} Commits`,
        current: stats.totalCommits,
        target,
        estimatedDays: daysToMilestone,
        estimatedDate: format(addDays(new Date(), daysToMilestone), "MMM d, yyyy"),
      });
      break;
    }
  }

  // Star milestones
  const starMilestones = [10, 50, 100, 500, 1000, 5000, 10000];
  for (const target of starMilestones) {
    if (stats.totalStars < target) {
      // Rough estimate - stars grow slower
      const remaining = target - stats.totalStars;
      const daysToMilestone = Math.ceil(remaining * 7); // Assume ~1 star per week

      milestones.push({
        name: `${target.toLocaleString()} Stars`,
        current: stats.totalStars,
        target,
        estimatedDays: daysToMilestone,
        estimatedDate: format(addDays(new Date(), daysToMilestone), "MMM d, yyyy"),
      });
      break;
    }
  }

  return milestones.slice(0, 5); // Top 5 milestones
}

function predictProductiveDays(stats: UserStats): ProductiveDayPrediction[] {
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayOfWeekTotals = stats.contributionsByDayOfWeek;
  const total = dayOfWeekTotals.reduce((a, b) => a + b, 0);

  if (total === 0) {
    return [];
  }

  const predictions: ProductiveDayPrediction[] = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = addDays(today, i);
    const dayOfWeek = date.getDay();
    const probability = Math.round((dayOfWeekTotals[dayOfWeek] / total) * 100);

    let likelihood: "high" | "medium" | "low" = "medium";
    if (probability > 20) likelihood = "high";
    else if (probability < 10) likelihood = "low";

    predictions.push({
      date: format(date, "yyyy-MM-dd"),
      dayOfWeek: dayNames[dayOfWeek],
      probability,
      likelihood,
    });
  }

  return predictions;
}

// Get prediction summary text
export function getPredictionSummary(predictions: Predictions): string[] {
  const summaries: string[] = [];

  // Commits prediction
  const { predicted, trend } = predictions.commits30Days;
  const trendEmoji = trend === "increasing" ? "📈" : trend === "decreasing" ? "📉" : "➡️";
  summaries.push(
    `${trendEmoji} Predicted ${predicted} commits in the next 30 days (${trend})`
  );

  // Streak probability
  const { next7Days, next30Days } = predictions.streakProbability;
  if (next7Days > 0) {
    summaries.push(
      `🔥 ${next7Days}% chance of maintaining your streak for 7 days`
    );
  }

  // Top productive day
  const productiveDays = predictions.productiveDays;
  if (productiveDays.length > 0) {
    const topDay = productiveDays.reduce((max, d) =>
      d.probability > max.probability ? d : max
    );
    summaries.push(
      `📅 Most likely to code on ${topDay.dayOfWeek} (${topDay.probability}% probability)`
    );
  }

  return summaries;
}
