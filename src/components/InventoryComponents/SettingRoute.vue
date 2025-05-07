<template>
  
  <router-link :to="{ name: route }" class="text-white items-center py-2  gap-4">
    
      <div class=" color-lite btn text-color-dark ">
        <div class="relative flex items-center justify-center ">
          
          <div class="w-7 h-7 rounded-full flex items-center justify-center color-primary">
            <font-awesome-icon :icon="['fas', 'wrench']" class="text-white" size="sm" />
          </div>

          <div class="flex justify-between ">
            <p class=" mx-4 text-black">{{ text }}</p>
            <font-awesome-icon :icon="['fas', 'arrow-down']" />
          </div>

        </div>
      </div>
    
  </router-link>
</template>
<script lang="ts">
export default {
  props: {
    route: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
};
</script>

