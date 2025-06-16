import { useAuthContext } from "@/context/authContext";
import { HeaderDropdown } from "@components/navigation/HeaderDropdown";
import { userQuery } from "@features/authentication/queries/authQueries";
import { NotificationsView } from "@features/notifications/components/NotificationsView";
import {
  AppShell,
  Burger,
  Button,
  Container,
  Group,
  Stack,
  Title,
  ActionIcon,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ReactNode } from "react";

export const Layout = ({ children }: { children: ReactNode }) => {
  const { user } = useAuthContext();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const { data } = useSuspenseQuery(userQuery(user!.uid));

  const navigate = useNavigate();
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { desktop: true, mobile: !opened } }}
    >
      <AppShell.Header px="lg">
        <Group h="100%" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Title
              order={3}
              style={{ userSelect: "none", cursor: "pointer" }}
              onClick={() => navigate({ to: "/media" })}
            >
              Media Voyage
            </Title>
          </Group>
          <Group justify="end" visibleFrom="sm">
            <Button
              variant="light"
              onClick={() => {
                navigate({ to: "/media" });
              }}
            >
              Home
            </Button>

            <Button
              variant="light"
              onClick={() => {
                navigate({ to: "/media/add" });
              }}
            >
              Add
            </Button>
            <NotificationsView />
            <ActionIcon size="lg" onClick={toggleColorScheme}>
              {colorScheme === "dark" ? <IconSun /> : <IconMoon />}
            </ActionIcon>

            <HeaderDropdown name={data.name} />
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <Stack justify="space-between" h="100%">
          <Stack>
            <Button variant="light" onClick={toggle}>
              Home
            </Button>
            <Button
              variant="light"
              onClick={() => {
                navigate({ to: "/media/add" });
                toggle();
              }}
            >
              Add
            </Button>
            <Button variant="light" onClick={toggle}>
              Profile
            </Button>
            <Button variant="outline" onClick={toggleColorScheme}>
              {colorScheme === "dark" ? "Light Mode" : "Dark Mode"}
            </Button>
          </Stack>
          <Button variant="light" color="red" onClick={toggle}>
            Logout
          </Button>
        </Stack>
      </AppShell.Navbar>
      <AppShell.Main>
        <Container size="xl" py="md" px={{ base: "xs", md: "md" }}>
          {children}
        </Container>
      </AppShell.Main>
    </AppShell>
  );
};
