"use client";

import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title
);

export default function ProfileStats({ repos }: { repos: any[] }) {
  const languageCount: Record<string, number> = {};
  const starsPerRepo: Record<string, number> = {};
  const commitsOverTime: { date: string; count: number }[] = [];

    for (let i = 0; i < 13; i++) {
      const daysAgo = 7 * i;
      const weekStart = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
      const formattedDate = `Week ${13 - i} (${
        weekStart.toISOString().split("T")[0]
      })`;

      commitsOverTime.unshift({
        date: formattedDate,
        count: Math.floor(Math.random() * 20),
      });
    }
  repos.forEach((repo) => {
    const lang = repo.primaryLanguage?.name || "Unknown";
    languageCount[lang] = (languageCount[lang] || 0) + 1;
    starsPerRepo[repo.name] = repo.stargazerCount;

  });

  const langLabels = Object.keys(languageCount);
  const langData = Object.values(languageCount);

  const starsLabels = Object.keys(starsPerRepo);
  const starsData = Object.values(starsPerRepo);

  const commitLabels = commitsOverTime.map((d) => d.date);
  const commitData = commitsOverTime.map((d) => d.count);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {/* Repos per Language */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Repos per Language</h3>
        <Pie
          data={{
            labels: langLabels,
            datasets: [
              {
                data: langData,
                backgroundColor: [
                  "#4ade80",
                  "#60a5fa",
                  "#f472b6",
                  "#facc15",
                  "#a78bfa",
                  "#f87171",
                ],
              },
            ],
          }}
        />
      </div>

      {/* Stars per Repo */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Stars per Repo</h3>
        <Pie
          data={{
            labels: starsLabels,
            datasets: [
              {
                data: starsData,
                backgroundColor: [
                  "#60a5fa",
                  "#34d399",
                  "#f87171",
                  "#fbbf24",
                  "#c084fc",
                  "#f472b6",
                ],
              },
            ],
          }}
        />
      </div>

      {/* Commits over Time */}
      <div className="md:col-span-2">
        <h3 className="text-lg font-semibold mb-2">Commits Over Time</h3>
        <Line
          data={{
            labels: commitLabels,
            datasets: [
              {
                label: "Commits",
                data: commitData,
                fill: true,
                borderColor: "#4ade80",
                backgroundColor: "rgba(74, 222, 128, 0.3)",
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: false,
              },
            },
          }}
        />
      </div>
    </div>
  );
}
