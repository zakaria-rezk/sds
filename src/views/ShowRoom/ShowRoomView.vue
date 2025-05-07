<template>
  <div class="flex w-full flex-col lg:flex-row">
    <aside
      class="h-full lg:w-[420px] bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100"
    >
      <CardBoxLayoutComponent class="h-full flex flex-col">
        <!-- Search Section -->
        <div
          class="p-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-indigo-50"
        >
          <div class="flex items-center gap-2 relativ">
            <input
              type="text"
              v-model="materialNicknames"
              :placeholder="$t('show-room.search_placeholder')"
              class="flex-1 py-2 px-2 shadow-sm focus:ring-2 focus:ring-purple-300 w-[150px]"
            />
            <button
              :title="$t('search')"
              @click="search"
              :disabled="materialNicknames === ''"
              class="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-md hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span class="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {{ $t("search") }}
              </span>
            </button>
          </div>
        </div>

        <!-- Active Filters Section -->
        <div class="p-4 border-b border-gray-100">
          <div class="flex justify-between items-center mb-3">
            <h3 class="font-bold text-purple-800 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Active Filters
            </h3>
            <button-component
              class="text-sm font-semibold text-red-600 hover:text-red-800 px-3 py-1 bg-red-50 rounded-md hover:bg-red-100 transition-colors flex items-center gap-1"
              title="Clear All"
              :disabled="disableBtn"
              @click="clearAll"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Clear All
            </button-component>
          </div>

          <div class="space-y-3">
            <div v-for="(item, key) in filters" :key="key">
              <div v-if="item.length > 0" class="mb-3">
                <p
                  class="text-sm font-semibold text-purple-700 mb-1 flex items-center gap-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                    />
                  </svg>
                  {{ key }}
                </p>
                <div class="flex flex-wrap gap-2">
                  <ShipLayoutComponent
                    v-for="(i, index) in item"
                    @remove="toggleFiter(false, i, key)"
                    :key="index"
                    class="bg-purple-100 hover:bg-purple-200 transition-colors"
                  >
                    <template #default>
                      <span class="text-purple-800 text-sm font-medium">{{
                        getName(i, key)
                      }}</span>
                    </template>
                  </ShipLayoutComponent>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Filters List -->
        <div class="flex-1 overflow-y-auto p-4 space-y-4">
          <SpinnerLoaderComponent v-if="loading" class="my-8" />

          <div v-else class="flex flex-col gap-4">
            <div v-for="(key, index) in Object.keys(filtersList)" :key="index">
              <fieldset
                class="border border-gray-200 p-0 rounded-lg overflow-hidden"
              >
                <legend
                  class="font-semibold text-sm text-purple-800 px-4 py-2 bg-gradient-to-r from-purple-50 to-indigo-50 w-full cursor-pointer flex justify-between items-center"
                  @click="activeFilter[key] = !activeFilter[key]"
                >
                  <span class="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 transition-transform duration-200"
                      :class="{ 'transform rotate-90': activeFilter[key] }"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    {{ key }}
                  </span>
                  <span
                    class="text-xs font-medium bg-purple-200 text-purple-800 px-2 py-1 rounded-full"
                  >
                    {{ filtersList[key].length }} options
                  </span>
                </legend>

                <transition
                  name="expand"
                  @enter="enter"
                  @after-enter="afterEnter"
                  @leave="leave"
                  enter-active-class="transition-all duration-300 ease-in-out"
                  enter-from-class="max-h-0 opacity-0"
                  enter-to-class="max-h-[500px] opacity-100"
                  leave-active-class="transition-all duration-300 ease-in-out"
                  leave-from-class="max-h-[500px] opacity-100"
                  leave-to-class="max-h-0 opacity-0"
                >
                  <div v-show="activeFilter[key]" class="px-2 py-3 space-y-2">
                    <label
                      class="flex items-center justify-between p-2 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer"
                      v-for="item in filtersList[key]"
                      :key="item.id"
                    >
                      <div class="flex items-center gap-3">
                        <ToggleButtonComponent
                          :disabled="false"
                          variant="checkbox"
                          :checked="filters[key]?.includes(item.id)"
                          @fireToggleEmit="toggleFiter($event, item.id, key)"
                          class="text-purple-600 focus:ring-purple-500"
                        />
                        <span class="text-gray-700 font-medium text-sm">{{
                          item.name
                        }}</span>
                      </div>
                      <span
                        class="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-full min-w-[28px] text-center"
                      >
                        {{ item.count }}
                      </span>
                    </label>
                  </div>
                </transition>
              </fieldset>
            </div>
          </div>
        </div>
      </CardBoxLayoutComponent>
    </aside>
    <div class="w-full py-10 px-4">
      <BreadCrumpsComponent
        :BreadCrumps="breadCrumps"
        :disabled="false"
        @toggleModalEmit="navigator"
      />
      <CardLoaderLayoutComponent v-if="loading"></CardLoaderLayoutComponent>
      <div
        class="p-5 grid gird-cols-2 md:grid-cols-3 xl:grid-cols-5 lg:grid-cols-4 gap-6 mb-5"
        v-else
      >
        <template v-if="itemsBatches.length > 0">
          <div v-for="i in itemsBatches" :key="i.batch_id">
            <router-link
              :to="{
                name: 'batches',
                params: { id: i.material_id },
              }"
            >
              <img
                src="@/assets/pexels-karolina-grabowska-4705933.jpg"
                alt=""
              />
            </router-link>
            <p class="text-gray-800 font-bold">{{ i.material_nicknames }}</p>
            <div class="mt-2 flex flex-wrap items-center gap-2">
              <span
                v-for="color in i.unique_colors"
                :key="color"
                class="bg-gray-200 text-gray-700 px-2 py-1 rounded-md"
              >
                {{ color }}
              </span>
              <p class="text-sm text-gray-600 font-light">
                {{ i.unique_finishing_levels[0] }}
              </p>
            </div>
          </div>
        </template>
        <template v-else>
          <div
            class="flex flex-col items-center justify-center text-center p-6 bg-gray-100 rounded-lg shadow-md"
          >
            <p class="text-lg font-semibold text-gray-600">No products found</p>
            <p class="text-gray-500">
              Please check back later or try another search.
            </p>
          </div>
        </template>
      </div>
      <div class="flex justify-center" ref="targetElement">
        <div
          v-if="infinteLoader"
          class="animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-500"
        ></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
