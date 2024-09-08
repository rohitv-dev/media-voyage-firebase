import { z } from "zod";

export const MediaStatusEnum = z.enum(["Completed", "In Progress", "Planned"]);
export type MediaStatus = z.infer<typeof MediaStatusEnum>;

export const MediaTypeEnum = z.enum(["Movie", "Show", "Game", "Book"]);
export type MediaType = z.infer<typeof MediaTypeEnum>;

// TODO: No special characters in Genre, Platform

export interface Media {
  id?: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  startDate?: Date;
  completedDate?: Date;
  tags: string[];
  comments?: string;
  rating: number;
  type: MediaType;
  platform?: string;
  recommended?: string;
  status: MediaStatus;
  uid?: string;
  genre?: string;
}
