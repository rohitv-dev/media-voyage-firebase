import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Blocker } from "react-router-dom";

export const BlockerModal = ({ blocker }: { blocker: Blocker }) => {
  const [opened, handlers] = useDisclosure(true);

  if (blocker.state === "blocked")
    return (
      <Modal opened={opened} onClose={handlers.close} title="Wait!">
        <Stack>
          <Text>Are you sure you want to leave?! You will lose all the amazing progress you made ;-;</Text>
          <Group justify="end">
            <Button onClick={blocker.reset}>No</Button>
            <Button color="red" onClick={blocker.proceed}>
              Yes
            </Button>
          </Group>
        </Stack>
      </Modal>
    );

  return null;
};
