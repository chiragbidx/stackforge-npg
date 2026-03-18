import { redirect } from "next/navigation";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { getAuthSession } from "@/lib/auth/session";
import { collections, teamMembers, titles, users } from "@/lib/db/schema";
import { CollectionDetailClient } from "./client";

export const dynamic = "force-dynamic";

export default async function CollectionDetailPage({ params }: { params: { id: string } }) {
  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");
  const collectionId = params.id;

  // Find collection and membership
  const [col] = await db
    .select({
      id: collections.id,
      name: collections.name,
      description: collections.description,
      teamId: collections.teamId,
      createdBy: collections.createdBy,
    })
    .from(collections)
    .where(eq(collections.id, collectionId))
    .limit(1);

  if (!col) redirect("/dashboard/collections");

  const [teamMember] = await db
    .select({ teamId: teamMembers.teamId, role: teamMembers.role })
    .from(teamMembers)
    .where(and(eq(teamMembers.userId, session.userId), eq(teamMembers.teamId, col.teamId)))
    .limit(1);

  if (!teamMember) redirect("/dashboard/team");

  // Fetch all titles for this collection
  const titleResults = await db
    .select({
      id: titles.id,
      name: titles.name,
      type: titles.type,
      platform: titles.platform,
      genres: titles.genres,
      description: titles.description,
      posterUrl: titles.posterUrl,
      createdBy: titles.createdBy,
      createdAt: titles.createdAt,
      updatedAt: titles.updatedAt,
    })
    .from(titles)
    .where(eq(titles.collectionId, collectionId));

  // Fetch user info for creators
  const usersMap: Record<string, { firstName: string; lastName: string }> = {};
  if (titleResults.length > 0) {
    const createdByIds = Array.from(new Set(titleResults.map((t) => t.createdBy)));
    const creators = await db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
      })
      .from(users)
      .where((row) =>
        createdByIds.length === 1
          ? eq(users.id, createdByIds[0])
          : row.in(users.id, createdByIds)
      );
    creators.forEach((u) => {
      usersMap[u.id] = { firstName: u.firstName, lastName: u.lastName };
    });
  }

  return (
    <CollectionDetailClient
      collection={col}
      teamRole={teamMember.role}
      titles={titleResults}
      usersMap={usersMap}
      sessionUserId={session.userId}
      teamId={teamMember.teamId}
    />
  );
}