"use client";

import { useMemo } from "react";
import { DailyContribution } from "@/types/github";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { format, parseISO, getDay, startOfWeek, eachWeekOfInterval, addDays } from "date-fns";
import { Calendar } from "lucide-react";

interface ContributionHeatmapProps {
  contributions: DailyContribution[];
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getIntensityClass(count: number): string {
  if (count === 0) return "bg-muted hover:bg-muted/80";
  if (count <= 2) return "bg-green-200 dark:bg-green-900 hover:bg-green-300 dark:hover:bg-green-800";
  if (count <= 5) return "bg-green-400 dark:bg-green-700 hover:bg-green-500 dark:hover:bg-green-600";
  if (count <= 10) return "bg-green-500 dark:bg-green-500 hover:bg-green-600 dark:hover:bg-green-400";
  return "bg-green-600 dark:bg-green-400 hover:bg-green-700 dark:hover:bg-green-300";
}

export function ContributionHeatmap({ contributions }: ContributionHeatmapProps) {
  const { weeks, totalContributions } = useMemo(() => {
    if (contributions.length === 0) {
      return { weeks: [], totalContributions: 0 };
    }

    const contributionMap = new Map(
      contributions.map((c) => [c.date, c])
    );

    const startDate = parseISO(contributions[0].date);
    const endDate = parseISO(contributions[contributions.length - 1].date);

    const weekStarts = eachWeekOfInterval(
      { start: startDate, end: endDate },
      { weekStartsOn: 0 }
    );

    const weeks = weekStarts.map((weekStart) => {
      const days = [];
      for (let i = 0; i < 7; i++) {
        const date = addDays(weekStart, i);
        const dateStr = format(date, "yyyy-MM-dd");
        const contribution = contributionMap.get(dateStr);
        days.push({
          date: dateStr,
          count: contribution?.count || 0,
          commits: contribution?.commits || 0,
        });
      }
      return days;
    });

    const total = contributions.reduce((sum, c) => sum + c.count, 0);

    return { weeks, totalContributions: total };
  }, [contributions]);

  if (weeks.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">Contribution Calendar</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              {totalContributions.toLocaleString()}
            </span>{" "}
            contributions
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto pb-2">
          <div className="inline-flex gap-1 min-w-full">
            {/* Day labels */}
            <div className="flex flex-col gap-1 mr-2 pt-6">
              {DAYS.map((day, i) => (
                <div
                  key={day}
                  className={cn(
                    "h-3 text-[10px] text-muted-foreground flex items-center",
                    i % 2 === 1 && "invisible"
                  )}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Weeks grid */}
            <div className="flex gap-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {/* Month label for first day of month */}
                  <div className="h-5 text-[10px] text-muted-foreground">
                    {week[0] && parseISO(week[0].date).getDate() <= 7 && (
                      format(parseISO(week[0].date), "MMM")
                    )}
                  </div>
                  {week.map((day) => (
                    <TooltipProvider key={day.date} delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={cn(
                              "w-3 h-3 rounded-sm cursor-pointer transition-colors",
                              getIntensityClass(day.count)
                            )}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-semibold">
                            {day.count} contribution{day.count !== 1 && "s"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(parseISO(day.date), "EEEE, MMMM d, yyyy")}
                          </p>
                          {day.commits > 0 && (
                            <p className="text-xs">{day.commits} commits</p>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-2 mt-4 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 2, 5, 10, 15].map((level) => (
              <div
                key={level}
                className={cn(
                  "w-3 h-3 rounded-sm",
                  getIntensityClass(level)
                )}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
}
