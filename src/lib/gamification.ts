import type { Badge, BadgeCategory, BadgeRarity, LevelInfo, UserStats } from "@/types/github";

// XP Awards
const XP_VALUES = {
  commit: 10,
  prOpened: 25,
  prMerged: 50,
  prReview: 20,
  issueOpened: 15,
  issueClosed: 30,
  starReceived: 5,
  forkReceived: 10,
};

// Level thresholds
const LEVEL_THRESHOLDS = [
  0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5000, // 1-10
  6500, 8000, 10000, 12500, 15000, 18000, 22000, 27000, 33000, 40000, // 11-20
  50000, 62000, 75000, 90000, 110000, 135000, 165000, 200000, 250000, 310000, // 21-30
  380000, 460000, 550000, 660000, 790000, 940000, 1100000, 1300000, 1550000, 1850000, // 31-40
  2200000, 2600000, 3100000, 3700000, 4400000, 5200000, 6100000, 7200000, 8500000, 10000000, // 41-50
];

const LEVEL_TITLES: Record<number, string> = {
  1: "Code Newbie",
  5: "Junior Developer",
  10: "Developer",
  15: "Senior Developer",
  20: "Lead Developer",
  25: "Staff Engineer",
  30: "Principal Engineer",
  35: "Distinguished Engineer",
  40: "Architect",
  45: "Senior Architect",
  50: "Code Wizard",
  60: "Code Master",
  75: "GitHub Master",
  90: "GitHub Legend",
  100: "GitHub God",
};

export function calculateXP(stats: UserStats): number {
  return (
    stats.totalCommits * XP_VALUES.commit +
    stats.totalPRs * XP_VALUES.prOpened +
    stats.totalPRsMerged * XP_VALUES.prMerged +
    stats.totalReviews * XP_VALUES.prReview +
    stats.totalIssues * XP_VALUES.issueOpened +
    stats.totalIssuesClosed * XP_VALUES.issueClosed +
    stats.totalStars * XP_VALUES.starReceived +
    stats.totalForks * XP_VALUES.forkReceived
  );
}

export function calculateLevel(totalXP: number): LevelInfo {
  let level = 1;

  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (totalXP >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
    } else {
      break;
    }
  }

  // Cap at 100
  level = Math.min(level, 100);

  const currentLevelXP = LEVEL_THRESHOLDS[level - 1] || 0;
  const nextLevelXP = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];

  const xpInCurrentLevel = totalXP - currentLevelXP;
  const xpNeededForNextLevel = nextLevelXP - currentLevelXP;
  const progress = Math.min(100, (xpInCurrentLevel / xpNeededForNextLevel) * 100);

  // Get title
  let title = "Code Newbie";
  const titleLevels = Object.keys(LEVEL_TITLES)
    .map(Number)
    .sort((a, b) => b - a);

  for (const titleLevel of titleLevels) {
    if (level >= titleLevel) {
      title = LEVEL_TITLES[titleLevel];
      break;
    }
  }

  return {
    level,
    title,
    currentXP: xpInCurrentLevel,
    xpForNextLevel: xpNeededForNextLevel,
    xpProgress: progress,
    totalXP,
  };
}

