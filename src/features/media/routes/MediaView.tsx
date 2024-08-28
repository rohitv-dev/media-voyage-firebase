import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { singleMediaLoader } from "./routes";
import { isBoolean, isDate, isNullish } from "remeda";
import dayjs from "dayjs";
import { Box, Button, Divider, Group, Modal, rem, SimpleGrid, Stack, Text } from "@mantine/core";
import { useEditor } from "@tiptap/react";
import { RichTextEditor } from "@mantine/tiptap";
import StarterKit from "@tiptap/starter-kit";
import { MRating, MTitle } from "@components/motion";
import { animate } from "framer-motion";
import { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MediaService } from "../api/MediaService";
import { showErrorNotification, showSuccessNotification } from "@utils/notifications";

const DataColumn = ({ title, value }: { title: string; value?: string | Date | boolean }) => {
  if (isNullish(value)) return null;

  const getValue = () => {
    if (isDate(value)) return dayjs(value).format("DD/MM/YYYY");
    if (isBoolean(value)) return value ? "Yes" : "No";
    return value;
  };

  return (
    <Stack gap="5px">
      <Text fw="bold" fz={rem(16)}>
        {title}
      </Text>
      <Text fz={rem(14)}>{getValue()}</Text>
    </Stack>
  );
};

export const MediaView = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const media = useLoaderData() as Awaited<ReturnType<ReturnType<typeof singleMediaLoader>>>;
  const [rating, setRating] = useState(0);
  const [deleteOpened, deleteHandlers] = useDisclosure(false);

  const { mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: MediaService.deleteMedia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
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
      navigate("/");
    } else showErrorNotification(res.message);
    deleteHandlers.close();
  };

  return (
    <Box>
      <Stack gap="sm">
        {isError ? <Text>{error.message}</Text> : null}
        <Group justify="space-between">
          <Group>
            <MTitle initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} c="teal">
              {media.title}
            </MTitle>
            <MRating value={rating} readOnly />
          </Group>
          <Group>
            <Button component={Link} to={`/update/${media.id}`}>
              Update
            </Button>
            <Button color="red" size="sm" onClick={deleteHandlers.open}>
              Delete
            </Button>
          </Group>
        </Group>
        <Divider />
        <SimpleGrid cols={2}>
          <DataColumn title="Type" value={media.type} />
          <DataColumn title="Status" value={media.status} />
          <DataColumn title="Start Date" value={media.startDate} />
          <DataColumn title="Completed Date" value={media.completedDate} />
          <DataColumn title="Platform" value={media.platform} />
          <DataColumn title="Recommended?" value={media.recommended} />
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
          <Text>Are you sure you want to delete the selected media?</Text>
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
    </Box>
  );
};
