"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchGitHubGraphQL } from "../../../../lib/github";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Github,
  MapPin,
  LinkIcon,
  Calendar,
  Star,
  GitFork,
  Code,
  Award,
  Zap,
} from "lucide-react";
import { ContributionChart } from "@/components/contribution-chart";
import { LanguageChart } from "@/components/language-chart";
import { ActivityChart } from "@/components/activity-chart";
import { RepositoryCard } from "@/components/repository-card";
import { CommitChart } from "@/components/commit-chart";

// Mock data for demonstration
const profileData = {
  username: "octocat",
  name: "The Octocat",
  bio: "GitHub's mascot and Git guru 🐙",
  avatar: "/placeholder.svg?height=120&width=120",
  location: "San Francisco, CA",
  website: "https://github.com",
  joinDate: "2011-01-25",
  followers: 4521,
  following: 9,
  publicRepos: 8,
  totalStars: 12543,
  totalForks: 3421,
  totalCommits: 1247,
  contributionStreak: 42,
  languages: [
    { name: "JavaScript", percentage: 35, color: "#f1e05a" },
    { name: "TypeScript", percentage: 28, color: "#2b7489" },
    { name: "Python", percentage: 20, color: "#3572A5" },
    { name: "Go", percentage: 12, color: "#00ADD8" },
    { name: "Rust", percentage: 5, color: "#dea584" },
  ],
  topRepos: [
    {
      name: "Hello-World",
      description: "My first repository on GitHub!",
      language: "JavaScript",
      stars: 1892,
      forks: 1049,
      isPrivate: false,
      updatedAt: "2024-01-15",
    },
    {
      name: "Spoon-Knife",
      description: "This repo is for demonstration purposes only.",
      language: "HTML",
      stars: 12345,
      forks: 143234,
      isPrivate: false,
      updatedAt: "2024-01-10",
    },
    {
      name: "git-consortium",
      description: "This repository is for managing the Git project.",
      language: "C",
      stars: 234,
      forks: 45,
      isPrivate: false,
      updatedAt: "2024-01-08",
    },
  ],
};

