import { SearchForm } from "@/components/features/search-form";
import {
  BarChart3,
  GitCommit,
  Trophy,
  TrendingUp,
  Flame,
  Swords,
} from "lucide-react";

const features = [
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Beautiful Charts",
    description: "Interactive visualizations of your GitHub activity",
  },
  {
    icon: <Trophy className="h-6 w-6" />,
    title: "Gamification",
    description: "Earn badges and level up as you code",
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    title: "Predictions",
    description: "Statistical forecasts for your progress",
  },
  {
    icon: <Flame className="h-6 w-6" />,
    title: "Streak Tracking",
    description: "Monitor your contribution streaks",
  },
  {
    icon: <GitCommit className="h-6 w-6" />,
    title: "Productivity Insights",
    description: "Discover when you code best",
  },
  {
    icon: <Swords className="h-6 w-6" />,
    title: "Battle Mode",
    description: "Compare stats with other developers",
  },
];

export default function HomePage() {
  return (
    <div className="relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-12 md:py-24">
        {/* Hero section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            Now with Battle Mode!
          </div>

          <h1 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
            GitHub Stats,{" "}
            <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              Enhanced
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Discover your coding patterns, earn achievements, and showcase your
            developer journey with beautiful analytics that go beyond basic stats.
          </p>

          <SearchForm />
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="text-center mt-16 text-sm text-muted-foreground">
          <p>
            Powered by GitHub&apos;s public API. No authentication required.
          </p>
          <p className="mt-1">
            Rate limited to 60 requests/hour. Data is cached for optimal performance.
          </p>
        </div>
      </div>
    </div>
  );
}
