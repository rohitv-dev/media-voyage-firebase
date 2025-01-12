import { z } from "zod";

export const MediaStatusEnum = z.enum(["Completed", "In Progress", "Planned", "Dropped"]);
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
  isPrivate: boolean;
}

export interface CSVMedia {
  Title: string;
  Status: string;
  Type: string;
  Rating: number;
  "Added On": string;
  "Last Updated On": string;
  "Started On"?: string;
  "Completed On"?: string;
  Platform?: string;
  Tags: string[];
  Genre?: string;
  Recommended?: string;
  Comments?: string;
}

export interface MediaCount {
  total: number;
  completed: number;
  dropped: number;
  planned: number;
  inProgress: number;
}
