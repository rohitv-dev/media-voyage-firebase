import { Center, Group, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MediaService } from "../api/MediaService";
import { Media, MediaStatusEnum, MediaTypeEnum } from "../types/media";
import { CommentsEditor } from "../components/CommentsEditor";
import { useInputState } from "@mantine/hooks";
import { UpdateMediaSchema, updateMediaSchema } from "../utils/schema";
import { showErrorNotification, showSuccessNotification } from "@utils/notifications";
import { findIndex } from "remeda";
import { useAppForm } from "@components/form/form";
import { formatDate } from "@utils/functions";
import { YYYYMMDD } from "@utils/constants";
import { useNavigate } from "@tanstack/react-router";

export const UpdateMediaForm = ({ media }: { media: Media }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [comments, setComments] = useInputState(media.comments ?? "");

  const { mutateAsync, isPending } = useMutation({
    mutationFn: MediaService.updateMedia,
    onSuccess: async (data) => {
      queryClient.setQueryData<Media[]>(["media"], (old) => {
        if (!old) return old;
        const index = findIndex(old, (m) => m.id === data.id);
        if (index === -1) return old;
        old[index] = data;
        old.unshift(old.splice(index, 1)[0]);
        return old;
      });

      showSuccessNotification("Updated Media Succesffully");
      navigate({ to: "/media" });

      await queryClient.invalidateQueries({
        queryKey: ["media", media.id],
      });

      await queryClient.invalidateQueries({
        queryKey: ["mediaCount"],
      });
    },
    onError: (res) => {
      showErrorNotification(res.message);
    },
  });

  const { AppField, AppForm, SubmitButton, Subscribe, handleSubmit, validateField } = useAppForm({
    defaultValues: structuredClone({
      ...media,
      startDate: media.startDate ? formatDate(media.startDate, YYYYMMDD) : undefined,
      completedDate: media.completedDate ? formatDate(media.completedDate, YYYYMMDD) : undefined,
    }) as UpdateMediaSchema,
    validators: {
      onSubmit: updateMediaSchema,
    },
    onSubmit: async ({ value }) => {
      const result = updateMediaSchema.parse(value);
      mutateAsync({ ...result, comments });
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
          <Group justify="space-between">
            <Title order={3}>Update Media</Title>
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
