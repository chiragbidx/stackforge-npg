"use client";

import { useState } from "react";
import Link from "next/link";
import { PlusSquare, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreateTitleForm } from "./forms/create-title-form";
import { EditTitleForm } from "./forms/edit-title-form";
import { Title, Collection } from "./types";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function CollectionDetailClient({
  collection,
  teamRole,
  titles,
  usersMap,
  sessionUserId,
  teamId,
}: {
  collection: Collection;
  teamRole: string;
  titles: Title[];
  usersMap: Record<string, { firstName: string; lastName: string }>;
  sessionUserId: string;
  teamId: string;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTitleId, setEditTitleId] = useState<string | null>(null);
  const router = useRouter();

  function handleEdit(id: string) {
    setEditTitleId(id);
    setDialogOpen(true);
  }

  function handleCloseDialog() {
    setEditTitleId(null);
    setDialogOpen(false);
  }

  const canCreate = ["owner", "admin", "member"].includes(teamRole);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Folder className="w-6 h-6 text-muted-foreground" />
            {collection.name}
          </h1>
          <div className="text-muted-foreground text-sm">{collection.description}</div>
        </div>
        {canCreate && (
          <Dialog open={dialogOpen && !editTitleId} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default" className="gap-2">
                <PlusSquare className="w-4 h-4" />
                Add Title
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a Title</DialogTitle>
              </DialogHeader>
              <CreateTitleForm
                collectionId={collection.id}
                teamId={teamId}
                onComplete={() => {
                  setDialogOpen(false);
                  router.refresh();
                }}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
      {titles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Folder className="w-16 h-16 text-muted-foreground/20 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No titles in this collection</h2>
          <div className="max-w-xl text-center text-muted-foreground mb-4">
            Use <b>Add Title</b> to add your first show or movie!
          </div>
        </div>
      ) : (
        <div className={cn("grid gap-6", titles.length === 1 ? "md:grid-cols-1" : "md:grid-cols-2 lg:grid-cols-3")}>
          {titles.map((t) => (
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
                  {t.platform && (
                    <Badge variant="secondary">{t.platform}</Badge>
                  )}
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