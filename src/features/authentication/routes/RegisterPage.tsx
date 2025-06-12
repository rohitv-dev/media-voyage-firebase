import { Anchor, Card, Center, Container, Stack, Title } from "@mantine/core";
import { z } from "zod";
import { AuthService } from "../api/AuthService";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { showErrorNotification } from "@utils/notifications";
import { LoadingScreen } from "@components/LoadingScreen";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import { useState } from "react";
import { useAppForm } from "@components/form/form";

export const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const { isLoggedIn, loading: authLoading } = useFirebaseUser();
  const navigate = useNavigate();

  const { AppForm, AppField, SubmitButton, handleSubmit } = useAppForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: z
        .object({
          name: z.string().min(3, "Name must contain at least 3 characters"),
          email: z.string().email(),
          password: z.string().min(8, "Password must contain at least 8 characters"),
          confirmPassword: z.string().min(8, "Password must contain at least 8 characters"),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: "Passwords don't match",
          path: ["confirmPassword"],
        }),
    },
    onSubmit: async ({ value }) => {
      setLoading(true);
      const res = await AuthService.register({
        name: value.name.trim(),
        email: value.email.trim(),
        password: value.password.trim(),
      });
      if (res.ok) {
        navigate("../");
      } else {
        showErrorNotification(res.message);
      }
      setLoading(false);
    },
  });

  if (authLoading) return <LoadingScreen />;

  if (isLoggedIn) return <Navigate to="../" />;

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
                <Title order={3}>Register</Title>
                <AppField
                  name="name"
                  children={({ TextField }) => <TextField withAsterisk label="Name" placeholder="Name" />}
                />
                <AppField
                  name="email"
                  children={({ TextField }) => <TextField withAsterisk label="Email" placeholder="Email" />}
                />
                <AppField
                  name="password"
                  children={({ PasswordField }) => (
                    <PasswordField withAsterisk label="Password" placeholder="Password" />
                  )}
                />
                <AppField
                  name="confirmPassword"
                  validators={{
                    onChangeListenTo: ["password"],
                    onChange: ({ value, fieldApi }) => {
                      if (value !== fieldApi.form.getFieldValue("password")) {
                        return "Passwords do not match";
                      }
                      return undefined;
                    },
                  }}
                  children={({ PasswordField }) => (
                    <PasswordField withAsterisk label="Confirm Password" placeholder="Confirm Password" />
                  )}
                />
                <SubmitButton loading={loading}>Register</SubmitButton>
                <Anchor component={Link} to="/login" style={{ textAlign: "center" }}>
                  Already have an account? Login!
                </Anchor>
              </Stack>
            </AppForm>
          </form>
        </Card>
      </Center>
    </Container>
  );
};
