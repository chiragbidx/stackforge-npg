"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreateCollectionForm } from "./forms/create-collection-form";
import { EditCollectionForm } from "./forms/edit-collection-form";
import { Collection } from "./types";
import { cn } from "@/lib/utils";

export function CollectionsClient({
  collections,
  usersMap,
  teamRole,
  teamId,
  sessionUserId,
}: {
  collections: Collection[];
  usersMap: Record<string, { firstName: string; lastName: string }>;
  teamRole: string;
  teamId: string;
  sessionUserId: string;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editCollectionId, setEditCollectionId] = useState<string | null>(null);
  const router = useRouter();

  // Trigger dialog for edit by Collection ID
  function handleEdit(id: string) {
    setEditCollectionId(id);
    setDialogOpen(true);
  }

  function handleCloseDialog() {
    setEditCollectionId(null);
    setDialogOpen(false);
  }

  const canCreate = ["owner", "admin", "member"].includes(teamRole);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Collections</h1>
          <div className="text-muted-foreground text-sm">
            Group shows and movies by topic, event, or interest. Invite your team to contribute!
          </div>
        </div>
        {canCreate && (
          <Dialog open={dialogOpen && !editCollectionId} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default" className="gap-2">
                <Plus className="w-4 h-4" />
                New Collection
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a new Collection</DialogTitle>
              </DialogHeader>
              <CreateCollectionForm
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

      {collections.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Users className="w-16 h-16 text-muted-foreground/20 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No collections yet</h2>
          <div className="max-w-xl text-center text-muted-foreground mb-4">
            Start your StreamPilot journey — create a collection for a watch party, series, or custom list!
          </div>
          {canCreate && (
            <Button onClick={() => setDialogOpen(true)} variant="default" className="gap-2">
              <Plus className="w-4 h-4" />
              New Collection
            </Button>
          )}
        </div>
      ) : (
        <div className={cn("grid gap-6", collections.length === 1 ? "md:grid-cols-1" : "md:grid-cols-2 lg:grid-cols-3")}>
          {collections.map((col) => (
            <Card key={col.id} className="relative group hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex w-full justify-between items-start gap-2">
                  <div>
                    <Link href={`/dashboard/collections/${col.id}`} className="hover:underline">
                      {col.name}
                    </Link>
                  </div>
                  {(teamRole === "owner" || teamRole === "admin" || col.createdBy === sessionUserId) && (
                    <Dialog open={dialogOpen && editCollectionId === col.id} onOpenChange={open => !open ? handleCloseDialog() : handleEdit(col.id)}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-7" title="Edit collection">
                          <span className="sr-only">Edit</span>
                          <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M15.232 5.232a3 3 0 1 1 4.243 4.243l-10 10A3 3 0 0 1 7 20H4v-3a3 3 0 0 1 .879-2.121l10-10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 7 17 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Collection</DialogTitle>
                        </DialogHeader>
                        <EditCollectionForm
                          collection={col}
                          onComplete={() => {
                            handleCloseDialog();
                            router.refresh();
                          }}
                        />
                      </DialogContent>
                    </Dialog>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-2">{col.description || <span className="italic text-gray-400">No description</span>}</div>
                <div className="flex items-center gap-2 mt-3">
                  <Badge>
                    Created by {usersMap[col.createdBy]?.firstName || "Someone"}
                  </Badge>
                  <div className="text-xs text-muted-foreground ml-auto">
                    {new Date(col.createdAt).toLocaleDateString()}
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