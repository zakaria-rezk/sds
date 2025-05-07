import { ref } from "vue";
export function useButtonLoad() {
  const ButtonLoad = ref<boolean>(false);
  const toggleButtonLoad = () => {
    ButtonLoad.value = !ButtonLoad.value;
  };
  return {
    ButtonLoad,
    toggleButtonLoad,
  };
}
