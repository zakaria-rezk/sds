<template>
  <div class="p-2">
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 z-50 bg-black bg-opacity-50 lg:hidden"
      @click="toggleSidebar"
    ></div>
    <aside
      :class="[
        'fixed top-0 z-50 h-full pt-6 bg-white transition-transform duration-300',
        'lg:w-64',
        isRtl ? 'right-0' : 'left-0',
        isSidebarOpen
          ? 'translate-x-0'
          : isRtl
          ? 'translate-x-full'
          : '-translate-x-full',
      ]"
      aria-label="Sidebar"
    >
      <div
        class="h-full flex flex-col justify-between pl-4 pb-6 overflow-y-auto p-2"
      >
        <div class="fixed" :class="isRtl ? '-left-2' : '-right-2'">
          <font-awesome-icon
            @click="toggleSidebar"
            :icon="['fas', 'bars']"
            :class="{
              '-rotate-90': isSidebarOpen,
              'rotate-90': isSidebarOpen && isRtl,
            }"
            class="fixed top-4 h-4 w-4 bg-white shadow-box py-1 px-1.5 rounded-full transition-transform duration-300 cursor-pointer"
          />
        </div>
        <div>
          <div class="flex items-center justify-between mb-6 px-4">
            <div class="flex items-center justify-center">
              <img
                :src="Logo"
                alt="Logo"
                class="w-40"
                width="160"
                height="52"
              />
            </div>
          </div>

          <div
            class="w-full py-2 text-center text-systemColor bg-violet-200 rounded-xl text-sm px-2"
          >
            <span class="font-semibold"> {{ locationName }}</span
            >
          </div>
          <div
            class="w-full text-center py-2 text-systemColor bg-violet-200 rounded-xl text-sm px-2 my-2"
          >
            <span class="font-semibold">{{ userName }}</span>
          </div>
          <div class="text-gray-600">
            <div
              class="flex items-center px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer mb-2"
            >
              <font-awesome-icon
                class="mx-2 text-gray-500"
                :icon="['fas', 'gauge']"
              />
              <span class="text-sm">{{ $t("side-bar.dashboard") }}</span>
            </div>
            <!-- receive -->
            <div class="mb-2" v-if="hasReceive">
              <div
                @click="toggleInboxDropdown()"
                class="flex justify-between items-center px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <font-awesome-icon
                  class="mx-2 text-gray-400"
                  :icon="['fas', 'box-archive']"
                />
                <span class="text-sm flex-grow">{{
                  $t("side-bar.inbox")
                }}</span>
                <font-awesome-icon
                  class="text-sm"
                  :icon="[
                    'fas',
                    inboxDropdownIndex === activeSideBar
                      ? 'chevron-up'
                      : 'chevron-down',
                  ]"
                />
              </div>
              <transition
                name="dropdown"
                enter-active-class="transition-all duration-300 ease-in-out"
                leave-active-class="transition-all duration-300 ease-in-out"
                enter-from-class="max-h-0 opacity-0"
                enter-to-class="max-h-[500px] opacity-100"
                leave-from-class="max-h-[500px] opacity-100"
                leave-to-class="max-h-0 opacity-0"
              >
                <div
                  v-if="inboxDropdownIndex === activeSideBar"
                  class="ml-6 mt-2 space-y-2 overflow-hidden transition-all duration-300 ease-in-out"
                >
                  <router-link
                    :to="{
                      name: 'ImportReceive',
                      params: {
                        type: 'import',
                        operation_id: operations.find(
                          (el) => el.route === 'Receive'
                        ).operation_id,
                      },
                    }"
                    class="flex hover:bg-gray-100 cursor-pointer items-center px-3 py-1 bg-gray-50 rounded-lg"
                  >
                    <font-awesome-icon
                      class="mx-2 -rotate-90"
                      :icon="['fas', 'arrow-turn-down']"
                    />
                    <span class="text-sm text-gray-700 mx-1">{{
                      $t("side-bar.import_receive")
                    }}</span>
                  </router-link>
                </div>
              </transition>
            </div>
            <!-- operations  -->
            <div class="mb-2">
              <div
                @click="toggleOperationsDropdown()"
                class="flex justify-between items-center px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <font-awesome-icon
                  class="mx-2 text-gray-400"
                  :icon="['fas', 'box-archive']"
                />
                <span class="text-sm flex-grow">{{
                  $t("side-bar.operations")
                }}</span>
                <font-awesome-icon
                  class="text-sm"
                  :icon="[
                    'fas',
                    operationsDropdonwIndex === activeSideBar
                      ? 'chevron-up'
                      : 'chevron-down',
                  ]"
                />
              </div>
              <transition
                name="dropdown"
                enter-active-class="transition-all duration-300 ease-in-out"
                leave-active-class="transition-all duration-300 ease-in-out"
                enter-from-class="max-h-0 opacity-0"
                enter-to-class="max-h-[500px] opacity-100"
                leave-from-class="max-h-[500px] opacity-100"
                leave-to-class="max-h-0 opacity-0"
              >
                <div
                  v-if="operationsDropdonwIndex === activeSideBar"
                  class="ml-6 mt-2 space-y-2 overflow-hidden transition-all duration-300 ease-in-out"
                >
                  <router-link
                    v-for="(i, index) in operations"
                    :key="index"
                    :to="{
                      name: i.route,
                      params: { operation_id: i.operation_id },
                    }"
                    class="flex hover:bg-gray-100 cursor-pointer items-center px-3 py-1 bg-gray-50 rounded-lg"
                  >
                    <font-awesome-icon
                      class="mx-2 -rotate-90"
                      :icon="['fas', 'arrow-turn-down']"
                    />
                    <div v-if="locale == 'en'">
                      <span class="text-sm text-gray-700 mx-1"
                        >{{ i.en_name }}
                      </span>
                    </div>
                    <div v-else>
                      <span>{{ i.ar_name }}</span>
                    </div>
                  </router-link>
                </div>
              </transition>
            </div>

            <!-- vendors  -->
            <div class="mb-2">
              <router-link to="/inventory/vendors">
                <div
                  class="flex justify-between items-center px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  <font-awesome-icon
                    class="mx-2 text-gray-400"
                    :icon="['fas', 'box-archive']"
                  />
                  <span class="text-sm flex-grow">{{
                    $t("side-bar.vendors")
                  }}</span>
                </div>
              </router-link>
            </div>

            <!-- cheques  -->
            <div class="mb-2">
              <router-link to="/cheques/1">
                <div
                  class="flex justify-between items-center px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  <font-awesome-icon
                    class="mx-2 text-gray-400"
                    :icon="['fas', 'money-bill']"
                  />
                  <span class="text-sm flex-grow"> Cheques </span>
                </div>
              </router-link>
            </div>

            <button
              class="w-full py-2 text-center mt-4 mb-2 text-white bg-systemColor rounded-sm text-sm flex items-center justify-center"
            >
              <font-awesome-icon
                class="text-white border-2 px-0.5 text-center m py-0.5 mx-2 rounded-full"
                :icon="['fas', 'plus']"
              />
              {{ $t("side-bar.create_self_service") }}
            </button>
          </div>
        </div>
        <div>
          <router-link
            :to="{ name: 'Settings' }"
            class="flex text-sm items-center px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer mb-4"
          >
            <font-awesome-icon
              class="text-sm text-gray-700 mx-2"
              :icon="['fas', 'gear']"
            />
            <span class="font-semibold">{{
              $t("welcome.routes.settings")
            }}</span>
          </router-link>
          <router-link
            :to="{ name: 'ItemsSettings' }"
            class="flex text-sm items-center px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer mb-4"
          >
            <font-awesome-icon
              class="text-sm text-gray-700 mx-2"
              :icon="['fas', 'gear']"
            />
            <span class="font-semibold">{{
              $t("welcome.routes.item_settings")
            }}</span>
          </router-link>
          <router-link
            :to="{ name: 'ShowRoom' }"
            class="w-full py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-600 hover:text-white transition-all duration-300 rounded-lg text-sm flex items-center justify-center my-2 shadow-md"
          >
            {{ $t("side-bar.show_room") }}
          </router-link>   <router-link
            :to="{ name: 'Items' }"
            class="w-full py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-600 hover:text-white transition-all duration-300 rounded-lg text-sm flex items-center justify-center my-2 shadow-md"
          >
            {{ $t("items") }}
          </router-link>

          <button
            class="w-full py-2 text-white bg-purple-600 hover:bg-purple-700 transition-all duration-300 rounded-lg text-sm flex items-center justify-center my-2 shadow-md"
            @click="logout"
          >
            <span class="font-semibold mx-2">{{ $t("Logout") }}</span>
          </button>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
