import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams, useRouteLoaderData } from "react-router-dom";
import { Container, Title } from "@mantine/core";
import { MediaTable } from "@features/media/components/MediaTable";
import { friendMediaQuery } from "../api/queries";
import { FriendLoader } from "../api/loaders";

export const FriendMediaPage = () => {
  const { name } = useParams() as { name: string };
  const [uid, friendUid] = useRouteLoaderData("friend") as FriendLoader;

  const { data } = useSuspenseQuery(friendMediaQuery(uid, friendUid, name));

  return (
    <Container>
      <Title order={5}>Viewing {name}'s Media</Title>
      <MediaTable data={data} viewOnly />
    </Container>
  );
};
