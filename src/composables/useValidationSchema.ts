import * as yup from "yup";

export function useSchemaValidation() {

  const getValidationSchema = (formData: object, keyObjInJons: string) => {
    const keys = Object.keys(formData).filter((key) => !key.startsWith("null"));

    const schemaFields = keys.reduce((acc, key) => {
      const value = formData[key];
      let validation: any;

      if (typeof value === "number") {
        validation = yup
          .number()
          .required(`${t(`${keyObjInJons}.form.errors.${key}`)}`);
      } else {
        validation = yup
          .string()
          .required(`${t(`${keyObjInJons}.form.errors.${key}`)}`);
      }

      acc[key] = validation;
      return acc;
    }, {});

    return yup.object().shape(schemaFields);
  };

  return { getValidationSchema };
}
