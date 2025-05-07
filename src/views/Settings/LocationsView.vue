<template>
  <div class="">
    <BreadCrumpsComponent
      @toggleModalEmit="openModal"
      :btn="$t('locations.add-location-btn')"
      :BreadCrumps="breadCrumps"
      :disabled="false"
    />
    <table-skeleton-loader v-if="loading" />

    <TableLayoutComponent
      v-else
      :columns="columns"
      :rows="rows"
      :pageLable="$t('locations.table.form_name')"
    >
      <template #actions="{ row }">
        <td>
          <ButtonComponent
            class="btn color-primary"
            :icon="'fa-solid fa-list'"
            @click="
              router.replace({
                name: 'LocationDetails',
                params: { name: row.location_name, id: row.id },
              })
            "
          >
          </ButtonComponent>
        </td>
      </template>
      <template #status="{ row }">
        <td>
          <ButtonComponent
            class="btn text-color-v-dark"
            icon="fa-solid fa-pencil"
            @click="updateForm(row.id)"
          >
          </ButtonComponent>
          <ButtonComponent
            class="btn text-color-v-dark"
            icon="fa-solid fa-xmark"
            @click="deleteLocation(row.id)"
          >
          </ButtonComponent>
        </td>
      </template>
    </TableLayoutComponent>

    <ModalComponent :showModal="showModal || isEditModalOpen">
      <FormPopUpLayoutComponent
        @close-modal="closeModal"
        v-click-outside="closeModal"
        v-click-enter="submitForm"
        :title="
          isEditModalOpen
            ? $t('locations.edit_location')
            : $t('locations.add-location-btn')
        "
      >
        <div v-if="formInputs">
          <div class="input-group flex flex-col w-full py-2 mt-1">
            <label for="name"
              >{{ $t("locations.form.I1.label")
              }}<span class="text-red-500 pb-4">*</span></label
            >
            <input
              type="text"
              id="name"
              v-model="formData.location_name"
              class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
              :placeholder="$t('locations.form.I1.placeholder')"
            />
            <p v-if="errors.location_name" class="pt-2 text-xs text-red-500">
              {{ errors.location_name }}
            </p>
          </div>

          <div class="input-group flex flex-col w-full py-2 mt-1">
            <label for="name"
              >{{ $t("locations.form.I2.label")
              }}<span class="text-red-500 pb-4">*</span></label
            >
            <input
              type="text"
              id="name"
              v-model="formData.short_name"
              class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
              :placeholder="$t('locations.form.I2.placeholder')"
            />
            <p v-if="errors.short_name" class="pt-2 text-xs text-red-500">
              {{ errors.short_name }}
            </p>
          </div>
          <div class="input-group flex flex-col w-full py-2 mt-1">
            <label for="name"
              >{{ $t("locations.form.I3.label") }}
              <span class="text-red-500 pb-4">*</span></label
            >
            <select
              id="operation-type"
              class="py-2 rounded-md border-2 bg-gray-100 text-gray-500 px-2"
              v-model="formData.location_type"
            >
              <option disabled selected :value="null">
                {{ $t("locations.form.I3.placeholder") }}
              </option>
              <option
                :value="loc"
                v-for="(loc, index) in location_types"
                :key="index"
              >
                {{ loc }}
              </option>
            </select>
            <p v-if="errors.location_type" class="pt-2 text-xs text-red-500">
              {{ errors.location_type }}
            </p>
          </div>

          <div class="input-group flex flex-col w-full py-2 mt-1">
            <label for="name"
              >{{ $t("locations.form.I4.label") }}
              <span class="text-red-500 pb-4">*</span></label
            >
            <select
              id="operation-type"
              class="py-2 rounded-md border-2 bg-gray-100 text-gray-500 px-2"
              v-model="formData.country"
            >
              <option disabled selected :value="null">
                {{ $t("locations.form.I4.placeholder") }}
              </option>
              <option
                :value="country"
                v-for="(country, index) in countries"
                :key="index"
              >
                {{ country }}
              </option>
            </select>
            <p v-if="errors.country" class="pt-2 text-xs text-red-500">
              {{ errors.country }}
            </p>
          </div>

          <div class="input-group flex flex-col w-full py-2 mt-1">
            <label for="location_zone"
              >{{ $t("locations.form.I5.label") }}
              <span class="text-red-500 pb-4">*</span></label
            >
            <input
              type="text"
              id="name"
              v-model="formData.zone_name"
              class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
              :placeholder="$t('locations.form.I5.placeholder')"
            />
            <p v-if="errors.zone_name" class="pt-2 text-xs text-red-500">
              {{ errors.zone_name }}
            </p>
          </div>
          <ButtonComponent
            :title="$t('save')"
            :loading="btn_loading"
            @click="submitForm"
            class="form_btn"
          ></ButtonComponent>
        </div>
        <SuccessModalComponent
          v-else
          @closeModal="closeModal"
          :text="$t('locations.form.success')"
        ></SuccessModalComponent>
      </FormPopUpLayoutComponent>
    </ModalComponent>
  </div>
</template>
<script lang="ts">
import { defineAsyncComponent } from "vue";

