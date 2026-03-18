import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { getAuthSession } from "@/lib/auth/session";
import { collections, teamMembers, users } from "@/lib/db/schema";
import { CollectionsClient } from "./client";

export const dynamic = "force-dynamic";

export default async function CollectionsPage() {
  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");

  // Find team membership for current user
  const [teamMember] = await db
    .select({ teamId: teamMembers.teamId, role: teamMembers.role })
    .from(teamMembers)
    .where(eq(teamMembers.userId, session.userId))
    .limit(1);

  if (!teamMember) redirect("/dashboard/team");

  // Fetch all collections for this team
  const items = await db
    .select({
      id: collections.id,
      name: collections.name,
      description: collections.description,
      createdAt: collections.createdAt,
      updatedAt: collections.updatedAt,
      createdBy: collections.createdBy,
    })
    .from(collections)
    .where(eq(collections.teamId, teamMember.teamId));

  // Fetch user info for creators
  const usersMap: Record<string, { firstName: string; lastName: string }> = {};
  if (items.length > 0) {
    const createdByIds = Array.from(new Set(items.map((c) => c.createdBy)));
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
    <CollectionsClient
      collections={items}
      usersMap={usersMap}
      teamRole={teamMember.role}
      teamId={teamMember.teamId}
      sessionUserId={session.userId}
    />
  );
}