// Badge definitions
const BADGE_DEFINITIONS: Omit<Badge, "earned" | "earnedDate" | "progress">[] = [
  // Productivity
  {
    id: "night-owl",
    name: "Night Owl",
    description: "40%+ of commits between 10 PM - 6 AM",
    icon: "moon",
    category: "productivity",
    rarity: "uncommon",
    criteria: { type: "nightCommitPercent", threshold: 40, comparison: "gte" },
  },
  {
    id: "early-bird",
    name: "Early Bird",
    description: "40%+ of commits between 5 AM - 9 AM",
    icon: "sunrise",
    category: "productivity",
    rarity: "uncommon",
    criteria: { type: "morningCommitPercent", threshold: 40, comparison: "gte" },
  },
  {
    id: "9-to-5",
    name: "9-to-5 Grind",
    description: "60%+ of commits during business hours",
    icon: "briefcase",
    category: "productivity",
    rarity: "common",
    criteria: { type: "businessHoursPercent", threshold: 60, comparison: "gte" },
  },
  {
    id: "weekend-warrior",
    name: "Weekend Warrior",
    description: "50%+ of commits on weekends",
    icon: "calendar",
    category: "productivity",
    rarity: "rare",
    criteria: { type: "weekendCommitPercent", threshold: 50, comparison: "gte" },
  },

  // Consistency
  {
    id: "week-streak",
    name: "Week Streak",
    description: "7 consecutive days with commits",
    icon: "flame",
    category: "consistency",
    rarity: "common",
    criteria: { type: "streak", threshold: 7, comparison: "gte" },
  },
  {
    id: "month-streak",
    name: "Month Streak",
    description: "30 consecutive days with commits",
    icon: "flame",
    category: "consistency",
    rarity: "uncommon",
    criteria: { type: "streak", threshold: 30, comparison: "gte" },
  },
  {
    id: "100-day-streak",
    name: "100 Day Streak",
    description: "100 consecutive days with commits",
    icon: "flame",
    category: "consistency",
    rarity: "rare",
    criteria: { type: "streak", threshold: 100, comparison: "gte" },
  },
  {
    id: "365-day-streak",
    name: "Year-Long Streak",
    description: "365 consecutive days with commits",
    icon: "flame",
    category: "consistency",
    rarity: "epic",
    criteria: { type: "streak", threshold: 365, comparison: "gte" },
  },

  // Collaboration
  {
    id: "code-reviewer",
    name: "Code Reviewer",
    description: "10+ PRs reviewed",
    icon: "eye",
    category: "collaboration",
    rarity: "common",
    criteria: { type: "reviews", threshold: 10, comparison: "gte" },
  },
  {
    id: "team-player",
    name: "Team Player",
    description: "50+ PRs reviewed",
    icon: "users",
    category: "collaboration",
    rarity: "uncommon",
    criteria: { type: "reviews", threshold: 50, comparison: "gte" },
  },
  {
    id: "review-master",
    name: "Review Master",
    description: "200+ PRs reviewed",
    icon: "award",
    category: "collaboration",
    rarity: "rare",
    criteria: { type: "reviews", threshold: 200, comparison: "gte" },
  },

  // Impact
  {
    id: "first-star",
    name: "First Star",
    description: "Received your first star",
    icon: "star",
    category: "impact",
    rarity: "common",
    criteria: { type: "stars", threshold: 1, comparison: "gte" },
  },
  {
    id: "rising-star",
    name: "Rising Star",
    description: "100+ total stars",
    icon: "star",
    category: "impact",
    rarity: "uncommon",
    criteria: { type: "stars", threshold: 100, comparison: "gte" },
  },
  {
    id: "star-collector",
    name: "Star Collector",
    description: "1,000+ total stars",
    icon: "star",
    category: "impact",
    rarity: "rare",
    criteria: { type: "stars", threshold: 1000, comparison: "gte" },
  },
  {
    id: "superstar",
    name: "Superstar",
    description: "10,000+ total stars",
    icon: "star",
    category: "impact",
    rarity: "epic",
    criteria: { type: "stars", threshold: 10000, comparison: "gte" },
  },
  {
    id: "polyglot",
    name: "Polyglot",
    description: "Used 5+ programming languages",
    icon: "code",
    category: "impact",
    rarity: "uncommon",
    criteria: { type: "languages", threshold: 5, comparison: "gte" },
  },
  {
    id: "language-master",
    name: "Language Master",
    description: "Used 10+ programming languages",
    icon: "code",
    category: "impact",
    rarity: "rare",
    criteria: { type: "languages", threshold: 10, comparison: "gte" },
  },

  // Velocity
  {
    id: "productive-day",
    name: "Productive Day",
    description: "10+ commits in one day",
    icon: "zap",
    category: "velocity",
    rarity: "common",
    criteria: { type: "biggestDay", threshold: 10, comparison: "gte" },
  },
  {
    id: "sprint",
    name: "Sprint",
    description: "50+ commits in one week",
    icon: "zap",
    category: "velocity",
    rarity: "uncommon",
    criteria: { type: "biggestWeek", threshold: 50, comparison: "gte" },
  },
  {
    id: "speed-demon",
    name: "Speed Demon",
    description: "100+ commits in one week",
    icon: "zap",
    category: "velocity",
    rarity: "rare",
    criteria: { type: "biggestWeek", threshold: 100, comparison: "gte" },
  },

  // Milestones
  {
    id: "beginner",
    name: "Beginner",
    description: "100+ total commits",
    icon: "git-commit",
    category: "milestone",
    rarity: "common",
    criteria: { type: "commits", threshold: 100, comparison: "gte" },
  },
  {
    id: "intermediate",
    name: "Intermediate",
    description: "1,000+ total commits",
    icon: "git-commit",
    category: "milestone",
    rarity: "uncommon",
    criteria: { type: "commits", threshold: 1000, comparison: "gte" },
  },
  {
    id: "advanced",
    name: "Advanced",
    description: "5,000+ total commits",
    icon: "git-commit",
    category: "milestone",
    rarity: "rare",
    criteria: { type: "commits", threshold: 5000, comparison: "gte" },
  },
  {
    id: "expert",
    name: "Expert",
    description: "10,000+ total commits",
    icon: "git-commit",
    category: "milestone",
    rarity: "epic",
    criteria: { type: "commits", threshold: 10000, comparison: "gte" },
  },
  {
    id: "legend",
    name: "Legend",
    description: "50,000+ total commits",
    icon: "git-commit",
    category: "milestone",
    rarity: "legendary",
    criteria: { type: "commits", threshold: 50000, comparison: "gte" },
  },
  {
    id: "repo-creator",
    name: "Repository Creator",
    description: "10+ public repositories",
    icon: "folder",
    category: "milestone",
    rarity: "common",
    criteria: { type: "repos", threshold: 10, comparison: "gte" },
  },
  {
    id: "prolific",
    name: "Prolific",
    description: "50+ public repositories",
    icon: "folder",
    category: "milestone",
    rarity: "uncommon",
    criteria: { type: "repos", threshold: 50, comparison: "gte" },
  },
];

