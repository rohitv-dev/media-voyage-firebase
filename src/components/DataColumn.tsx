import { Stack, Text, rem } from "@mantine/core";
import dayjs from "dayjs";
import { isNullish, isDate, isBoolean } from "remeda";

export const DataColumn = ({ title, value }: { title: string; value?: string | Date | boolean }) => {
  if (isNullish(value)) return null;

  const getValue = () => {
    if (isDate(value)) return dayjs(value).format("DD/MM/YYYY");
    if (isBoolean(value)) return value ? "Yes" : "No";
    return value;
  };

  return (
    <Stack gap="5px">
      <Text fw="bold" fz={rem(16)}>
        {title}
      </Text>
      <Text fz={rem(14)}>{getValue()}</Text>
    </Stack>
  );
};
