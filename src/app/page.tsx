"use client";

import { fetchGitHubGraphQL } from "../../lib/github";
import { useState } from "react";
import RepoCard from "./RepoCard";
import ProfileStats from "./ProfileStats";

export default function Home() {
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);

    const query = `
      query($login: String!) {
        user(login: $login) {
          name
          avatarUrl
          repositories(first: 100, orderBy: {field: STARGAZERS, direction: DESC}) {
            nodes {
              name
              description
              url
              stargazerCount
              forkCount
              createdAt
              updatedAt
              primaryLanguage {
                name
                color
              }
            }
          }
        }
      }
    `;

    try {
      const data = await fetchGitHubGraphQL(query, { login: username });
      if (!data.user) {
        setError("User not found");
        setProfile(null);
      } else {
        setProfile(data.user);
        console.log("Profile data:", data.user);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch profile data");
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">GitHub Profile Analyzer</h1>

      <div className="flex items-center mb-4 gap-2">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter GitHub username"
          className="p-2 border-2 border-gray-400 rounded-md w-full"
        />
        <button
          onClick={fetchProfile}
          className="p-2 bg-blue-500 text-white rounded-md"
        >
          {loading ? "Loading..." : "Analyze"}
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {profile && (
        <div className="mt-6">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-20 h-20 rounded-full"
            />
            <h2 className="text-2xl font-semibold">{profile.name}</h2>
          </div>

          {/* 📊 Charts */}
          <ProfileStats repos={profile.repositories.nodes} />

          {/* 📦 Repo Cards */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Top Repositories</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
              {" "}
              {profile.repositories.nodes.map((repo: any) => (
                <RepoCard key={repo.name} repo={repo} />
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
