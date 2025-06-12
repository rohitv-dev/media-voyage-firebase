import { Button, ButtonProps } from "@mantine/core";
import { useFormContext } from "../form";

export function SubmitButton({ loading, children }: ButtonProps) {
  const form = useFormContext();

  return (
    <form.Subscribe
      selector={(state) => [state.canSubmit, state.isSubmitting]}
      children={([canSubmit, isSubmitting]) => (
        <Button type="submit" loading={isSubmitting || loading} disabled={!canSubmit}>
          {children}
        </Button>
      )}
    />
  );
}
