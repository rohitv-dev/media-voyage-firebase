import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Media, MediaStatus } from "../types/media";
import {
  ActionIcon,
  Box,
  Button,
  DefaultMantineColor,
  Divider,
  Flex,
  Group,
  Menu,
  Paper,
  Pill,
  Rating,
  Stack,
  StyleProp,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { Filter } from "@components/table/Filter";
import { isNullish } from "remeda";
import classes from "./MediaTable.module.scss";
import { TableHeader } from "@components/table/TableHeader";
import { IconChevronDown, IconDotsVertical, IconSearch, IconX } from "@tabler/icons-react";
import { formatDate } from "@utils/functions";
import { downloadCsv } from "../utils/functions";
import { MediaCard } from "./MediaCard";
import { useNavigate, useParams } from "@tanstack/react-router";

interface MediaTableProps {
  data: Media[];
  viewOnly?: boolean;
}

export const MediaTable = ({ data, viewOnly }: MediaTableProps) => {
  const { name } = useParams({ strict: false });
  const navigate = useNavigate();
  const columnHelper = createColumnHelper<Media>();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const tableColumns = useMemo(
    () => [
      columnHelper.accessor("title", {
        id: "Title",
        header: (ctx) => <TableHeader ctx={ctx} />,
        cell: (info) => {
          return (
            <Box>
              <Box visibleFrom="sm">{info.getValue()}</Box>
              <Box hiddenFrom="sm">
                <Text fw="bold">{info.getValue()}</Text>
              </Box>
            </Box>
          );
        },
      }),
      columnHelper.accessor("type", {
        id: "Media Type",
        header: (ctx) => <TableHeader ctx={ctx} />,
      }),
      columnHelper.accessor("status", {
        id: "Status",
        header: (ctx) => <TableHeader ctx={ctx} />,
        cell: (info) => {
          const colors: Record<MediaStatus, StyleProp<DefaultMantineColor>> = {
            Completed: "teal",
            "In Progress": "yellow",
            Planned: "grape",
            Dropped: "red",
          };

          return (
            <Pill bg={colors[info.getValue()]} c="white" fw="bold">
              {info.getValue()}
            </Pill>
          );
        },
      }),
      columnHelper.accessor("genre", {
        id: "Genre",
        header: () => "Genre",
        cell: (info) => info.getValue() ?? "",
        enableColumnFilter: false,
      }),
      columnHelper.accessor("platform", {
        id: "Platform",
        header: () => "Platform",
        cell: (info) => info.getValue() ?? "",
        enableColumnFilter: false,
      }),
      columnHelper.accessor("createdAt", {
        id: "Added On",
        header: (ctx) => <TableHeader ctx={ctx} />,
        cell: (info) => {
          return (
            <Box>
              <Box visibleFrom="sm">{formatDate(info.getValue())}</Box>
              <Group hiddenFrom="sm" gap="xs">
                <Text>Added On: </Text>
                <Text>{formatDate(info.getValue())}</Text>
              </Group>
            </Box>
          );
        },
        enableColumnFilter: false,
        enableGlobalFilter: false,
        sortingFn: "datetime",
      }),
      columnHelper.accessor("rating", {
        id: "Rating",
        header: (ctx) => <TableHeader ctx={ctx} />,
        cell: (info) => <Rating size="xs" value={info.getValue()} readOnly />,
        enableGlobalFilter: false,
        enableColumnFilter: false,
      }),
      columnHelper.display({
        id: "Actions",
        header: () => null,
        cell: (info) => {
          const { id } = info.row.original;

          return (
            <Box>
              <Menu>
                <Menu.Target>
                  <ActionIcon
                    variant="transparent"
                    visibleFrom="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <IconDotsVertical stroke={1} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    onClick={(e) => {
                      e.stopPropagation();
                      if (viewOnly && name) navigate({ to: "/friend/$name/media/view/$id", params: { id: id!, name } });
                      else navigate({ to: "/media/view/$id", params: { id: id! } });
                    }}
                  >
                    View
                  </Menu.Item>
                  {!viewOnly && (
                    <Menu.Item
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate({ to: "/media/update/$id", params: { id: id! } });
                      }}
                    >
                      Update
                    </Menu.Item>
                  )}
                </Menu.Dropdown>
              </Menu>
              <Group grow hiddenFrom="sm">
                <Button
                  size="xs"
                  variant="light"
                  onClick={() => {
                    if (viewOnly && name) navigate({ to: "/friend/$name/media/view/$id", params: { id: id!, name } });
                    else navigate({ to: "/media/view/$id", params: { id: id! } });
                  }}
                >
                  View
                </Button>
                <Button
                  size="xs"
                  variant="light"
                  onClick={() => {
                    navigate({ to: "/media/update/$id", params: { id: id! } });
                  }}
                >
                  Update
                </Button>
              </Group>
            </Box>
          );
        },
        enableSorting: false,
        enableColumnFilter: false,
      }),
    ],
    [columnHelper, navigate, viewOnly, name]
  );

  const table = useReactTable({
    columns: tableColumns,
    data,
    state: {
      sorting,
      globalFilter,
    },
    globalFilterFn: "includesString",
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
  });

  const getFilterValue = (val: unknown) => {
    return `${val}`;
  };

  return (
    <Stack gap="xs">
      <Flex gap="sm" wrap="wrap" mt="xs">
        {table.getAllColumns().map((col) => {
          if (col.getCanFilter()) {
            if (isNullish(col.getFilterValue())) return null;
            return (
              <Pill
                key={col.id}
                withRemoveButton
                onRemove={() => col.setFilterValue(undefined)}
                bg="teal"
                c="white"
                fw="bold"
              >
                {getFilterValue(col.getFilterValue())}
              </Pill>
            );
          }
        })}
      </Flex>
      <Group justify="space-between">
        <TextInput
          flex={1}
          leftSection={<IconSearch size={18} />}
          placeholder="Search"
          size="xs"
          value={globalFilter}
          onChange={(e) => {
            setGlobalFilter(String(e.target.value));
          }}
        />
        <Group gap="xs">
          {table
            .getAllColumns()
            .filter((col) => col.getCanFilter())
            .map((col) => (
              <Menu key={col.id}>
                <Menu.Target>
                  <Button size="xs" variant="outline" rightSection={<IconChevronDown size={16} />}>
                    {col.id}
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Stack>
                    <Filter column={col} table={table} />
                    <Divider />
                    <Group justify="end">
                      <Button
                        size="xs"
                        variant="subtle"
                        leftSection={<IconX size={16} />}
                        onClick={() => col.setFilterValue("")}
                      >
                        Clear
                      </Button>
                    </Group>
                  </Stack>
                </Menu.Dropdown>
              </Menu>
            ))}
          <Button variant="outline" size="xs" color="yellow" onClick={() => downloadCsv(data)}>
            Export
          </Button>
        </Group>
      </Group>

      <Stack hiddenFrom="sm">
        {table.getRowModel().rows.map((row) => (
          <MediaCard key={row.id} media={row.original} />
        ))}
      </Stack>

      <Stack visibleFrom="sm">
        <Paper shadow="xs">
          <Table withColumnBorders withRowBorders>
            <Table.Thead className={classes.header}>
              {table.getHeaderGroups().map((headerGroup) => (
                <Table.Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Table.Th key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </Table.Th>
                  ))}
                </Table.Tr>
              ))}
            </Table.Thead>
            <Table.Tbody>
              {table.getRowModel().rows.map((row) => (
                <Table.Tr
                  key={row.id}
                  className={classes.row}
                  onClick={() => {
                    if (viewOnly && name)
                      navigate({ to: "/friend/$name/media/view/$id", params: { id: row.original.id!, name } });
                    else navigate({ to: "/media/view/$id", params: { id: row.original.id! } });
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <Table.Td key={cell.id} data-heading={cell.column.id !== "Actions" ? cell.column.id : undefined}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Table.Td>
                  ))}
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Paper>
      </Stack>
    </Stack>
  );
};
