import { Card, Stack, Group, Rating, Button, Text, DefaultMantineColor, StyleProp } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { Media } from "../types/media";
import { formatDate } from "@utils/functions";

export const MediaCard = ({ media }: { media: Media }) => {
  const navigate = useNavigate();

  const getColor = (status: string): StyleProp<DefaultMantineColor> => {
    if (status === "Completed") return "teal";
    if (status === "In Progress") return "cyan";
    return "lime";
  };

  return (
    <Card key={media.title} withBorder shadow="md" radius="md" bg={getColor(media.status)} c="white">
      <Stack gap="xs">
        <Group justify="space-between">
          <Text fw="bold" fz="lg">
            {media.title}
          </Text>
          <Rating value={media.rating} readOnly />
        </Group>
        <Text fw="600">{media.status}</Text>
        <Group>
          <Text fw="600">Added On: </Text>
          {<Text>{formatDate(media.createdAt)}</Text>}
        </Group>
        <Group>
          <Button
            variant="white"
            onClick={() => {
              navigate(`view/${media.id}`);
            }}
          >
            View
          </Button>
          <Button
            variant="white"
            onClick={() => {
              navigate(`update/${media.id}`, { state: { media } });
            }}
          >
            Update
          </Button>
        </Group>
      </Stack>
    </Card>
  );
};