const materialNicknames = ref<string>("");
let disableBtn = false;

import ToggleButtonComponent from "@/components/Layouts/AppLayoutComponents/ToggleButtonComponent.vue";
//global imports
import BreadCrumpsComponent from "@/components/Layouts/AppLayoutComponents/BreadCrumpsComponent.vue";
import { onBeforeMount } from "vue";
import CardLoaderLayoutComponent from "@/components/Layouts/AppLayoutComponents/loaders/CardLoaderLayoutComponent.vue";
import SpinnerLoaderComponent from "@/components/Layouts/AppLayoutComponents/SpinnerLoaderComponent.vue";
import ShipLayoutComponent from "@/components/Layouts/AppLayoutComponents/ShipLayoutComponent.vue";
import CardBoxLayoutComponent from "@/components/Layouts/AppLayoutComponents/CardBoxLayoutComponent.vue";
import GenericInputLayoutComponent from "@/components/Layouts/FormLayoutComponents/GenericInputLayoutComponent.vue";
import ButtonComponent from "@/components/Layouts/AppLayoutComponents/ButtonComponent.vue";
import { useRoute, useRouter } from "vue-router";
//infite scrolling
import { useIntersectionObserver } from "@/composables/useIntersectionObserver";
const { targetElement } = useIntersectionObserver(() => {
  infiniteScroll();
});
const route = useRoute();
const router = useRouter();
const enter = (el) => {
  el.style.height = "auto";
  const height = getComputedStyle(el).height;
  el.style.height = "0";
  setTimeout(() => {
    el.style.height = height;
  });
};

const afterEnter = (el) => {
  el.style.height = "auto";
};

