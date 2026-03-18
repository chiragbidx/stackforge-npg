"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Title = {
  id: string;
  name: string;
  type: string;
  platform?: string | null;
  genres?: string[] | null;
  description?: string | null;
  posterUrl?: string | null;
  createdBy: string;
  createdAt: string | Date;
  updatedAt: string | Date | null;
  collectionId: string;
};

type Collection = {
  id: string;
  name: string;
};

type UsersMap = Record<string, { firstName: string; lastName: string }>;

export function BrowseClient({
  titles,
  collections,
  usersMap,
  teamRole,
  sessionUserId,
}: {
  titles: Title[];
  collections: Collection[];
  usersMap: UsersMap;
  teamRole: string;
  sessionUserId: string;
}) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "show" | "movie">("all");
  const [filterCollection, setFilterCollection] = useState<string>("all");
  const [filterPlatform, setFilterPlatform] = useState<string>("all");

  let filtered = titles.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  if (filterType !== "all") {
    filtered = filtered.filter((t) => t.type === filterType);
  }
  if (filterCollection !== "all") {
    filtered = filtered.filter((t) => t.collectionId === filterCollection);
  }
  if (filterPlatform !== "all") {
    filtered = filtered.filter((t) => (t.platform || "").toLowerCase() === filterPlatform.toLowerCase());
  }

  // Platform options
  const platforms = Array.from(new Set(titles.map((t) => t.platform).filter(Boolean)));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Browse All Titles</h1>
      <div className="mb-6 flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-xs font-bold mb-1">Search</label>
          <div className="relative">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search titles..."
              className="md:w-64 pr-8"
            />
            <Search className="absolute top-2.5 right-2 w-4 h-4 text-muted-foreground" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold mb-1">Type</label>
          <select className="input"
            value={filterType}
            onChange={e => setFilterType(e.target.value as any)}
          >
            <option value="all">All</option>
            <option value="show">Shows</option>
            <option value="movie">Movies</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold mb-1">Collection</label>
          <select className="input"
            value={filterCollection}
            onChange={e => setFilterCollection(e.target.value)}
          >
            <option value="all">All</option>
            {collections.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold mb-1">Platform</label>
          <select className="input"
            value={filterPlatform}
            onChange={e => setFilterPlatform(e.target.value)}
          >
            <option value="all">All</option>
            {platforms.map(p => (
              <option key={p as string} value={p as string}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center mt-24">
          <Eye className="w-16 h-16 text-muted-foreground/20 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No titles match your filters</h2>
          <div className="text-muted-foreground">Try resetting your filters or add a new title!</div>
        </div>
      ) : (
        <div className={cn("grid gap-6", filtered.length === 1 ? "md:grid-cols-1" : "md:grid-cols-2 lg:grid-cols-3")}>
          {filtered.map((t) => (
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
                <div className="text-sm text-muted-foreground mb-2">{t.description || <span className="italic text-gray-400">No description</span>}</div>
                <div className="flex flex-wrap gap-2 mt-1">
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
                    Added by {usersMap[t.createdBy]?.firstName || "Someone"}
                  </Badge>
                  <div className="text-xs text-muted-foreground ml-auto">
                    {new Date(t.createdAt).toLocaleDateString()}
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