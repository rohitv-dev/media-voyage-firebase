import { Card, Center, Container, Stack, Title } from "@mantine/core";
import { z } from "zod";
import { AuthService } from "../api/AuthService";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import { LoadingScreen } from "@components/LoadingScreen";
import { useState } from "react";
import { useAppForm } from "@components/form/form";
import { Navigate } from "@tanstack/react-router";
import { Anchor } from "@components/Anchor";
import { showErrorNotification } from "@utils/notifications";
import { FirebaseError } from "firebase/app";

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
      try {
        await AuthService.login(value.email.trim(), value.password.trim());
      } catch (err) {
        if (err instanceof FirebaseError) showErrorNotification(err.message);
        else showErrorNotification(`${err}`);
      } finally {
        setLoading(false);
      }
    },
  });

  if (authLoading) return <LoadingScreen />;

  if (isLoggedIn) {
    return <Navigate to="/media" />;
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
                <Anchor to="/register" style={{ textAlign: "center" }}>
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
