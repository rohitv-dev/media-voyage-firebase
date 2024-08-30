import { Media } from "@features/media/types/media";
import { Menu, Button, Stack, Center } from "@mantine/core";
import { IconArrowDown, IconArrowUp, IconChevronDown, IconChevronUp, IconX } from "@tabler/icons-react";
import { HeaderContext } from "@tanstack/react-table";

export const TableHeader = ({ ctx }: { ctx: HeaderContext<Media, unknown> }) => {
  if (!ctx.column.getCanSort()) return <Center>{ctx.column.id}</Center>;

  return (
    <Menu>
      <Menu.Target>
        <Button
          size="sm"
          w="100%"
          rightSection={
            <Stack gap="1px">
              <IconChevronUp size="12px" stroke={3} />
              <IconChevronDown size="12px" stroke={3} />
            </Stack>
          }
        >
          {ctx.column.id}
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item c="teal" onClick={() => ctx.column.toggleSorting()} leftSection={<IconArrowUp size="20px" />}>
          Sort Ascending
        </Menu.Item>
        <Menu.Item c="teal" onClick={() => ctx.column.toggleSorting(true)} leftSection={<IconArrowDown size="20px" />}>
          Sort Descending
        </Menu.Item>
        <Menu.Item c="teal" onClick={() => ctx.column.clearSorting()} leftSection={<IconX size="20px" />}>
          Clear
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
