"use client";

import { useState } from "react";
import { Badge as BadgeType } from "@/types/github";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { getRarityColor } from "@/lib/gamification";
import {
  Award,
  Moon,
  Sun,
  Briefcase,
  Calendar,
  Flame,
  Eye,
  Users,
  Star,
  Code,
  Zap,
  GitCommit,
  Folder,
  Trophy,
  Lock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface BadgeWallProps {
  badges: BadgeType[];
}

const ICON_MAP: Record<string, React.ReactNode> = {
  moon: <Moon className="h-5 w-5" />,
  sunrise: <Sun className="h-5 w-5" />,
  briefcase: <Briefcase className="h-5 w-5" />,
  calendar: <Calendar className="h-5 w-5" />,
  flame: <Flame className="h-5 w-5" />,
  eye: <Eye className="h-5 w-5" />,
  users: <Users className="h-5 w-5" />,
  award: <Award className="h-5 w-5" />,
  star: <Star className="h-5 w-5" />,
  code: <Code className="h-5 w-5" />,
  zap: <Zap className="h-5 w-5" />,
  "git-commit": <GitCommit className="h-5 w-5" />,
  folder: <Folder className="h-5 w-5" />,
  trophy: <Trophy className="h-5 w-5" />,
};

const RARITY_LABELS: Record<string, string> = {
  common: "Common",
  uncommon: "Uncommon",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
};

export function BadgeWall({ badges }: BadgeWallProps) {
  const [showAllLocked, setShowAllLocked] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const earnedBadges = badges.filter((b) => b.earned);
  const lockedBadges = badges.filter((b) => !b.earned);
  const displayedLockedBadges = showAllLocked ? lockedBadges : lockedBadges.slice(0, 6);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 20;
    setShowScrollIndicator(!isAtBottom);
  };

  return (
    <Card className="relative">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">Achievements</CardTitle>
          </div>
          <Badge variant="secondary">
            {earnedBadges.length} / {badges.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="max-h-[500px] overflow-y-auto" onScroll={handleScroll}>
        {/* Earned Badges */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            Earned ({earnedBadges.length})
          </h3>
          {earnedBadges.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No badges earned yet. Keep coding!
            </p>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
              {earnedBadges.map((badge) => (
                <TooltipProvider key={badge.id} delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          "relative flex items-center justify-center p-3 rounded-xl transition-all cursor-pointer hover:scale-110",
                          getRarityColor(badge.rarity)
                        )}
                      >
                        {ICON_MAP[badge.icon] || <Award className="h-5 w-5" />}
                        {badge.rarity === "legendary" && (
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[200px]">
                      <div className="space-y-1">
                        <p className="font-semibold">{badge.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {badge.description}
                        </p>
                        <Badge
                          variant="outline"
                          className={cn("text-xs", getRarityColor(badge.rarity))}
                        >
                          {RARITY_LABELS[badge.rarity]}
                        </Badge>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          )}
        </div>

        {/* Locked Badges */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            In Progress ({lockedBadges.length})
          </h3>
          <div className="space-y-3">
            {displayedLockedBadges.map((badge) => (
              <div
                key={badge.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"
              >
                <div className="flex items-center justify-center p-2 rounded-lg bg-muted text-muted-foreground">
                  <Lock className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium truncate">{badge.name}</p>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(badge.progress || 0)}%
                    </span>
                  </div>
                  <Progress value={badge.progress || 0} className="h-1.5" />
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {badge.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {lockedBadges.length > 6 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllLocked(!showAllLocked)}
              className="w-full mt-3 text-muted-foreground hover:text-foreground"
            >
              {showAllLocked ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Show {lockedBadges.length - 6} more badges
                </>
              )}
            </Button>
          )}
        </div>
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
