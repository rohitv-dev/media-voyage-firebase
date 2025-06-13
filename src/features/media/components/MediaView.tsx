import {
  Button,
  Card,
  Divider,
  Group,
  Modal,
  rem,
  SimpleGrid,
  Stack,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import { useEditor } from "@tiptap/react";
import { RichTextEditor } from "@mantine/tiptap";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MediaService } from "../api/MediaService";
import { showErrorNotification, showSuccessNotification } from "@utils/notifications";
import { Media } from "../types/media";
import { DataColumn } from "@components/DataColumn";
import { toUpperCase } from "remeda";
import { MotionRating, MotionTitle } from "@components/motion";
import { animate } from "motion/react";
import { useNavigate } from "@tanstack/react-router";

interface MediaViewProps {
  media: Media;
  viewOnly?: boolean;
}

export const MediaView = ({ media, viewOnly }: MediaViewProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [deleteOpened, deleteHandlers] = useDisclosure(false);
  const { colorScheme } = useMantineColorScheme();

  const { mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: MediaService.deleteMedia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
    },
    onError: (res) => {
      showErrorNotification(res.message);
    },
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: media?.comments ?? "",
    editable: false,
  });

  useEffect(() => {
    const controls = animate(0, media?.rating, {
      onUpdate: (val) => {
        if (val) setRating(val);
      },
    });

    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async () => {
    if (!media.id) return;
    const res = await mutateAsync(media.id);
    if (res.ok) {
      showSuccessNotification("Deleted Media Successfully");
      navigate({ to: "/media" });
    } else showErrorNotification(res.message);
    deleteHandlers.close();
  };

  return (
    <Card shadow={colorScheme === "dark" ? "sm" : "lg"}>
      <Stack gap="sm">
        {isError ? <Text>{error.message}</Text> : null}
        <Group justify="space-between">
          <Group>
            <MotionTitle initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} c="teal">
              {media.title}
            </MotionTitle>
            <MotionRating value={rating} readOnly />
          </Group>
          {!viewOnly && (
            <Group>
              <Button
                size="xs"
                onClick={() => {
                  navigate({ to: "/media/update/$id", params: { id: media.id! } });
                }}
              >
                Update
              </Button>
              <Button size="xs" color="red" onClick={deleteHandlers.open}>
                Delete
              </Button>
            </Group>
          )}
        </Group>
        <Divider />
        <SimpleGrid cols={2}>
          <DataColumn title="Type" value={media.type} />
          <DataColumn title="Status" value={media.status} />
          <DataColumn title="Start Date" value={media.startDate} />
          <DataColumn title="Completed Date" value={media.completedDate} />
          <DataColumn title="Platform" value={media.platform} />
          <DataColumn title="Recommended?" value={media.recommended} />
          <DataColumn title="Private" value={media.isPrivate ? "Yes" : "No"} />
        </SimpleGrid>
        {media.comments ? (
          <Stack gap="5px">
            <Text fw="600" fz={rem(16)}>
              Comments
            </Text>
            <RichTextEditor editor={editor}>
              <RichTextEditor.Content />
            </RichTextEditor>
          </Stack>
        ) : null}
        <Divider />
        <SimpleGrid cols={2}>
          <DataColumn title="Added On" value={media.createdAt} />
          <DataColumn title="Last Updated On" value={media.updatedAt} />
        </SimpleGrid>
      </Stack>
      <Modal opened={deleteOpened} onClose={deleteHandlers.close} title={`Delete ${media.title}?`}>
        <Stack>
          <Stack gap="xs">
            <Text>Are you sure you want to delete...</Text>
            <Text fw="bold" fz="lg">
              {toUpperCase(media.title)}?!
            </Text>
          </Stack>
          <Group justify="right">
            <Button loading={isPending} onClick={deleteHandlers.close}>
              No
            </Button>
            <Button color="red" onClick={handleDelete} loading={isPending}>
              Yes
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Card>
  );
};
