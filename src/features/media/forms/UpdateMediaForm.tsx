import {
  Button,
  Center,
  Group,
  Rating,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MediaService } from "../api/MediaService";
import { useForm, zodResolver } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { CommentsEditor } from "../components/CommentsEditor";
import { useInputState } from "@mantine/hooks";
import { Media, MediaStatusEnum, MediaTypeEnum } from "../types/media";
import { mediaSchema } from "../utils/schema";
import { showErrorNotification, showSuccessNotification } from "@utils/notifications";
import { findIndex } from "remeda";

export const UpdateMediaForm = ({ media }: { media: Media }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [comments, setComments] = useInputState(media.comments ?? "");

  const form = useForm<Media>({
    initialValues: structuredClone(media),
    validate: zodResolver(mediaSchema),
    enhanceGetInputProps: (payload) => {
      const { status } = payload.form.values;

      if (payload.field === "completedDate") {
        if (status === "Completed")
          return {
            withAsterisk: true,
          };

        return {
          withAsterisk: false,
        };
      }
    },
  });

  const { mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: MediaService.updateMedia,
    onSuccess: (res) => {
      if (res.ok) {
        queryClient.setQueryData<Media[]>(["media"], (old) => {
          if (!old) return old;
          const index = findIndex(old, (m) => m.id === res.data.id);
          if (index === -1) return old;
          old[index] = res.data;
          old.unshift(old.splice(index, 1)[0]);
          return old;
        });
      }
    },
    onError: (res) => {
      showErrorNotification(res.message);
    },
  });

  const handleSubmit = async (values: Media) => {
    const res = await mutateAsync({ ...values, comments });
    if (res.ok) {
      showSuccessNotification("Updated Media Succesffully");
      navigate("../");
    } else showErrorNotification(res.message);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        {isError ? <Text>{error.message}</Text> : null}
        <Group justify="space-between">
          <Title order={3}>Update Media</Title>
          <Switch label="Private" {...form.getInputProps("isPrivate", { type: "checkbox" })} />
        </Group>
        <TextInput withAsterisk label="Title" placeholder="Enter the title" {...form.getInputProps("title")} />
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <Select
            label="Media Type"
            placeholder="Select Media Type"
            data={MediaTypeEnum.options}
            {...form.getInputProps("type")}
          />
          <TextInput label="Genre" placeholder="Enter the genre" {...form.getInputProps("genre")} />
        </SimpleGrid>
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <DateInput
            clearable
            label="Start Date"
            placeholder="Enter the start date"
            {...form.getInputProps("startDate")}
          />
          <DateInput
            clearable
            label="Completed Date"
            placeholder="Enter the completed date"
            {...form.getInputProps("completedDate")}
          />
        </SimpleGrid>
        <Select
          withAsterisk
          label="Status"
          placeholder="Status"
          data={MediaStatusEnum.options}
          {...form.getInputProps("status")}
        />
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <TextInput label="Platform" placeholder="Enter the platform" {...form.getInputProps("platform")} />
          <Select
            label="Recommended"
            data={["Yes", "No"]}
            placeholder="Yes/No"
            {...form.getInputProps("recommended")}
          />
        </SimpleGrid>
        <Stack gap="5px">
          <Text fw="600">Comments</Text>
          <CommentsEditor comments={comments} setComments={setComments} />
        </Stack>
        <Center>
          <Rating size="xl" {...form.getInputProps("rating")} />
        </Center>
        <Button type="submit" loading={isPending}>
          Submit
        </Button>
      </Stack>
    </form>
  );
};
