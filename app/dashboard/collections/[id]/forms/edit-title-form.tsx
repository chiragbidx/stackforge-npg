"use client";

import { useRef, useState } from "react";
import { updateTitle, deleteTitle } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Title } from "../types";

const GENRE_OPTIONS = [
  "Drama", "Comedy", "Action", "Thriller", "Sci-Fi", "Fantasy", "Documentary", "Romance", "Animation", "Horror", "Crime", "Adventure", "Family"
];

function parseGenres(genres: string[] | null | undefined) {
  if (!genres) return [];
  if (Array.isArray(genres)) return genres;
  try {
    return JSON.parse(genres as any);
  } catch {
    return [];
  }
}

export function EditTitleForm({
  title,
  onComplete,
}: {
  title: Title;
  onComplete: () => void;
}) {
  const ref = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState<Record<string, string[]> | string | null>(null);
  const router = useRouter();

  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    parseGenres(title.genres)
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.set("genres", JSON.stringify(selectedGenres));
    const result = await updateTitle(title.id, formData);
    setLoading(false);

    if (result?.success) {
      ref.current?.reset();
      onComplete();
    } else if (result?.error) {
      setError(result.error);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this title? All reviews/comments/etc will be deleted.")) return;
    setDeleteLoading(true);
    const result = await deleteTitle(title.id);
    setDeleteLoading(false);
    if (result?.success) {
      onComplete();
      router.refresh();
    } else if (result?.error) {
      setError(result.error);
    }
  }

  function toggleGenre(genre: string) {
    setSelectedGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : [...prev, genre]
    );
  }

  return (
    <form ref={ref} className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <label className="block font-medium text-sm">
        Title Name
        <Input name="name" defaultValue={title.name} required maxLength={150} />
      </label>
      <label className="block font-medium text-sm">
        Type
        <Select name="type" required defaultValue={title.type}>
          <SelectTrigger>
            <SelectValue placeholder="Choose..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="show">Show</SelectItem>
            <SelectItem value="movie">Movie</SelectItem>
          </SelectContent>
        </Select>
      </label>
      <label className="block font-medium text-sm">
        Platform
        <Input name="platform" defaultValue={title.platform ?? ""} maxLength={50} />
      </label>
      <label className="block font-medium text-sm">
        Genres
        <div className="flex flex-wrap gap-2 mt-1">
          {GENRE_OPTIONS.map((genre) => (
            <Button key={genre}
              type="button"
              size="sm"
              variant={selectedGenres.includes(genre) ? "default" : "outline"}
              className="rounded-full"
              onClick={() => toggleGenre(genre)}
            >
              {genre}
            </Button>
          ))}
        </div>
      </label>
      <label className="block font-medium text-sm">
        Description
        <Textarea name="description" maxLength={500} defaultValue={title.description ?? ""} />
      </label>
      <label className="block font-medium text-sm">
        Poster URL
        <Input name="posterUrl" maxLength={300} defaultValue={title.posterUrl ?? ""} />
      </label>
      {error && (
        <div className="bg-red-50 text-red-500 text-sm px-3 py-2 rounded mb-2 border border-red-100">
          {typeof error === "string"
            ? error
            : Object.entries(error).map(([key, arr]) => (
                <span key={key}>
                  {key[0].toUpperCase() + key.slice(1)}: {arr.join(", ")}
                </span>
              ))}
        </div>
      )}
      <div className="flex gap-2 items-center justify-end">
        <Button type="button" variant="destructive" onClick={handleDelete} disabled={deleteLoading}>
          {deleteLoading ? "Deleting..." : "Delete"}
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}