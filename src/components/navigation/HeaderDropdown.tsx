import { Menu, Button, Divider } from "@mantine/core";
import { IconChevronDown, IconSettings, IconUser, IconLogout } from "@tabler/icons-react";
import { Link } from "react-router-dom";

export const HeaderDropdown = ({ name }: { name: string }) => {
  return (
    <Menu position="bottom-end" width={200} closeOnItemClick={true}>
      <Menu.Target>
        <Button rightSection={<IconChevronDown />} variant="outline">
          {name}
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
  );
};
