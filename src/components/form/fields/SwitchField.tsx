import { Switch, SwitchProps } from "@mantine/core";
import { useFieldContext } from "../form";
import { capitalize } from "remeda";

export function SwitchField({ label, ...rest }: SwitchProps) {
  const field = useFieldContext<boolean>();

  return (
    <Switch
      label={label ?? capitalize(field.name)}
      checked={field.state.value ?? false}
      error={field.state.meta.errors[0]?.message}
      onChange={(e) => field.handleChange(e.currentTarget.checked)}
      onBlur={field.handleBlur}
      {...rest}
    />
  );
}
