import { isNullish } from "remeda";
import { MediaStatusEnum, MediaTypeEnum } from "../types/media";
import { z } from "zod/v4";

export const addMediaSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    createdAt: z.date(),
    updatedAt: z.date(),
    tags: z.array(z.string()),
    startDate: z
      .string()
      .transform((val) => new Date(val))
      .optional(),
    completedDate: z
      .string()
      .transform((val) => new Date(val))
      .optional(),
    comments: z.string().optional(),
    rating: z.number(),
    type: MediaTypeEnum,
    status: MediaStatusEnum,
    platform: z.string().optional(),
    recommended: z.string().optional(),
    isPrivate: z.boolean(),
    genre: z.string().optional(),
  })
  .refine(
    (val) => {
      if (val.status === MediaStatusEnum.enum.Completed && isNullish(val.completedDate)) return false;
      return true;
    },
    {
      path: ["completedDate"],
      error: "Completed Date is required when Status is Completed",
    }
  );

export const updateMediaSchema = z.object({ ...addMediaSchema.shape, id: z.string().optional() }).refine(
  (val) => {
    if (val.status === MediaStatusEnum.enum.Completed && isNullish(val.completedDate)) return false;
    return true;
  },
  {
    path: ["completedDate"],
    error: "Completed Date is required when Status is Completed",
  }
);

export type AddMediaSchema = z.input<typeof addMediaSchema>;
export type UpdateMediaSchema = z.input<typeof updateMediaSchema>;
