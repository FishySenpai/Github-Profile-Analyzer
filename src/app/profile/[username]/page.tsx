"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Github,
  Search,
  TrendingUp,
  Users,
  Star,
  GitFork,
  Code,
  Zap,
  Moon,
  Sun,
  MapPin,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Advanced search state
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [searchMode, setSearchMode] = useState<"username" | "advanced">(
    "username"
  );
  const [searchCriteria, setSearchCriteria] = useState({
    language: "any",
    location: "",
    minRepos: 0,
    minFollowers: 0,
    sortBy: "best-match",
  });
  const [searchResults, setSearchResults] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [displayedCount, setDisplayedCount] = useState(12);
  const [loadingMore, setLoadingMore] = useState(false);

  // Apply dark class to <html> on toggle
  // ...existing useEffect for dark mode...

  const fetchProfile = async () => {
    if (!username.trim()) {
      setError("Please enter a GitHub username");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      router.push(`/profile/${username}`);
    } catch (err) {
      setError("Failed to fetch profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const searchProfiles = async () => {
    setLoading(true);
    setError(null);
    setDisplayedCount(12);
    setSearchResults([]);

    try {
      let query = "";

      if (searchCriteria.language && searchCriteria.language !== "any") {
        query += `language:${searchCriteria.language} `;
      }

      if (searchCriteria.location) {
        query += `location:${searchCriteria.location} `;
      }

      if (searchCriteria.minRepos > 0) {
        query += `repos:>=${searchCriteria.minRepos} `;
      }

      if (searchCriteria.minFollowers > 0) {
        query += `followers:>=${searchCriteria.minFollowers} `;
      }

      query += "type:user";

      const response = await fetch(
        `https://api.github.com/search/users?q=${encodeURIComponent(
          query
        )}&per_page=100&sort=${searchCriteria.sortBy}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
          },
        }
      );

      const data = await response.json();

      if (data.items) {
        setTotalCount(data.total_count);

        const detailedUsers = await Promise.all(
          data.items.map(async (user) => {
            const userResponse = await fetch(user.url, {
              headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
              },
            });
            return userResponse.json();
          })
        );

        setSearchResults(detailedUsers);
      }
    } catch (err) {
      setError("Search failed. Please try again.");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setDisplayedCount((prev) => Math.min(prev + 12, searchResults.length));
      setLoadingMore(false);
    }, 300);
  };

  const visibleResults = searchResults.slice(0, displayedCount);
  const hasMore = displayedCount < searchResults.length;

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
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-12 max-w-2xl mx-auto">
            Get detailed analytics, contribution patterns, and AI-powered
            insights for any GitHub developer
          </p>

          {/* Search Mode Toggle */}
          <div className="flex justify-center gap-2 mb-6">
            <Button
              variant={searchMode === "username" ? "default" : "outline"}
              onClick={() => {
                setSearchMode("username");
                setSearchResults([]);
                setError(null);
              }}
            >
              Search by Username
            </Button>
            <Button
              variant={searchMode === "advanced" ? "default" : "outline"}
              onClick={() => {
                setSearchMode("advanced");
                setUsername("");
                setError(null);
              }}
            >
              Discover Developers
            </Button>
          </div>

          {/* Username Search */}
          {searchMode === "username" && (
            <div className="max-w-2xl mx-auto">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Enter GitHub username..."
                    className="pl-10 h-12 text-base"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && fetchProfile()}
                  />
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
            </div>
          )}

          {/* Advanced Search */}
          {searchMode === "advanced" && (
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Discover Developers</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAdvanced(!showAdvanced)}
                    >
                      {showAdvanced ? (
                        <>
                          <ChevronUp className="h-4 w-4 mr-1" />
                          Hide Filters
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4 mr-1" />
                          Show Filters
                        </>
                      )}
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Find developers by language, location, and expertise
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Always visible: Language and Location */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Code className="h-4 w-4" />
                        Programming Language
                      </label>
                      <Select
                        value={searchCriteria.language}
                        onValueChange={(value) =>
                          setSearchCriteria({
                            ...searchCriteria,
                            language: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any Language</SelectItem>
                          <SelectItem value="javascript">JavaScript</SelectItem>
                          <SelectItem value="typescript">TypeScript</SelectItem>
                          <SelectItem value="python">Python</SelectItem>
                          <SelectItem value="java">Java</SelectItem>
                          <SelectItem value="go">Go</SelectItem>
                          <SelectItem value="rust">Rust</SelectItem>
                          <SelectItem value="cpp">C++</SelectItem>
                          <SelectItem value="csharp">C#</SelectItem>
                          <SelectItem value="ruby">Ruby</SelectItem>
                          <SelectItem value="php">PHP</SelectItem>
                          <SelectItem value="swift">Swift</SelectItem>
                          <SelectItem value="kotlin">Kotlin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Location
                      </label>
                      <Input
                        placeholder="e.g., San Francisco, Remote"
                        value={searchCriteria.location}
                        onChange={(e) =>
                          setSearchCriteria({
                            ...searchCriteria,
                            location: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Advanced Filters (Collapsible) */}
                  {showAdvanced && (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Minimum Repositories: {searchCriteria.minRepos}
                        </label>
                        <Slider
                          value={[searchCriteria.minRepos]}
                          onValueChange={(value) =>
                            setSearchCriteria({
                              ...searchCriteria,
                              minRepos: value[0],
                            })
                          }
                          max={100}
                          step={5}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Minimum Followers: {searchCriteria.minFollowers}
                        </label>
                        <Slider
                          value={[searchCriteria.minFollowers]}
                          onValueChange={(value) =>
                            setSearchCriteria({
                              ...searchCriteria,
                              minFollowers: value[0],
                            })
                          }
                          max={1000}
                          step={50}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Sort By</label>
                        <Select
                          value={searchCriteria.sortBy}
                          onValueChange={(value) =>
                            setSearchCriteria({
                              ...searchCriteria,
                              sortBy: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="best-match">
                              Best Match
                            </SelectItem>
                            <SelectItem value="followers">
                              Most Followers
                            </SelectItem>
                            <SelectItem value="repositories">
                              Most Repositories
                            </SelectItem>
                            <SelectItem value="joined">
                              Recently Joined
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  <Button
                    onClick={searchProfiles}
                    disabled={loading}
                    className="w-full"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <span className="mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin inline-block" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Search Developers
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
        </div>
      </section>

      {/* Search Results Section */}
      {searchMode === "advanced" && searchResults.length > 0 && (
        <section className="container mx-auto px-4 pb-20">
          <div className="space-y-6">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold">
                  Found {totalCount.toLocaleString()} developers
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Showing {visibleResults.length} of{" "}
                  {Math.min(searchResults.length, totalCount)} loaded results
                </p>
              </div>

              {searchResults.length < totalCount && (
                <Badge variant="secondary">
                  Loaded {searchResults.length} of {totalCount.toLocaleString()}{" "}
                  total
                </Badge>
              )}
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {visibleResults.map((user) => (
                <Card
                  key={user.login}
                  className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
                  onClick={() => router.push(`/profile/${user.login}`)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <img
                        src={user.avatar_url}
                        alt={user.login}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">
                          {user.name || user.login}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                          @{user.login}
                        </p>
                        {user.location && (
                          <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{user.location}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {user.bio && (
                      <p className="mt-3 text-sm text-slate-700 dark:text-slate-300 line-clamp-2">
                        {user.bio}
                      </p>
                    )}

                    <div className="flex gap-3 mt-4 text-xs">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-slate-500" />
                        <span className="font-medium">{user.followers}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-slate-500" />
                        <span className="font-medium">{user.public_repos}</span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/profile/${user.login}`);
                      }}
                    >
                      View Profile
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="flex flex-col items-center gap-3 pt-6">
                <Button
                  onClick={loadMore}
                  disabled={loadingMore}
                  size="lg"
                  variant="outline"
                >
                  {loadingMore ? (
                    <>
                      <span className="mr-2 h-4 w-4 border-2 border-t-transparent border-slate-600 rounded-full animate-spin inline-block" />
                      Loading...
                    </>
                  ) : (
                    <>
                      Load More ({searchResults.length - displayedCount}{" "}
                      remaining)
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Features Section */}
      {/* ...keep your existing features section... */}
    </div>
  );
}
