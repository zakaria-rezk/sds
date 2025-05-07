<template>
  <div class="">
    <BreadCrumpsComponent
      @toggleModalEmit="toggleModal"
      :btn="$t('users.add-operation-btn')"
      :BreadCrumps="breadCrumps"
      :disabled="false"
    />
    <!-- --------------------- -->
    <div class="flex flex-col md:flex-row justify-center items-start m:-mt-8">
      <div class="text-center flex">
        <div class="relative">
          <input
            type="text"
            class="pl-10 pr-4 py-1 border rounded-lg color-lite"
            @focus="hideUsersList = false"
            @blur="hideUsersList = true"
            v-model="searchWord"
            @input="filter(searchWord)"
            :placeholder="$t('search')"
          />
          <div
            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
          >
            <font-awesome-icon
              :icon="['fas', 'magnifying-glass']"
              class="absolute text-gray-500"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- --------------------- -->

    <table-skeleton-loader v-if="loading" />
    <TableLayoutComponent
      :columns="columns"
      :rows="rows"
      :pageLable="$t('users.table.form_name')"
      v-else
    >
      <template #actions="{ row }">
        <td>
          <ButtonComponent
            class="btn color-primary"
            :title="''"
            :icon="'fas fa-street-view'"
            :loading="loading"
            @click="goToUserProfile(row.id)"
          >
          </ButtonComponent>
        </td>
      </template>
      <template #status="{ row }">
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
            @click="deleteUser(row.id)"
          >
          </ButtonComponent>
        </td>
      </template>
      <template #toggle="{ row, additional_data }">
        <td>
          <ToggleButtonComponent
           variant="slider"
            :checked="additional_data"
            :disabled="disabledBtns.has(row.id)"
            @fireToggleEmit="changeUserState($event, row.id)"
            class="text-start"
          />
        </td>
      </template>
    </TableLayoutComponent>

    <ModalComponent :showModal="showModal">
      <FormPopUpLayoutComponent
        @close-modal="closeModal"
        v-click-outside="closeModal"
        v-click-enter="submitForm"
      >
        <div v-if="formInputs">
          <div class="input-group flex flex-col w-full py-2 mt-1">
            <label for="name"
              >{{ $t("users.form.I1.label")
              }}<span class="text-red-500 pb-4">*</span></label
            >
            <input
              type="text"
              id="name"
              v-model="formData.name"
              :disabled="enableUpdateBtn"
              class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
              :placeholder="$t('users.form.I1.placeholder')"
            />
            <p v-if="errors.name" class="pt-2 text-xs text-red-500">
              {{ errors.name }}
            </p>
          </div>
          <div class="input-group flex flex-col w-full py-2 mt-1">
            <label for="email"
              >{{ $t("users.form.I2.label") }}
              <span class="text-red-500 pb-4">*</span></label
            >
            <input
              type="email"
              id="email"
              v-model="formData.email"
              :disabled="enableUpdateBtn"
              class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
              :placeholder="$t('users.form.I2.placeholder')"
            />
            <p v-if="errors.email" class="pt-2 text-xs text-red-500">
              {{ errors.email }}
            </p>
          </div>

          <div class="input-group flex flex-col w-full py-2 mt-1">
            <label for="name"
              >{{ $t("users.form.I3.label")
              }}<span class="text-red-500 pb-4">*</span></label
            >
            <input
              type="password"
              id="name"
              v-model="formData.password"
              class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
              :placeholder="$t('users.form.I3.placeholder')"
            />
            <p v-if="errors.password" class="pt-2 text-xs text-red-500">
              {{ errors.password }}
            </p>
          </div>

          <div class="input-group flex flex-col w-full py-2 mt-1">
            <label for="name"
              >{{ $t("users.form.I4.label")
              }}<span class="text-red-500 pb-4">*</span></label
            >
            <input
              type="password"
              id="name"
              v-model="formData.password_confirmation"
              class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
              :placeholder="$t('users.form.I4.placeholder')"
            />
            <p
              v-if="errors.password_confirmation"
              class="pt-2 text-xs text-red-500"
            >
              {{ errors.password_confirmation }}
            </p>
          </div>
          <div class="input-group flex flex-col w-full py-2 mt-1">
            <!-- <div
              @click="openLocationsOptions"
              class="text-start p-2 rounded-md shadow my-2 text-black-500 flex justify-between cursor-pointer"
            >
              <span>{{ $t("users.form.I5.label") }}</span>
              <span class="animated" ref="arrow"
                ><font-awesome-icon :icon="['fas', 'arrow-down']"
              /></span>
            </div> -->
            <!-- <div ref="options" class="hidden options animated overflow-y-auto">
              <div
                v-for="(locatoin, index) in locations"
                :key="index"
                class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    :value="locatoin.id"
                    v-model="formData.location_ids"
                    class="form-checkbox cursor-pointer"
                  />
                  <span>{{ locatoin.location_name }}</span>
                </label>
              </div>
            </div> -->
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
          :text="$t('users.form.success')"
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
import TableLayoutComponent from "@/components/Layouts/TablesLayoutComponents/TableLayoutComponent.vue";
import ButtonComponent from "@/components/Layouts/AppLayoutComponents/ButtonComponent.vue";
import TableSkeletonLoader from "@/components/Layouts/TablesLayoutComponents/TableLoadersComponents/TableSkeletonLoader.vue";
import ToggleButtonComponent from "@/components/Layouts/AppLayoutComponents/ToggleButtonComponent.vue";

