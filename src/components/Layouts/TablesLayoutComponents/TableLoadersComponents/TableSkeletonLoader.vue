<template>
  <div
    role="status"
    class="w-full p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700"
  >
    <div
      v-for="(i, index) in 10"
      :key="index"
      class="flex items-center justify-between"
    >
      <div>
        <div
          class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"
        ></div>
        <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
      </div>
      <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
    </div>
  </div>
</template>
