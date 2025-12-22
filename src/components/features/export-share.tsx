"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Download, Share2, Copy, Check, Twitter, Linkedin } from "lucide-react";
import { toPng } from "html-to-image";

interface ExportShareProps {
  username: string;
  exportRef: React.RefObject<HTMLDivElement | null>;
}

export function ExportShare({ username, exportRef }: ExportShareProps) {
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/${username}`
    : `/${username}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleExportImage = async () => {
    if (!exportRef.current) return;

    setExporting(true);
    try {
      const dataUrl = await toPng(exportRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: getComputedStyle(document.documentElement)
          .getPropertyValue("--background")
          .includes("oklch")
          ? document.documentElement.classList.contains("dark")
            ? "#0a0a0a"
            : "#ffffff"
          : "#ffffff",
      });

      const link = document.createElement("a");
      link.download = `github-stats-${username}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to export:", err);
    } finally {
      setExporting(false);
    }
  };

  const handleShareTwitter = () => {
    const text = `Check out my GitHub stats! ${shareUrl}`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  const handleShareLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      "_blank"
    );
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleExportImage}
        disabled={exporting}
        className="gap-2"
      >
        {exporting ? (
          <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        Export
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64" align="end">
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Share Profile</h4>

            {/* Copy link */}
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2"
              onClick={handleCopyLink}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied ? "Copied!" : "Copy Link"}
            </Button>

            {/* Social sharing */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-2"
                onClick={handleShareTwitter}
              >
                <Twitter className="h-4 w-4" />
                Twitter
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-2"
                onClick={handleShareLinkedIn}
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