function getStatValue(stats: UserStats, type: string): number {
  const hourlyTotal = stats.contributionsByHour.reduce((a, b) => a + b, 0);
  const weekdayTotal = stats.contributionsByDayOfWeek.reduce((a, b) => a + b, 0);

  switch (type) {
    case "nightCommitPercent":
      if (hourlyTotal === 0) return 0;
      const nightCommits =
        stats.contributionsByHour.slice(22, 24).reduce((a, b) => a + b, 0) +
        stats.contributionsByHour.slice(0, 6).reduce((a, b) => a + b, 0);
      return (nightCommits / hourlyTotal) * 100;

    case "morningCommitPercent":
      if (hourlyTotal === 0) return 0;
      const morningCommits = stats.contributionsByHour.slice(5, 9).reduce((a, b) => a + b, 0);
      return (morningCommits / hourlyTotal) * 100;

    case "businessHoursPercent":
      if (hourlyTotal === 0) return 0;
      const businessCommits = stats.contributionsByHour.slice(9, 17).reduce((a, b) => a + b, 0);
      return (businessCommits / hourlyTotal) * 100;

    case "weekendCommitPercent":
      if (weekdayTotal === 0) return 0;
      const weekendCommits = stats.contributionsByDayOfWeek[0] + stats.contributionsByDayOfWeek[6];
      return (weekendCommits / weekdayTotal) * 100;

    case "streak":
      return stats.longestStreak;

    case "reviews":
      return stats.totalReviews;

    case "stars":
      return stats.totalStars;

    case "languages":
      return Object.keys(stats.languages).length;

    case "biggestDay":
      return stats.biggestDay.count;

    case "biggestWeek":
      return stats.biggestWeek.count;

    case "commits":
      return stats.totalCommits;

    case "repos":
      return stats.totalRepos;

    default:
      return 0;
  }
}

export function calculateBadges(stats: UserStats): Badge[] {
  return BADGE_DEFINITIONS.map((badgeDef) => {
    const value = getStatValue(stats, badgeDef.criteria.type);
    const threshold = badgeDef.criteria.threshold;

    let earned = false;
    let progress = 0;

    switch (badgeDef.criteria.comparison) {
      case "gte":
        earned = value >= threshold;
        progress = Math.min(100, (value / threshold) * 100);
        break;
      case "lte":
        earned = value <= threshold;
        progress = earned ? 100 : 0;
        break;
      case "eq":
        earned = value === threshold;
        progress = earned ? 100 : 0;
        break;
      case "percent":
        earned = value >= threshold;
        progress = Math.min(100, value);
        break;
    }

    return {
      ...badgeDef,
      earned,
      progress,
    };
  });
}

export function getRarityColor(rarity: BadgeRarity): string {
  switch (rarity) {
    case "common":
      return "text-gray-500 bg-gray-100 dark:bg-gray-800";
    case "uncommon":
      return "text-green-600 bg-green-100 dark:bg-green-900";
    case "rare":
      return "text-blue-600 bg-blue-100 dark:bg-blue-900";
    case "epic":
      return "text-purple-600 bg-purple-100 dark:bg-purple-900";
    case "legendary":
      return "text-amber-500 bg-amber-100 dark:bg-amber-900";
  }
}

export function getCategoryIcon(category: BadgeCategory): string {
  switch (category) {
    case "productivity":
      return "clock";
    case "consistency":
      return "flame";
    case "collaboration":
      return "users";
    case "impact":
      return "star";
    case "velocity":
      return "zap";
    case "milestone":
      return "trophy";
  }
}

// Competition scoring
export function calculateCompetitionScore(stats: UserStats): number {
  return (
    stats.totalCommits * 1 +
    stats.totalPRs * 2 +
    stats.totalStars * 3 +
    stats.longestStreak * 5 +
    Object.keys(stats.languages).length * 10 +
    stats.totalRepos * 1
  );
}
