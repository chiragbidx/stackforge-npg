import { redirect } from "next/navigation";
import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { getAuthSession } from "@/lib/auth/session";
import { recommendations, titles, users, teamMembers, collections } from "@/lib/db/schema";
import { RecommendedClient } from "./client";

export const dynamic = "force-dynamic";

export default async function RecommendedPage() {
  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");

  // Find team membership for current user
  const [teamMember] = await db
    .select({ teamId: teamMembers.teamId, role: teamMembers.role })
    .from(teamMembers)
    .where(eq(teamMembers.userId, session.userId))
    .limit(1);

  if (!teamMember) redirect("/dashboard/team");

  // Find titles most recommended (by count), limited display to top 24
  // Drizzle doesn't support aggregate/groupby as conveniently, so use raw query if needed
  const rawRecommended = await db.execute(`
    SELECT t.id, t.name, t.type, t.platform, t.genres, t.description, t.poster_url, t.created_by, t.created_at, t.updated_at, t.collection_id,
      COUNT(r.id) AS recommendation_count
    FROM recommendations r
    JOIN titles t ON r.title_id = t.id
    JOIN collections c ON t.collection_id = c.id
    WHERE (r.recommended_to_team_id = $1 OR c.team_id = $1)
    GROUP BY t.id
    ORDER BY recommendation_count DESC, t.created_at DESC
    LIMIT 24
  `, [teamMember.teamId]);

  // Users map for creator attribution
  const result = Array.isArray(rawRecommended.rows) ? rawRecommended.rows : [];
  const usersMap: Record<string, { firstName: string; lastName: string }> = {};
  if (result.length > 0) {
    const createdByIds = Array.from(new Set(result.map((t: any) => t.created_by)));
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
    <RecommendedClient
      recommended={result}
      usersMap={usersMap}
      teamRole={teamMember.role}
      sessionUserId={session.userId}
    />
  );
}