const leave = (el) => {
  el.style.height = getComputedStyle(el).height;
  setTimeout(() => {
    el.style.height = "0";
  });
};
const breadCrumps = [
  // {
  //   text: t("adjustment_form.adjustment_details"),
  //   route: "adjustment-details",
  //   params: {
  //     operation_id: route.params.operation_id,
  //     form_id: route.params.form_id,
  //   },
  // },
  // { text: t("add_items_to_form.BreadCrump.adjustment.curr_page"), route: "" },
];
const navigator = () => {
  // router.push({
  //   name: "CreateItem",
  //   params: {
  //     form_id: +route.params.form_id,
  //     operation_id: +route.params.operation_id,
  //   },
  //   state: {
  //     previous: String(route.name),
  //   },
  // });
};
const getName = (id: any, key: any) => {
  const item = filtersList.value[key].find((item: any) => item.id === id);
  return item?.name;
};
import { useResetValue } from "@/composables/useResetValue";
const { reset } = useResetValue();

import show_room_api from "@/services/inventory/show_room_api";
const addFilter = (id: number, key: string | number) => {
  if (!filters.value[key].includes(id)) {
    filters.value[key].push(id);
  }
};
const activeFilter = ref<any>({
  bundles: false,
  categories: false,
  locations: false,
  colorNames: false,
  finishingLevels: false,
  materialNicknames: false,
  shapes: false,
  thickHeight: false,
  uoms: false,
});
const removeFilter = (id: number, key: string | number) => {
  filters.value[key] = filters.value[key].filter((item: any) => item !== id);
};
const toggleFiter = (isChecked: boolean, id: number, key: string | number) => {
  if (isChecked) {
    addFilter(id, key);
  } else {
    removeFilter(id, key);
  }
  getItemAndFilters();
};
const navigateToDetails = () => {
  router.push({ name: "materials-details", params: { block_name: "sss" } });
};
//modal

import { onMounted, ref, watch } from "vue";
import Image from "@/components/Layouts/AppLayoutComponents/Image.vue";

const loading = ref<boolean>(true);
let pageNumber = 1;
interface FiltersAttributes {
  bundles: any[];
  categories: any[];
  colorNames: any[];
  locations: any[];
  finishingLevels: any[];
  materialNicknames: string;
  shapes: any[];
  thickHeight: number[];
  uoms: any[];
}
const filtersList = ref<FiltersAttributes>({
  bundles: [],
  categories: [],
  colorNames: [],
  locations: [],
  finishingLevels: [],
  materialNicknames: "",
  shapes: [],
  thickHeight: [],
  uoms: [],
});
const itemsBatches = ref<any>([]);

const filters = ref<FiltersAttributes>({
  bundles: [],
  categories: [],
  colorNames: [],
  locations: [],
  finishingLevels: [],
  materialNicknames: "",
  shapes: [],
  thickHeight: [],
  uoms: [],
});
const clearAll = async () => {
  disableBtn = true;
  filters.value = {
    bundles: [],
    categories: [],
    colorNames: [],
    locations: [],
    finishingLevels: [],
    materialNicknames: "",
    shapes: [],
    thickHeight: [],
    uoms: [],
  };
  materialNicknames.value = "";
  getItemAndFilters();
};
watch(filters, (newVal, oldVal) => {
  disableBtn = true;
});
const infinteLoader = ref<boolean>(true);
const totalItems = ref<number>();
const search = () => {
  filters.value.materialNicknames = materialNicknames.value;
  getItemAndFilters();
};
const infiniteScroll = async () => {
  if (itemsBatches.value.length === totalItems.value) return;
  try {
    pageNumber++;
    infinteLoader.value = true;
    const response = await show_room_api.getDropdownFilterData(
      filters.value,
      pageNumber
    );
    itemsBatches.value = [...itemsBatches.value, ...response.groupedByMaterial];
  } catch (er) {
    throw er;
  } finally {
    infinteLoader.value = false;
  }
};
const getItemAndFilters = async () => {
  try {
    filters.value.materialNicknames = materialNicknames.value;
    loading.value = true;
    const response = await show_room_api.getDropdownFilterData(
      filters.value,
      pageNumber
    );

    itemsBatches.value = response.groupedByMaterial;

    // totalItems.value = response.itemBatches.total;
    delete response.groupedByMaterial;
    filtersList.value = response;
  } catch (er) {
    throw er;
  } finally {
    loading.value = false;
    disableBtn = false;
  }
};

onBeforeMount(async () => {
  await getItemAndFilters();
});
</script>

