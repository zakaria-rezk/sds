<template>
  <div>
    <BreadCrumpsComponent
      :BreadCrumps="breadCrumps"
      :btn="$t('Create Items')"
      :disabled="false"
      @toggleModalEmit="navigateToAddItemsPage"
    />
    
    <div class="flex justify-center">
      <p class="">{{ formCode }}</p>
      <p class="">
        <span>{{ $t("add_items_to_form.btn_lable") }}</span>
        <span class="font-bold px-2">{{ item_card_ids.length }}</span>
      </p>
      <button-component
        @click="addItemsToForm"
        class="btn color-primary"
        :loading="ButtonLoad"
        :title="t('add_items_to_form.BreadCrump.RFQ.curr_page')"
        :disabled="item_card_ids.length === 0"
      >
      </button-component>
    </div>

    <SelectToLayoutComponent
      :keys="dropDownKeys"
      :data="filterDropDownData"
      @filter="filter"
    />
    <TableSkeletonLoader v-if="loading" />
    <TableWraperLayoutComponent v-else>
      <TableLayoutComponent
        :pageLable="$t('add_items_to_form.page_lable')"
        :columns="columns"
        :rows="rows"
        :operations_type="'rfq_api'"
      >
        <template #status="{ row }">
          <td>
            <ToggleButtonComponent
            :disabled="false"
            :checked="isItemHasValue[row.id]"
              @fireToggleEmit="
                toggleItemFromOperation($event, row.id, row.item_name)
              "
            />
          </td>
          <!-- <td
              v-else
              class="btn"
              :class="{
                'btn-primary': row.additional_data === 'Confirmed',
                'bg-red-500': row.additional_data === 'Closed',
                'bg-violet-400 ': row.additional_data === 'Open',
                'bg-gray-400 ': row.additional_data === 'Not Exist',
              }"
            >
              {{ row.additional_data }}
            </td> -->
        </template>
      </TableLayoutComponent>
    </TableWraperLayoutComponent>

    <ModalComponent :showModal="isModalOpen"
      ><FormPopUpLayoutComponent @closeModal="toggleCloseModal" :title="row_name">
        <div class="flex flex-col">
          <div class="input flex flex-col w-full py-2 mt-1">
            <InputLableLayoutComponent
              lableFor="name"
              :text="$t('adjustment_item_form.form.I1.lable')"
            />
            <input
              type="number"
              id="name"
              class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
              :placeholder="$t('rfq_form.form.quantity')"
              v-model="form_quantity"
            />

            <p v-if="!form_quantity" class="pt-2 text-xs text-red-500">
              {{ $t("adjustment_item_form.form.I1.placeholder") }}
            </p>
          </div>
          <!-- <div class="input flex flex-col w-full py-2 mt-1">
              <InputLableLayoutComponent
                lableFor="name"
                :text="$t('adjustment_item_form.form.I1.lable')"
              />
              <input
                type="text"
                id="name"
                v-model="formData.reason_of_change"
                class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
                :placeholder="$t('adjustment_item_form.form.I1.placeholder')"
              />
              <p v-if="errors.reason_of_change" class="pt-2 text-xs text-red-500">
                {{ errors.reason_of_change }}
              </p>
            </div> -->
          <ButtonComponent
            :loading="ButtonLoad"
            :title="$t('rfq_form.form.add_item')"
            @click="addItemsToSelectedItems"
            class="form_btn"
          />
        </div>
      </FormPopUpLayoutComponent>
    </ModalComponent>

    <SuccessModalComponent
      :text="$t('rfq_form.form.success')"
    ></SuccessModalComponent>
  </div>
</template>
<script lang="ts" setup>
import TableSkeletonLoader from "@/components/Layouts/TablesLayoutComponents/TableLoadersComponents/TableSkeletonLoader.vue";

import ToggleButtonComponent from "@/components/Layouts/AppLayoutComponents/ToggleButtonComponent.vue";
import BreadCrumpsComponent from "@/components/Layouts/AppLayoutComponents/BreadCrumpsComponent.vue";
import TableLayoutComponent from "@/components/Layouts/TablesLayoutComponents/TableLayoutComponent.vue";
import SelectToLayoutComponent from "@/components/Layouts/FormLayoutComponents/SelectToLayoutComponent.vue";
import ButtonComponent from "@/components/Layouts/AppLayoutComponents/ButtonComponent.vue";

import FormPopUpLayoutComponent from "@/components/Layouts/PopUpLayoutComponent/FormPopUpLayoutComponent.vue";
import ModalComponent from "@/components/Layouts/AppLayoutComponents/ModalComponent.vue";
import InputLableLayoutComponent from "@/components/Layouts/InputsFromLayoutCompoennts/InputLableLayoutComponent.vue";
import { useModal } from "@/composables/useModal";

const { isModalOpen, openModal, closeModal, toggleModal } = useModal();
import { useButtonLoad } from "@/composables/useButtonLoad";
const { ButtonLoad, toggleButtonLoad } = useButtonLoad();

