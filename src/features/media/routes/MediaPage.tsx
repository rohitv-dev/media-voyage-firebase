import { useQuery } from "@tanstack/react-query";
import { Container } from "@mantine/core";
import { MediaTable } from "../components/MediaTable";
import { LoadingScreen } from "@components/LoadingScreen";
import { useRouteLoaderData } from "react-router-dom";
import { UserLoader } from "@features/authentication/routes/routes";
import { ErrorScreen } from "@components/ErrorScreen";
import { mediaQuery } from "../api/queries";
import { MediaCountSection } from "../components/MediaCountSection";

export const MediaPage = () => {
  const uid = useRouteLoaderData("root") as UserLoader;

  const { data, isPending, isError, error } = useQuery(mediaQuery(String(uid)));

  if (isPending) return <LoadingScreen />;
  if (isError) return <ErrorScreen message={error.message} />;

  return (
    <Container>
      <MediaCountSection />
      <MediaTable data={data} />
    </Container>
  );
};
