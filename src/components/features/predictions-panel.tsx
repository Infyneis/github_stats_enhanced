"use client";

import { useState } from "react";
import { Predictions, Milestone } from "@/types/github";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  Flame,
  Calendar,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PredictionsPanelProps {
  predictions: Predictions;
}

export function PredictionsPanel({ predictions }: PredictionsPanelProps) {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 20;
    setShowScrollIndicator(!isAtBottom);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "decreasing":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getLikelihoodColor = (likelihood: string) => {
    switch (likelihood) {
      case "high":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className="relative">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-lg">Predictions & Forecasts</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 max-h-[500px] overflow-y-auto" onScroll={handleScroll}>
        {/* 30-day commit prediction */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-purple-500/5 border border-primary/10">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <h4 className="font-medium">30-Day Forecast</h4>
            </div>
            <Badge variant="outline" className="gap-1">
              {getTrendIcon(predictions.commits30Days.trend)}
              <span className="capitalize">{predictions.commits30Days.trend}</span>
            </Badge>
          </div>
          <p className="text-3xl font-bold mb-1">
            ~{predictions.commits30Days.predicted}{" "}
            <span className="text-lg font-normal text-muted-foreground">
              commits
            </span>
          </p>
          <p className="text-sm text-muted-foreground">
            Expected range: {predictions.commits30Days.confidence[0]} -{" "}
            {predictions.commits30Days.confidence[1]} commits
          </p>
        </div>

        {/* Streak probability */}
        <div className="p-4 rounded-xl bg-muted/30">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="h-5 w-5 text-orange-500" />
            <h4 className="font-medium">Streak Probability</h4>
          </div>
          <div className="space-y-3">
            {[
              { label: "7 days", value: predictions.streakProbability.next7Days },
              { label: "14 days", value: predictions.streakProbability.next14Days },
              { label: "30 days", value: predictions.streakProbability.next30Days },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground w-16">
                  {item.label}
                </span>
                <div className="flex-1">
                  <Progress
                    value={item.value}
                    className={cn(
                      "h-2",
                      item.value > 70
                        ? "[&>div]:bg-green-500"
                        : item.value > 40
                          ? "[&>div]:bg-yellow-500"
                          : "[&>div]:bg-red-500"
                    )}
                  />
                </div>
                <span className="text-sm font-medium w-12 text-right">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Productive days this week */}
        {predictions.productiveDays.length > 0 && (
          <div className="p-4 rounded-xl bg-muted/30">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-blue-500" />
              <h4 className="font-medium">This Week's Forecast</h4>
            </div>
            <div className="flex gap-2 flex-wrap">
              {predictions.productiveDays.map((day) => (
                <div
                  key={day.date}
                  className={cn(
                    "flex flex-col items-center p-2 rounded-lg min-w-[60px]",
                    day.likelihood === "high" && "bg-green-500/10",
                    day.likelihood === "medium" && "bg-yellow-500/10",
                    day.likelihood === "low" && "bg-muted"
                  )}
                >
                  <span className="text-xs text-muted-foreground">
                    {day.dayOfWeek.slice(0, 3)}
                  </span>
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full mt-1",
                      getLikelihoodColor(day.likelihood)
                    )}
                  />
                  <span className="text-xs font-medium mt-1">
                    {day.probability}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Milestones */}
        {predictions.milestones.length > 0 && (
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              Upcoming Milestones
            </h4>
            <div className="space-y-3">
              {predictions.milestones.map((milestone) => (
                <MilestoneCard key={milestone.name} milestone={milestone} />
              ))}
            </div>
          </div>
        )}
      </CardContent>

      {/* Scroll indicator */}
      {showScrollIndicator && (
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-card to-transparent pointer-events-none flex items-end justify-center pb-2">
          <div className="animate-bounce">
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      )}
    </Card>
  );
}

function MilestoneCard({ milestone }: { milestone: Milestone }) {
  const progress = (milestone.current / milestone.target) * 100;

  return (
    <div className="p-3 rounded-lg border bg-card">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium">{milestone.name}</span>
        <span className="text-sm text-muted-foreground">
          {milestone.estimatedDate}
        </span>
      </div>
      <Progress value={progress} className="h-2 mb-2" />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>
          {milestone.current.toLocaleString()} / {milestone.target.toLocaleString()}
        </span>
        <span>~{milestone.estimatedDays} days</span>
      </div>
    </div>
  );
}
