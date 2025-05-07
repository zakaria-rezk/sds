<template>
  <div>
    <div class="relative inline-block">
      <button
        @click="isDropdownOpen = !isDropdownOpen"
        class="inline-flex lang justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
      >
        {{ $t("language") }}
        <svg
          width="22"
          height="16"
          viewBox="0 0 22 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="mt-1.5 ps-1"
        >
          <path d="M11 15.5L0.607697 0.5L21.3923 0.5L11 15.5Z" fill="#D9D9D9" />
        </svg>
      </button>

      <div
        v-show="isDropdownOpen"
        class="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg"
      >
        <ul class="py-1">
          <li>
            <button
              @click="changeLanguage('en')"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              {{ $t("english") }}
            </button>
            <button
              @click="changeLanguage('ar')"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              {{ $t("arabic") }}
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">


interface MyComponentData {
  isDropdownOpen: boolean;
}

export default {
  data: (): MyComponentData => ({
    isDropdownOpen: false,
  }),
  methods: {
    changeLanguage(language: string) {
      this.isDropdownOpen = false;
   
      this.$i18n.locale = language;
       localStorage.setItem("locale", language);
    },
  },
};
</script>
