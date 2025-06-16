import { Center, Group, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MediaService } from "../api/MediaService";
import { Media, MediaStatusEnum, MediaTypeEnum } from "../types/media";
import { CommentsEditor } from "../components/CommentsEditor";
import { useInputState } from "@mantine/hooks";
import { addMediaSchema, AddMediaSchema } from "../utils/schema";
import { showErrorNotification, showSuccessNotification } from "@utils/notifications";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import { useAppForm } from "@components/form/form";
import { useNavigate } from "@tanstack/react-router";

export const AddMediaForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useFirebaseUser();

  const [comments, setComments] = useInputState("");

  const { mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: async ({ uid, media }: { uid: string; media: Media }) => {
      return await MediaService.addMedia(uid, media);
    },
    onSuccess: async (data) => {
      queryClient.setQueryData<Media[]>(["media"], (old) => {
        if (!old) return old;
        return [data, ...old];
      });

      showSuccessNotification("Added Media Succesffully");
      navigate({ to: "/media" });

      await queryClient.invalidateQueries({
        queryKey: ["mediaCount"],
      });
    },
    onError: (res) => {
      showErrorNotification(res.message);
    },
  });

  const { AppField, AppForm, SubmitButton, Subscribe, handleSubmit, validateField } = useAppForm({
    defaultValues: {
      title: "",
      createdAt: new Date(),
      rating: 0,
      tags: [],
      type: MediaTypeEnum.enum.Movie,
      updatedAt: new Date(),
      status: MediaStatusEnum.enum.Completed,
      isPrivate: false,
    } as AddMediaSchema,
    validators: {
      onSubmit: addMediaSchema,
    },
    onSubmit: async ({ value }) => {
      if (!user) return;

      const result = addMediaSchema.parse(value);

      const media: Media = {
        ...result,
        comments,
      };

      mutateAsync({
        uid: user.uid,
        media,
      });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <AppForm>
        <Stack>
          {isError ? <Text>{error.message}</Text> : null}
          <Group justify="space-between">
            <Title order={3}>Add Media</Title>
            <AppField name="isPrivate" children={({ SwitchField }) => <SwitchField label="Private" />} />
          </Group>
          <AppField
            name="title"
            children={({ TextField }) => <TextField withAsterisk placeholder="Enter the title" />}
          />
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <AppField
              name="type"
              children={({ SelectField }) => (
                <SelectField
                  withAsterisk
                  label="Media Type"
                  placeholder="Select Media Type"
                  data={MediaTypeEnum.options}
                />
              )}
            />
            <AppField name="genre" children={({ TextField }) => <TextField placeholder="Enter the genre" />} />
          </SimpleGrid>
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <AppField
              name="startDate"
              children={({ DateField }) => (
                <DateField highlightToday clearable label="Start Date" placeholder="Enter the start date" />
              )}
            />
            <Subscribe
              selector={(state) => state.values.status}
              children={(status) => (
                <AppField
                  name="completedDate"
                  children={({ DateField }) => (
                    <DateField
                      withAsterisk={status === "Completed"}
                      highlightToday
                      clearable
                      label="Completed Date"
                      placeholder="Enter the completed date"
                    />
                  )}
                />
              )}
            />
          </SimpleGrid>
          <AppField
            listeners={{
              onChange: () => {
                validateField("completedDate", "change");
              },
            }}
            name="status"
            children={({ SelectField }) => (
              <SelectField withAsterisk label="Status" placeholder="Status" data={MediaStatusEnum.options} />
            )}
          />
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <AppField name="platform" children={({ TextField }) => <TextField placeholder="Enter the platform" />} />
            <AppField
              name="recommended"
              children={({ SelectField }) => (
                <SelectField label="Recommended" placeholder="Yes/No" data={["Yes", "No"]} />
              )}
            />
          </SimpleGrid>
          <Stack gap="5px">
            <Text fw="600">Comments</Text>
            <CommentsEditor comments={comments} setComments={setComments} />
          </Stack>
          <Center>
            <AppField name="rating" children={({ RatingField }) => <RatingField size="xl" />} />
          </Center>
          <SubmitButton loading={isPending}>Submit</SubmitButton>
        </Stack>
      </AppForm>
    </form>
  );
};
