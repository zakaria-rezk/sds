<template>
  <div class="col-span-12 border-b border-gray-200 px-2 my-2">
    <div class="lg:col-span-12 md:col-span-4 sm:col-span-4 mdx:col-span-4  grid lg:grid-cols-12 md:grid-cols-8 sm:grid-cols-4 mdx:grid-cols-4 lg:gap-10 md:gap-6 sm:gap-4 my-12">
      <div class="col-span-4" v-for="(label, index) in labels" :key="index">
        <label :for="`input-${index}`" class="block text-gray-700 font-medium mb-2">{{ label }}</label>
        <input
            :id="`input-${index}`"
            type="text"
            :placeholder="`Enter ${label.toLowerCase()}`"
            class="lg:w-[400px] md:w-[400px] sm:w-[300px]  p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">


export default {
  name: "CreateInventory",
  data:() => ({
    labels: ["Inventory Name", "Inventory ID", "Location", 'Inventory Manager']
  }),
  created() {
   
  }
};
</script>
