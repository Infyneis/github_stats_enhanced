import type {
  GitHubUser,
  GitHubRepo,
  GitHubEvent,
  LanguageStats,
} from "@/types/github";

const GITHUB_API_BASE = "https://api.github.com";

// Simple in-memory cache
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }
  cache.delete(key);
  return null;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

interface RateLimitInfo {
  remaining: number;
  reset: Date;
  limit: number;
}

let rateLimitInfo: RateLimitInfo = {
  remaining: 60,
  reset: new Date(),
  limit: 60,
};

export function getRateLimitInfo(): RateLimitInfo {
  return rateLimitInfo;
}

async function fetchWithRateLimit<T>(url: string): Promise<T> {
  const cached = getCached<T>(url);
  if (cached) return cached;

  if (rateLimitInfo.remaining <= 0 && new Date() < rateLimitInfo.reset) {
    throw new Error(
      `Rate limit exceeded. Resets at ${rateLimitInfo.reset.toLocaleTimeString()}`
    );
  }

  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github.v3+json",
    },
    next: { revalidate: 300 }, // 5 minute revalidation
  });

  // Update rate limit info
  const remaining = response.headers.get("X-RateLimit-Remaining");
  const reset = response.headers.get("X-RateLimit-Reset");
  const limit = response.headers.get("X-RateLimit-Limit");

  if (remaining) rateLimitInfo.remaining = parseInt(remaining);
  if (reset) rateLimitInfo.reset = new Date(parseInt(reset) * 1000);
  if (limit) rateLimitInfo.limit = parseInt(limit);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("User not found");
    }
    if (response.status === 403) {
      throw new Error("Rate limit exceeded");
    }
    throw new Error(`GitHub API error: ${response.status}`);
  }

  const data = await response.json();
  setCache(url, data);
  return data;
}

export async function fetchUser(username: string): Promise<GitHubUser> {
  return fetchWithRateLimit<GitHubUser>(
    `${GITHUB_API_BASE}/users/${encodeURIComponent(username)}`
  );
}

export async function fetchUserRepos(
  username: string,
  page = 1,
  perPage = 100
): Promise<GitHubRepo[]> {
  return fetchWithRateLimit<GitHubRepo[]>(
    `${GITHUB_API_BASE}/users/${encodeURIComponent(username)}/repos?per_page=${perPage}&page=${page}&sort=updated`
  );
}

export async function fetchAllUserRepos(username: string): Promise<GitHubRepo[]> {
  const allRepos: GitHubRepo[] = [];
  let page = 1;
  const maxPages = 3; // Limit to 300 repos

  while (page <= maxPages) {
    const repos = await fetchUserRepos(username, page);
    allRepos.push(...repos);
    if (repos.length < 100) break;
    page++;
  }

  return allRepos;
}

export async function fetchUserEvents(
  username: string,
  page = 1,
  perPage = 100
): Promise<GitHubEvent[]> {
  return fetchWithRateLimit<GitHubEvent[]>(
    `${GITHUB_API_BASE}/users/${encodeURIComponent(username)}/events/public?per_page=${perPage}&page=${page}`
  );
}

export async function fetchAllUserEvents(username: string): Promise<GitHubEvent[]> {
  const allEvents: GitHubEvent[] = [];
  let page = 1;
  const maxPages = 3; // Limit to 300 events

  while (page <= maxPages) {
    const events = await fetchUserEvents(username, page);
    allEvents.push(...events);
    if (events.length < 100) break;
    page++;
  }

  return allEvents;
}

export async function fetchRepoLanguages(
  owner: string,
  repo: string
): Promise<LanguageStats> {
  return fetchWithRateLimit<LanguageStats>(
    `${GITHUB_API_BASE}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/languages`
  );
}

export async function fetchUserLanguages(
  username: string,
  repos: GitHubRepo[]
): Promise<LanguageStats> {
  const aggregatedLanguages: LanguageStats = {};

  // Get languages from top 10 most recently updated repos
  const topRepos = repos
    .filter((r) => !r.fork)
    .slice(0, 10);

  const languagePromises = topRepos.map((repo) =>
    fetchRepoLanguages(username, repo.name).catch(() => ({}))
  );

  const languageResults = await Promise.all(languagePromises);

  for (const langs of languageResults) {
    for (const [lang, bytes] of Object.entries(langs)) {
      aggregatedLanguages[lang] = (aggregatedLanguages[lang] || 0) + bytes;
    }
  }

  return aggregatedLanguages;
}

export function isValidUsername(username: string): boolean {
  const regex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;
  return regex.test(username);
}

export function clearCache(): void {
  cache.clear();
}
