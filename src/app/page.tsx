"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { fetchGitHubGraphQL } from "../../lib/github";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Github,
  Search,
  BarChart3,
  Users,
  GitBranch,
  Star,
  TrendingUp,
  Zap,
  Clock,
  Moon,
  Sun,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchLoading, setSearchLoading] = useState(false);

  const searchRef = useRef(null);

  // Apply dark class to <html> on toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch username suggestions
  const fetchSuggestions = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setSearchLoading(true);

    try {
      const response = await fetch(
        `https://api.github.com/search/users?q=${encodeURIComponent(
          query
        )}&per_page=8`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 403) {
          toast.error("Rate limit exceeded. Please try again later.");
          return;
        }
        throw new Error("Failed to fetch suggestions");
      }

      const data = await response.json();

      if (data.items) {
        setSuggestions(data.items);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      toast.error("Failed to load suggestions");
    } finally {
      setSearchLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (username) {
        fetchSuggestions(username);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300); // Wait 300ms after user stops typing

    return () => clearTimeout(timer);
  }, [username]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === "Enter") {
        fetchProfile();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          selectSuggestion(suggestions[selectedIndex]);
        } else {
          fetchProfile();
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const selectSuggestion = (user) => {
    setUsername(user.login);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    toast.success(`Analyzing ${user.login}'s profile...`);
    // Navigate immediately
    router.push(`/profile/${user.login}`);
  };

  const fetchProfile = async () => {
    if (!username.trim()) {
      toast.error("Please enter a GitHub username");
      return;
    }

    setLoading(true);
    setShowSuggestions(false);

    try {
      toast.loading(`Analyzing ${username}'s profile...`, {
        id: "analyzing",
      });
      router.push(`/profile/${username}`);
    } catch (err) {
      toast.error("Failed to fetch profile. Please try again.", {
        id: "analyzing",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-slate-900 dark:bg-white rounded-lg">
              <Github className="h-6 w-6 text-white dark:text-slate-900" />
            </div>
            <span className="text-xl font-bold">GitAnalyzer</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#features"
              className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
            >
              How it works
            </a>
            <a
              href="/search"
              className="text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              Discover Developers
            </a>
            <Button variant="outline" size="sm">
              <Github className="h-4 w-4 mr-2" />
              Sign in with GitHub
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle dark mode"
              onClick={() => setDarkMode((d) => !d)}
              className="ml-2"
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-slate-700" />
              )}
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            <Zap className="h-3 w-3 mr-1" />
            Analyze any GitHub profile instantly
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            Unlock insights from
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}
              GitHub profiles
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            Get detailed analytics, contribution patterns, and insights from any
            GitHub profile. Perfect for recruiters, developers, and teams.
          </p>

          {/* Search Form with Autocomplete */}
          <div className="max-w-md mx-auto mb-8" ref={searchRef}>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
                <Input
                  placeholder="Enter GitHub username..."
                  className="pl-10 h-12 text-base"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => {
                    if (suggestions.length > 0) {
                      setShowSuggestions(true);
                    }
                  }}
                  autoComplete="off"
                />

                {/* Loading indicator in input */}
                {searchLoading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <span className="h-4 w-4 border-2 border-t-transparent border-slate-400 rounded-full animate-spin inline-block" />
                  </div>
                )}

                {/* Autocomplete Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-80 overflow-y-auto z-50">
                    {suggestions.map((user, index) => (
                      <div
                        key={user.id}
                        className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
                          index === selectedIndex
                            ? "bg-blue-50 dark:bg-blue-950"
                            : "hover:bg-slate-50 dark:hover:bg-slate-700"
                        } ${
                          index === suggestions.length - 1
                            ? ""
                            : "border-b border-slate-100 dark:border-slate-700"
                        }`}
                        onClick={() => selectSuggestion(user)}
                        onMouseEnter={() => setSelectedIndex(index)}
                      >
                        <img
                          src={user.avatar_url}
                          alt={user.login}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">
                            {user.login}
                          </div>
                          {user.type && (
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              {user.type}
                            </div>
                          )}
                        </div>
                        <Search className="h-4 w-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                )}

                {/* No results message */}
                {showSuggestions &&
                  suggestions.length === 0 &&
                  username.length >= 2 &&
                  !searchLoading && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-4 z-50">
                      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                        No users found matching "{username}"
                      </p>
                    </div>
                  )}
              </div>

              <Button
                size="lg"
                className="h-12 px-6"
                onClick={fetchProfile}
                disabled={loading}
              >
                {loading ? (
                  <span className="mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin inline-block" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Analyze
              </Button>
            </div>

            {/* Keyboard shortcuts hint */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 text-center">
                Use ↑↓ to navigate, Enter to select, Esc to close
              </div>
            )}

            <p className="text-sm text-slate-500 mt-2">
              Try: octocat, torvalds, or any GitHub username
            </p>
          </div>


          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                10K+
              </div>
              <div className="text-slate-600 dark:text-slate-300">
                Profiles Analyzed
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                50+
              </div>
              <div className="text-slate-600 dark:text-slate-300">
                Data Points
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                99.9%
              </div>
              <div className="text-slate-600 dark:text-slate-300">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Powerful Analytics Features
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Get comprehensive insights into GitHub profiles with our advanced
            analytics tools
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg w-fit">
                <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle>Contribution Analysis</CardTitle>
              <CardDescription>
                Detailed breakdown of commits, pull requests, and contribution
                patterns over time
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg w-fit">
                <GitBranch className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle>Repository Insights</CardTitle>
              <CardDescription>
                Analyze repository languages, stars, forks, and project
                complexity metrics
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg w-fit">
                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle>Activity Trends</CardTitle>
              <CardDescription>
                Track coding activity, streak analysis, and productivity
                patterns
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg w-fit">
                <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <CardTitle>Community Impact</CardTitle>
              <CardDescription>
                Measure influence through followers, collaborations, and open
                source contributions
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg w-fit">
                <Star className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle>Skill Assessment</CardTitle>
              <CardDescription>
                Identify programming languages, frameworks, and technical
                expertise levels
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="p-2 bg-teal-100 dark:bg-teal-900 rounded-lg w-fit">
                <Clock className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              </div>
              <CardTitle>Real-time Updates</CardTitle>
              <CardDescription>
                Get the latest data with real-time synchronization from GitHub
                API
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="bg-white dark:bg-slate-800 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Get comprehensive GitHub profile analysis in just three simple
              steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  1
                </span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Enter Username
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Simply enter any GitHub username in the search box above
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  2
                </span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                AI Analysis
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Our AI analyzes repositories, commits, and contribution patterns
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  3
                </span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Get Insights
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Receive detailed analytics and actionable insights instantly
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Ready to analyze your GitHub profile?
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
            Join thousands of developers who use GitAnalyzer to understand their
            coding journey
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="h-12 px-8"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <Search className="h-4 w-4 mr-2" />
              Start Analysis
            </Button>
            <Button variant="outline" size="lg" className="h-12 px-8">
              <Github className="h-4 w-4 mr-2" />
              View on GitHub
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="p-2 bg-slate-900 dark:bg-white rounded-lg">
                <Github className="h-5 w-5 text-white dark:text-slate-900" />
              </div>
              <span className="font-bold">GitAnalyzer</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-600 dark:text-slate-300">
              <a
                href="#"
                className="hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Terms
              </a>
              <a
                href="#"
                className="hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t text-center text-sm text-slate-500">
            <p>© 2024 GitAnalyzer. Built with Next.js and Tailwind CSS.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
