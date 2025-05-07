<template>
  <div>
    <div class="relative">
      <BreadCrumpsComponent
        @toggleModalEmit="toggleModal"
        :text="$t('bundle-group.BreadCrump')"
        :btn="$t('bundle-group.add-bundle-btn')"
        :BreadCrumps="breadCrumps"
        :disabled="false"
      />

      <table-skeleton-loader v-if="loading" />
      <TableLayoutComponent
        v-else
        :rows="rows"
        :columns="columns"
        :pageLable="$t('bundle-group.BreadCrump')"
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
        :title="
          isEditModalOpen
            ? $t('bundle-group.edit-bundle')
            : $t('bundle-group.add-bundle-btn')
        "
        v-click-outside="closeModal"
      >
        <div v-if="formData">
          <div class="input-group flex flex-col w-full py-2 mt-1">
            <label for="name"
              >{{ $t("bundle-group.form.I1.label")
              }}<span class="text-red-500 pb-4">*</span></label
            >
            <input
              type="text"
              id="name"
              v-model="bundleData.bundle_serial"
              class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
              :placeholder="$t('bundle-group.form.I1.placeholder')"
            />
            <p v-if="errors?.bundle_serial" class="pt-2 text-xs text-red-500">
              {{ errors?.bundle_serial }}
            </p>
          </div>

          <div class="input-group flex flex-col w-full py-2 mt-1">
            <label for="name"
              >{{ $t("bundle-group.form.I2.label") }}
              <span class="text-red-500 pb-4">*</span></label
            >
            <select
              id="operation-type"
              class="py-2 rounded-md border-2 bg-gray-100 text-gray-500 px-2"
              v-model="bundleData.source_item_id"
            >
              <option
                disabled
                selected
                :value="bundleData.source_item_id || null"
              >
                {{ $t("bundle-group.form.I2.placeholder") }}
              </option>
              <option
                :value="bund.id"
                v-for="(bund, index) in bundles"
                :key="index"
              >
                {{ bund.bundle_serial }}
              </option>
            </select>
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
          @closeModal="
            closeModal();
            formData = true;
          "
          :text="$t('bundle-group.form.success')"
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

import ButtonComponent from "@/components/Layouts/AppLayoutComponents/ButtonComponent.vue";

import * as yup from "yup";

import TableLayoutComponent from "@/components/Layouts/TablesLayoutComponents/TableLayoutComponent.vue";
import { modalMixin } from "@/mixins/toggleModal";
import { useResetValues } from "@/mixins/useResetValue";
import Modal from "@/components/Modal.vue";

import TableSkeletonLoader from "@/components/Layouts/TablesLayoutComponents/TableLoadersComponents/TableSkeletonLoader.vue";
import BreadCrumpsComponent from "@/components/Layouts/AppLayoutComponents/BreadCrumpsComponent.vue";
import TableHeader from "@/components/Layouts/TablesLayoutComponents/TableHeaderComponent.vue";
import { BundleData } from "@/types/itemsettings/bundle";
import bundle_group_api from "@/services/inventory/bundle_group_api";
export default {
  components: {
    FormPopUpLayoutComponent,
    TableLayoutComponent,
    ButtonComponent,
    TableSkeletonLoader,
    SuccessModalComponent,
    Modal,
    BreadCrumpsComponent,
    TableHeader,
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
        { text: this.$t("bundle-group.BreadCrump"), route: "" },
      ],

      formData: true,
      loading: true,
      btn_loading: false,
      selectedRowId: null as number,
      columns: [
        this.$t("bundle-group.table.bundle-serial"),
        this.$t("bundle-group.table.source-item"),
        this.$t("bundle-group.table.creator"),
        this.$t("bundle-group.table.action"),
      ],
      bundles: [],
      rows: [],
      bundleData: {
        bundle_serial: null,
        source_item_id: null,
      },
      errors: {
        bundle_serial: "" as string,
      },
    };
  },
  computed: {
    SkuCode() {
      return this.bundles.map((el: BundleData) => el.source_item.item_sku_code);
    },
  },
  methods: {
    getValidationSchema() {
      return yup.object().shape({
        bundle_serial: yup
          .string()
          .required(this.$t("bundle-group.form.errors.bundle-serial")),
      });
    },
    async submitForm() {
      this.reset(this.errors);
      const schema = this.getValidationSchema();
      try {
        await schema.validate(this.bundleData, { abortEarly: false });
        this.btn_loading = true;
        this.isEditModalOpen
          ? await bundle_group_api.updateBundle(
              this.bundleData,
              this.selectedRowId
            )
          : await await this.addbundle();
        this.formData = false;
        this.getbundles();
        this.reset(this.bundleData);
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
      const selectedRow = this.rows.find((bundle: any) => bundle.id === row_id);
      this.openEditModal();
      (this.bundleData = {
        bundle_serial: selectedRow.bundle_serial,
        source_item_id: selectedRow.sku_code,
      }),
        (this.selectedRowId = row_id);
    },
    async addbundle() {
      this.btn_loading = true;
      try {
        this.isEditModalOpen
          ? await bundle_group_api.updateBundle(
              this.LevelData,
              this.selectedRowId
            )
          : await bundle_group_api.addbundle(this.bundleData);

        this.formData = false;
        this.reset(this.bundleData);
        this.getbundles();
      } catch (error) {
        if ((error.response.data.status = 422)) {
          this.errors.bundle_serial = this.$t(
            "bundle-group.form.errors.bundle-serial-exist"
          );
        }

        throw error;
      } finally {
        this.btn_loading = false;
      }
    },
    async getbundles() {
      try {
        this.loading = true;
        const response = await bundle_group_api.getbundles();
        this.bundles = response;

        this.rows = this.bundles.map((bund: any) => ({
          id: bund.id,
          bundle_serial: bund.bundle_serial,
          sku_code: bund.source_item?.item_sku_code,
          creator: bund.creator.name,
        }));
      } catch (er) {
        throw er;
      } finally {
        this.loading = false;
      }
    },
  },
  async mounted() {
    await this.getbundles();
    this.loading = false;
  },
};
</script>
