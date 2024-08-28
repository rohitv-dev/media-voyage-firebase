import { Anchor, Button, Card, Center, Container, PasswordInput, Stack, TextInput, Title } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { AuthService } from "../api/AuthService";
import { Link, Navigate } from "react-router-dom";
import { showErrorNotification } from "@utils/notifications";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import { LoadingScreen } from "@components/LoadingScreen";
import { useState } from "react";

interface Login {
  email: string;
  password: string;
}

export const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const { isLoggedIn, loading: authLoading } = useFirebaseUser();

  const form = useForm<Login>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: zodResolver(
      z.object({
        email: z.string(),
        password: z.string(),
      })
    ),
  });

  const handleSubmit = async (values: Login) => {
    setLoading(true);
    const res = await AuthService.login(values.email, values.password);
    if (!res.ok) {
      showErrorNotification(res.message);
    }
    setLoading(false);
  };

  if (authLoading) return <LoadingScreen />;

  if (isLoggedIn) {
    return <Navigate to="../" />;
  }

  return (
    <Container h="100vh">
      <Center h="100%">
        <Card miw={400} shadow="lg" p="xl">
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <Title order={3}>Login</Title>
              <TextInput withAsterisk label="Email" placeholder="Email" {...form.getInputProps("email")} />
              <PasswordInput withAsterisk label="Password" placeholder="Password" {...form.getInputProps("password")} />
              <Button type="submit" loading={loading}>
                Login
              </Button>
              <Anchor component={Link} to="/register" style={{ textAlign: "center" }}>
                Don't have an account? Register!
              </Anchor>
            </Stack>
          </form>
        </Card>
      </Center>
    </Container>
  );
};
