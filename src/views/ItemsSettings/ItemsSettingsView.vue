<template>
  <div class="">
    <BreadCrumpsComponent
      :BreadCrumps="breadCrumps"
      :disabled="true"
    />

    <div
      class="rounded-grid"
    >
      <setting-route
        v-for="(item, index) in ItemsSettings"
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
      ItemsSettings: [
        {
          text: "items-setting.r7.text",
          route: "Categories",
        },
        {
          text: "items-setting.r1.text",
          route: "Material",
        },
        {
          text: "items-setting.r2.text",
          route: "UnitOfMeasurement",
        },
        {
          text: "items-setting.r3.text",
          route: "FinishLevel",
        },
        {
          text: "items-setting.r4.text",
          route: "MaterialOrigin",
        },
        {
          text: "items-setting.r5.text",
          route: "ItemBatch",
        },
        // {
        //   text: "items-setting.r6.text",
        //   route: "MaterialTitle",
        // },

        {
          text: "items-setting.r8.text",
          route: "Bundle",
        },
      ],
      breadCrumps: [{ text: "ItemSettings", route: "" }],
    };
  },
};
// ---------------------
</script>
