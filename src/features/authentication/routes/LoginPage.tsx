import { Anchor, Card, Center, Container, Stack, Title } from "@mantine/core";
import { z } from "zod";
import { AuthService } from "../api/AuthService";
import { Link, Navigate } from "react-router-dom";
import { showErrorNotification } from "@utils/notifications";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import { LoadingScreen } from "@components/LoadingScreen";
import { useState } from "react";
import { useAppForm } from "@components/form/form";

export const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const { isLoggedIn, loading: authLoading } = useFirebaseUser();

  const { AppForm, AppField, SubmitButton, handleSubmit } = useAppForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: z.object({
        email: z.string(),
        password: z.string(),
      }),
    },
    onSubmit: async ({ value }) => {
      setLoading(true);
      const res = await AuthService.login(value.email.trim(), value.password.trim());
      if (!res.ok) {
        showErrorNotification(res.message);
      }
      setLoading(false);
    },
  });

  if (authLoading) return <LoadingScreen />;

  if (isLoggedIn) {
    return <Navigate to="../" />;
  }

  return (
    <Container h="100vh">
      <Center h="100%">
        <Card miw={400} shadow="lg" p="xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <AppForm>
              <Stack>
                <Title order={3}>Login</Title>
                <AppField name="email" children={({ TextField }) => <TextField />} />
                <AppField name="password" children={({ PasswordField }) => <PasswordField />} />
                <SubmitButton loading={loading}>Login</SubmitButton>
                <Anchor component={Link} to="/register" style={{ textAlign: "center" }}>
                  Don't have an account yet? Register!
                </Anchor>
              </Stack>
            </AppForm>
          </form>
        </Card>
      </Center>
    </Container>
  );
};
