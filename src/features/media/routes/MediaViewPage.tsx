import { useLoaderData } from "react-router-dom";
import { SingleMediaLoader, singleMediaQuery } from "./routes";
import { useSuspenseQuery } from "@tanstack/react-query";
import { MediaView } from "../components/MediaView";

export const MediaViewPage = () => {
  const id = useLoaderData() as SingleMediaLoader;

  const { data: media } = useSuspenseQuery(singleMediaQuery(id));

  return <MediaView media={media} />;
};
