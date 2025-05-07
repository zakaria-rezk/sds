<template>
  <div class="">
    <BreadCrumpsComponent
      @toggleModalEmit="toggleModal"
      :btn="$t('operations.add-operation-btn')"
      :disabled="false"
      :BreadCrumps="breadCrumps"
    />

    <TableSkeletonLoader v-if="loading" />

    <TableLayoutComponent
      :columns="columns"
      :rows="rows"
      :pageLable="$t('operations.table.form_name')"
      v-else
    >
      <template #actions="{ row }">
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
            @click="deleteOperation(row.id)"
          >
          </ButtonComponent>
        </td>
      </template>
    </TableLayoutComponent>

    <ModalComponent :showModal="showModal">
      <FormPopUpLayoutComponent
        @close-modal="closeModal"
        v-click-outside="closeModal"
        v-click-enter="submitForm"
        :title="
          isEditModalOpen
            ? $t('operations.edit_operation')
            : $t('operations.add-operation-btn')
        "
      >
        <div>
          <div v-if="formInputs">
            <div class="input-group flex flex-col w-full py-2 mt-1">
              <label for="name"
                >{{ $t("operations.form.I1.label")
                }}<span class="text-red-500 pb-4">*</span></label
              >
              <input
                type="text"
                id="name"
                v-model="formData.operation_name_en"
                class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
                :placeholder="$t('operations.form.I1.placeholder')"
              />
              <p
                v-if="errors.operation_name_en"
                class="pt-2 text-xs text-red-500"
              >
                {{ errors.operation_name_en }}
              </p>
            </div>
            <div class="input-group flex flex-col w-full py-2 mt-1">
              <label for="name"
                >{{ $t("operations.form.I2.label")
                }}<span class="text-red-500 pb-4">*</span></label
              >
              <input
                type="text"
                id="name"
                v-model="formData.operation_name_ar"
                class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
                :placeholder="$t('operations.form.I2.placeholder')"
              />
              <p
                v-if="errors.operation_name_ar"
                class="pt-2 text-xs text-red-500"
              >
                {{ errors.operation_name_ar }}
              </p>
            </div>
            <div class="input-group flex flex-col w-full py-2 mt-1">
              <label for="name"
                >{{ $t("operations.form.I3.label") }}
                <span class="text-red-500 pb-4">*</span></label
              >
              <select
                id="operation-type"
                class="py-2 rounded-md border-2 bg-gray-100 text-gray-500 px-2"
                v-model="formData.operation_type"
              >
                <option disabled selected :value="null">
                  {{ $t("operations.form.I3.placeholder") }}
                </option>
                <option
                  :value="opa"
                  v-for="opa in OperationIput"
                  :key="opa"
                >
                 {{ opa }}
                </option>
              </select>
              <p v-if="errors.operation_type" class="pt-2 text-xs text-red-500">
                {{ errors.operation_type }}
              </p>
            </div>
            <div class="input-group flex flex-col w-full py-2 mt-1">
              <label for="name"
                >{{ $t("operations.form.I4.label") }}
                <span class="text-red-500 pb-4">*</span></label
              >
              <select
                id="operation-parent"
                class="py-2 rounded-md border-2 bg-gray-100 text-gray-500 px-2"
              >
                <!-- operation parent in ar json must be update -->
                <option disabled selected value="">
                  {{ $t("operations.form.I4.placeholder") }}
                </option>
                <option
                  :value="opa"
                  v-for="opa in OperationIput"
                  :key="opa"
                >
                 {{ opa }}
                </option>
              </select>
            </div>
            <div class="input-group flex flex-col w-full py-2 mt-1">
              <label for="name"
                >{{ $t("operations.form.I5.label")
                }}<span class="text-red-500 pb-4">*</span></label
              >
              <input
                type="reference_doc_type"
                id="name"
                v-model="formData.reference_doc_type"
                class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
                :placeholder="$t('operations.form.I5.placeholder')"
              />
              <p
                v-if="errors.reference_doc_type"
                class="py-2 text-xs text-red-500"
              >
                {{ errors.reference_doc_type }}
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
            :text="$t('operations.form.success')"
          ></SuccessModalComponent>
        </div>
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
import TableLayoutComponent from "@/components/Layouts/TablesLayoutComponents/TableLayoutComponent.vue";
import { modalMixin } from "@/mixins/toggleModal";
import { useResetValues } from "@/mixins/useResetValue";

