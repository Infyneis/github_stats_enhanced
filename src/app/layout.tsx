import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Header } from "@/components/shared/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GitStats Enhanced - GitHub Analytics Dashboard",
  description:
    "Visualize your GitHub activity with beautiful charts, gamification, and productivity insights. Track commits, PRs, streaks, and more!",
  keywords: [
    "GitHub",
    "statistics",
    "analytics",
    "developer",
    "portfolio",
    "commits",
    "contributions",
  ],
  authors: [{ name: "GitStats Enhanced" }],
  openGraph: {
    title: "GitStats Enhanced - GitHub Analytics Dashboard",
    description:
      "Visualize your GitHub activity with beautiful charts and productivity insights.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GitStats Enhanced",
    description: "Beautiful GitHub analytics and productivity insights",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}
      >
        <ThemeProvider defaultTheme="system" storageKey="github-stats-theme">
          <Header />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
