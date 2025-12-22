<p align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/bar-chart-3.svg" alt="GitStats Enhanced" width="100" height="100" />
</p>

<h1 align="center">📊 GitStats Enhanced</h1>
<h3 align="center">Beautiful GitHub analytics with gamification & predictions <code>#10/365 - Year Coding Challenge</code></h3>

<p align="center">
  <em>Discover your coding patterns, earn achievements, and showcase your developer journey</em>
</p>

<p align="center">
  <a href="https://github.com/Infyneis">
    <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  </a>
  <a href="https://www.linkedin.com/in/samy-djemili/">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-4.0-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Shadcn/ui-Latest-000000?style=flat-square" alt="Shadcn" />
  <img src="https://img.shields.io/badge/Recharts-3.0-22C55E?style=flat-square" alt="Recharts" />
  <img src="https://img.shields.io/badge/SWR-2.0-000000?style=flat-square" alt="SWR" />
</p>

---

## ✨ Overview

A modern **GitHub analytics dashboard** that transforms boring stats into an engaging experience. View beautiful visualizations of your contributions, earn achievement badges, level up with XP, get statistical predictions, and battle other developers in head-to-head comparisons!

<p align="center">
  <img src="https://img.shields.io/badge/🚀_Year_Coding_Challenge-Project_%2310-22C55E?style=for-the-badge" alt="Year Coding Challenge" />
  <img src="https://img.shields.io/badge/📅_Completed-December_21,_2024-10B981?style=for-the-badge" alt="Completed" />
  <img src="https://img.shields.io/badge/🎨_Theme-Modern_Glassmorphism-3B82F6?style=for-the-badge" alt="Theme" />
</p>

---

## 🚀 Features

| Feature | Description |
|---------|-------------|
| 📊 **Beautiful Charts** | Interactive heatmaps, line charts, pie charts, and velocity graphs |
| 🏆 **30+ Badges** | Earn achievements across 6 categories with 5 rarity tiers |
| ⚡ **XP & Levels** | Level up from "Code Newbie" to "GitHub Legend" (100 levels) |
| 🔮 **Predictions** | Statistical forecasts for commits, streaks, and milestones |
| ⚔️ **Battle Mode** | Compare stats with up to 4 developers in competition style |
| 🌙 **Dark/Light Mode** | Beautiful themes with smooth transitions |
| 📱 **Mobile First** | Fully responsive design for all devices |
| 📤 **Export & Share** | Download stats as PNG, share via link or social media |
| 🔒 **No Auth Required** | Works with any public GitHub profile |
| ⚡ **Fast & Cached** | SWR caching for optimal performance |

---

## 🛠️ Tech Stack

<table>
  <tr>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=nextjs" width="48" height="48" alt="Next.js" />
      <br>Next.js 16
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=react" width="48" height="48" alt="React" />
      <br>React 19
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=ts" width="48" height="48" alt="TypeScript" />
      <br>TypeScript
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=tailwind" width="48" height="48" alt="Tailwind" />
      <br>Tailwind 4
    </td>
    <td align="center" width="96">
      <img src="https://ui.shadcn.com/apple-touch-icon.png" width="48" height="48" alt="shadcn" />
      <br>shadcn/ui
    </td>
  </tr>
  <tr>
    <td align="center" width="96">
      <img src="https://recharts.org/favicon.ico" width="48" height="48" alt="Recharts" />
      <br>Recharts
    </td>
    <td align="center" width="96">
      <img src="https://swr.vercel.app/favicon/favicon-32x32.png" width="48" height="48" alt="SWR" />
      <br>SWR
    </td>
    <td align="center" width="96">
      <img src="https://lucide.dev/logo.light.svg" width="48" height="48" alt="Lucide" />
      <br>Lucide Icons
    </td>
    <td align="center" width="96">
      <img src="https://pnpm.io/img/pnpm-no-name-with-frame.svg" width="48" height="48" alt="pnpm" />
      <br>pnpm
    </td>
    <td align="center" width="96">
      <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" width="48" height="48" alt="GitHub API" />
      <br>GitHub API
    </td>
  </tr>
</table>

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Next.js Frontend                           │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐  │
│  │ 🔍 Search    │  │ 📊 Dashboard │  │ ⚔️ Battle Mode        │  │
│  │ (Home Page)  │  │ (User Stats) │  │ (Comparisons)         │  │
│  └──────────────┘  └──────────────┘  └───────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                    SWR Data Fetching + Caching
                              │
