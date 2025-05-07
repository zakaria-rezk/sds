export const useResetValues = {
  methods: {
    reset(obj) {
      for (let key in obj) {
        obj[key] = null;
      }
    },
  },
};
