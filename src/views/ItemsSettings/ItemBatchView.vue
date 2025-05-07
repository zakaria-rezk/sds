<template>
  <section class="mx-12">
    <BreadCrumpsComponent
      @toggleModalEmit="navigator"
      :btn="$t('create_item.form.title')"
      :BreadCrumps="breadCrumps"
      :disabled="false"
    />
    <SelectToLayoutComponent
      :keys="dropDownKeys"
      :data="filterDropDownData"
      @filter="filter"
    />
    <table-skeleton-loader v-if="loading" />
    <TableLayoutComponent
      v-else
      :rows="rows"
      :columns="columns"
      :paginationObj="paginationObj"
      @update:page="filter(null, $event)"
    >
      <template #actions="{ row }">
        <td>
          <router-link
            :to="{ name: 'CreateItem', params: { item_id: row.id } }"
          >
            <font-awesome-icon
              :icon="['fas', 'list']"
              class="btn color-primary"
          /></router-link></td
      ></template>
      <!-- <template #status="{ row }">
        <td>
          <button
            @click="
              openModal();
              item_id = row.id;
            "
            class="flex items-center gap-2 bg-violet-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-violet-600 transition"
          >
            <font-awesome-icon :icon="['fas', 'upload']" class="text-lg" />
            <span>Upload Images</span>
          </button>
        </td>
      </template> -->
    </TableLayoutComponent>
    <ModalComponent :show-modal="isModalOpen">
      <FormPopUpLayoutComponent
        @closeModal="resetValues"
        v-click-outside="resetValues"
      >
        <div class="file-upload">
          <button
            class="w-full flex justify-between items-center font-bold cursor-pointer hover:underline text-gray-800 dark:text-gray-50"
          >
            <label for="fileInput" class="flex justify-between">
              <p
                class="text-base cursor-pointer bg-violet-400 px-4 py-2 rounded-md text-white"
              >
                {{ $t("material-title.add-img-btn") }}
              </p>
            </label>
            <input
              ref="fileInput"
              type="file"
              id="fileInput"
              accept="image/*"
              multiple
              @change="handleFileChange($event)"
              class="hidden"
            />
          </button>
          <div
            v-if="imagePreviews.length"
            class="flex flex-wrap gap-4 mt-4 p-4 border border-gray-300 rounded-lg bg-gray-100"
          >
            <TransitionGroup name="fade-scale">
              <div
                v-for="(file, index) in imagePreviews"
                :key="index"
                class="relative group"
              >
                <img
                  :src="file"
                  :alt="file"
                  class="w-24 h-24 object-cover rounded-lg shadow-md"
                />
                <button
                  @click="removeImage(index)"
                  class="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
              </div>
            </TransitionGroup>
          </div>
        </div>
        <ButtonComponent
          v-if="imagePreviews.length"
          :title="$t('save')"
          @click="addImgs"
          :loading="ButtonLoad"
          class="form_btn"
        />
      </FormPopUpLayoutComponent>
    </ModalComponent>
  </section>
</template>
<script setup lang="ts">
import { useToast } from "vue-toast-notification";
const toast = useToast();
let item_id: number = null;
const resetValues = () => {
  form.value = new FormData();
  imagePreviews.value = [];
  closeModal();
};
const addImgs = async () => {
  try {
    toggleButtonLoad();
    form.value.append("entity_id", item_id);
    form.value.append("entity_type", "item_card");
    form.value.append("type", "image");

    await create_item_api.addItemImgs(form.value);
    toast.success("images uploaded sucessfully", {
      position: "top-right",
      duration: 5000,
      pauseOnHover: true,
    });
  } catch (er) {
  } finally {
    toggleButtonLoad();
    resetValues();
  }
};

