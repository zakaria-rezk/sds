<template>
  <div class="">
    <BreadCrumpsComponent
      @toggleModalEmit="
        toggleModal();
        categoryForm = true;
      "
      :btn="$t('categories.add-operation-btn')"
      :BreadCrumps="breadCrumps"
      :disabled="false"
    />
    <table-skeleton-loader v-if="loading" />
    <TableLayoutComponent
      v-else
      :columns="columns"
      :rows="rows"
      :pageLable="$t('categories.BreadCrump')"
      :slotTDcolName="slotTDcolName"
    >
      <template #columnAction="{ row }">
        <div>
          <!-- Add Shape-->
          <ButtonComponent
            class="indigo_badge"
            :title="$t('categories.table.add_shape_btn')"
            :icon="'fa-solid fa-plus'"
            :loading="loading"
            @click="
              toggleModal();
              categoryForm = true;
              shapeForm(row.cat_name, row.id);
            "
          >
          </ButtonComponent>
          <!-- Edit Shapes-->
          <ButtonComponent
            class="indigo_badge"
            :icon="'fa-solid fa-pencil'"
            :loading="loading"
          >
          </ButtonComponent>
        </div>
      </template>

      <template #toggle="{ row }">
        <td>
          <ToggleButtonComponent
            variant="slider"
            :checked="row.additional_data"
            :disabled="disabledBtns.has(row.id)"
            @fireToggleEmit="updateStatus($event, row.id)"
            class="text-start"
          />
        </td>
      </template>

      <template #actions="{ row }">
        <td>
          <!-- Edit -->
          <ButtonComponent
            class="btn color-primary"
            :icon="'fa-solid fa-pencil'"
            :loading="false"
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
    <!-- ------------------------------------------- -->
    <ModalComponent :showModal="showModal || isEditModalOpen">
      <FormPopUpLayoutComponent
        @close-modal="closeModal"
        v-click-outside="closeModal"
        :title="
          categoryForm
            ? isEditModalOpen
              ? $t('categories.edit_category')
              : $t('categories.add-operation-btn')
            : shapeCategory
        "
      >
        <div v-if="formData">
          <div v-if="categoryForm">
            <div class="input-group flex flex-col w-full py-2 mt-1">
              <label for="category_name"
                >{{ $t("categories.form.I1.label")
                }}<span class="text-red-500 pb-4">*</span></label
              >
              <input
                type="text"
                id="category_name"
                v-model="CategoryData.cat_name"
                class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
                :placeholder="$t('categories.form.I1.placeholder')"
              />
              <p v-if="errors.cat_name" class="pt-2 text-xs text-red-500">
                {{ errors.cat_name }}
              </p>
            </div>

            <div class="input-group flex flex-col w-full py-2 mt-1">
              <label for="parent_category"
                >{{ $t("categories.form.I2.label") }}
                <span class="text-red-500 pb-4">*</span></label
              >
              <select
                id="parent_category"
                class="py-2 rounded-md border-2 bg-gray-100 text-gray-500 px-2"
                v-model="CategoryData.cat_parent"
              >
                <option disabled selected value="">
                  {{ $t("categories.form.I2.placeholder") }}
                </option>
                <option :value="cat.id" v-for="cat in Categories" :key="cat.id">
                  {{ cat.cat_name }}
                </option>
              </select>
              <p v-if="errors.cat_parent" class="pt-2 text-xs text-red-500">
                {{ errors.cat_parent }}
              </p>
            </div>
            <div
              class="input-group flex flex-col w-full py-2 mt-1"
              v-if="!isEditModalOpen"
            >
              <label for="cat_status"
                >{{ $t("categories.form.I4.label") }}
                <span class="text-red-500 pb-4">*</span></label
              >
              <select
                id="cat_status"
                class="py-2 rounded-md border-2 bg-gray-100 text-gray-500 px-2"
                v-model="CategoryData.status"
              >
                <option disabled selected value="">
                  {{ $t("categories.form.I4.placeholder") }}
                </option>
                <option
                  :value="status.value"
                  v-for="(status, index) in CategoryStatusOptions"
                  :key="index"
                >
                  {{ $t(status.text) }}
                </option>
              </select>
              <p v-if="errors.status" class="pt-2 text-xs text-red-500">
                {{ errors.status }}
              </p>
            </div>
          </div>
          <div v-else>
            <!-- <h2 class="text-center text-black-500 shadow py-2 text-2xl m-1">
              {{ shapeCategory }}
            </h2> -->
            <div class="input-group flex flex-col w-full py-2 mt-1">
              <label for="shape_name"
                >{{ $t("material-shape.form.I1.label")
                }}<span class="text-red-500 pb-4">*</span></label
              >
              <input
                type="text"
                id="shape_name"
                v-model="ShapeData.shape_name"
                class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
                :placeholder="$t('material-shape.form.I1.placeholder')"
              />
              <p v-if="errors.shape_name" class="pt-2 text-xs text-red-500">
                {{ errors.shape_name }}
              </p>
            </div>

            <div class="input-group flex flex-col w-full py-2 mt-1">
              <label for="shape-description"
                >{{ $t("material-shape.form.I2.label") }}
                <span class="text-red-500 pb-4">*</span></label
              >
              <textarea
                id="shape-description"
                class="py-2 rounded-md border-2 bg-gray-100 text-gray-500 px-2"
                v-model="ShapeData.desc"
                :placeholder="$t('material-shape.form.I2.placeholder')"
              ></textarea>
            </div>
          </div>
          <button-component
            :title="$t('save')"
            @click="categoryForm ? submitForm() : addShape()"
            :loading="btn_loading"
            class="form_btn"
          ></button-component>
        </div>
        <SuccessModalComponent
          v-else
          @closeModal="
            closeModal();
            formData = true;
          "
          :text="
            categoryForm
              ? $t('categories.form.success')
              : $t('material-shape.form.success')
          "
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
import TableLayoutComponent from "@/components/Layouts/TablesLayoutComponents/TableLayoutComponent.vue";

