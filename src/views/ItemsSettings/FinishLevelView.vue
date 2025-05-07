<template>
  <div class="">
    <BreadCrumpsComponent
      @toggleModalEmit="toggleModal"
      :btn="$t('finish-level.add-level-btn')"
      :BreadCrumps="breadCrumps"
      :disabled="false"
    />
    <table-skeleton-loader v-if="loading" />
    <TableLayoutComponent
      v-else
      :rows="rows"
      :columns="columns"
      :pageLable="$t('finish-level.BreadCrump')"
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
          ? $t('finish-level.edit-level')
          : $t('finish-level.add-level-btn')
      "
    >
      <div v-if="formData">
        <div class="input-group flex flex-col w-full py-2 mt-1">
          <label for="name"
            >{{ $t("finish-level.form.I1.label")
            }}<span class="text-red-500 pb-4">*</span></label
          >
          <input
            type="text"
            id="name"
            v-model="LevelData.finishing_level"
            class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
            :placeholder="$t('finish-level.form.I1.placeholder')"
          />
          <p v-if="errors.details" class="pt-2 text-xs text-red-500">
            {{ errors.finishing_level }}
          </p>
        </div>
        <div class="input-group flex flex-col w-full py-2 mt-1">
          <label for="name"
            >{{ $t("finish-level.form.I2.label")
            }}<span class="text-red-500 pb-4">*</span></label
          >
          <input
            type="text"
            id="name"
            v-model="LevelData.details"
            class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
            :placeholder="$t('finish-level.form.I2.placeholder')"
          />
          <p v-if="errors.details" class="pt-2 text-xs text-red-500">
            {{ errors.details }}
          </p>
        </div>
        <button-component
          :title="$t('save')"
          :loading="btn_loading"
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
        :text="$t('finish-level.form.success')"
      ></SuccessModalComponent>
    </FormPopUpLayoutComponent>
  </ModalComponent>
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
import TableLayoutComponent from "@/components/Layouts/TablesLayoutComponents/TableLayoutComponent.vue";

import { useResetValues } from "@/mixins/useResetValue";
import ButtonComponent from "@/components/Layouts/AppLayoutComponents/ButtonComponent.vue";
import TableSkeletonLoader from "@/components/Layouts/TablesLayoutComponents/TableLoadersComponents/TableSkeletonLoader.vue";
import BreadCrumpsComponent from "@/components/Layouts/AppLayoutComponents/BreadCrumpsComponent.vue";
import TableHeader from "@/components/Layouts/TablesLayoutComponents/TableHeaderComponent.vue";
import finish_level_api from "@/services/inventory/finish_level_api";
export default {
  components: {
    ButtonComponent,
    FormPopUpLayoutComponent,
    TableSkeletonLoader,
    SuccessModalComponent,
    Modal,
    BreadCrumpsComponent,
    TableHeader,
    ModalComponent,
    TableLayoutComponent,
  },
  mixins: [modalMixin, useResetValues],
  data() {
    return {
      breadCrumps: [
        {
          text: this.$t("welcome.routes.item_settings"),
          route: "ItemsSettings",
        },
        { text: this.$t("finish-level.BreadCrump"), route: "" },
      ],
      formData: true,
      loading: true,
      btn_loading: false,
      selectedRowId: null as number,
      Levels: [],
      columns: [
        this.$t("finish-level.table.finish-level"),
        this.$t("finish-level.table.details"),
        this.$t("finish-level.table.action"),
      ],
      rows: [],
      LevelData: {
        finishing_level: "",
        details: "",
      },
      errors: { finishing_level: "" as string, details: "" as string },
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
        finishing_level: yup
          .string()
          .required(this.$t("finish-level.form.errors.finish-level")),
        details: yup
          .string()
          .required(this.$t("finish-level.form.errors.details")),
      });
    },
    async submitForm() {
      this.reset(this.errors);
      const schema = this.getValidationSchema();

      try {
        await schema.validate(this.LevelData, { abortEarly: false });
        this.btn_loading = true;
        this.isEditModalOpen
          ? await finish_level_api.updateLevel(
              this.LevelData,
              this.selectedRowId
            )
          : await this.addLevel();
        this.getLevels();
        this.formData = false;
        this.reset(this.LevelData);
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
      const selectedRow = this.rows.find(
        (finish_level: any) => finish_level.id === row_id
      );
      this.openEditModal();
      (this.LevelData = {
        finishing_level: selectedRow.finish_level,
        details: selectedRow.details,
      }),
        (this.selectedRowId = row_id);
    },
    async addLevel() {
      this.btn_loading = true;
      try {
        await finish_level_api.addLevel(this.LevelData);
        this.formData = !this.formData;
        await this.getLevels();
      } catch (error) {
        throw error;
      } finally {
        this.btn_loading = false;
      }
    },
    async getLevels() {
      try {
        this.loading = true;
        const response = await finish_level_api.getLevels();
        this.rows = response.map((level: any) => ({
          id: level.id,
          finish_level: level.finishing_level,
          details: level.details,
        }));
      } catch (er) {
        throw er;
      } finally {
        this.loading = false;
      }
      
    },
  },
  async mounted() {this.getLevels();
  },
};
</script>
