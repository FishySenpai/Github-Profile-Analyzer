"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Twitter, Linkedin, Copy } from "lucide-react";

interface QuickShareButtonsProps {
  username: string;
  name: string;
}

export function QuickShareButtons({ username, name }: QuickShareButtonsProps) {
  const profileUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/profile/${username}`
      : "";

  const shareText = `Check out ${name}'s GitHub profile on GitAnalyzer!`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      toast.success("Link copied!");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const shareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}&url=${encodeURIComponent(profileUrl)}`;
    window.open(url, "_blank", "width=550,height=420");
  };

  const shareLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      profileUrl
    )}`;
    window.open(url, "_blank", "width=550,height=420");
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 px-2"
        onClick={copyLink}
        title="Copy link"
      >
        <Copy className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 px-2"
        onClick={shareTwitter}
        title="Share on Twitter"
      >
        <Twitter className="h-3.5 w-3.5 text-[#1DA1F2]" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 px-2"
        onClick={shareLinkedIn}
        title="Share on LinkedIn"
      >
        <Linkedin className="h-3.5 w-3.5 text-[#0A66C2]" />
      </Button>
    </div>
  );
}
