export const CreateDataInputField = ({
  label,
  model,

  required,
  ishidden,
  initialValue = "",
  rules = [],
  cols = { md: 12, lg: 12 },
  props: {
    type,
    animation = "",
    variant = "rounded",
    placeholder,
    disabled = false,
    appearance = "primary",
  },
}) => ({
  label: t(`FIELD.${label}`),

  model,
  ishidden,
  required,
  initialValue,
  rules,
  cols,
  props: {
    disabled,
    type,
    animation,
    variant,
    appearance,
    placeholder: t(`FIELD.${placeholder}`),
  },
});
export const CreateDataSelectField = ({
  label,
  model=null,

  required,
  ishidden,
  cols = { md: 12, lg: 12 },
  initialValue = "",
  props: {
    options = [],
    disabled = false,
    type,
    animation = "",
    placeholder,
    variant,
    appearance = "primary",
  },
}) => ({
  label: t(`FIELD.${label}`),

  model,
  type,
  required,
  initialValue,
  ishidden,
  cols,
  props: {
    options,
    disabled,
    type,
    placeholder: t(`FIELD.${placeholder}`),
    animation,
    variant,
    appearance,
  },
});
