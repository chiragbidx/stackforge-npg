"use client";

import Link from "next/link";
import { Sparkles, Star, ThumbsUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Recommended = {
  id: string;
  name: string;
  type: string;
  platform?: string | null;
  genres?: string[] | null;
  description?: string | null;
  poster_url?: string | null;
  created_by: string;
  created_at: string | Date;
  updated_at: string | Date | null;
  collection_id: string;
  recommendation_count: number;
};

type UsersMap = Record<string, { firstName: string; lastName: string }>;

export function RecommendedClient({
  recommended,
  usersMap,
  teamRole,
  sessionUserId,
}: {
  recommended: Recommended[];
  usersMap: UsersMap;
  teamRole: string;
  sessionUserId: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-6 h-6 text-secondary" />
        <h1 className="text-2xl font-bold">Most Recommended</h1>
      </div>
      {recommended.length === 0 ? (
        <div className="flex flex-col items-center mt-24">
          <ThumbsUp className="w-16 h-16 text-muted-foreground/20 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Nothing recommended yet</h2>
          <div className="text-muted-foreground text-center">As you and your team recommend titles to each other, they’ll appear here.</div>
        </div>
      ) : (
        <div className={cn("grid gap-6", recommended.length === 1 ? "md:grid-cols-1" : "md:grid-cols-2 lg:grid-cols-3")}>
          {recommended.map((t) => (
            <Card key={t.id} className="relative group hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>
                  <Link href={`/dashboard/titles/${t.id}`} className="hover:underline flex items-center gap-2">
                    <span>{t.name}</span>
                    <Badge variant={t.type === "movie" ? "secondary" : "default"}>
                      {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                    </Badge>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-primary flex gap-2 mb-2">
                  <Star className="inline-block w-4 h-4" />
                  <span>{t.recommendation_count} recommendation{t.recommendation_count === 1 ? "" : "s"}</span>
                </div>
                <div className="text-sm text-muted-foreground mb-2">{t.description || <span className="italic text-gray-400">No description</span>}</div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {Array.isArray(t.genres) && t.genres.length > 0 && (
                    <div className="flex gap-1">
                      {t.genres.map((genre, i) => (
                        <Badge key={i} variant="outline">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {t.platform && <Badge variant="secondary">{t.platform}</Badge>}
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Badge>
                    Added by {usersMap[t.created_by]?.firstName || "Someone"}
                  </Badge>
                  <div className="text-xs text-muted-foreground ml-auto">
                    {new Date(t.created_at).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}