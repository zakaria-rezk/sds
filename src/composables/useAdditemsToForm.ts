// composables/useSelectedItems.ts
import { ref, computed } from "vue";
interface Item {
  form_quantity: number;
  item_batch_location: number;
}
export function useSelectedItems() {   
  const selectedItems = ref<Item[]>([]);  

  // Function to add an item to the selected items array
  const addItems = <T extends object>(item: T) => {
    for (const key in item) {
      const singal_item = {
        item_batch_location: +key,
        form_quantity: +item[key],
      };

      selectedItems.value.push(singal_item);
    }
  };

  return {
    selectedItems,
    addItems,
  };
}
