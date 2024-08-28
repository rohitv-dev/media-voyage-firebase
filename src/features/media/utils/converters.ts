import { getDate } from "@utils/functions";
import { Media } from "../types/media";

export const parseMedia = (media: Media): Media => ({
  ...media,
  completedDate: media.completedDate ? getDate(media.completedDate) : undefined,
  startDate: media.startDate ? getDate(media.startDate) : undefined,
  createdAt: getDate(media.createdAt),
  updatedAt: getDate(media.updatedAt),
});
