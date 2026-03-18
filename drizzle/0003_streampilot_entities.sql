-- StreamPilot entities migration

-- 1. Collections
CREATE TABLE IF NOT EXISTS "collections" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "team_id" TEXT NOT NULL REFERENCES "teams"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "created_by" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT collections_team_name_idx UNIQUE ("team_id", "name")
);

-- 2. Titles
CREATE TABLE IF NOT EXISTS "titles" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "collection_id" TEXT NOT NULL REFERENCES "collections"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "platform" TEXT,
  "genres" JSON,
  "description" TEXT,
  "poster_url" TEXT,
  "created_by" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT titles_collection_name_idx UNIQUE ("collection_id", "name")
);

-- 3. WatchStatus
CREATE TABLE IF NOT EXISTS "watch_status" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "title_id" TEXT NOT NULL REFERENCES "titles"("id") ON DELETE CASCADE,
  "user_id" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "status" TEXT NOT NULL,
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT watchstatus_title_user_idx UNIQUE ("title_id", "user_id")
);

-- 4. Reviews
CREATE TABLE IF NOT EXISTS "reviews" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "title_id" TEXT NOT NULL REFERENCES "titles"("id") ON DELETE CASCADE,
  "user_id" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "rating" INTEGER NOT NULL,
  "review_text" TEXT,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT reviews_title_user_idx UNIQUE ("title_id", "user_id")
);

-- 5. Recommendations
CREATE TABLE IF NOT EXISTS "recommendations" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "title_id" TEXT NOT NULL REFERENCES "titles"("id") ON DELETE CASCADE,
  "recommended_by" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "recommended_to_user_id" TEXT REFERENCES "users"("id") ON DELETE CASCADE,
  "recommended_to_team_id" TEXT REFERENCES "teams"("id") ON DELETE CASCADE,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Comments
CREATE TABLE IF NOT EXISTS "comments" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "title_id" TEXT NOT NULL REFERENCES "titles"("id") ON DELETE CASCADE,
  "user_id" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "comment_text" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);