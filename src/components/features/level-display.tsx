"use client";

import { LevelInfo } from "@/types/github";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Zap } from "lucide-react";

interface LevelDisplayProps {
  levelInfo: LevelInfo;
}

export function LevelDisplay({ levelInfo }: LevelDisplayProps) {
  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 border-primary/20">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <CardContent className="relative p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Level Badge */}
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-full blur-md opacity-50 animate-pulse" />
            <div className="relative flex items-center justify-center w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-primary to-purple-600 text-white shadow-xl">
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-black">{levelInfo.level}</p>
                <p className="text-[10px] uppercase tracking-wider opacity-80">Level</p>
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-background border-2 border-primary">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
          </div>

          {/* Level Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                {levelInfo.title}
              </h2>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-muted-foreground mb-4">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="font-semibold text-foreground">
                {levelInfo.totalXP.toLocaleString()}
              </span>
              <span>Total XP</span>
            </div>

            {/* Progress bar */}
            <div className="space-y-2 max-w-md mx-auto md:mx-0">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress to Level {levelInfo.level + 1}</span>
                <span className="font-medium">{Math.round(levelInfo.xpProgress)}%</span>
              </div>
              <Progress
                value={levelInfo.xpProgress}
                className="h-3 bg-muted/50"
              />
              <p className="text-xs text-muted-foreground">
                {levelInfo.currentXP.toLocaleString()} / {levelInfo.xpForNextLevel.toLocaleString()} XP
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
