import { NextResponse } from "next/server";
import type { ContributionCalendar, ContributionDay } from "@/types/github";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  try {
    // Fetch the GitHub profile page to get contribution data
    const year = new Date().getFullYear();
    const response = await fetch(
      `https://github.com/users/${username}/contributions?from=${year}-01-01&to=${year}-12-31`,
      {
        headers: {
          Accept: "text/html",
          "User-Agent": "GitHub-Stats-Enhanced",
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch contributions: ${response.status}`);
    }

    const html = await response.text();
    const calendar = parseContributionCalendar(html);

    return NextResponse.json(calendar);
  } catch (error) {
    console.error("Error fetching contributions:", error);
    return NextResponse.json(
      { error: "Failed to fetch contributions" },
      { status: 500 }
    );
  }
}

function parseContributionCalendar(html: string): ContributionCalendar {
  const days: ContributionDay[] = [];
  let totalContributions = 0;

  // First, get the total from the heading (most accurate)
  // Format: "919 contributions in 2025"
  const totalMatch = html.match(/(\d[\d,]*)\s+contributions?\s+in/i);
  if (totalMatch) {
    totalContributions = parseInt(totalMatch[1].replace(/,/g, ""), 10);
  }

  // Parse contribution cells - GitHub format:
  // <td ... data-date="2025-01-15" ... data-level="2" ...>
  const cellRegex = /data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d)"/g;

  let match;
  const rawDays: { date: string; level: number }[] = [];

  while ((match = cellRegex.exec(html)) !== null) {
    const date = match[1];
    const level = parseInt(match[2], 10);
    rawDays.push({ date, level });
  }

  // Calculate weighted contributions based on levels
  // Level 0 = 0, Level 1-4 = varying amounts
  const totalWeight = rawDays.reduce((sum, day) => sum + (day.level > 0 ? day.level : 0), 0);

  if (totalWeight > 0 && totalContributions > 0) {
    // Distribute total contributions proportionally based on levels
    rawDays.forEach((day) => {
      let count = 0;
      if (day.level > 0) {
        // Proportional distribution based on level weight
        count = Math.round((day.level / totalWeight) * totalContributions);
      }
      days.push({ date: day.date, count, level: day.level });
    });

    // Adjust for rounding errors - add/subtract from highest level days
    const currentTotal = days.reduce((sum, day) => sum + day.count, 0);
    const diff = totalContributions - currentTotal;
    if (diff !== 0) {
      // Find days with highest levels to adjust
      const sortedDays = [...days].sort((a, b) => b.level - a.level);
      for (let i = 0; i < Math.abs(diff) && i < sortedDays.length; i++) {
        const dayToAdjust = days.find(d => d.date === sortedDays[i].date);
        if (dayToAdjust) {
          dayToAdjust.count += diff > 0 ? 1 : -1;
        }
      }
    }
  } else {
    // Fallback: estimate from levels
    rawDays.forEach((day) => {
      const count = estimateCountFromLevel(day.level);
      days.push({ date: day.date, count, level: day.level });
    });
    totalContributions = days.reduce((sum, day) => sum + day.count, 0);
  }

  return { totalContributions, days };
}

function estimateCountFromLevel(level: number): number {
  // GitHub uses 5 levels (0-4)
  // Level 0: 0 contributions
  // Level 1: 1-3 contributions
  // Level 2: 4-6 contributions
  // Level 3: 7-9 contributions
  // Level 4: 10+ contributions
  switch (level) {
    case 0:
      return 0;
    case 1:
      return 2;
    case 2:
      return 5;
    case 3:
      return 8;
    case 4:
      return 12;
    default:
      return 0;
  }
}