export default function ProfileAnalysisPage({
  params,
}: {
  params: { username: string };
}) {
  const { username } = React.use(params);
  const [profileData, setProfileData] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      const query = `
        query($login: String!) {
          user(login: $login) {
            username: login
            name
            bio
            avatarUrl
            location
            websiteUrl
            createdAt
            followers {
              totalCount
            }
            following {
              totalCount
            }
            repositories(first: 100, orderBy: {field: STARGAZERS, direction: DESC}) {
              totalCount
              nodes {
                name
                description
                url
                stargazerCount
                forkCount
                isPrivate
                updatedAt
                createdAt
                primaryLanguage {
                  name
                  color
                }
              }
            }
            contributionsCollection {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    contributionCount
                  }
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
          setProfileData(null);
        } else {
          const user = data.user;
          const contributionCalendar =
            data.user.contributionsCollection.contributionCalendar;

          // Generate chartData
          const chartData = generateChartData(contributionCalendar);

          // Pass chartData to ContributionChart
          setChartData(chartData);
          // Map the fetched data to the structure of `profileData`
          const mappedProfileData = {
            username: user.username,
            name: user.name,
            bio: user.bio,
            avatar: user.avatarUrl,
            location: user.location,
            website: user.websiteUrl,
            joinDate: user.createdAt,
            followers: user.followers.totalCount,
            following: user.following.totalCount,
            publicRepos: user.repositories.totalCount,
            totalStars: user.repositories.nodes.reduce(
              (acc, repo) => acc + repo.stargazerCount,
              0
            ),
            totalForks: user.repositories.nodes.reduce(
              (acc, repo) => acc + repo.forkCount,
              0
            ),
            totalCommits:
              user.contributionsCollection.contributionCalendar
                .totalContributions,
            contributionStreak: calculateContributionStreak(
              user.contributionsCollection.contributionCalendar.weeks
            ),
            languages: user.repositories.nodes.reduce((acc, repo) => {
              const lang = repo.primaryLanguage;
              if (lang) {
                const existingLang = acc.find((l) => l.name === lang.name);
                if (existingLang) {
                  existingLang.percentage += 1;
                } else {
                  acc.push({
                    name: lang.name,
                    percentage: 1,
                    color: lang.color,
                  });
                }
              }
              return acc;
            }, []),
            topRepos: user.repositories.nodes.slice(0, 3).map((repo) => ({
              name: repo.name,
              description: repo.description,
              language: repo.primaryLanguage?.name || "Unknown",
              stars: repo.stargazerCount,
              forks: repo.forkCount,
              isPrivate: repo.isPrivate,
              updatedAt: repo.updatedAt,
            })),
          };

          setProfileData(mappedProfileData);
          console.log("Profile Data:", data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch profile data");
        setProfileData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  function generateChartData(contributionCalendar) {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Initialize an object to store contributions by month
    const monthlyContributions = Array(12).fill(0);

    // Loop through weeks and aggregate contributions by month
    contributionCalendar.weeks.forEach((week, weekIndex) => {
      week.contributionDays.forEach((day, dayIndex) => {
        const approximateDate = new Date();
        approximateDate.setDate(1); // Start at the first day of the month
        approximateDate.setMonth(weekIndex); // Use the week index to approximate the month
        const month = approximateDate.getMonth(); // Get the month (0-11)
        monthlyContributions[month] += day.contributionCount; // Add contributions to the corresponding month
      });
    });
console.log("Monthly Contributions:", monthlyContributions);
    // Generate chartData from monthlyContributions
    const chartData = months.map((month, index) => ({
      date: month,
      contributions: monthlyContributions[index],
    }));

    return chartData;
  }
  const calculateContributionStreak = (weeks: any[]) => {
    let streak = 0;
    let maxStreak = 0;

    weeks.forEach((week) => {
      week.contributionDays.forEach((day) => {
        if (day.contributionCount > 0) {
          streak++;
          maxStreak = Math.max(maxStreak, streak);
        } else {
          streak = 0;
        }
      });
    });

    return maxStreak;
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="border-b bg-white dark:bg-slate-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <a href="/">← Back to Home</a>
            </Button>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
            <h1 className="text-xl font-semibold">Profile Analysis</h1>
          </div>
          <Button variant="outline" size="sm">
            <Github className="h-4 w-4 mr-2" />
            View on GitHub
          </Button>
        </div>
      </header>
      {profileData && (
        <div className="container mx-auto px-4 py-8">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <Avatar className="h-24 w-24 md:h-32 md:w-32">
                  <AvatarImage
                    src={profileData.avatar || "/placeholder.svg"}
                    alt={profileData.name}
                  />
                  <AvatarFallback>{profileData.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                        {profileData.name}
                      </h1>
                      <p className="text-lg text-slate-600 dark:text-slate-300 mb-2">
                        @{profileData.username}
                      </p>
                      <p className="text-slate-700 dark:text-slate-300 mb-3">
                        {profileData.bio}
                      </p>
                    </div>
                    <Badge variant="secondary" className="w-fit">
                      <Award className="h-3 w-3 mr-1" />
                      Pro Developer
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-300 mb-4">
                    {profileData.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {profileData.location}
                      </div>
                    )}
                    {profileData.website && (
                      <div className="flex items-center gap-1">
                        <LinkIcon className="h-4 w-4" />
                        <a
                          href={profileData.website}
                          className="hover:underline"
                        >
                          {profileData.website}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined{" "}
                      {new Date(profileData.joinDate).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        {profileData.followers.toLocaleString()}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">
                        Followers
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        {profileData.following}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">
                        Following
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        {profileData.publicRepos}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">
                        Repositories
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        {profileData.contributionStreak}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">
                        Day Streak
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Stars
                </CardTitle>
                <Star className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {profileData.totalStars.toLocaleString()}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Forks
                </CardTitle>
                <GitFork className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {profileData.totalForks.toLocaleString()}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  +8% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Commits
                </CardTitle>
                <Code className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {profileData.totalCommits.toLocaleString()}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  +23% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Contribution Streak
                </CardTitle>
                <Zap className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {profileData.contributionStreak}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Current streak
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="repositories">Repositories</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Contribution Chart */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Contribution Activity</CardTitle>
                    <CardDescription>
                      Daily contribution activity over the past year
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ContributionChart  chartData={chartData}/>
                  </CardContent>
                </Card>

                {/* Language Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Language Distribution</CardTitle>
                    <CardDescription>
                      Programming languages used across repositories
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <LanguageChart languages={profileData.languages} />
                  </CardContent>
                </Card>

                {/* Commit Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Commit Activity</CardTitle>
                    <CardDescription>
                      Commits over the past 12 months
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px] w-[700px]">
                    <CommitChart />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Activity Timeline</CardTitle>
                    <CardDescription>
                      Detailed activity breakdown over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="w-full">
                    <ActivityChart />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Activity Summary</CardTitle>
                    <CardDescription>Key activity metrics</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Most Active Day</span>
                      <Badge variant="secondary">Wednesday</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Peak Hour</span>
                      <Badge variant="secondary">2-3 PM</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Avg Commits/Day</span>
                      <Badge variant="secondary">3.4</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Longest Streak</span>
                      <Badge variant="secondary">89 days</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Productivity Score</CardTitle>
                    <CardDescription>
                      Based on contribution patterns
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Consistency</span>
                        <span>92%</span>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Quality</span>
                        <span>88%</span>
                      </div>
                      <Progress value={88} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Impact</span>
                        <span>95%</span>
                      </div>
                      <Progress value={95} className="h-2" />
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Overall Score</span>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          A+
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="repositories" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="text-lg font-semibold">Top Repositories</h3>
                  {profileData.topRepos.map((repo, index) => (
                    <RepositoryCard
                      key={repo.name}
                      repo={repo}
                      rank={index + 1}
                    />
                  ))}
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Repository Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm">Public Repos</span>
                        <span className="font-medium">
                          {profileData.publicRepos}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Private Repos</span>
                        <span className="font-medium">12</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Forked Repos</span>
                        <span className="font-medium">23</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Contributed To</span>
                        <span className="font-medium">156</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Repository Languages</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {profileData.languages.map((lang) => (
                        <div key={lang.name} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{lang.name}</span>
                            <span>{lang.percentage}%</span>
                          </div>
                          <Progress value={lang.percentage} className="h-2" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>AI-Generated Insights</CardTitle>
                    <CardDescription>
                      Key observations about this developer profile
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                        🚀 High Activity Developer
                      </h4>
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        Maintains consistent contribution patterns with a 42-day
                        streak. Shows strong commitment to open source
                        development.
                      </p>
                    </div>

                    <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                      <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
                        💡 Polyglot Programmer
                      </h4>
                      <p className="text-sm text-green-800 dark:text-green-200">
                        Demonstrates expertise across multiple programming
                        languages, with strong focus on JavaScript and
                        TypeScript.
                      </p>
                    </div>

                    <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                      <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">
                        🌟 Community Impact
                      </h4>
                      <p className="text-sm text-purple-800 dark:text-purple-200">
                        High star count indicates valuable contributions to the
                        developer community. Projects show good documentation
                        and maintenance.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recommendations</CardTitle>
                    <CardDescription>
                      Suggestions for profile improvement
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-sm">
                          Add more documentation
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          Consider adding README files to repositories without
                          documentation
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-sm">
                          Explore new technologies
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          Consider learning emerging technologies like
                          WebAssembly or GraphQL
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-sm">
                          Increase collaboration
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          Participate in more open source projects to expand
                          network
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Developer Profile Summary</CardTitle>
                    <CardDescription>
                      Comprehensive analysis of coding patterns and expertise
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                          Expert
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">
                          Skill Level
                        </div>
                        <p className="text-xs mt-1">
                          Based on code complexity and contribution patterns
                        </p>
                      </div>

                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                          High
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">
                          Activity Level
                        </div>
                        <p className="text-xs mt-1">
                          Consistent daily contributions and engagement
                        </p>
                      </div>

                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                          Strong
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">
                          Community Impact
                        </div>
                        <p className="text-xs mt-1">
                          Valuable contributions with high engagement
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
