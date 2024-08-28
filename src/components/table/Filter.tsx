import { Select } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { Column, Table } from "@tanstack/react-table";
import { useMemo } from "react";
import { isDate, isNumber, isString } from "remeda";

interface FiltersProps<T> {
  column: Column<T>;
  table: Table<T>;
}

export function Filter<T>({ column, table }: FiltersProps<T>) {
  if (column.id === "Actions") return null;

  const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);
  const columnFilterValue = column.getFilterValue();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const sortedUniqueValues = useMemo<string[]>(() => {
    if (isNumber(firstValue)) return [];
    const uniqueValues = column.getFacetedUniqueValues();
    if (uniqueValues && uniqueValues.keys()) return Array.from(column.getFacetedUniqueValues().keys()).sort();
    return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [column.getFacetedUniqueValues(), firstValue]);

  if (isDate(firstValue)) {
    return <DatePickerInput placeholder={column.id} onChange={(val) => column.setFilterValue(val)} />;
  }

  if (isString(firstValue)) {
    return (
      <Select
        clearable
        placeholder={column.id}
        data={sortedUniqueValues}
        value={(columnFilterValue ?? "") as string}
        onClear={() => {
          column.setFilterValue("");
        }}
        onChange={(val) => {
          if (val) column.setFilterValue(val);
          else column.setFilterValue(null);
        }}
      />
    );
  }

  return <></>;
}
