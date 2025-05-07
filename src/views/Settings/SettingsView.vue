<template>
  <div class="">
    <BreadCrumpsComponent
      :BreadCrumps="breadCrumps"
      :text="''"
      :btn="''"
      :disabled="true"
    />

    <div class="rounded-grid">
      <setting-route
        v-for="(item, index) in SettingRoute"
        :key="index"
        :text="$t(item.text)"
        :route="$t(item.route)"
      >
      </setting-route>
    </div>
  </div>
</template>
<script lang="ts">
import SettingRoute from "@/components/InventoryComponents/SettingRoute.vue";
import BreadCrumpsComponent from "@/components/Layouts/AppLayoutComponents/BreadCrumpsComponent.vue";

export default {
  components: {
    SettingRoute,
    BreadCrumpsComponent,
  },
  data() {
    const breadCrumps = [];
    return {
      SettingRoute: [
        {
          text: "setting.r1.text",
          route: "Operations",
        },
        {
          text: "setting.r2.text",
          route: "Locations",
        },
        {
          text: "setting.r3.text",
          route: "Users",
        },
      ],
      breadCrumps: [{ text: this.$t("welcome.routes.settings"), route: "" }],
    };
  },
};

</script>
