import { Card, Stack, Group, Button, Text, DefaultMantineColor, StyleProp, Divider, Box, Pill } from "@mantine/core";
import { Link } from "react-router-dom";
import { Media, MediaStatus } from "../types/media";
import { IconStarFilled, IconEye, IconEdit } from "@tabler/icons-react";
import { formatDate } from "@utils/functions";

const colors: Record<MediaStatus, StyleProp<DefaultMantineColor>> = {
  Completed: "teal",
  "In Progress": "yellow",
  Planned: "grape",
  Dropped: "red",
};

export const MediaCard = ({ media }: { media: Media }) => {
  return (
    <Card shadow="md" radius="md">
      <Stack gap="xs" w="100%">
        <Group justify="space-between">
          <Group>
            <Text fw="bold" fz="md">
              {media.title}
            </Text>
            <Pill size="xs" bg={colors[media.status]} fw="bold" c="white">
              {media.status}
            </Pill>
          </Group>
          <Group gap="xs">
            {media.rating}
            <IconStarFilled size={16} color="orange" />
          </Group>
        </Group>

        <Stack gap="1px">
          <Text fz="xs">{media.type}</Text>
          <Box h={5}></Box>
          <Group justify="space-between">
            <Text fz="xs">Added On: {formatDate(media.createdAt)}</Text>
          </Group>
        </Stack>

        <Divider color="gray" />

        <Group>
          <Button size="xs" leftSection={<IconEye size={18} />} component={Link} to={`./view/${media.id}`} color="blue">
            View
          </Button>
          <Button size="xs" leftSection={<IconEdit size={18} />} component={Link} to={`./update/${media.id}`}>
            Update
          </Button>
        </Group>
      </Stack>
    </Card>
  );
};
