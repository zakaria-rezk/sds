<template>
  <div class="">
    <BreadCrumpsComponent
      @toggleModalEmit="toggleModal"
      :btn="$t('material-title.add-title-btn')"
      :BreadCrumps="breadCrumps"
      :disabled="false"
    />
    <SpinnerLoaderComponent v-if="loading" />
    <div class="" v-else>
      <div
        class="w-full grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2 py-5 bg-gray-50 dark:bg-gray-100"
      >
        <article
          class="bg-white rounded-lg shadow-lg gap-5 overflow-hidden dark:bg-gray-700"
          v-for="title in Titles"
          :key="title"
        >
          <div class="">
            <transition name="fade" mode="out-in" appear>
              <!-- <img
                :key="currImage"
                class="object-cover h-64 w-full transition-transform duration-500 ease-in-out transform"
                :src="title.material_images[currImage]?.img_name || baseImg"
                alt="Image"
              /> -->
            </transition>
          </div>

          <div class="flex flex-wrap gap-4 mt-4 px-4 justify-center">
            <span class="sr-only">Colors available</span>
            <button
              v-for="(img, index) in title.material_images?.length"
              :key="index"
              aria-label="Yellow"
              :class="{ 'bg-systemColor': index === currImage }"
              @click="currImage = index"
              class="p-1 border border-gray-200 dark:border-gray-500 rounded-full cursor-pointer dark:bg-yellow-400"
            ></button>
          </div>
          <div class="flex flex-col gap-1 mt-4 px-4">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-50">
              {{ title.material_nicknames }}
            </h2>
          </div>

          <div class="mt-4 p-4 border-t border-gray-200 dark:border-gray-500">
            <button
              @click="triggerFileInput"
              class="w-full flex justify-between items-center font-bold cursor-pointer hover:underline text-gray-800 dark:text-gray-50"
            >
              <label for="fileInput" class="flex justify-between">
                <p class="text-base cursor-pointer">
                  {{ $t("material-title.add-img-btn")
                  }}<span
                    class="max-size mx-2 text-xs text-gray-500"
                    ref="maxSizeError"
                  >
                    {{ $t("material-title.img-max-size") }}</span
                  >
                </p>
              </label>
              <input
                ref="fileInput"
                type="file"
                id="fileInput"
                accept="image/*"
                multiple
                @change="handleFileChange($event, title.id)"
                class="hidden"
              />
            </button>
          </div>
        </article>
      </div>
    </div>
    <ModalComponent :showModal="showModal">
      <FormPopUpLayoutComponent
        @close-modal="toggleModal"
        v-click-outside="toggleModal"
      >
        <div v-if="formData">
          <div class="input-group flex flex-col w-full py-2 mt-1">
            <label for="name"
              >{{ $t("material-title.form.I1.label")
              }}<span class="text-red-500 pb-4">*</span></label
            >
            <input
              type="text"
              id="name"
              v-model="TitleData.material_nicknames"
              class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
              :placeholder="$t('material-title.form.I1.placeholder')"
            />
            <p
              v-if="errors.material_nicknames"
              class="pt-2 text-xs text-red-500"
            >
              {{ errors.material_nicknames }}
            </p>
          </div>
          <div class="input-group flex flex-col w-full py-2 mt-1">
            <label for="name"
              >{{ $t("material-title.form.I2.label")
              }}<span class="text-red-500 pb-4">*</span></label
            >
            <select
              id="name"
              v-model="TitleData.category_id"
              class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
              :placeholder="$t('material-title.form.I2.placeholder')"
            >
              <option :value="null" disabled>
                {{ $t("material-title.form.I2.placeholder") }}
              </option>
              <option
                v-for="(cat, index) in Categories"
                :key="index"
                :value="cat.id"
              >
                {{ cat.cat_name }}
              </option>
            </select>
            <p v-if="errors.category_id" class="pt-2 text-xs text-red-500">
              {{ errors.category_id }}
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
          @closeModal="toggleModal"
          :text="$t('material-title.form.success')"
        ></SuccessModalComponent>
      </FormPopUpLayoutComponent>
    </ModalComponent>
  </div>
