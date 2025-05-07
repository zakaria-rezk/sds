<template>
  <div>
    <div class="">
      <BreadCrumpsComponent
        @toggleModalEmit="toggleModal"
        :btn="$t('material-origin.add-origin-btn')"
        :BreadCrumps="breadCrumps"
        :disabled="false"
      />
      <table-skeleton-loader v-if="loading" />
      <TableLayoutComponent
        v-else
        :pageLable="$t('material-origin.BreadCrump')"
        :rows="rows"
        :columns="columns"
      >
        <template #actions="{ row }">
          <td>
            <!-- Edit -->
            <ButtonComponent
              class="btn color-primary"
              @click="updateForm(row.id)"
              :icon="'fa-solid fa-pencil'"
              :loading="loading"
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
    </div>
    <ModalComponent :showModal="showModal || isEditModalOpen">
      <FormPopUpLayoutComponent
        @close-modal="closeModal"
        v-click-outside="closeModal"
        :title="
          isEditModalOpen
            ? $t('material-origin.edit-origin')
            : $t('material-origin.add-origin-btn')
        "
      >
        <div v-if="formData">
          <div class="input-group flex flex-col w-full py-2 mt-1">
            <label for="name"
              >{{ $t("material-origin.form.I1.label")
              }}<span class="text-red-500 pb-4">*</span></label
            >
            <input
              type="text"
              id="name"
              v-model="OriginData.origin_name"
              class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
              :placeholder="$t('material-origin.form.I1.placeholder')"
            />
            <p v-if="errors.origin_name" class="pt-2 text-xs text-red-500">
              {{ errors.origin_name }}
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
          :text="$t('material-origin.form.success')"
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
import TableLayoutComponent from "@/components/Layouts/TablesLayoutComponents/TableLayoutComponent.vue";
import material_origin_api from "@/services/inventory/material_origin_api";
export default {
  components: {
    FormPopUpLayoutComponent,
    ButtonComponent,
    TableSkeletonLoader,
    SuccessModalComponent,

    TableLayoutComponent,
    BreadCrumpsComponent,
    ModalComponent,
  },
  mixins: [modalMixin, useResetValues],
  data() {
    return {
      breadCrumps: [
        {
          text: this.$t("welcome.routes.item_settings"),
          route: "ItemsSettings",
        },
        { text: this.$t("material-origin.BreadCrump"), route: "" },
      ],

      formData: true,
      loading: true,
      btn_loading: false,
      selectedRowId: null as number,
      columns: [
        this.$t("material-origin.table.origin_name"),
        this.$t("material-origin.table.action"),
      ],
      rows: [],
      OriginData: {
        origin_name: "",
      },
      errors: { origin_name: "" as string },
    };
  },
  watch: {
    isEditModalOpen(newval, oldval) {
      if (!newval) {
        this.reset(this.LevelData);
      }
    },
  },
  methods: {
    getValidationSchema() {
      return yup.object().shape({
        origin_name: yup
          .string()
          .required(this.$t("material-origin.form.errors.origin_name")),
      });
    },
    async submitForm() {
      this.reset(this.errors);
      const schema = this.getValidationSchema();

      try {
        await schema.validate(this.OriginData, { abortEarly: false });
        this.btn_loading = true;
        this.isEditModalOpen
          ? await material_origin_api.updateOrigin(
              this.OriginData,
              this.selectedRowId
            )
          : await this.addOrigin();
        this.getOrigins();
        this.formData = false;
        this.reset(this.LevelData);
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
      const selectedRow = this.rows.find((origin: any) => origin.id === row_id);
      this.openEditModal();
      (this.OriginData = {
        origin_name: selectedRow.origin_name,
      }),
        (this.selectedRowId = row_id);
    },
    async addOrigin() {
      try {
        await material_origin_api.addOrigin(this.OriginData);
        this.reset(this.OriginData);
        this.formData = !this.formData;
        await this.getOrigins();
      } catch (error) {
        throw error;
      }
    },
    async getOrigins() {
      try {
        this.loading = true;
        const response = await material_origin_api.getOrigins();
        this.rows = response.map((origin: any) => ({
          id: origin.id,
          origin_name: origin.origin_name,
        }));
      } catch (er) {
        throw er;
      } finally {
        this.loading = false;
      }
    },
  },
  async mounted() {
    await this.getOrigins();
  },
};
</script>
