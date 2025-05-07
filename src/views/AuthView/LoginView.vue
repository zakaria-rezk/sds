<template>
  <div class="grid grid-cols-12 min-h-screen h-full">
    <side-layout-component />
    <div class="col-span-12 md:col-span-9 login-form">
      <div class="text-end m-12">
        <SwitchLanguage />
      </div>
      <div class="flex flex-col items-center mt-24 justify-center flex-grow">
        <div class="text-center">
          <h2 class="text-3xl py-4">{{ $t("login.form.system-login") }}</h2>
          <p>
            {{ $t("login.form.no-account") }}
            <router-link to="/" class="text-customPurple">
              {{ $t("login.form.new-account") }}
            </router-link>
          </p>
        </div>
        <div class="space-y-6 mx-auto p-6 bg-white rounded-lg shadow-md m-8">
          <div class="user-name relative">
            <input
              type="text"
              name="name"
              v-model="payload.email"
              :placeholder="$t('login.form.user-name')"
              class="border p-2 py-4 px-7 rounded-md w-full shadow md:w-96"
            />
            <font-awesome-icon
              :icon="['far', 'user']"
              class="absolute top-5 left-2"
            />
          </div>
          <span v-if="errors.email" class="text-sm my-2 mx-2 text-red-400">{{
            errors.email
          }}</span>
          <div class="password relative">
            <input
              type="password"
              name="name"
              v-model="payload.password"
              :placeholder="$t('login.form.password')"
              class="border p-2 py-4 px-7 rounded-md w-full shadow md:w-96"
            />
            <font-awesome-icon
              :icon="['fas', 'lock']"
              class="absolute top-5 left-2"
            />
          </div>
          <span v-if="errors.password" class="text-sm my-2 mx-2 text-red-400">{{
            errors.password
          }}</span>
          <div class="flex justify-between px-1">
            <div class="flex items-center space-x-2">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label for="rememberMe" class="text-sm text-gray-700">
                {{ $t("login.form.remember-me") }}
              </label>
            </div>
            <p>
              <router-link
                :to="{ name: '' }"
                class="text-sm text-gray-700 hover:underline"
                >{{ $t("login.form.forget-password") }}
              </router-link>
            </p>
          </div>
          <button-component
            @click="setLogin"
            :loading="btn_loading"
            :title="$t('login.form.submit')"
            class="form_btn"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Logo from "@/assets/Logo/logo.svg";
import ButtonComponent from "@/components/Layouts/AppLayoutComponents/ButtonComponent.vue";
import SwitchLanguage from "@/components/Layouts/AppLayoutComponents/SwitchLanguage.vue";
import SideLayoutComponent from "@/components/AuthComponents/UserAuthComponents/SideLayoutComponent.vue";
import * as yup from "yup";

export default {
  components: {
    SideLayoutComponent,
    ButtonComponent,
    SwitchLanguage,
  },
  data: () => ({
    Logo,
    btn_laoding: false,
    payload: {
      email: null,
      password: null,
    },
    errors: {},
    loading: false,
  }),
  methods: {
    changeLanguage(language) {},
    getValidationSchema() {
      return yup.object().shape({
        email: yup
          .string()
          .required(`${this.$t("login.form.errors.required-email")}`),
        password: yup
          .string()
          .required(`${this.$t("login.form.errors.required-pass")}`),
      });
    },
    async validateForm() {
      const schema = this.getValidationSchema();
      try {
        this.errors = {};
        await schema.validate(this.payload, { abortEarly: false });
        return true;
      } catch (err) {
        if (err.inner) {
          err.inner.forEach((validationError) => {
            this.errors[validationError.path] = validationError.message;
          });
        }
        return false;
      }
    },
    async setLogin() {
      this.loading = true;
      this.btn_laoding = true;
      const isValid = await this.validateForm();
      if (!isValid) return;
      try {
        await this.$store.dispatch("authentication_module/Login", this.payload);

        this.$router.push("/welcome");
      } catch (error) {
        (this.errors.email = this.$t("login.form.errors.invild-credentials")),
          (this.errors.password = this.$t(
            "login.form.errors.invild-credentials"
          ));
        throw error;
      } finally {
        this.btn_loading = false;
      }
    },
  },
};
</script>
