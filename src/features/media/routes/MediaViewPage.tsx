import { useLoaderData } from "react-router-dom";
import { useSuspenseQuery } from "@tanstack/react-query";
import { MediaView } from "../components/MediaView";
import { singleMediaQuery } from "../api/queries";
import { SingleMediaLoader } from "../api/loaders";

export const MediaViewPage = () => {
  const id = useLoaderData() as SingleMediaLoader;

  const { data: media } = useSuspenseQuery(singleMediaQuery(id));

  return <MediaView media={media} />;
};
