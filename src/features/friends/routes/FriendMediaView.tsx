import { SingleMediaLoader } from "@features/media/api/loaders";
import { singleMediaQuery } from "@features/media/api/queries";
import { MediaView } from "@features/media/components/MediaView";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useLoaderData } from "react-router-dom";

export const FriendMediaView = () => {
  const id = useLoaderData() as SingleMediaLoader;

  const { data } = useSuspenseQuery(singleMediaQuery(id));

  return <MediaView media={data} viewOnly />;
};
