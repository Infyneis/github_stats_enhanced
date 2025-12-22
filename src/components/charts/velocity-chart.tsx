"use client";

import { VelocityData } from "@/types/github";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Activity, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface VelocityChartProps {
  velocity: VelocityData;
}

export function VelocityChart({ velocity }: VelocityChartProps) {
  const chartData = velocity.weekly.map((commits, index) => ({
    week: `W${index + 1}`,
    commits,
  }));

  // Calculate moving average
  const movingAverage = velocity.weekly.map((_, index) => {
    const start = Math.max(0, index - 3);
    const slice = velocity.weekly.slice(start, index + 1);
    return slice.reduce((a, b) => a + b, 0) / slice.length;
  });

  const chartDataWithAvg = chartData.map((d, i) => ({
    ...d,
    average: Math.round(movingAverage[i] * 10) / 10,
  }));

  const getTrendIcon = () => {
    switch (velocity.trend) {
      case "increasing":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "decreasing":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getTrendColor = () => {
    switch (velocity.trend) {
      case "increasing":
        return "text-green-500 bg-green-500/10";
      case "decreasing":
        return "text-red-500 bg-red-500/10";
      default:
        return "text-yellow-500 bg-yellow-500/10";
    }
  };

  if (chartData.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">Velocity Trends</CardTitle>
          </div>
          <Badge variant="secondary" className={cn("gap-1", getTrendColor())}>
            {getTrendIcon()}
            <span className="capitalize">{velocity.trend}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartDataWithAvg}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
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
                }}
              />
              <ReferenceLine
                y={velocity.average}
                stroke="#888"
                strokeDasharray="5 5"
                label={{
                  value: `Avg: ${velocity.average.toFixed(1)}`,
                  position: "right",
                  fill: "#888",
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="commits"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, strokeWidth: 0 }}
                name="Commits"
              />
              <Line
                type="monotone"
                dataKey="average"
                stroke="#a855f7"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="4-week average"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-primary" />
            <span className="text-muted-foreground">Weekly commits</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-purple-500 border-dashed" style={{ borderTopWidth: 2 }} />
            <span className="text-muted-foreground">4-week average</span>
          </div>
        </div>

        {/* Stats summary */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold">{velocity.average.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground">Avg commits/week</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">
              {Math.max(...velocity.weekly)}
            </p>
            <p className="text-xs text-muted-foreground">Best week</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{velocity.weekly.length}</p>
            <p className="text-xs text-muted-foreground">Weeks tracked</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
