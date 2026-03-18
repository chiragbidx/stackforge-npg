"use client";

import { useRef, useState } from "react";
import { createTitle } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const GENRE_OPTIONS = [
  "Drama", "Comedy", "Action", "Thriller", "Sci-Fi", "Fantasy", "Documentary", "Romance", "Animation", "Horror", "Crime", "Adventure", "Family"
];

export function CreateTitleForm({
  collectionId,
  teamId,
  onComplete,
}: {
  collectionId: string;
  teamId: string;
  onComplete: () => void;
}) {
  const ref = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Record<string, string[]> | string | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.set("genres", JSON.stringify(selectedGenres));
    const result = await createTitle(collectionId, teamId, formData);
    setLoading(false);

    if (result?.success) {
      ref.current?.reset();
      setSelectedGenres([]);
      onComplete();
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
        <Input name="name" required maxLength={150} placeholder="e.g. Stranger Things" />
      </label>
      <label className="block font-medium text-sm">
        Type
        <Select name="type" required>
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
        <Input name="platform" maxLength={50} placeholder="e.g. Netflix, Hulu" />
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
        <Textarea name="description" maxLength={500} placeholder="Optional description"/>
      </label>
      <label className="block font-medium text-sm">
        Poster URL
        <Input name="posterUrl" maxLength={300} placeholder="https://..." />
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
      <Button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add"}
      </Button>
    </form>
  );
}