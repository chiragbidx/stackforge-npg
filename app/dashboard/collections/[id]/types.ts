export type Title = {
  id: string;
  name: string;
  type: "show" | "movie";
  platform?: string | null;
  genres?: string[] | null;
  description?: string | null;
  posterUrl?: string | null;
  createdBy: string;
  createdAt: Date | string;
  updatedAt?: Date | string | null;
};

export type Collection = {
  id: string;
  name: string;
  description?: string | null;
  teamId?: string;
  createdBy?: string;
};