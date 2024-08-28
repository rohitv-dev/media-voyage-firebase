import { Anchor, Button, Card, Center, Container, PasswordInput, Stack, TextInput, Title } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { AuthService } from "../api/AuthService";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { showErrorNotification } from "@utils/notifications";
import { LoadingScreen } from "@components/LoadingScreen";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import { useState } from "react";

interface Register {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const { isLoggedIn, loading: authLoading } = useFirebaseUser();
  const navigate = useNavigate();

  const form = useForm<Register>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    transformValues: (values) => ({
      name: values.name.trim(),
      email: values.email.trim(),
      password: values.password.trim(),
      confirmPassword: values.confirmPassword.trim(),
    }),
    validate: zodResolver(
      z
        .object({
          name: z.string().min(3, "Name must contain at least 3 characters"),
          email: z.string().email(),
          password: z.string().min(8, "Password must contain at least 8 characters"),
          confirmPassword: z.string().min(8, "Password must contain at least 8 characters"),
        })
        .refine(
          (data) => {
            return data.password === data.confirmPassword;
          },
          {
            message: "Passwords don't match",
            path: ["confirmPassword"],
          }
        )
    ),
  });

  const handleSubmit = async (values: Register) => {
    setLoading(true);
    const res = await AuthService.register({
      name: values.name,
      email: values.email,
      password: values.password,
    });
    if (res.ok) {
      navigate("../");
    } else {
      showErrorNotification(res.message);
    }
    setLoading(false);
  };

  if (authLoading) return <LoadingScreen />;

  if (isLoggedIn) return <Navigate to="../" />;

  return (
    <Container h="100vh">
      <Center h="100%">
        <Card miw={400} shadow="lg" p="xl">
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <Title order={3}>Register</Title>
              <TextInput withAsterisk label="Name" placeholder="Name" {...form.getInputProps("name")} />
              <TextInput withAsterisk label="Email" placeholder="Email" {...form.getInputProps("email")} />
              <PasswordInput withAsterisk label="Password" placeholder="Password" {...form.getInputProps("password")} />
              <PasswordInput
                withAsterisk
                label="Confirm Password"
                placeholder="Confirm Password"
                {...form.getInputProps("confirmPassword")}
              />
              <Button type="submit" loading={loading}>
                Register
              </Button>
              <Anchor component={Link} to="/login" style={{ textAlign: "center" }}>
                Already have an account? Login!
              </Anchor>
            </Stack>
          </form>
        </Card>
      </Center>
    </Container>
  );
};
