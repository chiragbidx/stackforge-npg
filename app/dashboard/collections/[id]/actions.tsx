"use server";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { titles, teamMembers, collections } from "@/lib/db/schema";
import { getAuthSession } from "@/lib/auth/session";

// Validation schema for Title
const titleSchema = z.object({
  name: z.string().min(1, "Name required").max(150),
  type: z.enum(["show", "movie"], { errorMap: () => ({ message: "Type must be Show or Movie" }) }),
  platform: z.string().max(50, "Max 50 chars").optional(),
  genres: z.preprocess(
    (val) => (typeof val === "string" ? JSON.parse(val) : val),
    z.array(z.string()).max(5, "Max 5 genres").optional()
  ),
  description: z.string().max(500, "Max 500 chars").optional(),
  posterUrl: z
    .string()
    .max(300, "Max 300 chars")
    .optional()
    .refine(
      (val) => !val || /^(https?:\/\/).+\.[a-z]{2,6}(\/\S*)?$/i.test(val),
      { message: "Invalid URL" }
    ),
});

export async function createTitle(collectionId: string, teamId: string, formData: FormData) {
  const session = await getAuthSession();
  if (!session) return { error: "Not authenticated" };
  // Only allow member, admin, owner with valid team
  const [member] = await db
    .select({ role: teamMembers.role })
    .from(teamMembers)
    .where(and(eq(teamMembers.userId, session.userId), eq(teamMembers.teamId, teamId)))
    .limit(1);
  if (!member) return { error: "Access denied" };

  // Validate collection association
  const [col] = await db
    .select({ id: collections.id, teamId: collections.teamId })
    .from(collections)
    .where(eq(collections.id, collectionId))
    .limit(1);
  if (!col || col.teamId !== teamId) return { error: "Invalid collection/team" };

  // Parse/validate input
  const parse = titleSchema.safeParse({
    name: formData.get("name"),
    type: formData.get("type"),
    platform: formData.get("platform") || undefined,
    genres: formData.get("genres"),
    description: formData.get("description") || undefined,
    posterUrl: formData.get("posterUrl") || undefined,
  });

  if (!parse.success) return { error: parse.error.flatten().fieldErrors };

  // Uniqueness check
  const [existing] = await db
    .select({ id: titles.id })
    .from(titles)
    .where(and(eq(titles.collectionId, collectionId), eq(titles.name, parse.data.name)))
    .limit(1);
  if (existing) return { error: { name: ["Title with this name already exists."] } };

  await db.insert(titles).values({
    name: parse.data.name,
    type: parse.data.type,
    platform: parse.data.platform || null,
    genres: parse.data.genres ?? null,
    description: parse.data.description ?? "",
    posterUrl: parse.data.posterUrl ?? "",
    collectionId,
    createdBy: session.userId,
  });
  return { success: true };
}

export async function updateTitle(titleId: string, formData: FormData) {
  const session = await getAuthSession();
  if (!session) return { error: "Not authenticated" };

  // Find title and its collection/team
  const [title] = await db
    .select({ id: titles.id, collectionId: titles.collectionId, createdBy: titles.createdBy, name: titles.name })
    .from(titles)
    .where(eq(titles.id, titleId))
    .limit(1);
  if (!title) return { error: "Title not found" };

  // Find user/team role and ensure permission
  const [col] = await db
    .select({ teamId: collections.teamId })
    .from(collections)
    .where(eq(collections.id, title.collectionId))
    .limit(1);
  if (!col) return { error: "Collection/team not found" };

  const [member] = await db
    .select({ role: teamMembers.role })
    .from(teamMembers)
    .where(and(eq(teamMembers.userId, session.userId), eq(teamMembers.teamId, col.teamId)))
    .limit(1);
  if (!member) return { error: "Access denied" };
  if (!(["owner", "admin"].includes(member.role) || title.createdBy === session.userId)) return { error: "Insufficient permissions" };

  const parse = titleSchema.safeParse({
    name: formData.get("name"),
    type: formData.get("type"),
    platform: formData.get("platform") || undefined,
    genres: formData.get("genres"),
    description: formData.get("description") || undefined,
    posterUrl: formData.get("posterUrl") || undefined,
  });
  if (!parse.success) return { error: parse.error.flatten().fieldErrors };

  // Uniqueness check if name changed
  if (title.name !== parse.data.name) {
    const [existing] = await db
      .select({ id: titles.id })
      .from(titles)
      .where(and(eq(titles.collectionId, title.collectionId), eq(titles.name, parse.data.name)))
      .limit(1);
    if (existing) return { error: { name: ["Another title with this name already exists."] } };
  }

  await db
    .update(titles)
    .set({
      name: parse.data.name,
      type: parse.data.type,
      platform: parse.data.platform || null,
      genres: parse.data.genres ?? null,
      description: parse.data.description ?? "",
      posterUrl: parse.data.posterUrl ?? "",
      updatedAt: new Date(),
    })
    .where(eq(titles.id, titleId));
  return { success: true };
}

export async function deleteTitle(titleId: string) {
  const session = await getAuthSession();
  if (!session) return { error: "Not authenticated" };

  // Find title's collection/team and createdBy
  const [title] = await db
    .select({ id: titles.id, collectionId: titles.collectionId, createdBy: titles.createdBy })
    .from(titles)
    .where(eq(titles.id, titleId))
    .limit(1);

  if (!title) return { error: "Title not found" };

  // Find team id
  const [col] = await db
    .select({ teamId: collections.teamId })
    .from(collections)
    .where(eq(collections.id, title.collectionId))
    .limit(1);

  if (!col) return { error: "Collection/team not found" };

  // Check permissions
  const [member] = await db
    .select({ role: teamMembers.role })
    .from(teamMembers)
    .where(and(eq(teamMembers.userId, session.userId), eq(teamMembers.teamId, col.teamId)))
    .limit(1);
  if (!member) return { error: "Access denied" };
  if (!(["owner", "admin"].includes(member.role) || title.createdBy === session.userId)) return { error: "Insufficient permissions" };

  await db.delete(titles).where(eq(titles.id, titleId));
  return { success: true };
}