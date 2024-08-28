import { z } from "zod";

export const mediaSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  createdAt: z.date(),
  updatedAt: z.date(),
  startDate: z.date().optional(),
  completedDate: z.date().optional(),
  tags: z.array(z.string()),
  comments: z.string().optional(),
  rating: z.number(),
  type: z.string(),
  platform: z.string().optional(),
  recommended: z.string().optional(),
  status: z.string(),
});
