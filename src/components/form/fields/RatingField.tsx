import { Rating, RatingProps } from "@mantine/core";
import { useFieldContext } from "../form";

export function RatingField({ ...rest }: RatingProps) {
  const field = useFieldContext<number>();

  return <Rating value={field.state.value ?? 0} onChange={field.handleChange} onBlur={field.handleBlur} {...rest} />;
}