┌─────────────────────────────────────────────────────────────────┐
│                      Core Services                              │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐  │
│  │ 📈 Stats     │  │ 🎮 Gamify    │  │ 🔮 Predictions        │  │
│  │ Calculator   │  │ (XP/Badges)  │  │ (Statistical)         │  │
│  └──────────────┘  └──────────────┘  └───────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │   GitHub REST API │
                    │   (Public, Cached)│
                    └───────────────────┘
```

---

## 📂 Project Structure

```
github_stats_enhanced/
├── 📦 package.json                   # Dependencies & scripts
├── src/
│   ├── app/
│   │   ├── 🏠 layout.tsx             # Root layout with theme provider
│   │   ├── 🔍 page.tsx               # Home page with search
│   │   └── [username]/
│   │       └── 📊 page.tsx           # User profile dashboard
│   ├── components/
│   │   ├── charts/
│   │   │   ├── 📅 contribution-heatmap.tsx   # GitHub-style calendar
│   │   │   ├── 📈 activity-chart.tsx         # Area chart
│   │   │   ├── 🥧 language-chart.tsx         # Pie chart
│   │   │   ├── ⏰ productivity-heatmap.tsx   # Hours x Days grid
│   │   │   └── 📉 velocity-chart.tsx         # Trend line chart
│   │   ├── features/
│   │   │   ├── 👤 profile-header.tsx         # User info card
│   │   │   ├── 📊 metric-cards.tsx           # Stats grid
│   │   │   ├── 🏆 badge-wall.tsx             # Achievement display
│   │   │   ├── ⚡ level-display.tsx          # XP progress
│   │   │   ├── 🔮 predictions-panel.tsx      # Forecasts
│   │   │   ├── ⚔️ comparison-view.tsx        # Battle mode
│   │   │   └── 📤 export-share.tsx           # Export/share buttons
│   │   ├── providers/
│   │   │   └── 🌙 theme-provider.tsx         # Dark/light mode
│   │   ├── shared/
│   │   │   ├── 🎨 header.tsx                 # App header
│   │   │   └── 🌙 theme-toggle.tsx           # Theme switcher
│   │   └── ui/                               # shadcn components
│   ├── hooks/
│   │   └── 🔄 use-github-data.ts             # SWR data hook
│   ├── lib/
│   │   ├── 🌐 github-api.ts                  # GitHub API client
│   │   ├── 📊 stats-calculator.ts            # Stats computation
│   │   ├── 🎮 gamification.ts                # XP, levels, badges
│   │   ├── 🔮 predictions.ts                 # Statistical forecasts
│   │   └── 🔧 utils.ts                       # Utilities
│   └── types/
│       └── 📝 github.ts                      # TypeScript types
└── 📖 README.md
```

---

## 🚀 Quick Start

### Prerequisites

- 🟢 **Node.js 18+** - [Download](https://nodejs.org)
- 📦 **pnpm** - `npm install -g pnpm`

### Installation

```bash
# Clone the repository
git clone https://github.com/Infyneis/github-stats-enhanced.git

# Navigate to project
cd github-stats-enhanced

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Then open **<http://localhost:3000>** and enter any GitHub username!

---

## 📊 Analytics Features

### 📈 Core Metrics

| Metric | Description |
|--------|-------------|
| 💻 **Commits** | Total commits with trend indicator |
| 🔀 **Pull Requests** | PRs opened and merged |
| 🐛 **Issues** | Issues created and resolved |
| 👀 **Code Reviews** | PR reviews conducted |
| ⭐ **Stars Earned** | Total stars across repositories |
| 🍴 **Forks** | Repository forks |
| 🔥 **Streaks** | Current and longest streak |
| 📁 **Repositories** | Public repository count |

### 📅 Visualizations

| Chart | Description |
|-------|-------------|
| 🟩 **Contribution Heatmap** | GitHub-style calendar grid |
| 📈 **Activity Timeline** | Commits, PRs, issues over time |
| 🥧 **Language Breakdown** | Top 10 languages with colors |
| ⏰ **Productivity Heatmap** | When you code (hours × days) |
| 📉 **Velocity Trends** | Weekly commit trends with moving average |

---

## 🏆 Gamification System

### 🎖️ Badge Categories

