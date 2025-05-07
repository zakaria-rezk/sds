<template>
  <div>
    <BreadCrumpsComponent
      :BreadCrumps="breadCrumps"
      :btn="$t('adjustment_form.form.button')"
      :disabled="disableBtn"
      @toggleModalEmit="openModal"
    />
    <SearchLayoutComponent
      :Schema="schema"
      @update:search="getAdjustments($event)"
    />
    <TableSkeletonLoader v-if="loading" />
    <div v-else>
      <TableLayoutComponent
        :columns="columns"
        :rows="rows"
        :pageLable="$t('adjustment_form.BreadCrump')"
      >
        <template #status="{ row }">
          <td>
            <div
              class="btn"
              :class="{
                indigo_badge: row.additional_data === $t('status.confirm'),
                yellow_badge: row.additional_data === $t('status.close'),
                green_badge: row.additional_data === $t('status.open'),
              }"
            >
              {{ row.additional_data }}
            </div>
          </td>
        </template>
        <template #actions="{ row }"
          ><td>
            <div class="flex">
              <router-link
                :to="{
                  name: 'adjustment-details',
                  params: { form_id: row.id, operation_id: route.params.id }, // operation id
                }"
              >
                <font-awesome-icon
                  :icon="['fas', 'list']"
                  class="btn color-primary"
                />
              </router-link>
              <button
                class="btn color-primary button"
                v-if="
                  row.additional_data !== $t('status.confirm') &&
                  row.additional_data !== 'Received'
                "
                @click="updateForm(row.id)"
              >
                <font-awesome-icon :icon="['fas', 'edit']" />
              </button>
            </div>
          </td>
        </template>
      </TableLayoutComponent>
    </div>
    <ModalComponent :showModal="isEditModalOpen || isModalOpen">
      <FormPopUpLayoutComponent
        @closeModal="closeModal"
        v-click-outside="closeModal"
        :title="
          isEditModalOpen
            ? $t('form_titles.adjustment.edit')
            : $t('form_titles.adjustment.add')
        "
      >
        <form
          class="flex flex-col"
          v-if="displayForm"
          @submit.prevent="submitForm"
        >
          <div
            class="input flex flex-col w-full py-2 mt-1"
            v-if="isEditModalOpen"
          >
            <InputLableLayoutComponent
              lableFor="name"
              :text="$t('adjustment_form.form.lable.lable')"
              :required="false"
            />
            <input
              readonly
              disabled
              type="text"
              id="name"
              v-model="formData.form_lable"
              class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
              :placeholder="$t('adjustment_form.form.lable.lable')"
            />
          </div>
          <div class="input flex flex-col w-full py-2 mt-1">
            <InputLableLayoutComponent
              lableFor="name"
              :text="$t('adjustment_form.form.I1.lable')"
              :required="false"
            />
            <select
              type="text"
              id="name"
              class="py-2 rounded-md border-2 bg-gray-100 text-gray-500 px-2"
              v-model="formData.category_name"
            >
              <option disabled selected value="">
                {{ $t("adjustment_form.form.I1.placeholder") }}
              </option>
              <option
                :value="category.category_name"
                v-for="category in categories"
                :key="category.id"
              >
                {{ category.category_name }}
              </option>
            </select>
          </div>
          <div class="input flex flex-col w-full py-2 mt-1">
            <InputLableLayoutComponent
              lableFor="date"
              :text="$t('adjustment_form.form.I2.lable')"
              :required="false"
            />
            <input
              required
              type="date"
              id="date"
              name="date"
              v-model="formData.form_datetime"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p v-if="errors.form_datetime" class="pt-2 text-xs text-red-500">
              {{ errors.form_datetime }}
            </p>
          </div>
          <div class="input flex flex-col w-full py-2 mt-1">
            <InputLableLayoutComponent
              lableFor="doc_number"
              :text="$t('adjustment_form.form.I3.lable')"
              :required="false"
            />
            <input
              type="text"
              id="doc_number"
              v-model="formData.doc_number"
              class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
              :placeholder="$t('adjustment_form.form.I3.placeholder')"
            />
            <p v-if="errors.doc_number" class="pt-2 text-xs text-red-500">
              {{ errors.doc_number }}
            </p>
          </div>
          <ButtonComponent
            :loading="ButtonLoad"
            :title="$t('save')"
            class="form_btn"
          />
        </form>
        <SuccessModalComponent
          v-else
          @closeModal="closeModal"
          :text="$t('adjustment_form.form.sucess')"
        ></SuccessModalComponent>
      </FormPopUpLayoutComponent>
    </ModalComponent>
  </div>
