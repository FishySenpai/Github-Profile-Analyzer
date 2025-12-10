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
import { Search, MapPin, Code, TrendingUp, Users } from "lucide-react";

export default function SearchPage() {
  const router = useRouter();
  const [searchCriteria, setSearchCriteria] = useState({
    language: "any",
    location: "",
    minRepos: 0,
    minFollowers: 0,
    minContributions: 0,
    sortBy: "best-match",
  });

  const [searchResults, setSearchResults] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [displayedCount, setDisplayedCount] = useState(12); // Show 12 initially
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const searchProfiles = async () => {
    setLoading(true);
    setDisplayedCount(12); // Reset to initial count

    try {
      // Build GitHub search query
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

      // Fetch up to 100 users (GitHub API limit per page)
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

        // Fetch detailed info for users in batches
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
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    setLoadingMore(true);
    // Simulate loading delay for better UX
    setTimeout(() => {
      setDisplayedCount((prev) => Math.min(prev + 12, searchResults.length));
      setLoadingMore(false);
    }, 300);
  };

  const visibleResults = searchResults.slice(0, displayedCount);
  const hasMore = displayedCount < searchResults.length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Discover Developers</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Find developers by language, location, and expertise level
          </p>
        </div>

        {/* Search Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search Criteria</CardTitle>
            <CardDescription>
              Refine your search to find the perfect developers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Language Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Code className="h-4 w-4" />
                Programming Language
              </label>
              <Select
                value={searchCriteria.language}
                onValueChange={(value) =>
                  setSearchCriteria({ ...searchCriteria, language: value })
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

            {/* Location Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </label>
              <Input
                placeholder="e.g., San Francisco, London, Remote"
                value={searchCriteria.location}
                onChange={(e) =>
                  setSearchCriteria({
                    ...searchCriteria,
                    location: e.target.value,
                  })
                }
              />
            </div>

            {/* Minimum Repositories */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Minimum Repositories: {searchCriteria.minRepos}
              </label>
              <Slider
                value={[searchCriteria.minRepos]}
                onValueChange={(value) =>
                  setSearchCriteria({ ...searchCriteria, minRepos: value[0] })
                }
                max={100}
                step={5}
              />
            </div>

            {/* Minimum Followers */}
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

            {/* Sort By */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Sort By</label>
              <Select
                value={searchCriteria.sortBy}
                onValueChange={(value) =>
                  setSearchCriteria({ ...searchCriteria, sortBy: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="best-match">Best Match</SelectItem>
                  <SelectItem value="followers">Most Followers</SelectItem>
                  <SelectItem value="repositories">
                    Most Repositories
                  </SelectItem>
                  <SelectItem value="joined">Recently Joined</SelectItem>
                </SelectContent>
              </Select>
            </div>

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

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-6">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  Found {totalCount.toLocaleString()} developers
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleResults.map((user) => (
                <Card
                  key={user.login}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => router.push(`/profile/${user.login}`)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <img
                        src={user.avatar_url}
                        alt={user.login}
                        className="w-16 h-16 rounded-full"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {user.name || user.login}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          @{user.login}
                        </p>
                        {user.location && (
                          <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                            <MapPin className="h-3 w-3" />
                            {user.location}
                          </div>
                        )}
                      </div>
                    </div>

                    {user.bio && (
                      <p className="mt-3 text-sm text-slate-700 dark:text-slate-300 line-clamp-2">
                        {user.bio}
                      </p>
                    )}

                    <div className="flex gap-4 mt-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-slate-500" />
                        <span className="font-medium">{user.followers}</span>
                        <span className="text-slate-500">followers</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-slate-500" />
                        <span className="font-medium">{user.public_repos}</span>
                        <span className="text-slate-500">repos</span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
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
                  className="min-w-[200px]"
                >
                  {loadingMore ? (
                    <>
                      <span className="mr-2 h-4 w-4 border-2 border-t-transparent border-slate-600 rounded-full animate-spin inline-block" />
                      Loading...
                    </>
                  ) : (
                    <>
                      Show More ({searchResults.length - displayedCount}{" "}
                      remaining)
                    </>
                  )}
                </Button>
                <p className="text-sm text-slate-500">
                  Showing {displayedCount} of {searchResults.length} loaded
                  developers
                </p>
              </div>
            )}

            {/* All Loaded Message */}
            {!hasMore && searchResults.length < totalCount && (
              <div className="text-center py-6">
                <p className="text-slate-600 dark:text-slate-400">
                  Showing all {searchResults.length} loaded results.
                  {totalCount > searchResults.length && (
                    <>
                      {" "}
                      There are{" "}
                      {(
                        totalCount - searchResults.length
                      ).toLocaleString()}{" "}
                      more results available.
                    </>
                  )}
                </p>
              </div>
            )}
          </div>
        )}

        {/* No Results */}
        {!loading && searchResults.length === 0 && totalCount === 0 && (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <Search className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No results found</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Try adjusting your search criteria
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
