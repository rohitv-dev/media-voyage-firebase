import { useLoaderData } from "react-router-dom";
import { singleMediaLoader } from "./routes";
import { UpdateMediaForm } from "../forms/UpdateMediaForm";

export const UpdateMediaView = () => {
  const media = useLoaderData() as Awaited<ReturnType<ReturnType<typeof singleMediaLoader>>>;

  return <UpdateMediaForm media={media} />;
};
