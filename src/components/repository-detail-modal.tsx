"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  GitFork,
  Calendar,
  ExternalLink,
  Lock,
  Unlock,
  GitBranch,
} from "lucide-react";

interface RepositoryDetailModalProps {
  repo: {
    name: string;
    description: string;
    language: string;
    languageColor: string;
    stars: number;
    forks: number;
    isPrivate: boolean;
    isFork: boolean;
    updatedAt: string;
    createdAt: string;
    url: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RepositoryDetailModal({
  repo,
  isOpen,
  onClose,
}: RepositoryDetailModalProps) {
  if (!repo) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRepositoryAge = () => {
    const created = new Date(repo.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) return `${diffDays} days old`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months old`;
    return `${Math.floor(diffDays / 365)} years old`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              {repo.name}
              {repo.isPrivate ? (
                <Lock className="h-5 w-5 text-red-500" />
              ) : (
                <Unlock className="h-5 w-5 text-green-500" />
              )}
            </DialogTitle>
            <Button variant="outline" asChild>
              <a href={repo.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                View on GitHub
              </a>
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-2">
            {repo.isFork && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <GitBranch className="h-3 w-3" />
                Forked Repository
              </Badge>
            )}
            {repo.isPrivate && <Badge variant="destructive">Private</Badge>}
            <Badge variant="outline">{getRepositoryAge()}</Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <DialogDescription className="text-base">
              {repo.description ||
                "No description provided for this repository."}
            </DialogDescription>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-slate-600 dark:text-slate-300">
                Repository Stats
              </h4>

              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">
                  <strong>{repo.stars.toLocaleString()}</strong> stars
                </span>
              </div>

              <div className="flex items-center gap-2">
                <GitFork className="h-4 w-4 text-blue-500" />
                <span className="text-sm">
                  <strong>{repo.forks.toLocaleString()}</strong> forks
                </span>
              </div>

              {repo.language && repo.language !== "Unknown" && (
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: repo.languageColor }}
                  />
                  <span className="text-sm">
                    <strong>{repo.language}</strong>
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-slate-600 dark:text-slate-300">
                Timeline
              </h4>

              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-green-500 mt-0.5" />
                <div className="text-sm">
                  <div className="font-medium">Created</div>
                  <div className="text-slate-600 dark:text-slate-400">
                    {formatDate(repo.createdAt)}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-blue-500 mt-0.5" />
                <div className="text-sm">
                  <div className="font-medium">Last Updated</div>
                  <div className="text-slate-600 dark:text-slate-400">
                    {formatDate(repo.updatedAt)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex justify-between items-center">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {repo.isFork
                ? "This is a fork of another repository"
                : "Original repository"}
            </div>
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