</template>
<script setup lang="ts">
//GOLBAL IMPORTS
import {
  computed,
  onMounted,
  ref,
  defineAsyncComponent,
  shallowRef,
  watch,
} from "vue";
import store from "@/Middelware/store";
import { useRoute } from "vue-router";

import GenericSelectInputLayoutComponent from "@/components/Layouts/FormLayoutComponents/GenericSelectInputLayoutComponent.vue";
import ButtonComponent from "@/components/Layouts/AppLayoutComponents/ButtonComponent.vue";
//GLOBLA DATA
const route = useRoute();
//search
const locations = computed(() =>
  store.getters["location_module/Locations"]?.map((location) => ({
    id: location.id,
    name: location.location_name,
  }))
);
import SearchLayoutComponent from "@/components/Layouts/FormLayoutComponents/SearchLayoutComponent.vue";
import {
  CreateInputField,
  CreateSelectField,
} from "@/utils/create_input_field";
const schema = ref([
  CreateInputField({
    label: "FORM LABEL",
    model: "form_label",
    component: GenericInputLayoutComponent,
    animation: "animate-fade-in-left-to-right",
    props: {
      type: "text",
      appearance: "secondary",
      variant: "outline",
      initialValue: null,
      size: "full",
    },
  }),
  CreateInputField({
    label: "FROM",
    model: "date_from",
    component: GenericInputLayoutComponent,
    animation: "animate-fade-in-up",
    props: {
      type: "date",
      appearance: "secondary",
      variant: "outline",
      size: "full",
    },
  }),
  CreateInputField({
    label: "TO",
    model: "date_to",
    component: GenericInputLayoutComponent,
    animation: "animate-fade-in-up",
    props: {
      type: "date",
      appearance: "secondary",
      variant: "outline",
      size: "full",
      initialValue: new Date().toISOString().split("T")[0],
    },
  }),
  CreateSelectField({
    label: "LOCATION",
    model: "to_location",
    component: GenericSelectInputLayoutComponent,
    animation: "animate-fade-in-right-to-left",
    props: {
      options: { ...locations.value },
      variant: "rounded",
      appearance: "secondary",
      size: "full",
    },
  }),
]);
//TABLE
//TABLE IMPORTS
import TableSkeletonLoader from "@/components/Layouts/TablesLayoutComponents/TableLoadersComponents/TableSkeletonLoader.vue";
import BreadCrumpsComponent from "@/components/Layouts/AppLayoutComponents/BreadCrumpsComponent.vue";
import TableLayoutComponent from "@/components/Layouts/TablesLayoutComponents/TableLayoutComponent.vue";
import adjustment_api from "@/services/inventory/adjustment_api";
const ModalComponent = defineAsyncComponent(
  () => import("@/components/Layouts/AppLayoutComponents/ModalComponent.vue")
);
const FormPopUpLayoutComponent = defineAsyncComponent(
  () =>
    import(
      "@/components/Layouts/PopUpLayoutComponent/FormPopUpLayoutComponent.vue"
    )
);
//TABLE COMPOSABLES
import { useModal } from "@/composables/useModal";
const {
  isModalOpen,
  openModal,
  closeModal,
  isEditModalOpen,
  openEditModal,
  displayForm,
} = useModal();
watch(
  [() => isModalOpen.value, () => isEditModalOpen.value],
  async ([newModalValue, newEditValue], [oldModalValue, oldEditValue]) => {
    if (oldEditValue) {
      // reset form data if when close edit modal :: just edit modal
      reset(formData.value);
    }
  }
);
//TABLE DATA
const loading = ref<boolean>(true);
const rows = shallowRef<[]>();
const adjustments = shallowRef<any>([]);

