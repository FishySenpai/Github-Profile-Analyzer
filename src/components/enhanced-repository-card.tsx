"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, GitFork, Eye, Calendar, ExternalLink } from "lucide-react";

interface EnhancedRepositoryCardProps {
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
  };
  rank: number;
  onClick: () => void;
}

export function EnhancedRepositoryCard({
  repo,
  rank,
  onClick,
}: EnhancedRepositoryCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow duration-200"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              #{rank}
            </Badge>
            <h4 className="font-semibold text-lg hover:text-blue-600 transition-colors">
              {repo.name}
            </h4>
            {repo.isFork && (
              <Badge variant="secondary" className="text-xs">
                Fork
              </Badge>
            )}
            {repo.isPrivate && (
              <Badge variant="destructive" className="text-xs">
                Private
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            asChild
            onClick={(e) => e.stopPropagation()}
          >
            <a href={repo.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>

        <p className="text-slate-600 dark:text-slate-300 text-sm mb-3 line-clamp-2">
          {repo.description || "No description provided"}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-slate-500">
            {repo.language && repo.language !== "Unknown" && (
              <div className="flex items-center gap-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: repo.languageColor }}
                />
                <span>{repo.language}</span>
              </div>
            )}

            <div className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              <span>{repo.stars.toLocaleString()}</span>
            </div>

            <div className="flex items-center gap-1">
              <GitFork className="h-3 w-3" />
              <span>{repo.forks.toLocaleString()}</span>
            </div>
          </div>

          <div className="text-xs text-slate-400">
            Updated {formatDate(repo.updatedAt)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
