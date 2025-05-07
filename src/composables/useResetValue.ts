export function useResetValue() {
  const reset = (obj: object) => {
    for (let key in obj) {
      obj[key] = null;
    }
  };
  return { reset };
}
