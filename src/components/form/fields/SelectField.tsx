import { Select, SelectProps } from "@mantine/core";
import { useFieldContext } from "../form";
import { capitalize } from "remeda";

interface SelectFieldProps extends SelectProps {}

export function SelectField({ label, placeholder, data, clearable, ...rest }: SelectFieldProps) {
  const field = useFieldContext<string>();

  return (
    <Select
      label={label ? capitalize(field.name) : null}
      placeholder={placeholder ?? capitalize(field.name)}
      value={field.state.value}
      data={data}
      error={field.state.meta.errors[0]?.message}
      onBlur={field.handleBlur}
      onChange={(val) => {
        if (val) field.handleChange(val);
      }}
      onClear={clearable ? () => field.handleChange("") : undefined}
      {...rest}
    />
  );
}