import ButtonComponent from "@/components/Layouts/AppLayoutComponents/ButtonComponent.vue";
const imagePreviews = ref<string[]>([]);
const form = ref<any>(new FormData());
const removeImage = (index: number) => {
  imagePreviews.value.splice(index, 1);
};
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  form.value = new FormData();
  if (!files) return;
  for (let i = 0; i < files.length; i++) {
    form.value.append("media[]", files[i]);
    imagePreviews.value.push(URL.createObjectURL(files[i]));
  }
  // const mediaFiles = form.value.getAll("media[]");
  // console.log(mediaFiles);
  // for (const [key, value] of form.value.entries()) {
  //   console.log(form.value.getAll("media[]")[0].name);
  // }
};
import { useButtonLoad } from "@/composables/useButtonLoad";
import { useRoute, useRouter } from "vue-router";
const ModalComponent = defineAsyncComponent(
  () => import("@/components/Layouts/AppLayoutComponents/ModalComponent.vue")
);
const FormPopUpLayoutComponent = defineAsyncComponent(
  () =>
    import(
      "@/components/Layouts/PopUpLayoutComponent/FormPopUpLayoutComponent.vue"
    )
);
import { useModal } from "@/composables/useModal";
const {
  isModalOpen,
  openModal,
  closeModal,
  toggleModal,
  displayForm,
  closeEditModal,
  isEditModalOpen,
  openEditModal,
} = useModal();
const { ButtonLoad, toggleButtonLoad } = useButtonLoad();
import { ref, onMounted, defineAsyncComponent } from "vue";
//SEARCH IMPORTS
import SelectToLayoutComponent from "@/components/Layouts/FormLayoutComponents/SelectToLayoutComponent.vue";
///SEARCH DATA // ITME IDS WILL BE ADD TO FOMR WHEN USER CLICK ADD
const dropDownKeys = ref<any>();
const filterDropDownData = ref<any>();
import create_item_api from "@/services/create_item_api";
import item_batch_api from "@/services/inventory/item_batch_api";
const paginationObj = ref<object>();
import TableSkeletonLoader from "@/components/Layouts/TablesLayoutComponents/TableLoadersComponents/TableSkeletonLoader.vue";
import TableLayoutComponent from "@/components/Layouts/TablesLayoutComponents/TableLayoutComponent.vue";
//table
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const columns = [
  t("table.sku_code"),
  t("table.card_name"),
  t("table.material_name"),
  t("table.category_name"),
  t("table.shape_name"),
  t("table.origin_name"),
  t("table.uom"),
  t("table.action"),
];

const rows = ref([]);
const loading = ref(true);
// Methods
const route = useRoute();
const router = useRouter();
//form
import release_api from "@/services/inventory/release_api";
import BreadCrumpsComponent from "@/components/Layouts/AppLayoutComponents/BreadCrumpsComponent.vue";

const navigator = () => {
  router.push({ name: "CreateItem" });
};
const breadCrumps = [
  { text: t("welcome.routes.item_settings"), route: "ItemsSettings" },
  { text: t("items.BreadCrump"), route: "" },
];
const filter = async (filteredData: any = null, pageNumber: number = 1) => {
  if (filteredData) {
    filteredData.is_in_location = 1;
  }

  try {
    loading.value = true;
    const response = await item_batch_api.getItems(filteredData, pageNumber);
    rows.value = response.data.map((item: any) => ({
      id: item.id,
      sku_code: item.item_sku_code,
      card_name: item.item_name,
      material_name: item.material?.material_nicknames,
      category_name: item.category?.cat_name,
      shape_name: item.shape?.shape_name,
      origin_name: item.origin?.origin_name,
      uom: item.uom?.uom,
    }));
    paginationObj.value = response.pagination;
  } catch (error) {
    rows.value = [];
    throw error;
  } finally {
    loading.value = false;
  }
};
const getDropDownFilterData = async () => {
  try {
    filterDropDownData.value = await release_api.getDropDownFilterData();
  } catch (error) {
  } finally {
    loading.value = false;
  }

  dropDownKeys.value = Object.keys(filterDropDownData.value);
};
// On Mounted
onMounted(async () => {
  filter();
  getDropDownFilterData();
});
</script>
