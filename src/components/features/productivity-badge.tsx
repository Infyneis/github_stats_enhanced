"use client";

import { PeakProductivity } from "@/types/github";
import { Card, CardContent } from "@/components/ui/card";
import { Moon, Sun, Sunset, Briefcase, Calendar, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductivityBadgeProps {
  productivity: PeakProductivity;
  biggestDay: { date: string; count: number };
  biggestWeek: { startDate: string; count: number };
  biggestMonth: { month: string; count: number };
}

const BADGE_CONFIG: Record<
  string,
  { icon: React.ReactNode; color: string; bgColor: string; description: string }
> = {
  "Night Owl": {
    icon: <Moon className="h-8 w-8" />,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
    description: "Most active during late night hours",
  },
  "Early Bird": {
    icon: <Sun className="h-8 w-8" />,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    description: "Most active in the early morning",
  },
  "Evening Coder": {
    icon: <Sunset className="h-8 w-8" />,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    description: "Most productive in the evening",
  },
  "9-to-5 Developer": {
    icon: <Briefcase className="h-8 w-8" />,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    description: "Active during business hours",
  },
  "Weekend Warrior": {
    icon: <Calendar className="h-8 w-8" />,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    description: "Codes more on weekends",
  },
  "Day Worker": {
    icon: <Sun className="h-8 w-8" />,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    description: "Balanced daytime coder",
  },
  "Getting Started": {
    icon: <Sparkles className="h-8 w-8" />,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    description: "Just getting started on the journey",
  },
};

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function getHourLabel(hour: number): string {
  if (hour === 0) return "12:00 AM";
  if (hour === 12) return "12:00 PM";
  return hour < 12 ? `${hour}:00 AM` : `${hour - 12}:00 PM`;
}

export function ProductivityBadge({
  productivity,
  biggestDay,
  biggestWeek,
  biggestMonth,
}: ProductivityBadgeProps) {
  const config = BADGE_CONFIG[productivity.label] || BADGE_CONFIG["Day Worker"];

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Main badge */}
          <div className="flex flex-col items-center text-center">
            <div
              className={cn(
                "p-6 rounded-2xl mb-3 transition-transform hover:scale-105",
                config.bgColor
              )}
            >
              <div className={config.color}>{config.icon}</div>
            </div>
            <h3 className="text-xl font-bold">{productivity.label}</h3>
            <p className="text-sm text-muted-foreground max-w-[200px]">
              {config.description}
            </p>
          </div>

          {/* Details */}
          <div className="flex-1 grid grid-cols-2 gap-4">
            {/* Peak time */}
            <div className="p-4 rounded-xl bg-muted/30">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Peak Hour
              </p>
              <p className="text-lg font-bold">{getHourLabel(productivity.hour)}</p>
              <p className="text-sm text-muted-foreground">
                on {DAY_NAMES[productivity.dayOfWeek]}s
              </p>
            </div>

            {/* Biggest day */}
            <div className="p-4 rounded-xl bg-muted/30">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Biggest Day
              </p>
              <p className="text-lg font-bold">{biggestDay.count} commits</p>
              <p className="text-sm text-muted-foreground">{biggestDay.date}</p>
            </div>

            {/* Biggest week */}
            <div className="p-4 rounded-xl bg-muted/30">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Biggest Week
              </p>
              <p className="text-lg font-bold">{biggestWeek.count} commits</p>
              <p className="text-sm text-muted-foreground">
                Week of {biggestWeek.startDate}
              </p>
            </div>

            {/* Biggest month */}
            <div className="p-4 rounded-xl bg-muted/30">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Biggest Month
              </p>
              <p className="text-lg font-bold">{biggestMonth.count} commits</p>
              <p className="text-sm text-muted-foreground">{biggestMonth.month}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
