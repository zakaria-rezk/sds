<template>
  <div class="">
    <BreadCrumpsComponent
      @toggleModalEmit="toggleModal"
      :btn="''"
      :BreadCrumps="breadCrumps"
      :disabled="false"
    />
    <SpinnerLoaderComponent class="" v-if="loading" />
    <CardLayoutComponent
      v-else
      :allFields="[{ label: $t('locations.BreadCrump'), value: routeParams.name }]"
      :pageLable="$t('locations.table.form_name')"
      :Cards="Operations"
      :DisabledBtns="disabledBtns"
      :ActiveCards="currlocationOperationIds"
      @switchStatus="handleCheckboxChange"
    />
  </div>
</template>
<script lang="ts">
import CardLayoutComponent from "@/components/Layouts/AppLayoutComponents/CardLayoutComponent.vue";
import SpinnerLoaderComponent from "@/components/Layouts/AppLayoutComponents/SpinnerLoaderComponent.vue";
import { addLocatinoOperationMixin } from "@/mixins/addLocationOperation";
import BreadCrumpsComponent from "@/components/Layouts/AppLayoutComponents/BreadCrumpsComponent.vue";
import operations_api from "@/services/inventory/operations_setting_api";
import { modalMixin } from "@/mixins/toggleModal";
import axios from "axios";
import env from "@/env";
import Operation from "@/types/inventory/operation";
export default {
  components: {
    SpinnerLoaderComponent,
    BreadCrumpsComponent,
    CardLayoutComponent,
  },
  mixins: [addLocatinoOperationMixin, modalMixin],

  data() {
    return {
      breadCrumps: [
        { text: this.$t("welcome.routes.settings"), route: "Settings" },
    
        { text: this.$t("locations.BreadCrump"), route: "Locations" },
        { text: "", route: "" },
      ],
      routeParams: this.$route.params,
      loading: true,
      Operations: null as Operation[],
      columns: [
        this.$t("operations.table.id"),
        this.$t("operations.table.operation-name"),
        this.$t("operations.table.operation-type"),
        this.$t("operations.table.action"),
        this.$t("operations.table.reference-document-type"),
        this.$t("items.theader.actions"),
      ],
      locationOperations: [],

      disabledBtns: new Set<number>(),
      ShowModal: false,
      count: 0,
      btnLoading: false as boolean,
      switchInput: null,
      checkedd: true,
    };
  },
  computed: {
    currlocationOperationIds() {
      try {
        return this.locationOperations
          .filter((el: any) => el.status === 1)
          .map((el: any) => el.operation_id);
      } catch {
        return [];
      }
    },
  },

  methods: {
    async handleCheckboxChange(checked: boolean, operation_id: number) {
      if (checked) {
        await this.addLocationOperation(operation_id);
      } else {
        const myRow = this.locationOperations?.filter(
          (locationOperation: any) => {
            return (
              locationOperation.location_id === +this.routeParams.id &&
              locationOperation.operation_id === operation_id
            );
          }
        );
        await this.reomveLocationOperation(myRow[0].id, operation_id);
      }
      await this.getLocationOperation();

      this.$store.dispatch("location_operations");
    },
    async getLocationOperation() {
      try {
        const response = await axios.get(
          env.DOMAIN + "inv-apis/settings/loc-operations",
          {
            params: {
              location_id: +this.routeParams.id,
            },
          }
        );
        this.locationOperations = response.data.data;
        
      } catch (er) {
        this.locationOperations = [];
        throw er;
      } finally {
        this.loading = false;
      }
    },
    async getOperations() {
      const response = await operations_api.getOperation();

      
      this.Operations = response.map((opa: any) => ({
        id: opa.id,
        strings: [
          opa.operation_name_en,
          opa.operation_name_ar,
          opa.operation_type,
        ],
      }));
    },
  },
  async mounted() {
    
    this.getOperations();
    this.getLocationOperation();
  },
};
</script>

