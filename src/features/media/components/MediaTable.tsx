import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { Media } from "../types/media";
import { Box, Button, Card, Flex, Group, Modal, Paper, Pill, Rating, SimpleGrid, Stack, Table } from "@mantine/core";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { useDisclosure } from "@mantine/hooks";
import { Filter } from "@components/table/Filter";
import { isNullish } from "remeda";
import classes from "./MediaTable.module.scss";

interface MediaTableProps {
  data: Media[];
}

export const MediaTable = ({ data }: MediaTableProps) => {
  const columnHelper = createColumnHelper<Media>();
  const [filterOpened, filterHandlers] = useDisclosure(false);

  const tableColumns = useMemo(
    () => [
      columnHelper.accessor("title", {
        id: "Title",
        header: () => "Title",
      }),
      columnHelper.accessor("type", {
        id: "Media Type",
        header: () => "Media Type",
      }),
      columnHelper.accessor("status", {
        id: "Status",
        header: () => "Status",
      }),
      columnHelper.accessor("createdAt", {
        id: "Created At",
        header: () => "Added On",
        cell: (info) => dayjs(info.getValue()).format("DD/MM/YYYY"),
      }),
      columnHelper.accessor("rating", {
        id: "Rating",
        header: () => "Rating",
        cell: (info) => <Rating size="xs" value={info.getValue()} readOnly />,
      }),
      columnHelper.display({
        id: "Actions",
        header: () => "Actions",
        cell: (info) => {
          const { id } = info.row.original;

          return (
            <Group>
              <Button component={Link} to={`view/${id}`} size="xs" variant="light">
                View
              </Button>
              <Button component={Link} to={`update/${id}`} size="xs" variant="light">
                Update
              </Button>
            </Group>
          );
        },
      }),
    ],
    [columnHelper]
  );

  // const cardColumns = useMemo(
  //   () => [
  //     columnHelper.display({
  //       id: "Title",
  //       header: () => "Title",
  //       cell: (info) => (
  //         <Group>
  //           <Text>{info.row.original.title}</Text>
  //           <Rating readOnly value={info.row.original.rating} />
  //         </Group>
  //       ),
  //     }),
  //   ],
  //   [columnHelper]
  // );

  const table = useReactTable({
    columns: tableColumns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  // if (table.getRowCount() === 0)
  //   return (
  //     <Stack justify="center" align="center">
  //       <Text>Uh oh! Your list is empty. Wanna add a record?</Text>
  //       <Button component={Link} to="/add">
  //         Add Now!!!!
  //       </Button>
  //     </Stack>
  //   );

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
      <Group justify="right">
        <Button variant="outline" size="xs" onClick={filterHandlers.open}>
          Filters
        </Button>
      </Group>
      <Stack hiddenFrom="sm">
        {table.getRowModel().rows.map((row) => (
          <Card key={row.id} shadow="md" radius="md">
            <Stack gap="xs">
              {row.getVisibleCells().map((cell) => (
                <Group key={cell.id}>
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
