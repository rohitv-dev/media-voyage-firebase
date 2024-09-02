import { useLoaderData } from "react-router-dom";
import { SingleMediaLoader, singleMediaQuery } from "./routes";
import { UpdateMediaForm } from "../forms/UpdateMediaForm";
import { useSuspenseQuery } from "@tanstack/react-query";

export const UpdateMediaView = () => {
  const id = useLoaderData() as SingleMediaLoader;

  const { data: media } = useSuspenseQuery(singleMediaQuery(id));

  return <UpdateMediaForm media={media} />;
};
