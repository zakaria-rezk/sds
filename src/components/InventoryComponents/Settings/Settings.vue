<template>
  <div class="grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-5 m-2">
    <setting-route
      v-for="(item, index) in settingRoute"
      :key="index"
      :text="$t(item.text)"
      :route="$t(item.route)"
    >
    </setting-route>
  </div>
</template>
<script lang="ts">
import SettingRoute from "../SettingRoute.vue";
import settingRoute from "../../json/SettingText";

export default {
  components: {
    SettingRoute,
  },
  data() {
    return {
      settingRoute,
    };
  },
};
</script>
