export const CreateInputField = ({
  label,
  model,
  component,
  animation = "",
  props: {
    type,
    appearance = "primary",
    variant = "outline",
   
    size = "",
    cols = { sm: 12, md: 6, lg: 3 },
    initialValue = null,
  },
}) => ({
  label: t(`FIELD.${label}`),
  model,
  component,
  animation,
  props: {
    type,
    appearance,
    variant,
    placeholder: t(`PLACEHOLDER.${label}`),
    size,
    cols,
    initialValue,
  },
});
export const CreateSelectField = ({
  label,
  model,
  component,
  animation = "",
  props: {
    options = [],
    variant = "rounded",
    appearance = "secondary",
    size = "full",
    cols = { sm: 12, md: 6, lg: 3 },
    initialValue = null,
  },
}) => ({
  label: t(`FIELD.${label}`),
  model,
  component,
  animation,
  props: {
    options,
    placeholder: t(`PLACEHOLDER.${label}`),
    variant,
    appearance,
    size,
    cols,
    initialValue,
  },
});
