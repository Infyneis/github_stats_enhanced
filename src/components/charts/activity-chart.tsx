"use client";

import { useMemo } from "react";
import { DailyContribution } from "@/types/github";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns";
import { TrendingUp } from "lucide-react";

interface ActivityChartProps {
  contributions: DailyContribution[];
  title?: string;
}

export function ActivityChart({
  contributions,
  title = "Activity Over Time",
}: ActivityChartProps) {
  const chartData = useMemo(() => {
    // Aggregate by week for cleaner visualization
    const weeklyData: { week: string; commits: number; prs: number; issues: number }[] = [];
    let currentWeek = "";
    let weekData = { commits: 0, prs: 0, issues: 0 };

    contributions.forEach((day, index) => {
      const week = format(parseISO(day.date), "MMM d");

      if (index % 7 === 0 && index > 0) {
        weeklyData.push({
          week: currentWeek,
          ...weekData,
        });
        weekData = { commits: 0, prs: 0, issues: 0 };
      }

      currentWeek = week;
      weekData.commits += day.commits;
      weekData.prs += day.prs;
      weekData.issues += day.issues;
    });

    // Add last week
    if (currentWeek) {
      weeklyData.push({
        week: currentWeek,
        ...weekData,
      });
    }

    return weeklyData;
  }, [contributions]);

  if (chartData.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPRs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorIssues" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-muted"
                vertical={false}
              />
              <XAxis
                dataKey="week"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                className="text-muted-foreground"
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                className="text-muted-foreground"
                width={40}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Area
                type="monotone"
                dataKey="commits"
                stroke="#22c55e"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCommits)"
                name="Commits"
              />
              <Area
                type="monotone"
                dataKey="prs"
                stroke="#a855f7"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPRs)"
                name="Pull Requests"
              />
              <Area
                type="monotone"
                dataKey="issues"
                stroke="#f97316"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorIssues)"
                name="Issues"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-muted-foreground">Commits</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span className="text-muted-foreground">Pull Requests</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-muted-foreground">Issues</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
