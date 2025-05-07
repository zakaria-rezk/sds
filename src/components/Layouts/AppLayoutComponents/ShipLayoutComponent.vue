<template>
  <p
    class="w-fit px-3 py-1 my-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium shadow-sm cursor-pointer transition-all"
  >
    <slot></slot> <button class=" hover:bg-purple-200 px-2" @click="$emit('remove')">✕</button>
  </p>
</template>
