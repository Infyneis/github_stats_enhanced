// GitHub API Types

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  topics: string[];
  size: number;
  default_branch: string;
  fork: boolean;
  archived: boolean;
}

export interface GitHubEvent {
  id: string;
  type: string;
  created_at: string;
  repo: {
    id: number;
    name: string;
    url: string;
  };
  payload: {
    action?: string;
    ref?: string;
    ref_type?: string;
    commits?: Array<{
      sha: string;
      message: string;
      author: {
        name: string;
        email: string;
      };
    }>;
    size?: number;
    distinct_size?: number;
    pull_request?: {
      id: number;
      title: string;
      state: string;
      merged: boolean;
    };
    issue?: {
      id: number;
      title: string;
      state: string;
    };
    review?: {
      id: number;
      state: string;
    };
    comment?: {
      id: number;
      body: string;
    };
  };
}

export interface LanguageStats {
  [language: string]: number;
}

export interface ContributionDay {
  date: string;
  count: number;
  level: number; // 0-4 intensity level
}

export interface ContributionCalendar {
  totalContributions: number;
  days: ContributionDay[];
}

// Computed/Aggregated Types

export interface UserStats {
  totalCommits: number;
  totalPRs: number;
  totalPRsMerged: number;
  totalIssues: number;
  totalIssuesClosed: number;
  totalReviews: number;
  totalStars: number;
  totalForks: number;
  totalRepos: number;
  languages: LanguageStats;
  currentStreak: number;
  longestStreak: number;
  contributionsByDay: DailyContribution[];
  contributionsByHour: number[];
  contributionsByDayOfWeek: number[];
  peakProductivity: PeakProductivity;
  biggestDay: { date: string; count: number };
  biggestWeek: { startDate: string; count: number };
  biggestMonth: { month: string; count: number };
  velocity: VelocityData;
  collaborators: Collaborator[];
  repoHealth: RepoHealth[];
}

export interface DailyContribution {
  date: string;
  count: number;
  commits: number;
  prs: number;
  issues: number;
  reviews: number;
}

export interface PeakProductivity {
  hour: number;
  dayOfWeek: number;
  label: string; // "Night Owl", "Early Bird", etc.
}

export interface VelocityData {
  daily: number[];
  weekly: number[];
  monthly: number[];
  trend: 'increasing' | 'stable' | 'decreasing';
  average: number;
}

export interface Collaborator {
  username: string;
  avatarUrl: string;
  interactions: number;
  repos: string[];
}

export interface RepoHealth {
  name: string;
  fullName: string;
  score: number;
  factors: {
    recentActivity: number;
    issueResponseRate: number;
    stars: number;
    hasReadme: boolean;
    hasLicense: boolean;
  };
  trend: 'improving' | 'stable' | 'declining';
}

// Gamification Types

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: BadgeCategory;
  rarity: BadgeRarity;
  criteria: BadgeCriteria;
  earned: boolean;
  earnedDate?: string;
  progress?: number;
}

export type BadgeCategory =
  | 'productivity'
  | 'consistency'
  | 'collaboration'
  | 'impact'
  | 'velocity'
  | 'milestone';

export type BadgeRarity =
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'epic'
  | 'legendary';

export interface BadgeCriteria {
  type: string;
  threshold: number;
  comparison: 'gte' | 'lte' | 'eq' | 'percent';
}

export interface LevelInfo {
  level: number;
  title: string;
  currentXP: number;
  xpForNextLevel: number;
  xpProgress: number;
  totalXP: number;
}

// Prediction Types

export interface Predictions {
  commits30Days: {
    predicted: number;
    confidence: [number, number];
    trend: 'increasing' | 'stable' | 'decreasing';
  };
  streakProbability: {
    next7Days: number;
    next14Days: number;
    next30Days: number;
  };
  milestones: Milestone[];
  productiveDays: ProductiveDayPrediction[];
}

export interface Milestone {
  name: string;
  current: number;
  target: number;
  estimatedDays: number;
  estimatedDate: string;
}

export interface ProductiveDayPrediction {
  date: string;
  dayOfWeek: string;
  probability: number;
  likelihood: 'high' | 'medium' | 'low';
}

// Date Range Types

export type DateRangePreset =
  | '7d'
  | '30d'
  | '90d'
  | '365d'
  | 'year'
  | 'all';

export interface DateRange {
  start: Date;
  end: Date;
  preset?: DateRangePreset;
}

// Comparison Types

export interface ComparisonData {
  users: string[];
  stats: Record<string, UserStats>;
  winners: Record<string, string>;
  competitionScores: Record<string, number>;
  overallWinner: string;
}
