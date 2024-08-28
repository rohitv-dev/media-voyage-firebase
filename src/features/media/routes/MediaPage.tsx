import { useQuery } from "@tanstack/react-query";
import { MediaService } from "../api/MediaService";
import { Container } from "@mantine/core";
import { Media } from "../types/media";
import { MediaTable } from "../components/MediaTable";
import { LoadingScreen } from "@components/LoadingScreen";
import { useLoaderData } from "react-router-dom";
import { userLoader } from "@features/authentication/routes/routes";
import { ErrorScreen } from "@components/ErrorScreen";

export const MediaPage = () => {
  const uid = useLoaderData() as Awaited<ReturnType<ReturnType<typeof userLoader>>>;

  const { data, isPending, isError, error } = useQuery<Media[]>({
    queryKey: ["media"],
    queryFn: async () => {
      const res = await MediaService.getMedia(typeof uid === "string" ? uid : "");
      if (!res.ok) {
        throw new Error(res.message);
      }
      return res.data;
    },
  });

  if (isPending) return <LoadingScreen />;
  if (isError) return <ErrorScreen message={error.message} />;

  return (
    <Container>
      <MediaTable data={data} />
    </Container>
  );
};