// import { useRoute, useRouter } from "vue-router";
// import axios from "axios";
// import env from "@/env";
import Logo from "@/assets/Logo/Mask-group-optimized.png";
import { getRoute } from "@/utils/getOperationRoute";
import router from "@/router";
const store = useStore();
// Props
defineProps({
  isSidebarOpen: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits(["toggleSidebar"]);
const { locale } = useI18n();
const operationsDropdonwIndex = ref<number | null>(null);
const inboxDropdownIndex = ref<number | null>(null);
const purchaseDropdownIndex = ref(null);
const activeSideBar = ref<number>();
const locationName = ref<string>(
  store.getters["location_module/LocationName"]
    ? store.getters["location_module/LocationName"].toUpperCase()
    : ""
);
const userName = ref<string>(
  // store.getters["authentication_module/userName"]?.toUpperCase() || ""
  store.getters["authentication_module/userName"]
    ? store.getters["authentication_module/userName"].toUpperCase()
    : ""
);
const operations = computed(() =>
  store.getters["location_module/LocationOperations"]?.map((el: any) => ({
    operation_id: el.id,
    ar_name: el.setting_operation?.operation_name_ar,
    en_name: el.setting_operation?.operation_name_en,
    route: getRoute(el.setting_operation?.operation_type),
  }))
);

const hasReceive = computed(() => {
  return operations.value?.some((el) => {
    return el.route === "Receive";
  });
});
const isRtl = computed(() => {
  return locale.value !== "en";
});
const logout = () => {
  localStorage.clear();
  store.dispatch("authentication_module/Logout");
  router.push({ name: "Login" });
};
const toggleSidebar = () => {
  emit("toggleSidebar");
};
// toggle operations menu
const toggleOperationsDropdown = () => {
  operationsDropdonwIndex.value =
    operationsDropdonwIndex.value === activeSideBar.value
      ? null
      : activeSideBar.value;
};
// toggle purchasing menu
const togglePurchasingDropdown = (index: number) => {
  purchaseDropdownIndex.value =
    purchaseDropdownIndex.value === index ? null : index;
};
const toggleInboxDropdown = () => {
  inboxDropdownIndex.value =
    inboxDropdownIndex.value === activeSideBar.value
      ? null
      : activeSideBar.value;
};
const getLocationOperation = async () => {
  try {
    console.log('ffff')
    await store.dispatch("location_module/location_operations");
  } catch (er) {
    throw er;
  }
};

onMounted( () => {
    getLocationOperation();
});
</script>
