import { Card, Stack, Title, Text, Center } from "@mantine/core";
import { IconExclamationCircle } from "@tabler/icons-react";

export const ErrorScreen = ({ message }: { message?: string }) => {
  return (
    <Card h="100%" w="100%">
      <Stack align="center" h="100%" justify="center">
        <Stack gap="xs">
          <Center>
            <IconExclamationCircle size={64} />
          </Center>
          <Title order={2}>An Error Has Occurred</Title>
        </Stack>
        <Text fz={18}>{message ?? "An Unknown Error Has Occurred"}</Text>
      </Stack>
    </Card>
  );
};
