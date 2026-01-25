"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Share2,
  Twitter,
  Linkedin,
  Facebook,
  Copy,
  Mail,
  Check,
} from "lucide-react";

interface ShareProfileProps {
  username: string;
  name: string;
  bio?: string;
}

export function ShareProfile({ username, name, bio }: ShareProfileProps) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const profileUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/profile/${username}`
      : "";

  const shareText = `Check out ${name}'s GitHub profile analysis on GitAnalyzer!`;
  const shareTextWithBio = bio
    ? `${shareText}\n\n"${bio.slice(0, 100)}${bio.length > 100 ? "..." : ""}"`
    : shareText;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");

      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText,
    )}&url=${encodeURIComponent(profileUrl)}`;
    window.open(url, "_blank", "width=550,height=420");
  };

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      profileUrl,
    )}`;
    window.open(url, "_blank", "width=550,height=420");
  };

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      profileUrl,
    )}`;
    window.open(url, "_blank", "width=550,height=420");
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`${name}'s GitHub Profile Analysis`);
    const body = encodeURIComponent(`${shareTextWithBio}\n\n${profileUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${name}'s GitHub Profile`,
          text: shareText,
          url: profileUrl,
        });
        toast.success("Shared successfully!");
      } catch (error) {
        // User cancelled share
        const err = error as { name?: string };
        if (err.name !== "AbortError") {
          toast.error("Failed to share");
        }
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share {name}&apos;s Profile</DialogTitle>
          <DialogDescription>
            Share this profile analysis with others
          </DialogDescription>
        </DialogHeader>

        {/* Copy Link Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              readOnly
              value={profileUrl}
              className="flex-1"
              onClick={(e) => e.currentTarget.select()}
            />
            <Button
              size="icon"
              variant="outline"
              onClick={copyToClipboard}
              className="shrink-0"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Social Share Buttons */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Share via
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={shareOnTwitter}
              >
                <Twitter className="h-4 w-4 mr-2 text-[#1DA1F2]" />
                Twitter
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={shareOnLinkedIn}
              >
                <Linkedin className="h-4 w-4 mr-2 text-[#0A66C2]" />
                LinkedIn
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={shareOnFacebook}
              >
                <Facebook className="h-4 w-4 mr-2 text-[#1877F2]" />
                Facebook
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={shareViaEmail}
              >
                <Mail className="h-4 w-4 mr-2 text-slate-600" />
                Email
              </Button>
            </div>
          </div>

          {/* Native Share (Mobile) */}
          {typeof navigator !== "undefined" &&
            typeof navigator.share === "function" && (
              <Button
                variant="secondary"
                className="w-full"
                onClick={handleNativeShare}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share via...
              </Button>
            )}

          {/* QR Code Option (Future Enhancement) */}
          <div className="pt-2 border-t">
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
              Scan QR code or copy link to share
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
