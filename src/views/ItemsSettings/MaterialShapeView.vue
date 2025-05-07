<template>
  <div class="">
    <BreadCrumpsComponent
      @toggleModalEmit="toggleModal"
      :btn="$t('material-shape.add-operation-btn')"
      :BreadCrumps="breadCrumps"
      :disabled="false"
    />
    <table-skeleton-loader v-if="loading" />
    <TableLayoutComponent
      v-else
      :pageLable="$t('material-shape.BreadCrump')"
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
            ? $t('material-shape.edit-operation')
            : $t('material-shape.add-operation-btn')
        "
      >
        <div v-if="formData">
          <div class="input-group flex flex-col w-full py-2 mt-1">
            <label for="name"
              >{{ $t("material-shape.form.I1.label")
              }}<span class="text-red-500 pb-4">*</span></label
            >
            <input
              type="text"
              id="name"
              v-model="ShapeData.shape_name"
              class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
              :placeholder="$t('material-shape.form.I1.placeholder')"
            />
            <p v-if="errors.shape_name" class="pt-2 text-xs text-red-500">
              {{ errors.shape_name }}
            </p>
          </div>

          <div class="input-group flex flex-col w-full py-2 mt-1">
            <label for="name"
              >{{ $t("material-shape.form.I2.label") }}
              <span class="text-red-500 pb-4">*</span></label
            >
            <textarea
              id="operation-type"
              class="py-2 rounded-md border-2 bg-gray-100 text-gray-500 px-2"
              v-model="ShapeData.description"
              :placeholder="$t('material-shape.form.I2.placeholder')"
            ></textarea>
            <p v-if="errors.description" class="pt-2 text-xs text-red-500">
              {{ errors.description }}
            </p>
          </div>

          <div class="input-group flex flex-col w-full py-2 mt-1">
            <label for="name"
              >{{ $t("material-shape.form.I3.label") }}
              <span class="text-red-500 pb-4">*</span></label
            >
            <select
              id="operation-type"
              class="py-2 rounded-md border-2 bg-gray-100 text-gray-500 px-2"
              v-model="ShapeData.category_id"
            >
              <option disabled selected :value="null">
                {{ $t("material-shape.form.I3.placeholder") }}
              </option>
              <option
                :value="cat.id"
                v-for="(cat, index) in cat_ids"
                :key="index"
              >
                {{ cat.cat_name }}
              </option>
            </select>
            <p v-if="errors.is_single_value" class="pt-2 text-xs text-red-500">
              {{ errors.id }}
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
          :text="$t('material-shape.form.success')"
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
import Modal from "@/components/Modal.vue";
import material_shape_api from "@/services/inventory/material_shape_api";

import categories_api from "@/services/inventory/categories_settings_api";

import ButtonComponent from "@/components/Layouts/AppLayoutComponents/ButtonComponent.vue";
import { useResetValues } from "@/mixins/useResetValue";
import TableSkeletonLoader from "@/components/Layouts/TablesLayoutComponents/TableLoadersComponents/TableSkeletonLoader.vue";
import BreadCrumpsComponent from "@/components/Layouts/AppLayoutComponents/BreadCrumpsComponent.vue";
import TableLayoutComponent from "@/components/Layouts/TablesLayoutComponents/TableLayoutComponent.vue";

export default {
  components: {
    TableLayoutComponent,
    FormPopUpLayoutComponent,
    ButtonComponent,
    TableSkeletonLoader,
    SuccessModalComponent,
    Modal,
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
        { text: this.$t("material-shape.BreadCrump"), route: "" },
      ],
      formData: true,
      loading: true,
      Shapes: [],
      btn_loading: false,
      columns: [
        this.$t("material-shape.table.shape-name"),
        this.$t("material-shape.table.cat-id"),
        this.$t("material-shape.table.desc"),
        this.$t("material-shape.table.action"),
      ],
      rows: [],
      cat_ids: [],
      selectedRowId: null as number,
      ShapeData: {
        shape_name: "",
        description: "",
        category_id: null,
      },
      errors: {
        shape_name: "" as string,
        description: "" as string,
        id: "" as string,
        is_single_value: "" as string,
      },
    };
  },
  watch: {
    isEditModalOpen(newval, oldval) {
      if (!newval) {
        this.reset(this.ShapeData);
      }
    },
  },

  methods: {
    getValidationSchema() {
      return yup.object().shape({
        shape_name: yup
          .string()
          .required(this.$t("material-shape.form.errors.name")),
        description: yup
          .string()
          .required(this.$t("material-shape.form.errors.description")),
      });
    },
    async submitForm() {
      const schema = this.getValidationSchema();
      try {
        this.btn_loading = true;
        await schema.validate(this.ShapeData, { abortEarly: false });
        this.isEditModalOpen
          ? await material_shape_api.updateShape(
              this.ShapeData,
              this.selectedRowId
            )
          : await this.addShape();
        this.formData = false;
        this.reset(this.ShapeData);
        this.getShapes();
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
      const selectedRow = this.rows.find((shape: any) => shape.id === row_id);
      this.openEditModal();
      this.ShapeData = {
        shape_name: selectedRow.shape_name,
        category_id: this.getCategoryId(selectedRow.shape_category),
        description: selectedRow.shape_description,
      };
      this.selectedRowId = row_id;
    },
    getCategoryId(cat_name: string) {
      return this.cat_ids.find((cat: any) => cat.cat_name === cat_name).id;
    },
    async addShape() {
      this.btn_loading = true;
      try {
        await material_shape_api.addShape(this.ShapeData);
        this.formData = !this.formData;
        await this.getShapes();
      } catch (error) {
        throw error;
      } finally {
        this.btn_loading = false;
      }
    },
    async getShapes() {
      try {
        this.loading = true;
        const response = await material_shape_api.getShapes();
        this.rows = response.map((shape: any) => ({
          id: shape.id,
          shape_name: shape.shape_name,
          shape_category: shape.category?.cat_name || "",
          shape_description: shape.desc,
        }));
      } catch (er) {
        this.rows = [];
        throw er;
      } finally {
        this.loading = false;
      }
    },
  },
  async mounted() {
    await this.getShapes();
    this.cat_ids = await categories_api.getCategories();
  },
};
</script>
