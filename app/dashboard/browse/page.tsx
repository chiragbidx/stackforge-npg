import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { getAuthSession } from "@/lib/auth/session";
import { titles, teamMembers, users, collections } from "@/lib/db/schema";
import { BrowseClient } from "./client";

export const dynamic = "force-dynamic";

export default async function BrowsePage() {
  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");

  // Find team membership for current user
  const [teamMember] = await db
    .select({ teamId: teamMembers.teamId, role: teamMembers.role })
    .from(teamMembers)
    .where(eq(teamMembers.userId, session.userId))
    .limit(1);
  if (!teamMember) redirect("/dashboard/team");

  // Fetch all titles for this team (all collections)
  const result = await db
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
      collectionId: titles.collectionId,
    })
    .from(titles)
    .where(eq(titles.collectionId, collections.id))
    .limit(200);

  // List collections for filter display
  const allCollections = await db
    .select({
      id: collections.id,
      name: collections.name,
    })
    .from(collections)
    .where(eq(collections.teamId, teamMember.teamId));

  // Fetch user info for name display
  const usersMap: Record<string, { firstName: string; lastName: string }> = {};
  if (result.length > 0) {
    const createdByIds = Array.from(new Set(result.map((t) => t.createdBy)));
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
    <BrowseClient
      titles={result}
      collections={allCollections}
      usersMap={usersMap}
      teamRole={teamMember.role}
      sessionUserId={session.userId}
    />
  );
}