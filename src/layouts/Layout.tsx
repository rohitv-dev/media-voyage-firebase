import {
  AppShell,
  Burger,
  Button,
  Container,
  Group,
  Stack,
  Title,
  Menu,
  Divider,
  ActionIcon,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, Outlet, useLoaderData, useNavigate } from "react-router-dom";
import { IconChevronDown, IconLogout, IconMoon, IconSettings, IconSun, IconUser } from "@tabler/icons-react";
import { userLoader, userQuery } from "@features/authentication/routes/routes";

export const Layout = () => {
  const uid = useLoaderData() as Awaited<ReturnType<ReturnType<typeof userLoader>>>;
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const navigate = useNavigate();
  const [opened, { toggle }] = useDisclosure();

  const { data } = useSuspenseQuery(userQuery(typeof uid === "string" ? uid : ""));

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { desktop: true, mobile: !opened } }}
    >
      <AppShell.Header px="lg">
        <Group h="100%" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Title order={3} style={{ userSelect: "none", cursor: "pointer" }} onClick={() => navigate("")}>
              Media Voyage
            </Title>
          </Group>
          <Group justify="end" visibleFrom="sm">
            <Button component={Link} to="" variant="light">
              Home
            </Button>
            <Button component={Link} to="add" variant="light">
              Add
            </Button>
            <ActionIcon size="lg" onClick={toggleColorScheme}>
              {colorScheme === "dark" ? <IconSun /> : <IconMoon />}
            </ActionIcon>

            <Menu position="bottom-end" width={200} closeOnItemClick={true}>
              <Menu.Target>
                <Button rightSection={<IconChevronDown />} variant="outline">
                  {data.name}
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>General</Menu.Label>
                <Menu.Item disabled component={Link} leftSection={<IconSettings size={18} />} to="/">
                  Settings
                </Menu.Item>
                <Menu.Item disabled component={Link} leftSection={<IconUser size={18} />} to="/">
                  Profile
                </Menu.Item>
                <Divider size={1} mx="xs" />
                <Menu.Item component={Link} leftSection={<IconLogout size={18} />} to="/logout" color="red">
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <Stack justify="space-between" h="100%">
          <Stack>
            <Button component={Link} to="" variant="light" onClick={toggle}>
              Home
            </Button>
            <Button component={Link} to="/add" variant="light" onClick={toggle}>
              Add
            </Button>
          </Stack>
          <Button component={Link} to="/logout" variant="light" color="red" onClick={toggle}>
            Logout
          </Button>
        </Stack>
      </AppShell.Navbar>
      <AppShell.Main>
        <Container py="md">
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
};
