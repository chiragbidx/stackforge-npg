export type Collection = {
  id: string;
  name: string;
  description?: string | null;
  createdAt: Date | string;
  updatedAt?: Date | string | null;
  createdBy: string;
};