import { Center, Loader } from "@mantine/core";

export const LoadingScreen = () => {
  return (
    <Center h="calc(100vh - 100px)">
      <Loader size="xl" />
    </Center>
  );
};
