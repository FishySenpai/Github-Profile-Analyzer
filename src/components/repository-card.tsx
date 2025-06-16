import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, GitFork, Clock } from "lucide-react"

interface Repository {
  name: string
  description: string
  language: string
  stars: number
  forks: number
  isPrivate: boolean
  updatedAt: string
}

interface RepositoryCardProps {
  repo: Repository
  rank: number
}

export function RepositoryCard({ repo, rank }: RepositoryCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-xs">
                #{rank}
              </Badge>
              <CardTitle className="text-lg">{repo.name}</CardTitle>
              {repo.isPrivate && (
                <Badge variant="secondary" className="text-xs">
                  Private
                </Badge>
              )}
            </div>
            <CardDescription className="text-sm">{repo.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-400 rounded-full" />
              <span>{repo.language}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              <span>{repo.stars.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <GitFork className="h-3 w-3" />
              <span>{repo.forks.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Clock className="h-3 w-3" />
            <span>{new Date(repo.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