const breadCrumps = [{ text: t("adjustment_form.BreadCrump"), route: "" }];
const columns = [
  t("adjustment_form.table.category_name"),
  t("adjustment_form.table.form_lable"),
  t("adjustment_form.table.location_name"),
  t("adjustment_form.table.form_date_time"),
  t("adjustment_form.table.work_order_line_num"),
  t("adjustment_form.table.doc_number"),
  t("adjustment_form.table.created_by"),
  t("adjustment_form.table.confirmed_at"),
  t("adjustment_form.table.status"),
  t("view_items"),
];
//TABLE COMPUTED
const disableBtn = computed(() => {
  return (
    Array.isArray(adjustments.value) &&
    adjustments.value.some((el) => el.status === 0 || el.status === 1)
  );
});
//TABLE METHODS
const getAdjustments = async (filter = null) => {
  try {
    loading.value = true;
    const payload = {
      operation_id: +route.params.operation_id,
      ...filter,
    };
    const response = await adjustment_api.getAdjustments(payload);
    adjustments.value = response;

    rows.value = response.map((adjustment: any) => ({
      id: adjustment.id,
      category_name: adjustment.category_name,
      form_lable: adjustment.form_label,
      location_name: adjustment.from_location?.location_name,
      form_datetime: adjustment.form_datetime,
      work_order_line_num: adjustment.work_order_line_num,
      doc_number: adjustment.doc_number,
      created_by: [
        { text: adjustment.user.name },
        { text: adjustment.created_at },
      ],

      confirmed_at: [
        { text: adjustment.confirmed_by?.name || "" },
        { text: adjustment.confirmed_at?.slice(0, 10) || " " },
      ],
      additional_data:
        adjustment.status === 2
          ? t("status.confirm")
          : adjustment.status === 1
          ? t("status.close")
          : t("status.open"),
    }));
  } catch (er) {
    throw er;
  } finally {
    loading.value = false;
  }
};
//FORM
//FORM COMPONENTS
import GenericInputLayoutComponent from "@/components/Layouts/FormLayoutComponents/GenericInputLayoutComponent.vue";
const InputLableLayoutComponent = defineAsyncComponent(
  () =>
    import(
      "@/components/Layouts/InputsFromLayoutCompoennts/InputLableLayoutComponent.vue"
    )
);

const SuccessModalComponent = defineAsyncComponent(
  () =>
    import("@/components/Layouts/AppLayoutComponents/SuccessModalComponent.vue")
);

//FORM COMPOSABLES
import { useButtonLoad } from "@/composables/useButtonLoad";
import { useSchemaValidation } from "@/composables/useValidationSchema";
import { useResetValue } from "@/composables/useResetValue";
const { ButtonLoad, toggleButtonLoad } = useButtonLoad();
const { reset } = useResetValue();
const { getValidationSchema } = useSchemaValidation();
//FORM DATA
interface category {
  id: number;
  category_name: string;
}
const categories = ref<category[]>();

const errors = ref<any>({});
const selectedRowId = ref<number>(null);
interface AdjustmentOrder {
  form_lable: string;
  category_name: string;
  form_datetime: Date | string;
  doc_number: string;
  work_order_line_num: string;
}
const formData = ref<AdjustmentOrder>({
  form_lable: "",
  category_name: "",
  form_datetime: new Date().toISOString().split("T")[0],
  doc_number: "",
  work_order_line_num: "",
});

//FORM METHODS
import categories_settings_api from "@/services/inventory/categories_settings_api";
function getCategories() {
  categories_settings_api.getCategories().then((response) => {
    categories.value = response.map((category: any) => ({
      id: category.full_category_name,
      category_name: category.full_category_name,
    }));
  });
}
getCategories();
const submitForm = async () => {
  try {
    toggleButtonLoad();

    isEditModalOpen.value
      ? await adjustment_api.updateAdjustment(
          formData.value,
          selectedRowId.value
        )
      : await addAdjustment(formData.value);
    reset(formData.value);
    getAdjustments();
    displayForm.value = false;
  } catch (error) {
    throw error;
  } finally {
    toggleButtonLoad();
  }
};
const addAdjustment = async (payload) => {
  payload.operation_id = +route.params.operation_id;

  loading.value = false;
  try {
    await adjustment_api.addAdjustment(payload);
    getAdjustments();
  } catch (er) {
    throw er;
  }
};
const updateForm = (row_id: number) => {
  openEditModal();

  const selectedRow = adjustments.value.find(
    (adjustment: any) => adjustment.id === row_id
  );

  formData.value = {
    form_lable: selectedRow.form_label,
    category_name: selectedRow.category_name,
    form_datetime: new Date(selectedRow.form_datetime)
      .toISOString()
      .split("T")[0],

    doc_number: selectedRow.doc_number,
    work_order_line_num: selectedRow.work_order_line_num,
  };
  selectedRowId.value = row_id;
};
//LIFECYCLE HOOKS
onMounted(async () => {
  getAdjustments();
});
</script>
