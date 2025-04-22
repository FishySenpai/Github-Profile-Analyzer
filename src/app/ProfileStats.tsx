"use client";

import { Pie } from "react-chartjs-2";
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
import { Line } from "react-chartjs-2";

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
  const commitsPerLang: Record<string, number> = {};

  repos.forEach((repo) => {
    const lang = repo.primaryLanguage?.name || "Unknown";
    languageCount[lang] = (languageCount[lang] || 0) + 1;
    starsPerRepo[repo.name] = repo.stargazerCount;

    // Simulated commit counts (replace this with real commit data later)
    commitsPerLang[lang] =
      (commitsPerLang[lang] || 0) + Math.floor(Math.random() * 100);
  });

  const langLabels = Object.keys(languageCount);
  const langData = Object.values(languageCount);

  const commitLangLabels = Object.keys(commitsPerLang);
  const commitLangData = Object.values(commitsPerLang);

  const starsLabels = Object.keys(starsPerRepo);
  const starsData = Object.values(starsPerRepo);

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

      {/* Commits per Language */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Commits per Language</h3>
        <Pie
          data={{
            labels: commitLangLabels,
            datasets: [
              {
                data: commitLangData,
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
      <div className="md:col-span-2">
        <h3 className="text-lg font-semibold mb-2">Stars per Repo</h3>
        <Line
          data={{
            labels: starsLabels,
            datasets: [
              {
                label: "Stars",
                data: starsData,
                fill: true,
                borderColor: "#60a5fa",
                backgroundColor: "rgba(96, 165, 250, 0.3)",
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
