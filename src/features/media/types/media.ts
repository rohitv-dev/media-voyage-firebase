export type MediaType = "Movie" | "Show" | "Game" | "Book";

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
  type: string;
  platform?: string;
  recommended?: string;
  status: string;
  uid?: string;
  genre?: string;
}
