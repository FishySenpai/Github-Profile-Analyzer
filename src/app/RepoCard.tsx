// components/RepoCard.tsx
import React from "react";

type Repo = {
  name: string;
  description: string;
  url: string;
  stargazerCount: number;
  forkCount: number;
  primaryLanguage?: {
    name: string;
    color: string;
  };
  createdAt: string;
  updatedAt: string;
};

const RepoCard = ({ repo }: { repo: Repo }) => {
  return (
    <div className="border p-4 rounded-2xl shadow hover:shadow-lg transition mb-4 bg-white">
      <h3 className="text-xl font-bold text-blue-600">
        <a href={repo.url} target="_blank" rel="noopener noreferrer">
          {repo.name}
        </a>
      </h3>
      {repo.description && (
        <p className="text-gray-700 mt-1">{repo.description}</p>
      )}
      <div className="flex flex-wrap gap-4 text-sm mt-3 text-gray-600">
        <span>⭐ {repo.stargazerCount}</span>
        <span>🍴 {repo.forkCount}</span>
        {repo.primaryLanguage && (
          <span className="flex items-center gap-1">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: repo.primaryLanguage.color }}
            />
            {repo.primaryLanguage.name}
          </span>
        )}
      </div>
      <div className="text-xs text-gray-400 mt-2">
        Created: {new Date(repo.createdAt).toLocaleDateString()} | Updated:{" "}
        {new Date(repo.updatedAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default RepoCard;
