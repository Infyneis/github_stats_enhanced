"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface ProductivityHeatmapProps {
  hourlyData: number[];
  dayOfWeekData: number[];
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getHourLabel(hour: number): string {
  if (hour === 0) return "12am";
  if (hour === 12) return "12pm";
  return hour < 12 ? `${hour}am` : `${hour - 12}pm`;
}

export function ProductivityHeatmap({
  hourlyData,
  dayOfWeekData,
}: ProductivityHeatmapProps) {
  const totalByDay = dayOfWeekData.reduce((sum, val) => sum + val, 0);
  const totalByHour = hourlyData.reduce((sum, val) => sum + val, 0);
  const hasData = totalByDay > 0 && totalByHour > 0;

  // Create a 7x24 grid (days x hours)
  const gridData = useMemo(() => {
    if (!hasData) {
      return DAYS.map(() => HOURS.map(() => 0));
    }

    // Normalize and combine day and hour data
    // This is a simplification - ideally we'd have actual day+hour data
    return DAYS.map((_, dayIndex) => {
      const dayWeight = dayOfWeekData[dayIndex] / totalByDay;
      return HOURS.map((_, hourIndex) => {
        const hourWeight = hourlyData[hourIndex] / totalByHour;
        return dayWeight * hourWeight;
      });
    });
  }, [hourlyData, dayOfWeekData, hasData, totalByDay, totalByHour]);

  const maxValue = useMemo(() => {
    return Math.max(...gridData.flat(), 0.001);
  }, [gridData]);

  const getIntensityClass = (value: number): string => {
    const normalized = value / maxValue;
    if (normalized < 0.1) return "bg-muted";
    if (normalized < 0.25) return "bg-primary/20";
    if (normalized < 0.5) return "bg-primary/40";
    if (normalized < 0.75) return "bg-primary/60";
    return "bg-primary";
  };

  const peakHour = hourlyData.indexOf(Math.max(...hourlyData));
  const peakDay = dayOfWeekData.indexOf(Math.max(...dayOfWeekData));

  if (!hasData) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">Productivity Patterns</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Clock className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground mb-2">
              No recent activity data available
            </p>
            <p className="text-sm text-muted-foreground/70 max-w-md">
              Time-based patterns require recent push events from GitHub&apos;s Events API (last ~90 days).
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">Productivity Patterns</CardTitle>
          </div>
          <div className="text-sm text-muted-foreground">
            Peak: <span className="font-medium text-foreground">{DAYS[peakDay]}</span> at{" "}
            <span className="font-medium text-foreground">{getHourLabel(peakHour)}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Hour labels */}
            <div className="flex mb-2 ml-12">
              {HOURS.filter((h) => h % 3 === 0).map((hour) => (
                <div
                  key={hour}
                  className="flex-1 text-xs text-muted-foreground text-center"
                  style={{ minWidth: "40px" }}
                >
                  {getHourLabel(hour)}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="space-y-1">
              {DAYS.map((day, dayIndex) => (
                <div key={day} className="flex items-center gap-2">
                  <div className="w-10 text-sm text-muted-foreground text-right">
                    {day}
                  </div>
                  <div className="flex-1 flex gap-0.5">
                    {HOURS.map((hour) => {
                      const value = gridData[dayIndex][hour];
                      const percentage = ((value / maxValue) * 100).toFixed(1);

                      return (
                        <TooltipProvider key={hour} delayDuration={0}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className={cn(
                                  "flex-1 h-6 rounded-sm cursor-pointer transition-all hover:ring-2 hover:ring-primary/50",
                                  getIntensityClass(value)
                                )}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="font-semibold">
                                {day} at {getHourLabel(hour)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {percentage}% of activity
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-2 mt-4 text-xs text-muted-foreground">
              <span>Less active</span>
              <div className="flex gap-0.5">
                {["bg-muted", "bg-primary/20", "bg-primary/40", "bg-primary/60", "bg-primary"].map(
                  (cls, i) => (
                    <div key={i} className={cn("w-4 h-4 rounded-sm", cls)} />
                  )
                )}
              </div>
              <span>More active</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
