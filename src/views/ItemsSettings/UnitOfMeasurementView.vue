<template>
  <div class="">
    <BreadCrumpsComponent
      @toggleModalEmit="toggleModal"
      :btn="$t('unit-of-measurement.add-unit-btn')"
      :BreadCrumps="breadCrumps"
      :disabled="false"
    />
    <table-skeleton-loader v-if="loading" />
    <TableLayoutComponent
      v-else
      :pageLable="$t('unit-of-measurement.BreadCrump')"
      :rows="rows"
      :columns="columns"
    >
      <template #actions="{ row }">
        <td>
          <!-- Edit -->
          <ButtonComponent
            class="btn color-primary"
            :icon="'fa-solid fa-pencil'"
            :loading="loading"
            @click="updateForm(row.id)"
          >
          </ButtonComponent>
          <!-- Delete -->
          <ButtonComponent
            class="btn color-primary"
            :title="''"
            :icon="'fa-solid fa-xmark'"
            :loading="loading"
          >
          </ButtonComponent>
        </td>
      </template>
    </TableLayoutComponent>
    <ModalComponent :showModal="showModal || isEditModalOpen">
      <FormPopUpLayoutComponent
        @close-modal="closeModal"
        v-click-outside="closeModal"
        :title="
          isEditModalOpen
            ? $t('unit-of-measurement.edit-unit')
            : $t('unit-of-measurement.add-unit-btn')
        "
      >
        <div v-if="formData">
          <div class="input-group flex flex-col w-full py-2 mt-1">
            <label for="name"
              >{{ $t("unit-of-measurement.form.I1.label")
              }}<span class="text-red-500 pb-4">*</span></label
            >
            <input
              type="text"
              id="name"
              v-model="unitData.uom"
              class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
              :placeholder="$t('unit-of-measurement.form.I1.placeholder')"
            />
            <p v-if="errors.uom" class="pt-2 text-xs text-red-500">
              {{ errors.uom }}
            </p>
          </div>

          <div class="input-group flex flex-col w-full py-2 mt-1">
            <label for="name"
              >{{ $t("unit-of-measurement.form.I2.label") }}
              <span class="text-red-500 pb-4">*</span></label
            >
            <input
              id="operation-type"
              class="py-2 rounded-md border-2 bg-gray-100 text-gray-500 px-2"
              v-model="unitData.divided_to"
              :placeholder="$t('unit-of-measurement.form.I2.placeholder')"
            />
            <p v-if="errors.divided_to" class="pt-2 text-xs text-red-500">
              {{ errors.divided_to }}
            </p>
          </div>

          <div class="input-group flex flex-col w-full py-2 mt-1">
            <label for="name"
              >{{ $t("unit-of-measurement.form.I3.label") }}
              <span class="text-red-500 pb-4">*</span></label
            >
            <select
              id="operation-type"
              class="py-2 rounded-md border-2 bg-gray-100 text-gray-500 px-2"
              v-model="unitData.uom_parent"
            >
              <option disabled selected value="">
                {{ $t("unit-of-measurement.form.I3.placeholder") }}
              </option>
              <option :value="row.id" v-for="(row, index) in rows" :key="index">
                {{ row.unit }}
              </option>
            </select>
            <p v-if="errors.is_single_value" class="pt-2 text-xs text-red-500">
              {{ errors.is_single_value }}
            </p>
          </div>
          <button-component
            :loading="btn_loading"
            :title="$t('save')"
            @click="submitForm"
            class="form_btn"
          ></button-component>
        </div>
        <SuccessModalComponent
          v-else
          @closeModal="
            closeModal();
            formData = true;
          "
          :text="$t('unit-of-measurement.form.success')"
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
import * as yup from "yup";

import { modalMixin } from "@/mixins/toggleModal";
import { useResetValues } from "@/mixins/useResetValue";

import ButtonComponent from "@/components/Layouts/AppLayoutComponents/ButtonComponent.vue";

