import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { TextField } from "./fields/TextField";
import { NumberField } from "./fields/NumberField";
import { DateField } from "./fields/DateField";
import { SelectField } from "./fields/SelectField";
import { SubmitButton } from "./buttons/SubmitButton";
import { SwitchField } from "./fields/SwitchField";
import { RatingField } from "./fields/RatingField";
import { PasswordField } from "./fields/PasswordField";

export const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts();

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    NumberField,
    DateField,
    SelectField,
    SwitchField,
    RatingField,
    PasswordField,
  },
  formComponents: {
    SubmitButton,
  },
});
