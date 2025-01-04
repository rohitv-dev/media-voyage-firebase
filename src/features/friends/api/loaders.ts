import { auth } from "@/services/firebase";
import { singleMediaQuery } from "@features/media/api/queries";
import { QueryClient } from "@tanstack/react-query";
import { ErrorInfo } from "react";
import { LoaderFunctionArgs } from "react-router-dom";
import { find } from "remeda";
import { friendMediaQuery, friendsWithUserQuery } from "./queries";

export type FriendLoader = Awaited<ReturnType<ReturnType<typeof friendLoader>>>;

export const singleMediaLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    if (!params.id) {
      throw new Error("Media ID Not Provided");
    }

    if (!params.name) {
      throw new Error("Friend Name Not Provided");
    }

    await auth.authStateReady();

    const media =
      (await queryClient.ensureQueryData(friendMediaQuery(auth.currentUser!.uid, params.id, params.name))) || [];

    if (!media) {
      await queryClient.ensureQueryData(singleMediaQuery(params.id));
      return params.id;
    }

    const selectedMedia = find(media, (m) => m.id === params.id);

    if (!selectedMedia)
      throw {
        errorType: "Media Error",
        description: "Media ID Not Found",
      } as ErrorInfo;

    queryClient.setQueryData(["media", params.id], selectedMedia);

    return params.id;
  };

const findFriend = async (name: string, queryClient: QueryClient) => {
  await auth.authStateReady();

  const uid = auth.currentUser?.uid;

  if (uid) {
    const users = await queryClient.ensureQueryData(friendsWithUserQuery(uid));

    const selectedFriend = find(users, (u) => u.user.name === name);

    if (selectedFriend) {
      queryClient.setQueryData(["friend", name], selectedFriend);
      return [uid, selectedFriend.user.uid] as const;
    } else {
      throw new Response("Friend not found, sure you got the right peep?", {
        status: 404,
        statusText: "Friend Not Found",
      });
    }
  } else throw new Error("Unauthorized");
};

export const friendLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    if (!params.name) {
      throw new Error("Friend Name Not Provided");
    }

    const [uid, friendUid] = await findFriend(params.name, queryClient);

    return [uid, friendUid] as const;
  };

export const friendMediaLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    if (!params.name) {
      throw new Error("Friend Name Not Provided");
    }

    const [uid, friendUid] = await findFriend(params.name, queryClient);

    await queryClient.ensureQueryData(friendMediaQuery(uid, friendUid, params.name));

    return params.name;
  };
