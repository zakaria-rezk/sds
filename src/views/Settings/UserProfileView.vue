<template>
  <div class="">
    <BreadCrumpsComponent
      :btn="''"
      :BreadCrumps="breadCrumps"
      :disabled="false"
    />

    <!-- <BreadCrumpComponent :text="Array.isArray(routeParams.name)? routeParams.name.join(', '): routeParams.name" /> -->
    <SpinnerLoaderComponent v-if="loading" />
    <CardLayoutComponent
      v-else
      :page-lable="$t('users.BreadCrump')"
      :allFields="[{ label: $t('users.BreadCrump'), value: routeParams.name }]"
      :Cards="Locations"
      :DisabledBtns="disabledBtns"
      :ActiveCards="ActiveLocaation"
      @switchStatus="ToggleFromLocation"
    />
  </div>
</template>
<script lang="ts">
import SpinnerLoaderComponent from "@/components/Layouts/AppLayoutComponents/SpinnerLoaderComponent.vue";
import CardLayoutComponent from "@/components/Layouts/AppLayoutComponents/CardLayoutComponent.vue";
import BreadCrumpsComponent from "@/components/Layouts/AppLayoutComponents/BreadCrumpsComponent.vue";
import locations_api from "@/services/inventory/locations_api";
import user_api from "@/services/user_crud_api";

export default {
  components: {
    SpinnerLoaderComponent,
    CardLayoutComponent,
    BreadCrumpsComponent,
  },
  computed: {
    ActiveLocaation() {
      try {
        return this.userLocations.map((el: any) => el.location_id);
      } catch {
        return [];
      }
    },
  },
  data() {
    return {
      breadCrumps: [
      { text: this.$t("welcome.routes.settings"), route: "Settings" },

        { text: this.$t("locations.BreadCrump"), route: "Locations" },
        { text: this.$t("users.BreadCrump"), route: "Users" },
        { text: "", route: "" },
      ],
      routeParams: this.$route.params,
      loading: true,
      selectedLocation: "" as string | number,
      disabledBtns: new Set<number>(),
      Locations: [],
      userLocations: [],
    };
  },
  methods: {
    async ToggleFromLocation(status: boolean, location_id: number) {
      this.disabledBtns.add(location_id);
      const payload = {
        user_id: +this.routeParams.id,
        location_id: location_id,
      };

      if (status) {
        
        await user_api.addToLocatoin(payload);
      } else {
        const reponse = await this.getLinkID(payload);
        
        const link_id = reponse[0].id;
        await user_api.removeFromLocatoin(link_id);
      }
      this.getUserLocations();
      this.disabledBtns.delete(location_id);
    },
    async getLinkID(payload: any) {
      const respone = await user_api.getlinkId(payload);
      return respone;
    },
    async getLocations() {
      const response = await locations_api.getLocations();
      this.Locations = response;
      this.Locations = this.Locations.map((location) => {
        return {
          id: location.id,
          strings: [
            location.location_name,
            location.short_name,
            location.location_type,
          ],
        };
      });
    },
    async getUserLocations() {
      const user_id = +this.routeParams.id;
      const user_loactions = await user_api.getUserLocations(user_id);
      
      this.userLocations = user_loactions;
      this.loading = false;
    },
  },

  async mounted() {
    await this.getLocations();
    await this.getUserLocations();

    this.loading = false;
  },
};
</script>