</template>
<script lang="ts">
import { defineAsyncComponent } from "vue";
const defineLazyComponent = (path: string) =>
  defineAsyncComponent(() => import(`@/components/${path}`));

const ModalComponent = defineLazyComponent(
  "Layouts/AppLayoutComponents/ModalComponent.vue"
);
const FormPopUpLayoutComponent = defineLazyComponent(
  "Layouts/PopUpLayoutComponent/FormPopUpLayoutComponent.vue"
);
const SuccessModalComponent = defineLazyComponent(
  "Layouts/AppLayoutComponents/SuccessModalComponent.vue"
);
import * as yup from "yup";
import { modalMixin } from "@/mixins/toggleModal";
import ButtonComponent from "@/components/Layouts/AppLayoutComponents/ButtonComponent.vue";
import BreadCrumpsComponent from "@/components/Layouts/AppLayoutComponents/BreadCrumpsComponent.vue";
import SpinnerLoaderComponent from "@/components/Layouts/AppLayoutComponents/SpinnerLoaderComponent.vue";
import materail_titles_api from "@/services/inventory/materail_titles_api";
import categories_api from "@/services/inventory/categories_settings_api";
export default {
  components: {
    FormPopUpLayoutComponent,
    ButtonComponent,
    SpinnerLoaderComponent,
    SuccessModalComponent,
    BreadCrumpsComponent,
    ModalComponent,
  },
  mixins: [modalMixin],
  data() {
    return {
      breadCrumps: [
        {
          text: this.$t("welcome.routes.item_settings"),
          route: "ItemsSettings",
        },
        { text: this.$t("material-title.BreadCrump"), route: "" },
      ],
      formData: true,
      loading: true,
      btn_loading: false,
      currImage: 0,
      Categories: [],

      maxSizeError: "",

      Titles: [],
      TitleData: {
        material_nicknames: "",
        category_id: null,
      },
      errors: { material_nicknames: "", category_id: "" },
    };
  },
  computed: {
    parentId() {
      return this.Titles.map((el) => el.category.cat_name);
    },
  },
  methods: {
    getValidationSchema() {
      return yup.object().shape({
        material_nicknames: yup
          .string()
          .required(this.$t("material-title.form.errors.material_nicknames")),
        category_id: yup
          .string()
          .required(this.$t("material-title.form.errors.category_id")),
      });
    },
    async handleFileChange(event, id) {
      const target = event.target;
      const files = target.files;

      if (!files) return;
      let formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("images[]", files[i]);
        if (files[i].size > 2 * 1024 * 1024)
          this.$refs.maxSizeError[0]?.classList.add("text-red-500");
      }
      formData.append("material_title_id", id);
     // await this.$store.dispatch("addImgs", formData);
      this.getTitles();
    },
    async submitForm() {
      const schema = this.getValidationSchema();
      try {
        await schema.validate(this.TitleData, { abortEarly: false });
        this.addTitle();
      } catch (error) {
        if (error.inner) {
          error.inner.forEach((validationError) => {
            this.errors[validationError.path] = validationError.message;
          });
          throw error;
        }
      }
    },
    async addTitle() {
      this.btn_loading = true;
      try {
       // await this.$store.dispatch("addTitle", this.TitleData);

        this.formData = !this.formData;
        await this.getTitles();
      } catch (error) {
        throw error;
      } finally {
        this.btn_loading = false;
      }
    },
    async getTitles() {
      const payload = {
        category_id: this.$route.query.id,
      };
      const response = await materail_titles_api.getTitles(payload);
      this.Titles = response;
    },
    async getCategories() {
      const response = await categories_api.getCategories();

      this.Categories = response;
    },
  },
  async mounted() {
    await this.getTitles();
    this.getCategories();
    this.loading = false;
  },
};
</script>

