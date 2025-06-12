import { NumberInput, NumberInputProps } from "@mantine/core";
import { useFieldContext } from "../form";
import { capitalize } from "remeda";

export function NumberField({ label, placeholder, ...rest }: NumberInputProps) {
  const field = useFieldContext<number>();

  return (
    <NumberInput
      label={label ?? capitalize(field.name)}
      placeholder={placeholder ?? capitalize(field.name)}
      error={field.state.meta.errors[0]?.message}
      value={field.state.value}
      onChange={(val) => field.handleChange(Number(val))}
      onBlur={field.handleBlur}
      {...rest}
    />
  );
}
