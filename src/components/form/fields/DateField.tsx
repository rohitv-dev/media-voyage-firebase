import { useFieldContext } from "../form";
import { DateInput, DateInputProps } from "@mantine/dates";

export function DateField({ label, placeholder, ...rest }: DateInputProps) {
  const field = useFieldContext<string>();

  return (
    <DateInput
      clearable
      label={label}
      placeholder={placeholder}
      error={field.state.meta.errors[0]?.message}
      value={field.state.value}
      onChange={(v) => {
        if (v) field.handleChange(v);
      }}
      {...rest}
    />
  );
}
