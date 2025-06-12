import { PasswordInput, PasswordInputProps } from "@mantine/core";
import { useFieldContext } from "../form";
import { capitalize } from "remeda";

export function PasswordField({ label, placeholder, ...rest }: PasswordInputProps) {
  const field = useFieldContext<string>();

  return (
    <PasswordInput
      label={label ?? capitalize(field.name)}
      placeholder={placeholder ?? capitalize(field.name)}
      value={field.state.value ?? ""}
      error={field.state.meta.errors[0]?.message}
      onChange={(e) => field.handleChange(e.target.value)}
      onBlur={field.handleBlur}
      {...rest}
    />
  );
}
