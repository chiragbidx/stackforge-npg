"use client";

import { useRef, useState } from "react";
import { createCollection } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function CreateCollectionForm({
  teamId,
  onComplete,
}: {
  teamId: string;
  onComplete: () => void;
}) {
  const ref = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Record<string, string[]> | string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await createCollection(teamId, formData);
    setLoading(false);

    if (result?.success) {
      ref.current?.reset();
      onComplete();
    } else if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <form ref={ref} className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <label className="block font-medium text-sm">
        Name
        <Input name="name" required maxLength={100} placeholder="e.g. Family Movie Night" />
      </label>
      <label className="block font-medium text-sm">
        Description
        <Textarea name="description" maxLength={300} placeholder="Optional collection description" />
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
        {loading ? "Creating..." : "Create"}
      </Button>
    </form>
  );
}