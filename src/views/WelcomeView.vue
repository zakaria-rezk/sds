<template>
  <div
    class="w-full relative welcome min-h-screen overflow-hidden"
    style="background-color: rgba(247, 247, 253, 1)"
  >
    <div class="text-center mt-8 z-1">
      <h1>
        {{ $t("Hello") }} <span class="font-bold">{{ userName }}</span>
      </h1>
      <h1>{{ $t("welcome.title") }}</h1>
      <img
        :src="Logo"
        alt=""
        class="text-black m-auto py-3"
        width="160"
        height="52"
      />
    </div>
    <div
      v-if="loading"
      class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50"
    >
      <font-awesome-icon
        :icon="['fas', 'spinner']"
        class="text-primary text-3xl animate-spin"
      />
    </div>
    <div v-else>
      <div class="flex flex-wrap gap-8 justify-center z-50">
        <button
          v-for="(loc, index) in userLocations"
          :key="index"
          class="btn text-color-dark py-2"
          style="background-color: rgba(255, 255, 255, 1)"
          @click="
            navigateTo(loc.location_name, loc.location_id, loc.location_type)
          "
        >
          <div
            class="w-7 h-7 rounded-full flex items-center justify-center color-primary"
          >
            <font-awesome-icon
              :icon="['fas', 'wrench']"
              class="text-white"
              size="sm"
            />
          </div>

          <div class="flex justify-between">
            <p class="text-md mx-4">{{ loc.location_name }}</p>

            <font-awesome-icon
              :icon="['fas', 'arrow-down']"
              class="text-color-primary"
            />
          </div>
        </button>
      </div>
      <hr class="border-gray-300 my-4" />

      <div class="flex flex-wrap gap-8 justify-center z-50">
        <router-link
          v-for="(route, index) in settingRoutes"
          :key="index"
          class="btn text-color-dark py-2"
          :to="{ name: route.route }"
          style="background-color: rgba(255, 255, 255, 1)"
        >
          <div
            class="w-7 h-7 rounded-full flex items-center justify-center color-primary"
          >
            <font-awesome-icon
              :icon="['fas', 'wrench']"
              class="text-white"
              size="sm"
            />
          </div>

          <div class="flex justify-between">
            <p class="text-md mx-4">{{ route.text }}</p>
            <font-awesome-icon :icon="['fas', 'arrow-down']" />
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import api from "@/services/user_crud_api";
import { useRouter } from "vue-router";
import { ref, onMounted, computed } from "vue";
import Logo from "@/assets/Logo/Mask-group-optimized.png";
import { useStore } from "vuex";
const loading = ref(true);
const router = useRouter();
interface Route {
  route: string;
  text: string;
}

const store = useStore();
const userLocations = ref([]);
const settingRoutes = ref<Route[]>([
  { route: "Settings", text: t("welcome.routes.settings") },
  { route: "ItemsSettings", text: t("welcome.routes.item_settings") },
]);

const userName = computed(() => store.getters["autentication_module/userName"]);

const navigateTo = (
  location_name: string,
  location_id: string,
  location_type: string
) => {
  const payload = {
    location_id: location_id,
    location_name: location_name,
    location_type: location_type,
  };
  console.log(payload);
  store.dispatch("location_module/user_location", payload);
  console.log(location_name);
  router.push({ name: "Dashboard", params: { location_name } });
};
const getLoggedUserLocations = async () => {
  try {
    loading.value = true;
    const response = await api.loggedUserLocations();
    store.dispatch("authentication_module/SetUserName", response.name);
    userLocations.value = response.user_details;
    localStorage.setItem("user_name", response.name);
  } catch (error) {
    throw error;
  } finally {
    loading.value = false;
  }
};
onMounted(() => {
  getLoggedUserLocations();
});
</script>
