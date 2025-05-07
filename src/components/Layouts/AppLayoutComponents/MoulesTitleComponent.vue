<template>
  <div class="col-span-12 grid grid-cols-12">
    <div class="col-span-12">
      <h1 class="text-2xl font-semibold">{{moduleTitle}}</h1>
    </div>
</div>
</template>
<script lang="ts">


export default {
  name: "MoulesTitleComponent",
  props: {
    moduleTitle: {
      type: String,
      default: '',
      required: false,
    }
  }
}
</script>