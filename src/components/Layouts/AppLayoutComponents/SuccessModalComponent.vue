<template>
  <div class="flex flex-col justify-center items-center py-10">
    <svg
      width="78"
      height="78"
      viewBox="0 0 78 78"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="78" height="78" rx="39" fill="#65CE00" />
      <path
        d="M27.625 42.25L32.8788 46.1903C33.5754 46.7127 34.56 46.5933 35.1115 45.9194L48.75 29.25"
        stroke="white"
        stroke-width="4.5"
        stroke-linecap="round"
      />
    </svg>
    <p class="p-5">{{ text }}</p>
    <button-component
      @click="fireEmit"
      :title="$t('thanks')"
      class="form_btn"
    ></button-component>
  </div>
</template>
<script>

import ButtonComponent from "./ButtonComponent.vue";

export default {
  components: {
    ButtonComponent,
  },
  props:{
    text:{
        type:String,
        required:true,
    },
  },
  methods: {
    fireEmit() {
      this.$emit("closeModal");
    },
  },
};
</script>
