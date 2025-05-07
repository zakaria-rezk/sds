<template>
  <div class="bg-customGradient hidden md:block col-span-3 h-full p-4">
    <div class="text-start text-white ms-4 lg:ms-9">
      <img :src="Logo" alt="logo" class="my-8"/>
      <h2 class="mt-32 text-3xl font-bold">
        {{ $t("login.side-bar.head") }}
      </h2>
      <p class="mt-2 font-semibold">
        {{ $t("login.side-bar.sub-head") }}
      </p>
    </div>
  </div>
</template>
<script lang="ts">

import Logo from '@/assets/Logo/logo.svg'

export default {
  data:() => ({
    Logo
  })
}
</script>