import { ref } from "vue";
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import rfq_api from "@/services/rfq_api";
import { useRouter } from "vue-router";
const router = useRouter();

const loading = ref<boolean>(true);
const route = useRoute();
const selectedItems = ref<number[]>([]);
const dropDownKeys = ref<any>();
const filterDropDownData = ref<any>();
const formCode = ref<string>(localStorage.getItem("form_code"));
import { useI18n } from "vue-i18n";

const { t, messages, locale } = useI18n();
const breadCrumps = ref([
  { text:t('rfq_form.title'), route: "RFQ" },
  {
    text: `${localStorage.getItem('rfq-form-label')}`,
    route: "RFQ-details",
    params: {
      operation_id: route.params.operation_id,
      form_id: route.params.form_id,
    },
  },
  { text: t('add_items_to_form.BreadCrump.RFQ.curr_page'), route: "" },
]);
const columns = [
  t("rfq_form.items.item_name"),
  t("rfq_form.items.item_sku_code"),
  t("rfq_form.items.item_code"),
  t("rfq_form.items.material"),
  t("rfq_form.items.shape"),
  t("rfq_form.items.origin"),
  t("Color"),
  // t("rfq_form.items.length"),
  // t("rfq_form.items.width"),

  // t("rfq_form.items.thick_height"),

  // t("rfq_form.items.Weight"),

  t("adjustment_form.table.status"),
];
const rows = ref([]);
const row_id = ref("");
const row_name = ref("");
const item_card_ids = ref([]);
const form_quantitys = ref([]);
const isItemHasValue = ref([]);
const form_quantity = ref(1);


const toggleItemFromOperation = (toggleStatus, item_id, name) => {
  row_id.value = item_id;
  row_name.value = name;
  openModal();
};
const toggleCloseModal = ()=>{
  // if(form_quantity.value==1){
    isItemHasValue.value[row_id.value] = false
  // }else{
  //   isItemHasValue.value[row_id.value] = true
  // }
  toggleModal()
  // 
}
// add items to selectedItems
const addItemsToSelectedItems = () => {
  item_card_ids.value.push(row_id.value);
  form_quantitys.value.push(form_quantity.value);
  form_quantity.value = 1;
  closeModal();
};

//   add item to rfq details
const addItemsToForm = () => {
  const payload = {
    form_id: +route.params.form_id,
    item_card_ids: item_card_ids.value,
    form_quantity: form_quantitys.value,
  };
  try {
    rfq_api.addItemsToRFQForm(payload);
  } catch (err) {
    console.error(err);
  } finally {
    setTimeout(() => {
      router.push({
        name: "RFQ-details",
        params: { 
          form_id: +route.params.form_id,
          operation_id: +route.params.operation_id,
        },
      });
    }, 2000);
  }
};

const getDropDownFilterData = async () => {
  filterDropDownData.value = await rfq_api.getDropDownFilterData();
  loading.value = false;

  dropDownKeys.value = Object.keys(filterDropDownData.value);
  console.log(dropDownKeys.value , 'dropDownKeys dropDownKeys')
};

const formData = ref({});
const filter = async (filteredData: any) => {
  loading.value = true;
  filteredData.form_id = +route.params.form_id;
  filteredData.operation_id = +route.params.operation_id;
  console.log(filteredData)
  const payload = {
    origin_id : filteredData.origins,
    shape_id : filteredData.shapes,
    color_id : filteredData.colors,
    category_id : filteredData.categories,
    material_id : filteredData.material_titles,
    item_id : filteredData.item_cards
  }
  try {
    const response = await rfq_api.getFilterdItems(payload);
    rows.value = response.map((item) => ({
      id: item.id,
      item_name: item.item_name,
      item_sku_code: item.item_sku_code,
      item_code: item.item_code,
      material: item.material?.material_nicknames,
      shape: item.shape?.shape_name,
      origin: item.origin?.origin_name,
      color: item.color?.name,
      // length: item.length,
      // width: item.width,
      // thick_height: item.thick_height,
      // Weight: item.Weight,

      // additional_data:
      //   item.form_status === null
      //     ? "Not Exist"
      //     : item.form_status === 0
      //     ? "Open"
      //     : item.form_status === 1
      //     ? "Closed"
      //     : item.form_status === 2
      //     ? "Confirmed"
      //     : item.form_status,
    }));
  } catch (error) {
    rows.value = [];
    throw error;
  } finally {
    loading.value = false;
  }
};

const navigateToAddItemsPage = () => {
  router.push({
    name: "CreateItem",
    params: {
      form_id: +route.params.form_id,
      operation_id: +route.params.operation_id,
    },
  });
};
onMounted(async () => {
  getDropDownFilterData();
  filter(formData.value);
});
</script>
<style scoped>
disabled {
  opacity: 0.5;
}
</style>