import TableSkeletonLoader from "@/components/Layouts/TablesLayoutComponents/TableLoadersComponents/TableSkeletonLoader.vue";
import BreadCrumpsComponent from "@/components/Layouts/AppLayoutComponents/BreadCrumpsComponent.vue";
import unit_of_measurement_api from "@/services/inventory/unit_of_measurement_api";
import TableLayoutComponent from "@/components/Layouts/TablesLayoutComponents/TableLayoutComponent.vue";
export default {
  components: {
    TableLayoutComponent,
    ButtonComponent,
    TableSkeletonLoader,
    SuccessModalComponent,
    FormPopUpLayoutComponent,
    BreadCrumpsComponent,
    ModalComponent,
  },
  mixins: [modalMixin, useResetValues],
  computed: {},
  data() {
    return {
      breadCrumps: [
        {
          text: this.$t("welcome.routes.item_settings"),
          route: "ItemsSettings",
        },
        { text: this.$t("unit-of-measurement.BreadCrump"), route: "" },
      ],

      formData: true,
      loading: true,
      btn_loading: false,
      columns: [
        this.$t("unit-of-measurement.table.unit-of-measurement"),
        this.$t("unit-of-measurement.table.divided-to"),
        this.$t("unit-of-measurement.table.unit-parent"),
        this.$t("unit-of-measurement.table.action"),
      ],
      rows: [],
      units: [],
      selectedRowId: null as number,
      unitData: {
        uom: "" as string,
        divided_to: null as number,
        uom_parent: null as number,
      },
      errors: {
        uom: "" as string,
        divided_to: 0 as number,
        uom_parent: "" as string,
        is_single_value: "" as string,
      },
    };
  },
  watch: {
    isEditModalOpen(newval, oldval) {
      if (!newval) {
        this.reset(this.unitData);
      }
    },
  },
  methods: {
    getValidationSchema() {
      return yup.object().shape({
        uom: yup
          .string()
          .required(this.$t("unit-of-measurement.form.errors.uom")),
        id: yup.number().nullable(),
      });
    },
    async submitForm() {
      try {
        this.btn_loading = true;
        this.isEditModalOpen
          ? await unit_of_measurement_api.updateUnit(
              this.unitData,
              this.selectedRowId
            )
          : await unit_of_measurement_api.addUnitOfMeasurement(this.unitData);
        this.reset(this.unitData);
        this.getUintOfMeasurement();
        this.formData = false;
      } catch (error) {
        if (error.inner) {
          error.inner.forEach((validationError) => {
            this.errors[validationError.path] = validationError.message;
          });
          throw error;
        }
      } finally {
        this.btn_loading = false;
      }
    },
    updateForm(row_id: number) {
      const selectedRow = this.rows.find((uom: any) => uom.id === row_id);
      this.openEditModal();
      (this.unitData = {
        uom: selectedRow.unit,
        divided_to: selectedRow.divide_to,
        uom_parent: this.getUomId(selectedRow.unit),
      }),
        (this.selectedRowId = row_id);
    },
    getUomId(unit_name: string) {
      return this.rows.find((uom: any) => uom.unit === unit_name).id;
    },
    async addUnitOfMeasurement() {
      this.btn_loading = true;
      try {
        await unit_of_measurement_api.addUnitOfMeasurement(this.unitData);
        this.formData = !this.formData;
        await this.getUintOfMeasurement();
      } catch (error) {
        throw error;
      } finally {
        this.btn_loading = false;
      }
    },
    async getUintOfMeasurement() {
      try {
        this.loading = true;
        const response = await unit_of_measurement_api.getUnitOfMeasurement();
        this.rows = response.map((uom: any) => ({
          id: uom.id,
          unit: uom.uom,
          divide_to: uom.divided_to || "",
          unit_parent: uom.uom_parent || "",
        }));
      } catch (er) {
        throw er;
      } finally {
        this.loading = false;
      }
    },
  },
  async mounted() {
    this.getUintOfMeasurement();
  },
};
</script>
