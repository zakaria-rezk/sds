<template>
  <div class="just-rounded-border bg-white">
    <div
      class="main-thead static just-rounded-border color-primary py-3 -my-0.5 -mx-0.5"
    >
      <span class="px-8">{{ $t("search") }}</span>
    </div>

    <div class="grid grid-cols-4 gap-4 p-2">
      <div
        v-for="(item, index) in props.keys"
        :key="index"
        id="countries"
        class="relative text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full"
      >
        <div class="">
          <div class="flex w-full">
            <span class="rounded-span">
              <label class="nowrap">
                {{ $t(`add_items_to_form.filter.${item}`) }}</label
              >
            </span>
            <button
              class="rounded-output w-full"
              @click="toggleDropdown(index)"
            >
              <div class="flex justify-between">
                <p class="cursor-pointer">
                  {{
                    selectedOptions[item] ||
                    $t(`add_items_to_form.filter.${item}`)
                  }}
                </p>
                <font-awesome-icon :icon="['fas', 'arrow-down']" class="" />
              </div>
            </button>

            <div
              :class="{ hidden: activeDropdown !== index }"
              class="top-12 absolute bg-gray-100 w-full z-50 rounded px-4"
            >
              <input
                type="text"
                :placeholder="$t('search')"
                v-model="searchQuery"
                id="myInput"
                @input="filterDropDown(searchQuery, item)"
                class="w-full py-2 px-2 rounded-input mt-3"
              />
              <ul class="max-h-96 overflow-auto">
                <li
                  class="p-2 text-sm cursor-pointer"
                  v-for="(option, index) in filteredItems[item]"
                  :key="index"
                  @click="
                    updateUIandFilterObj(
                      `${item}`,
                      option.id || option.value,
                      option.name
                    );
                    toggleDropdown();
                  "
                >
                  {{ option.name }}
                </li>
              </ul>
            </div>
            <!--  -->
          </div>
        </div>
      </div>

      <div>
        <!-- search  -->
        <ButtonComponent
          class="btn color-primary"
          :title="$t('adjustment_form.form.search')"
          @click="search"
        />
        <!-- reset  -->
        <ButtonComponent
          class="btn color-primary"
          :title="$t('reset')"
          @click="reset"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch } from "vue";
import ButtonComponent from "../AppLayoutComponents/ButtonComponent.vue";
const item_name = ref("");

interface FilterData {
  bundle_groups: number;
  categories: number;
  finishing_level: number;
  item_cards: number;
  material_titles: number;
  origins: number;
  shapes: number;
}
const filterData = ref<FilterData>({
  bundle_groups: null,
  categories: null,
  finishing_level: null,
  item_cards: null,
  material_titles: null,
  origins: null,
  shapes: null,
});
const props = defineProps<{
  keys: string[];
  data: object;
}>();

const emits = defineEmits<{
  (event: "filter", filterData: object): void;
}>();
const selectedOptions = ref({});
//update value of object that appear in the user screen
const updateUIandFilterObj = (
  object: string,
  value_id: number,
  value: string
) => {
  filterData.value[object] = value_id;
  selectedOptions.value[object] = value;
};
//fire seacrh emit
const search = () => {
  Object.keys(filterData.value).forEach((key) => {
    if (filterData.value[key] === null) {
      delete filterData.value[key];
    }
  });
  console.log(filterData.value);
  emits("filter", filterData.value);
};
const filterWithItem = () => {
  emits("filter", filterData.value);
};
//reset search obj values
const reset = () => {
  selectedOptions.value = {};
  filterData.value = {
    bundle_groups: null,
    categories: null,
    finishing_level: null,
    item_cards: null,
    material_titles: null,
    origins: null,
    shapes: null,
  };
};
const activeDropdown = ref<number | null>(null);
const toggleDropdown = (index: number = null) => {
  activeDropdown.value = activeDropdown.value === index ? null : index;
};
const searchQuery = ref<string>("");
const filteredItems = ref<any>({ ...props.data });
// filter dropdown based on user input
const filterDropDown = (search: string, item: string) => {
  if (!searchQuery.value) {
    filteredItems.value[item] = props.data[item];
  }
  filteredItems.value[item] = props.data[item].filter((item) => {
    return item.name
      .toLowerCase()
      .includes(searchQuery.value.toLocaleLowerCase());
  });
};
//reformat data base object
const formatOptionName = (name: string) => {
  return name
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/s\b/, "");
};
watch(
  () => props.data,
  (newData) => {
    filteredItems.value = { ...newData };
  }
);
</script>
