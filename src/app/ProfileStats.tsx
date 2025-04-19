// components/ProfileStats.tsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

type Repo = {
  name: string;
  stargazerCount: number;
  primaryLanguage?: {
    name: string;
    color: string;
  };
};

const ProfileStats = ({ repos }: { repos: Repo[] }) => {
  const starsData = repos.map((repo) => ({
    name: repo.name,
    stars: repo.stargazerCount,
  }));

  const languageMap: Record<
    string,
    { name: string; count: number; color?: string }
  > = {};

  repos.forEach((repo) => {
    const lang = repo.primaryLanguage?.name;
    if (lang) {
      if (!languageMap[lang]) {
        languageMap[lang] = {
          name: lang,
          count: 1,
          color: repo.primaryLanguage?.color,
        };
      } else {
        languageMap[lang].count += 1;
      }
    }
  });

  const languageData = Object.values(languageMap);

  return (
    <div className="grid md:grid-cols-2 gap-8 my-6">
      {/* Stars Chart */}
      <div className="h-80">
        <h2 className="text-lg font-semibold mb-2">⭐ Stars per Repo</h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={starsData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="stars" fill="#3182CE" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Languages Chart */}
      <div className="h-80">
        <h2 className="text-lg font-semibold mb-2">🧑‍💻 Languages Used</h2>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={languageData}
              dataKey="count"
              nameKey="name"
              outerRadius={100}
              label
            >
              {languageData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || "#8884d8"} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProfileStats;