import ButtonComponent from "@/components/Layouts/AppLayoutComponents/ButtonComponent.vue";
import { OperationRoutes } from "@/components/json/OperationRoutes";
import TableSkeletonLoader from "@/components/Layouts/TablesLayoutComponents/TableLoadersComponents/TableSkeletonLoader.vue";
import BreadCrumpsComponent from "@/components/Layouts/AppLayoutComponents/BreadCrumpsComponent.vue";
import operations_api from "@/services/inventory/operations_setting_api";

export default {
  components: {
    TableSkeletonLoader,
    SuccessModalComponent,
    BreadCrumpsComponent,
    TableLayoutComponent,
    ModalComponent,
    FormPopUpLayoutComponent,
    ButtonComponent,
  },
  mixins: [modalMixin, useResetValues],
  data() {
    return {
      breadCrumps: [
        { text: this.$t("welcome.routes.settings"), route: "Settings" },
        { text: this.$t("setting.r1.text"), route: "" },
      ],
      formInputs: true,
      enableUpdateBtn: false,
      selectedRowId: null,
      Operations: null,
      loading: true,
      rows: "" as any,
      btn_loading: false,
      columns: [
        this.$t("operations.table.operation-name_en"),
        this.$t("operations.table.operation-name_ar"),
        this.$t("operations.table.operation-type"),
        this.$t("operations.table.reference-document-type"),
        this.$t("operations.table.action"),
      ],
      OperationIput: null,
      formData: {
        operation_name_en: "",
        operation_name_ar: "",
        operation_type: null,
        operation_parent: null,
        reference_doc_type: "",
      },
      errors: {
        operation_name_en: "" as string,
        operation_name_ar: "" as string,
        operation_type: "" as string,
        operation_parent: "" as string,
        reference_doc_type: "" as string,
      },
    };
  },
  computed: {},
  methods: {
    updateForm(row_id: number) {
      this.enableUpdateBtn = true;

      const selectedRow = this.rows.find((row: any) => row.id === row_id);

      this.formData = {
        operation_name_en: selectedRow.opeartion_name_en,
        operation_name_ar: selectedRow.opeartion_name_ar,
        operation_type: selectedRow.operation_type,
        operation_parent: selectedRow.operation_parent,
        reference_doc_type: selectedRow.operatino_ref,
      };
      this.toggleModal();
      this.selectedRowId = row_id;
    },
    async deleteOperation(row_id: number) {
      try {
        operations_api.deleteOperation(row_id);
        this.getOperations();
      } catch (error) {
        throw error;
      }
    },
    getValidationSchema() {
      return yup.object().shape({
        operation_name_en: yup
          .string()
          .required(this.$t("operations.form.errors.name")),
        operation_name_ar: yup
          .string()
          .required(this.$t("operations.form.errors.name")),
        operation_type: yup
          .string()
          .required(this.$t("operations.form.errors.type")),
        operation_parent: yup.string().nullable(),
        reference_doc_type: yup
          .string()
          .required(this.$t("operations.form.errors.reference")),
      });
    },
    async submitForm() {
      this.reset(this.errors);
      this.btn_loading = true;
      const schema = this.getValidationSchema();
      try {
        await schema.validate(this.formData, { abortEarly: false });

        this.enableUpdateBtn
          ? await operations_api.updateOperation(
              this.formData,
              this.selectedRowId
            )
          : await operations_api.addOperation(this.formData);
        this.formInputs = !this.formInputs;
        this.getOperations();
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

    async getOperations() {
      try {
        const response = await operations_api.getOperation();
        this.rows = response.map((opa: any) => ({
          id: opa.id,
          opeartion_name_en: opa.operation_name_en,
          opeartion_name_ar: opa.operation_name_ar,
          operation_type: opa.operation_type,
          operatino_ref: opa.reference_doc_type,
        }));
      } catch (er) {
        this.rows = [];
        throw er;
      } finally {
        this.loading = false;
      }
    },
    async getOperationTypes() {
      try {
        const response = await operations_api.getOperationTypes();
        this.OperationIput = response;
      } catch (er) {
        throw er;
      } finally {
        this.loading = false;
      }
    },
  },
  async mounted() {
    this.getOperations();
    this.getOperationTypes();
  },
};
</script>


