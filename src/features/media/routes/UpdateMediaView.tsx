import { useLoaderData } from "react-router-dom";
import { UpdateMediaForm } from "../forms/UpdateMediaForm";
import { useSuspenseQuery } from "@tanstack/react-query";
import { singleMediaQuery } from "../api/queries";
import { SingleMediaLoader } from "../api/loaders";

export const UpdateMediaView = () => {
  const id = useLoaderData() as SingleMediaLoader;

  const { data: media } = useSuspenseQuery(singleMediaQuery(id));

  return <UpdateMediaForm media={media} />;
};
