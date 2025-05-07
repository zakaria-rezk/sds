<template>
  <section class="py-1 mx-12">
    <BreadCrumpsComponent
      :BreadCrumps="breadCrumps"
      :disabled="false"
      :btn="history ? 'Go Back' : null"
      @toggleModalEmit="router.back()"
    />
    <div
      class="w-full lg:w-full px-4 mx-auto mt-6 just-rounded-border bg-white"
    >
      <div
        class="main-thead static just-rounded-border color-primary py-3 -my-0.5 -mx-0.5"
      >
        <span class="px-8">{{ $t("create_item.title") }}</span>
      </div>
      <CardBoxLayoutComponent>
        <div>
          <h6 class="text-sm mt-3 mb-6 font-bold uppercase">
            {{ $t("create_item.form.part_one") }}
          </h6>
          <div class="flex flex-wrap item_information">
            <div class="w-full flex lg:w-6/12 px-4">
              <div class="input flex py-2 mt-1 w-full">
                <InputLableLayoutComponent
                  class="rounded-span"
                  :text="$t('create_item.form.I1.label')"
                  lable-for="name"
                  :required="false"
                ></InputLableLayoutComponent>
                <GenericInputLayoutComponent
                  type="text"
                  size="full"
                  appearance="secondary"
                  variant="outline"
                  v-model="formData.item_name"
                  :placeholder="$t('create_item.form.I1.placeholder')"
                />
              </div>
            </div>
            <div class="w-full lg:w-6/12 px-4">
              <div class="input flex w-full py-2 mt-1">
                <InputLableLayoutComponent
                  class="rounded-span w-fit"
                  :text="$t('create_item.form.I2.label')"
                  lable-for="Sku_code"
                  :required="false"
                ></InputLableLayoutComponent>
                <GenericInputLayoutComponent
                  type="text"
                  size="full"
                  appearance="secondary"
                  variant="outline"
                  v-model="formData.item_sku_code"
                  :placeholder="$t('create_item.form.I2.placeholder')"
                />
              </div>
            </div>
            <div class="w-full lg:w-6/12 px-4">
              <div class="input flex w-full py-2 mt-1">
                <InputLableLayoutComponent
                  class="rounded-span w-fit"
                  :text="$t('create_item.form.I3.label')"
                  lable-for="uom"
                  :required="false"
                ></InputLableLayoutComponent>
                <select
                  name="uom"
                  id=""
                  v-model="formData.uom_id"
                  class="py-2 rounded-md border-2 bg-violet-50 px-2 w-full"
                >
                  <option :value="null" selected disabled>
                    {{ $t("create_item.form.I3.placeholder") }}
                  </option>
                  <option :value="uom.id" v-for="uom in uom" :key="uom.id">
                    {{ uom.name }}
                  </option>
                </select>
              </div>
            </div>
            <div class="w-full lg:w-6/12 px-4">
              <div class="input flex w-full py-2 mt-1">
                <InputLableLayoutComponent
                  class="rounded-span w-fit"
                  :text="$t('create_item.form.I4.label')"
                  lable-for="item_type"
                  :required="false"
                ></InputLableLayoutComponent>
                <select
                  name="item_type"
                  id=""
                  v-model="formData.item_type"
                  class="py-2 rounded-md border-2 bg-violet-50 px-2 w-full"
                >
                  <option :value="null" selected disabled>
                    {{ $t("create_item.form.I4.placeholder") }}
                  </option>
                  <option
                    :value="type"
                    v-for="(type, index) in itemType"
                    :key="index"
                  >
                    {{ type }}
                  </option>
                </select>
              </div>
            </div>
          </div>
          <hr class="mt-6 border-b-1 border-blueGray-300" />
          <h6 class="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            {{ $t("create_item.form.part_two") }}
          </h6>
          <div class="flex flex-wrap item_shape">
            <div class="w-full lg:w-6/12 px-4">
              <div class="input flex w-full py-2 mt-1">
                <InputLableLayoutComponent
                  class="rounded-span w-fit"
                  :text="$t('create_item.form.dimensions.I1.label')"
                  lable-for="name"
                  :required="false"
                ></InputLableLayoutComponent>
                <GenericInputLayoutComponent
                  type="number"
                  appearance="secondary"
                  size="full"
                  variant="outline"
                  :placeholder="
                    $t('create_item.form.dimensions.I1.placeholder')
                  "
                  v-model="formData.length"
                />
              </div>
            </div>
            <div class="w-full lg:w-6/12 px-4">
              <div class="input flex w-full py-2 mt-1">
                <InputLableLayoutComponent
                  class="rounded-span w-fit"
                  :text="$t('create_item.form.dimensions.I2.label')"
                  lable-for="thick_height"
                  :required="false"
                ></InputLableLayoutComponent>
                <GenericInputLayoutComponent
                  type="number"
                  appearance="secondary"
                  size="full"
                  variant="outline"
                  :placeholder="
                    $t('create_item.form.dimensions.I2.placeholder')
                  "
                  v-model="formData.thick_height"
                />
                <p v-if="errors.thick_height" class="pt-2 text-xs text-red-500">
                  {{ errors.thick_height }}
                </p>
              </div>
            </div>
          </div>
          <div class="flex flex-wrap">
            <div class="w-full lg:w-6/12 px-4">
              <div class="input flex w-full py-2 mt-1">
                <InputLableLayoutComponent
                  class="rounded-span w-fit"
                  :required="false"
                  :text="$t('create_item.form.dimensions.I3.label')"
                  lable-for="name"
                ></InputLableLayoutComponent>
                <GenericInputLayoutComponent
                  type="number"
                  appearance="secondary"
                  size="full"
                  variant="outline"
                  :placeholder="
                    $t('create_item.form.dimensions.I3.placeholder')
                  "
                  v-model="formData.width"
                />
              </div>
            </div>
            <div class="w-full lg:w-6/12 px-4">
              <div class="input flex w-full py-2 mt-1">
                <InputLableLayoutComponent
                  class="rounded-span w-fit"
                  :required="false"
                  :text="$t('create_item.form.dimensions.I4.label')"
                  lable-for="name"
                ></InputLableLayoutComponent>
                <GenericInputLayoutComponent
                  type="number"
                  appearance="secondary"
                  size="full"
                  variant="outline"
                  :placeholder="
                    $t('create_item.form.dimensions.I4.placeholder')
                  "
                  v-model="formData.weight"
                />
              </div>
            </div>
          </div>
          <hr class="mt-6 border-b-1 border-blueGray-300" />
          <h6 class="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            {{ $t("create_item.form.part_three") }}
          </h6>
          <div class="flex flex-wrap">
            <div
              class="w-full lg:w-6/12 px-4"
              v-for="(item, key, index) in dropDownData"
              :key="index"
            >
              <div class="input flex w-full py-2 mt-1">
                <InputLableLayoutComponent
                  class="rounded-span w-fit"
                  :text="$t(`create_item.form.drop_down.I${index + 1}.label`)"
                  lable-for="item"
                  :required="false"
                ></InputLableLayoutComponent>
                <select
                  v-model="formData[key]"
                  id="operation-type"
                  class="py-2 rounded-md border-2 bg-violet-50 px-2 w-full"
                >
                  <option :value="null" selected disabled>
                    {{
                      $t(`create_item.form.drop_down.I${index + 1}.placeholder`)
                    }}
                  </option>
                  <option :value="i.id" v-for="i in item" :key="i.id">
                    {{ i.name }}
                  </option>
                </select>
              </div>
            </div>
            <div
              class="w-full mt-4 p-4 border-t border-gray-200 dark:border-gray-500"
            >
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
                class="mt-4 grid grid-cols-6 gap-4 relative"
                @click="selectRemovableImgIndex($event, true)"
              >
                <div
                  v-for="(img, index) in newImgs"
                  :key="index"
                  class="relative border-2 border-green-500 rounded-lg overflow-hidden transition duration-300 hover:shadow-lg animate-fade-scale"
                >
                  <img
                    :src="img"
                    alt="Uploaded Preview"
                    class="w-full h-full object-cover rounded shadow"
                    width="300"
                    height="300"
                  />
                  <div
                    class="absolute inset-0 bg-green-500 opacity-0 hover:opacity-10 transition duration-300"
                  ></div>
                  <!-- Close button -->
                  <button
                    :data-index="index"
                    class="delete-btn absolute top-0 right-0 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg hover:bg-green-600"
                  >
                    <font-awesome-icon :icon="['fas', 'x']" class="w-2 h-2" />
                  </button>
                </div>
              </div>
              <div
                class="mt-4 grid grid-cols-6 gap-4 relative"
                @click="selectRemovableImgIndex($event, false)"
              >
                <div
                  v-for="(img, index) in imagePreviews"
                  :key="img.id"
                  class="relative border-2 border-indigo-500 rounded-lg overflow-hidden transition duration-300 hover:shadow-lg"
                >
                  <img
                    :src="img.url"
                    alt="Uploaded Preview"
                    class="w-full h-full object-cover rounded shadow"
                    width="300"
                    height="300"
                  />
                  <div
                    class="absolute inset-0 bg-indigo-500 opacity-0 hover:opacity-10 transition duration-300"
                  ></div>
                  <!-- Close button -->
                  <button
                    :data-index="index"
                    :data-id="img.id"
                    class="delete-btn absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg hover:bg-red-600"
                  >
                    <font-awesome-icon :icon="['fas', 'x']" class="w-2 h-2" />
                  </button>
                </div>
              </div>
            </div>

            <div class="flex justify-end w-full">
              <div class="">
                <button
                  class="form_btn w-[200px]"
                  type="button"
                  @click="submitForm"
                >
                  {{ $t("save") }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </CardBoxLayoutComponent>
      <ModalComponent :show-modal="isModalOpen">
        <FormPopUpLayoutComponent
          @closeModal="closeModal"
          v-click-outside="closeModal"
        >
          <ActionAlertLayoutComponent
            @cancle-process="closeModal"
            @confirm-process="removeImage"
          ></ActionAlertLayoutComponent>
        </FormPopUpLayoutComponent>
      </ModalComponent>
    </div>
  </section>
</template>
<script setup lang="ts">
import { onMounted } from "vue";
import { ref, defineAsyncComponent } from "vue";
const ActionAlertLayoutComponent = defineAsyncComponent(
  () =>
    import(
      "@/components/Layouts/PopUpLayoutComponent/ActionAlertLayoutComponent.vue"
    )
);
const ModalComponent = defineAsyncComponent(
  () => import("@/components/Layouts/AppLayoutComponents/ModalComponent.vue")
);
const FormPopUpLayoutComponent = defineAsyncComponent(
  () =>
    import(
      "@/components/Layouts/PopUpLayoutComponent/FormPopUpLayoutComponent.vue"
    )
);
import CardBoxLayoutComponent from "@/components/Layouts/AppLayoutComponents/CardBoxLayoutComponent.vue";
import { useRouter, useRoute } from "vue-router";
import BreadCrumpsComponent from "@/components/Layouts/AppLayoutComponents/BreadCrumpsComponent.vue";
import InputLableLayoutComponent from "@/components/Layouts/InputsFromLayoutCompoennts/InputLableLayoutComponent.vue";
import create_item_api from "@/services/create_item_api";
import GenericInputLayoutComponent from "@/components/Layouts/FormLayoutComponents/GenericInputLayoutComponent.vue";
import CreateItmeDropDown from "@/types/itemsettings/CreateItmeDropDown.";
import { useSchemaValidation } from "@/composables/useValidationSchema";
import { useToast } from "vue-toast-notification";
import store from "@/Middelware/store";
const toast = useToast();
const route = useRoute();
const history = window.history.state.previous;
const breadCrumps = [
  {
    text: t("items.BreadCrump"),
    route: "ItemBatch",
  },
  { text: t('create_item.form.title'), route: "" },
];
const dropDownData = ref<CreateItmeDropDown>();
const router = useRouter();
const { getValidationSchema } = useSchemaValidation();
const errors = ref<any>({});
const form = ref<any>(new FormData());
const formData = ref<any>({
  location_id: +store.getters["location_module/LocationId"],
  item_name: null,
  uom_id: null,
  item_type: null,
  item_sku_code: null,
  item_material_id: null,
  shape_id: null,
  origin_id: null,
  media: [],
  bundle_id: null,
  categories_id: null,
  length: null,
  width: null,
  thick_height: null,
  weight: null,
});
import { useModal } from "@/composables/useModal";
const { isModalOpen, openModal, closeModal } = useModal();
const imagePreviews = ref<any[]>([]);
let selectedImgIndex: number = 0;
let slectedImgId: number = null;
const selectRemovableImgIndex = (event: MouseEvent, penddingImg: boolean) => {
  const deleteBtn = (event.target as HTMLButtonElement).closest(".delete-btn");
  if (!(deleteBtn instanceof HTMLButtonElement)) return;

  const index = Number(deleteBtn.dataset.index);
  const id = Number(deleteBtn.dataset.id);
  selectedImgIndex = index;
  slectedImgId = id;
  if (penddingImg) getImgIndex();
  else openModal();
};
const getImgIndex = () => {
  newImgs.value.splice(selectedImgIndex, 1);
};
const removeImage = () => {
  imagePreviews.value.splice(selectedImgIndex, 1);
  create_item_api.deleteImg(slectedImgId);
  closeModal();
};
const newImgs = ref<any>([]);
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (!files) return;
  for (let i = 0; i < files.length; i++) {
    form.value.append("media[]", files[i]);
    newImgs.value.push(URL.createObjectURL(files[i]));
  }

  // for (const [key, value] of form.value.entries()) {
  //   console.log(form.value.getAll("media[]")[0].name);
  // }
};
let sku_code: string = null; //to use for backend purpose
const updateItem = async (item_id: number) => {
  // if ((formData.value.item_sku_code = sku_code)) {
  //   delete formData.value.item_sku_code;
  // }
  try {
    const response = await create_item_api.updateItem(formData.value, item_id);
    form.value.append("entity_id", item_id);
    form.value.append("entity_type", "item_card");
    form.value.append("type", "image");
    await create_item_api.addItemImgs(form.value);
    newImgs.value = [];
    toast.success("item created sucessfully");
    getItemCard();
  } catch (er) {
    throw er;
  } finally {
    form.value = new FormData();
  }
};
const submitForm = async () => {
  if (route.params.item_id) {
    updateItem(+route.params.item_id);
    return;
  }
  Object.entries(formData.value).forEach(([key, value]) => {
    if (key !== "media" && value != null) {
      form.value.append(key, value);
    }
  });
  try {
    await create_item_api.addItem(form.value);
    toast.success("item created sucessfully", {
      position: "top-right",
      duration: 5000,
      pauseOnHover: true,
    });
    formData.value = Object.fromEntries(
      Object.entries(formData.value).map(([key, value]) => [
        key,
        key === "location_id" ? value : null,
      ])
    );
    imagePreviews.value = [];
    // if (history.state.previous)
    //   router.push({
    //     name: history.state.previous,
    //     params: {
    //       form_id: route.params.form_id,
    //       operation_id: route.params.operation_id,
    //     },
    //   });
  } catch (error) {
    if (error.inner) {
      error.inner.forEach((validationError: any) => {
        errors.value[validationError.path] = validationError.message;
      });
    }
  } finally {
    form.value = new FormData();
  }
};
const uom = ref<any>();
const itemType = ["service", "consumable", "storable"];
const getDropDownData = async () => {
  try {
    const response = await create_item_api.getItmeDropDownData();
    uom.value = response.uom_id;
    delete response.uom_id;

    dropDownData.value = response;
  } catch (error) {
    throw error;
  }
};
import item_batch_api from "@/services/inventory/item_batch_api";

const getItemCard = async () => {
  if (!route.params.item_id) return;
  try {
    const response = await item_batch_api.getItem(+route.params.item_id);
    formData.value.item_name = response.item_name;
    formData.value.item_sku_code = response.item_sku_code;
    formData.value.uom_id = response.uom?.id || null;
    formData.value.item_type = response.item_type;
    formData.value.origin_id = response.origin?.id || null;
    formData.value.shape_id = response.shape?.id || null;
    formData.value.bundle_id = response.bundle?.id || null;
    formData.value.item_material_id = response.item_material_id;
    imagePreviews.value = [];

    response.media.forEach((img) => {
      imagePreviews.value.push({ url: img.full_url, id: img.id });
    });
  } catch (error) {
    throw error;
  }
};
onMounted(() => {
  getItemCard();
  getDropDownData();
});
</script>