| Category | Examples |
|----------|----------|
| ⏰ **Productivity** | Night Owl, Early Bird, Weekend Warrior |
| 🔥 **Consistency** | Week Streak, Month Streak, 365 Day Streak |
| 👥 **Collaboration** | Code Reviewer, Team Player, Review Master |
| ⭐ **Impact** | First Star, Rising Star, Superstar, Polyglot |
| ⚡ **Velocity** | Productive Day, Sprint, Speed Demon |
| 🎯 **Milestone** | Beginner, Intermediate, Advanced, Legend |

### 💎 Rarity Tiers

| Tier | Color | Difficulty |
|------|-------|------------|
| ⚪ Common | Gray | Easy (60%+ users) |
| 🟢 Uncommon | Green | Moderate (30-60%) |
| 🔵 Rare | Blue | Challenging (10-30%) |
| 🟣 Epic | Purple | Very Hard (1-10%) |
| 🟡 Legendary | Gold | Exceptional (<1%) |

### ⚡ XP & Leveling

| Activity | XP |
|----------|-----|
| Commit | 10 XP |
| PR Opened | 25 XP |
| PR Merged | 50 XP |
| PR Review | 20 XP |
| Issue Opened | 15 XP |
| Issue Closed | 30 XP |
| Star Received | 5 XP |
| Fork Received | 10 XP |

**Level Titles:** Code Newbie → Junior Developer → Developer → Senior Developer → Lead Developer → Principal Engineer → Architect → Code Wizard → GitHub Master → GitHub Legend

---

## 🔮 Predictions

All predictions use **statistical methods** (no AI):

| Prediction | Method |
|------------|--------|
| 📊 **30-Day Forecast** | Linear regression on last 90 days |
| 🔥 **Streak Probability** | Survival analysis on historical patterns |
| 🎯 **Milestone ETAs** | Velocity-based extrapolation |
| 📅 **Productive Days** | Day-of-week probability distribution |

---

## ⚔️ Battle Mode

Compare stats with other developers in competition style:

- 👥 Add up to 4 users
- 🏆 Head-to-head metric comparisons
- 📊 Competition score calculation
- 🥇 Winner highlighting with trophy
- 📤 Shareable comparison links

---

## 🎨 Design System

### Color Palette

| Color | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| 🔵 Primary | `#1d4ed8` | `#60a5fa` | Accents, buttons |
| 🟢 Success | `#22c55e` | `#34d399` | Positive metrics |
| 🟡 Warning | `#f59e0b` | `#fbbf24` | Alerts, priorities |
| 🔴 Danger | `#ef4444` | `#f87171` | Errors, decreasing |
| ⚫ Background | `#ffffff` | `#0a0a0a` | Main background |
| ⚫ Card | `#f9fafb` | `#18181b` | Card surfaces |

### Components

- **Glassmorphism** cards with backdrop blur
- **Gradient** accents and backgrounds
- **Smooth animations** with CSS transitions
- **Responsive** mobile-first design

---

## 📦 Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |

---

## 🌐 API & Rate Limits

### GitHub API

| Type | Rate Limit |
|------|------------|
| Unauthenticated | 60 requests/hour |
| Authenticated | 5,000 requests/hour |

### Caching Strategy

- **User Profile:** 5 minutes
- **Repositories:** 10 minutes
- **Events:** 2 minutes
- **Computed Stats:** Session-based

---

## 🐛 Troubleshooting

### Rate limit exceeded

```bash
# Check current rate limit
curl -s https://api.github.com/rate_limit | jq '.rate'

# Wait for reset or use cached data
```

### User not found

- Verify the username exists on GitHub
- Check for typos
- Ensure the profile is public

### Slow loading

- GitHub API may be slow for users with extensive history
- Data is cached after first load

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Self-hosted

```bash
# Build
pnpm build

# Start
pnpm start
```

---

## 📄 License

This project is open source and available for personal/educational use.

---

## 🙏 Acknowledgments

- ⚛️ [Next.js](https://nextjs.org) - React framework
- 🎨 [shadcn/ui](https://ui.shadcn.com) - Beautiful components
- 🎨 [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS
- 📊 [Recharts](https://recharts.org) - Chart library
- 🔄 [SWR](https://swr.vercel.app) - Data fetching
- 💡 [Lucide](https://lucide.dev) - Beautiful icons
- 🐙 [GitHub API](https://docs.github.com/en/rest) - Data source

---

<p align="center">
  Made with 💚 by <strong>Samy DJEMILI</strong>
</p>

<p align="center">
  <a href="#top">⬆️ Back to top</a>
</p>