import ButtonComponent from "@/components/Layouts/AppLayoutComponents/ButtonComponent.vue";
import Modal from "@/components/Modal.vue";
import CategoryStatusOptions from "@/components/json/CategoryStatusOptions";

import TableSkeletonLoader from "@/components/Layouts/TablesLayoutComponents/TableLoadersComponents/TableSkeletonLoader.vue";
import BreadCrumpsComponent from "@/components/Layouts/AppLayoutComponents/BreadCrumpsComponent.vue";
import ToggleButtonComponent from "@/components/Layouts/AppLayoutComponents/ToggleButtonComponent.vue";
import categories_api from "@/services/inventory/categories_settings_api";
import material_shape_api from "@/services/inventory/material_shape_api";
export default {
  components: {
    FormPopUpLayoutComponent,
    TableSkeletonLoader,
    TableLayoutComponent,
    SuccessModalComponent,
    Modal,
    ToggleButtonComponent,
    ModalComponent,
    BreadCrumpsComponent,
    ButtonComponent,
  },
  mixins: [modalMixin, useResetValues],
  data() {
    return {
      slotTDcolName: "shapes",
      breadCrumps: [
        {
          text: this.$t("welcome.routes.item_settings"),
          route: "ItemsSettings",
        },
        { text: this.$t("categories.BreadCrump"), route: "" },
      ],

      formData: true,
      loading: true,
      selectedRowid: null as number,
      btn_loading: false,
      disabledBtns: new Set<number>(),
      categoryForm: true as boolean,
      shapeCategory: "" as string,
      rows: [],
      CategoryStatusOptions: CategoryStatusOptions,
      columns: [
        this.$t("categories.table.cat_name"),
        this.$t("categories.table.cat_parent"),
        this.$t("categories.table.shapes"),
        this.$t("categories.table.status"),
        this.$t("categories.table.actions"),
      ],
      Categories: [],
      CategoryData: {
        cat_name: "",
        cat_parent: "",
        status: 0,
      },
      ShapeData: {
        shape_name: "" as string,
        desc: "" as string,
        category_id: null as number,
      },
      errors: {
        cat_name: "" as string,
        cat_parent: "" as string,

        status: 0 as number,
        shape_name: "" as string,
      },
    };
  },
  watch: {
    isEditModalOpen(newval, oldval) {
      if (!newval) {
        this.reset(this.CategoryData);
      }
    },
  },
  methods: {
    getValidationSchema() {
      return yup.object().shape({
        cat_name: yup.string().required(this.$t("categories.form.errors.name")),
        cat_parent: yup.string().nullable(),
        is_single_value: yup.string().nullable(),
        status: yup.string().required(this.$t("categories.form.errors.status")),
      });
    },
    async submitForm() {
      this.reset(this.errors);
      const schema = this.getValidationSchema();
      try {
        this.btn_loading = true;
        await schema.validate(this.CategoryData, { abortEarly: false });
        this.isEditModalOpen
          ? await categories_api.updateCategory(
              this.CategoryData,
              this.selectedRowId
            )
          : await this.addCategory();
        this.getCategories();
        this.reset(this.CategoryData);
        this.formData = false;
      } catch (error) {
        if (error.inner) {
          error.inner.forEach((validationError: any) => {
            this.errors[validationError.path] = validationError.message;
          });
          throw error;
        }
      } finally {
        this.btn_loading = false;
      }
    },
    updateForm(row_id: number) {
      const selectedRow = this.rows.find((cat: any) => cat.id === row_id);
      this.openEditModal();
      this.CategoryData = {
        cat_name: selectedRow.cat_name,
        cat_parent: selectedRow.cat_parent,
        status: selectedRow.additional_data,
      };
      this.selectedRowId = row_id;
    },
    async addCategory() {
      try {
        await categories_api.addCategory(this.CategoryData);
        this.reset(this.CategoryData);
        this.formData = !this.formData;
        this.getCategories();
      } catch (error) {
        throw error;
      } finally {
        this.btn_loading = false;
      }
    },
    async shapeForm(category_name: string, category_id: number) {
      this.categoryForm = false;
      this.ShapeData.category_id = category_id;
      this.shapeCategory = category_name;
    },
    async addShape() {
      this.btn_loading = true;

      if (!this.ShapeData.shape_name) {
        this.errors.shape_name = this.$t("categories.form.errors.shape_name");
        return;
      }
      try {
        await material_shape_api.addShape(this.ShapeData);
        this.reset(this.ShapeData);
        this.formData = !this.formData;
        await this.getCategories();
      } catch (error) {
        throw error;
      } finally {
        this.btn_loading = false;
      }
    },
    async updateStatus(isChecked: boolean, category_id: number) {
      this.disabledBtns.add(category_id);
      const payload = {
        status: isChecked,
      };
      await categories_api.changeCategoryStatus(payload, category_id);
      this.disabledBtns.delete(category_id);
    },
    async getCategories() {
      try {
        this.loading = true;
        const response = await categories_api.getCategories();
        this.Categories = response;
        this.rows = response.map((cat: any) => ({
          id: cat.id,
          cat_name: cat.cat_name,
          cat_parent: cat.parent_category?.cat_name || "",
          shapes: cat.shapes.map((sh: any) => ({ text: sh.shape_name })),

          additional_data: cat.status === 1 ? true : false,
        }));
      } catch (er) {
        throw er;
      } finally {
        this.loading = false;
      }
    },
  },
  async mounted() {
     this.getCategories();
  },
};
</script>