const ModalComponent = defineAsyncComponent(
  () => import("@/components/Layouts/AppLayoutComponents/ModalComponent.vue")
);
const FormPopUpLayoutComponent = defineAsyncComponent(
  () =>
    import(
      "@/components/Layouts/PopUpLayoutComponent/FormPopUpLayoutComponent.vue"
    )
);
const SuccessModalComponent = defineAsyncComponent(
  () =>
    import("@/components/Layouts/AppLayoutComponents/SuccessModalComponent.vue")
);
import { useRouter } from "vue-router";
import TableLayoutComponent from "@/components/Layouts/TablesLayoutComponents/TableLayoutComponent.vue";
import * as yup from "yup";
import { modalMixin } from "@/mixins/toggleModal";
import { useResetValues } from "@/mixins/useResetValue";

import ButtonComponent from "@/components/Layouts/AppLayoutComponents/ButtonComponent.vue";
import TableSkeletonLoader from "@/components/Layouts/TablesLayoutComponents/TableLoadersComponents/TableSkeletonLoader.vue";
import BreadCrumpsComponent from "@/components/Layouts/AppLayoutComponents/BreadCrumpsComponent.vue";
import Location from "@/types/inventory/location";

import location_api from "@/services/inventory/locations_api";
export default {
  components: {
    TableLayoutComponent,
    TableSkeletonLoader,
    SuccessModalComponent,
    BreadCrumpsComponent,
    ButtonComponent,
    ModalComponent,
    FormPopUpLayoutComponent,
  },
  mixins: [modalMixin, useResetValues],
  watch: {
    isEditModalOpen(newEditValue, oldEditValue) {
      if (oldEditValue) {
        this.reset(this.formData);
      }
    },
  },
  data() {
    return {
      breadCrumps: [
        { text: this.$t("welcome.routes.settings"), route: "Settings" },
        { text: this.$t("locations.BreadCrump"), route: "" },
      ],
      formInputs: true,
      enableUpdateBtn: false,
      selectedRowId: null,
      router: useRouter(),
      loading: true,
      btn_loading: false,
      Locations: [] as Location[],
      rows: "" as any,
      location_types: [] as string[],
      countries: [
        this.$t("countries.egypt"),
        this.$t("countries.united_arab_emirates"),
        this.$t("countries.turkey"),
      ],
      columns: [
        this.$t("locations.table.location-name"),
        this.$t("locations.table.location-type"),
        this.$t("locations.table.short-name"),
        this.$t("locations.table.Country"),
        this.$t("locations.table.zone"),
        this.$t("locations.table.action"),
        this.$t("locations.table.view_operations"),
      ],
      formData: {
        location_name: "",
        short_name: "",
        location_type: null as string,
        country: null as string,
        zone_name: "",
      },
      errors: {
        location_name: "" as string,
        short_name: "" as string,
        location_type: null as string,
        country: "" as string,
        zone_name: "" as string,
      },
    };
  },

  methods: {
    updateForm(row_id: number) {
      this.enableUpdateBtn = true;

      const selectedRow = this.rows.find((row: any) => row.id === row_id);

      this.formData = {
        location_name: selectedRow.location_name,
        short_name: selectedRow.location_short_name,
        location_type: selectedRow.location_type,
        country: selectedRow.location_country,
        zone_name: selectedRow.zone_time,
      };
      this.openEditModal();
      this.selectedRowId = row_id;
    },
    async deleteLocation(row_id: number) {
      try {
        location_api.deleteLocation(row_id);
        this.getLocations();
      } catch (er) {
        throw er;
      }
    },
    getValidationSchema() {
      return yup.object().shape({
        location_name: yup
          .string()
          .required(this.$t("locations.table.errors.name")),
        short_name: yup
          .string()
          .required(this.$t("locations.table.errors.short_name")),
        location_type: yup
          .string()
          .required(this.$t("locations.table.errors.location_type")),
        country: yup
          .string()
          .required(this.$t("locations.table.errors.country")),
        zone_name: yup
          .string()
          .required(this.$t("locations.table.errors.zone_name")),
      });
    },
    async submitForm() {
      this.reset(this.errors);
      this.btn_loading = true;
      
      const schema = this.getValidationSchema();
      try {
        await schema.validate(this.formData, { abortEarly: false });
        this.enableUpdateBtn
          ? await location_api.updateLocation(this.formData, this.selectedRowId)
          : await location_api.addLocation(this.formData);
        this.$store.dispatch("location_module/locations");
        this.formInputs = !this.formInputs;
        this.getLocations();
        this.reset(this.formData);
      } catch (error) {
        if (error.inner) {
          error.inner.forEach((validationError: any) => {
            this.errors[validationError.path] = validationError.message;
          });
          throw error;
        }
      } finally {
        this.btn_loading = false;
        this.enableUpdateBtn = false;
      }
    },

    async openForm() {
      this.toggleModal();
      // this.reset(this.formData);
      try {
        const response = await location_api.getLocationTypes();
        this.location_types = response;
      } catch (er) {
        throw er;
      }
    },
    async getLocations() {
      try {
        const response = await location_api.getLocations();
        const location_types = await location_api.getLocationTypes();
        this.location_types = location_types;
        this.rows = response.map((loc: any) => ({
          id: loc.id,
          location_name: loc.location_name,
          location_type: loc.location_type,
          location_short_name: loc.short_name,
          location_country: loc.country,
          zone_time: loc.zone_name,
        }));
      } catch (er) {
        throw er;
      } finally {
        this.loading = false;
      }
    },
  },
  async mounted() {
    await this.getLocations();
  },
};
</script>
