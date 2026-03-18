"use client";

import { useRef, useState } from "react";
import { updateCollection, deleteCollection } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { Collection } from "../types";

export function EditCollectionForm({
  collection,
  onComplete,
}: {
  collection: Collection;
  onComplete: () => void;
}) {
  const ref = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState<Record<string, string[]> | string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await updateCollection(collection.id, formData);
    setLoading(false);

    if (result?.success) {
      ref.current?.reset();
      onComplete();
    } else if (result?.error) {
      setError(result.error);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this collection? This cannot be undone.")) return;
    setDeleteLoading(true);
    const result = await deleteCollection(collection.id);
    setDeleteLoading(false);
    if (result?.success) {
      onComplete();
      router.push("/dashboard/collections");
      router.refresh();
    } else if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <form ref={ref} className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <label className="block font-medium text-sm">
        Name
        <Input name="name" defaultValue={collection.name} maxLength={100} required />
      </label>
      <label className="block font-medium text-sm">
        Description
        <Textarea name="description" defaultValue={collection.description ?? ""} maxLength={300} />
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