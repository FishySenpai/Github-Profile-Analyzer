"use client";

import { fetchGitHubGraphQL } from "../../lib/github";
import { useState } from "react";

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
          repositories(first: 10, orderBy: {field: STARGAZERS, direction: DESC}) {
            nodes {
              name
              stargazerCount
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
    <main className="p-8">
      <h1 className="text-3xl font-bold">GitHub Profile Analyzer</h1>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter GitHub username"
        className="p-2 border-2 border-gray-400 rounded-md"
      />
      <button
        onClick={fetchProfile}
        className="ml-4 p-2 bg-blue-500 text-white rounded-md"
      >
        Analyze
      </button>

      {profile && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">{profile.name}</h2>
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-24 h-24 rounded-full"
          />
          <ul>
            {profile.repositories.nodes.map((repo: any) => (
              <li key={repo.name} className="mt-2">
                <span className="font-medium">{repo.name}</span> (
                {repo.stargazerCount} stars) - {repo.primaryLanguage?.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
