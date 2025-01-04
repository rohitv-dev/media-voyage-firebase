import { Card, Stack, Title, Text } from "@mantine/core";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export const ErrorScreen = ({ message }: { message?: string }) => {
  const error = useRouteError();

  const getErrorMessage = () => {
    if (isRouteErrorResponse(error)) return error.data;
    return message ?? "An Unknown Error Has Occurred";
  };

  return (
    <Card h="100%" w="100%">
      <Stack align="center" h="100%" justify="center">
        <Title order={2}>An Error Has Occurred</Title>
        <Text fz={18}>{getErrorMessage()}</Text>
      </Stack>
    </Card>
  );
};
