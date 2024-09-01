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
import { Media } from "../types/media";
import {
  Box,
  Button,
  Card,
  Flex,
  Group,
  Modal,
  Paper,
  Pill,
  Rating,
  SimpleGrid,
  Stack,
  Table,
  TextInput,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import { Filter } from "@components/table/Filter";
import { isNullish } from "remeda";
import classes from "./MediaTable.module.scss";
import { TableHeader } from "@components/table/TableHeader";
import { IconSearch } from "@tabler/icons-react";
import { formatDate } from "@utils/functions";

interface MediaTableProps {
  data: Media[];
}

export const MediaTable = ({ data }: MediaTableProps) => {
  const columnHelper = createColumnHelper<Media>();
  const [filterOpened, filterHandlers] = useDisclosure(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const tableColumns = useMemo(
    () => [
      columnHelper.accessor("title", {
        id: "Title",
        header: (ctx) => <TableHeader ctx={ctx} />,
      }),
      columnHelper.accessor("type", {
        id: "Media Type",
        header: (ctx) => <TableHeader ctx={ctx} />,
      }),
      columnHelper.accessor("status", {
        id: "Status",
        header: (ctx) => <TableHeader ctx={ctx} />,
      }),
      columnHelper.accessor("createdAt", {
        id: "Added On",
        header: (ctx) => <TableHeader ctx={ctx} />,
        cell: (info) => formatDate(info.getValue()),
        enableColumnFilter: false,
        enableGlobalFilter: false,
        sortingFn: "datetime",
      }),
      columnHelper.accessor("rating", {
        id: "Rating",
        header: (ctx) => <TableHeader ctx={ctx} />,
        cell: (info) => <Rating size="xs" value={info.getValue()} readOnly />,
        enableGlobalFilter: false,
      }),
      columnHelper.display({
        id: "Actions",
        header: (ctx) => <TableHeader ctx={ctx} />,
        cell: (info) => {
          const { id } = info.row.original;

          return (
            <Group grow>
              <Button component={Link} to={`view/${id}`} size="xs" variant="light">
                View
              </Button>
              <Button component={Link} to={`update/${id}`} size="xs" variant="light">
                Update
              </Button>
            </Group>
          );
        },
        enableSorting: false,
        enableColumnFilter: false,
      }),
    ],
    [columnHelper]
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
      <Flex gap="sm" wrap="wrap">
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
          leftSection={<IconSearch size={18} />}
          placeholder="Search"
          size="xs"
          value={globalFilter}
          onChange={(e) => {
            setGlobalFilter(String(e.target.value));
          }}
        />
        <Button variant="outline" size="xs" onClick={filterHandlers.open}>
          Filters
        </Button>
      </Group>

      <Stack hiddenFrom="sm">
        {table.getRowModel().rows.map((row) => (
          <Card key={row.id} shadow="md" radius="md">
            <Stack gap="xs">
              {row.getVisibleCells().map((cell) => (
                <Group key={cell.id} grow>
                  <Box>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Box>
                </Group>
              ))}
            </Stack>
          </Card>
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
                <Table.Tr key={row.id} className={classes.row}>
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

      <Modal opened={filterOpened} onClose={filterHandlers.close} title="Filters">
        <SimpleGrid cols={2}>
          {table.getAllColumns().map((col) => {
            if (col.getCanFilter()) return <Filter key={col.id} column={col} table={table} />;
            return null;
          })}
        </SimpleGrid>
      </Modal>
    </Stack>
  );
};
