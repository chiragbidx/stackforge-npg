"use server";

import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { collections, teamMembers } from "@/lib/db/schema";
import { getAuthSession } from "@/lib/auth/session";

// Validation schema
const collectionSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Max 100 characters"),
  description: z.string().max(300, "Max 300 characters").optional(),
});

export async function createCollection(teamId: string, formData: FormData) {
  const session = await getAuthSession();
  if (!session) {
    return { error: "Not authenticated" };
  }
  // Validate membership/permission (owner, admin, member)
  const [member] = await db
    .select({ role: teamMembers.role })
    .from(teamMembers)
    .where(
      and(eq(teamMembers.userId, session.userId), eq(teamMembers.teamId, teamId))
    )
    .limit(1);
  if (!member) return { error: "Access denied" };

  const parse = collectionSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || "",
  });

  if (!parse.success) return { error: parse.error.flatten().fieldErrors };

  // Uniqueness check
  const [existing] = await db
    .select({ id: collections.id })
    .from(collections)
    .where(and(eq(collections.teamId, teamId), eq(collections.name, parse.data.name)))
    .limit(1);
  if (existing) return { error: { name: ["Collection with this name already exists."] } };

  await db.insert(collections).values({
    name: parse.data.name,
    description: parse.data.description ?? "",
    teamId,
    createdBy: session.userId,
  });
  return { success: true };
}

export async function updateCollection(collectionId: string, formData: FormData) {
  const session = await getAuthSession();
  if (!session) return { error: "Not authenticated" };

  const [col] = await db
    .select({ id: collections.id, teamId: collections.teamId, createdBy: collections.createdBy })
    .from(collections)
    .where(eq(collections.id, collectionId))
    .limit(1);

  if (!col) return { error: "Collection not found" };

  // Permission: owner, admin, or creator (member)
  const [member] = await db
    .select({ role: teamMembers.role })
    .from(teamMembers)
    .where(
      and(eq(teamMembers.userId, session.userId), eq(teamMembers.teamId, col.teamId))
    )
    .limit(1);

  if (!member) return { error: "Access denied" };
  if (!(["owner", "admin"].includes(member.role) || col.createdBy === session.userId)) return { error: "Insufficient permissions" };

  const parse = collectionSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || "",
  });
  if (!parse.success) return { error: parse.error.flatten().fieldErrors };

  // Uniqueness check for renaming
  const [existing] = await db
    .select({ id: collections.id })
    .from(collections)
    .where(
      and(
        eq(collections.teamId, col.teamId),
        eq(collections.name, parse.data.name),
        col.id !== collectionId
      )
    ).limit(1);
  if (existing) return { error: { name: ["Collection with this name already exists."] } };

  await db
    .update(collections)
    .set({
      name: parse.data.name,
      description: parse.data.description ?? "",
      updatedAt: new Date(),
    })
    .where(eq(collections.id, collectionId));
  return { success: true };
}

export async function deleteCollection(collectionId: string) {
  const session = await getAuthSession();
  if (!session) return { error: "Not authenticated" };

  const [col] = await db
    .select({ id: collections.id, teamId: collections.teamId, createdBy: collections.createdBy })
    .from(collections)
    .where(eq(collections.id, collectionId))
    .limit(1);

  if (!col) return { error: "Collection not found" };

  const [member] = await db
    .select({ role: teamMembers.role })
    .from(teamMembers)
    .where(
      and(eq(teamMembers.userId, session.userId), eq(teamMembers.teamId, col.teamId))
    )
    .limit(1);

  if (!member) return { error: "Access denied" };
  if (!(["owner", "admin"].includes(member.role) || col.createdBy === session.userId)) return { error: "Insufficient permissions" };

  await db.delete(collections).where(eq(collections.id, collectionId));
  return { success: true };
}