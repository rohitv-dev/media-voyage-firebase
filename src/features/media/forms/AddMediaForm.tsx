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
import { Media, MediaStatusEnum, MediaTypeEnum } from "../types/media";
import { useNavigate } from "react-router-dom";
import { CommentsEditor } from "../components/CommentsEditor";
import { useInputState } from "@mantine/hooks";
import { mediaSchema } from "../utils/schema";
import { showErrorNotification, showSuccessNotification } from "@utils/notifications";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";

const initialMediaValues: Media = {
  title: "",
  createdAt: new Date(),
  rating: 0,
  tags: [],
  type: "Movie",
  updatedAt: new Date(),
  status: "Completed",
  isPrivate: false,
};

export const AddMediaForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useFirebaseUser();

  const [comments, setComments] = useInputState("");

  const form = useForm<Media>({
    initialValues: initialMediaValues,
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
    mutationFn: MediaService.addMedia,
    onSuccess: async (res) => {
      if (res.ok) {
        queryClient.setQueryData<Media[]>(["media"], (old) => {
          if (!old) return old;
          return [res.data, ...old];
        });

        await queryClient.invalidateQueries({
          queryKey: ["mediaCount"],
        });
      }
    },
    onError: (res) => {
      showErrorNotification(res.message);
    },
  });

  const handleSubmit = async (values: Media) => {
    if (!user) return;
    const res = await mutateAsync({ ...values, comments, uid: user.uid });
    if (res.ok) {
      showSuccessNotification("Added Media Succesffully");
      navigate("../");
    } else showErrorNotification(res.message);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        {isError ? <Text>{error.message}</Text> : null}
        <Group justify="space-between">
          <Title order={3}>Add Media</Title>
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