import BreadCrumpsComponent from "@/components/Layouts/AppLayoutComponents/BreadCrumpsComponent.vue";
import { modalMixin } from "@/mixins/toggleModal";
import { useResetValues } from "@/mixins/useResetValue";
import location_api from "@/services/inventory/locations_api";
import user_crud_api from "@/services/user_crud_api";

export default {
  components: {
    TableSkeletonLoader,
    FormPopUpLayoutComponent,
    BreadCrumpsComponent,
    ModalComponent,
    ButtonComponent,
    SuccessModalComponent,
    ToggleButtonComponent,
    TableLayoutComponent,
  },
  mixins: [modalMixin, useResetValues],

  data() {
    return {
      breadCrumps: [
        { text: this.$t("welcome.routes.settings"), route: "Settings" },
        { text: this.$t("setting.r3.text"), route: "" },
      ],
      users: [],
      filteredUsers: null as [],
      hideUsersList: true,
      enableUpdateBtn: false,
      selectedRowId: null,
      formInputs: true,
      loading: true,
      disabledBtns: new Set<number>(),
      searchWord: "" as string,
      rows: [],
      btn_loading: false,
      columns: [
        this.$t("users.table.name"),
        this.$t("users.table.email"),
        this.$t("users.table.actions"),
        this.$t("users.table.action.a1"),
        this.$t("users.table.actions"),
      ],
      locations: null,
      selectedOptions: [],
      formData: {
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        location_ids: [],
      },
      errors: {
        name: "" as string,
        email: "" as string,
        password: "" as string,
        password_confirmation: "" as string,
        location_ids: "" as string,
        confirm_password: "" as string,
      },
    };
  },

  methods: {
    updateForm(row_id: number) {
      this.enableUpdateBtn = true;
      
      const selectedRow = this.rows.find((row: any) => row.id === row_id);
      
      this.formData = {
        name: selectedRow.user_name,
        email: selectedRow.user_email,
        password: "",
        password_confirmation: "",
      };
      this.toggleModal();
      this.selectedRowId = row_id;
    },
    async deleteUser(row_id: number) {
      try {
        user_crud_api.deleteUser(row_id);
        this.getOperations();
      } catch (error) {
        throw error;
      }
    },

    filter(searchWord: string) {
      this.search(searchWord);
    },
    search(keyword: string) {
      this.filteredUsers = this.users.filter((user) => {
        return user.name.toLowerCase().includes(keyword);
      });
      this.filteredUsers = this.filteredUsers.map((user: any) => ({
        id: user.id,
        user_name: user.name,
        user_email: user.email,
        additional_data: user.active,
      }));
      this.rows = this.filteredUsers;
      this.filteredUsers = this.users;
    },
    async changeUserState(checked: boolean, user_id: number) {
      this.disabledBtns.add(user_id);
      const state = checked ? 1 : 0;
      const payload = {
        active: state,
      };
      
      await user_crud_api.changeUserState(payload, user_id);
      this.disabledBtns.delete(user_id);
    },

    goToUserProfile(indexToGetId: number) {
      
      
      const user = this.users.find((user: any) => user.id === indexToGetId);
      
      this.$router.push({
        name: "UserProfile",
        params: {
          name: user.name,
          id: user.id,
        },
      });
    },
    openLocationsOptions() {
      this.$refs.arrow.classList.toggle("-rotate-180");
      this.$refs.options.classList.toggle("hidden");
    },
    getValidationSchema() {
      return yup.object().shape({
        name: yup.string().required(this.$t("users.form.errors.name")),
        email: yup.string().required(this.$t("users.form.errors.email")),
        password: yup.string().required(this.$t("users.form.errors.password")),
        password_confirmation: yup
          .string()
          .oneOf(
            [yup.ref("password"), null],
            this.$t("users.form.errors.passwords_must_match")
          )
          .required(this.$t("users.form.errors.password_confirmation")),
      });
    },
    async submitForm() {
      this.reset(this.errors);

      const schema = this.getValidationSchema();

      this.btn_loading = true;
      try {
        await schema.validate(this.formData, { abortEarly: false });
        this.enableUpdateBtn
          ? await user_crud_api.updateUser(this.formData, this.selectedRowId)
          : await this.addUser();
        this.reset(this.formData);
        this.getUsers();
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
      }
    },
    async addUser() {
      this.btn_loading = false;
      try {
        await user_crud_api.addUser(this.formData);
        this.formInputs = !this.formInputs;
      } catch (error) {
        if (error.response.status === 409) {
          this.errors.email = this.$t("users.form.errors.email-exists");
        } else if (error.response.status === 400) {
          this.errors.password = this.$t("users.form.errors.weak_password");
        }
        throw error;
      } finally {
        this.btn_loading = false;
      }
    },
    reShapeUsers() {
      this.rows = this.users.map((user: any) => ({
        id: user.id,
        user_name: user.name,
        user_email: user.email,
        additional_data: user.active,
      }));
    },
    async getUsers() {
      try {
        const response = await user_crud_api.getUsers();
        this.users = response;

        this.reShapeUsers();

        this.locations = await location_api.getLocations();
      } catch (er) {
        throw er;
      }
    },
  },
  async mounted() {
    await this.getUsers();

    this.loading = false;
  },
};
</script>
<style scoped>
.userList {
  transition: all 0.3s ease-in-out;
}
.options {
  animation: down2top 0.3s ease-in-out forwards;
}
.animated {
  transition: all 0.5s ease-in-out;
}
@keyframes down2top {
  from {
    opacity: 0;
    transform: translateY(100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
