<template>
  <div class="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-5 m-4">
    <setting-route
      v-for="(item, index) in ItemsSettings"
      :key="index"
      :text="$t(item.text)"
      :route="$t(item.route)"
    >
    </setting-route>
  </div>
</template>
<script lang="ts">
import SettingRoute from "../SettingRoute.vue";
import ItemsSettings from "@/components/json/ItemsSettingsText";

export default {
  components: {
    SettingRoute,
  },
  data() {
    return {
        ItemsSettings,
    };
  },
};
</script>
