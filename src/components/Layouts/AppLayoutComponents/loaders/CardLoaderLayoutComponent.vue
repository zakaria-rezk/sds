<template>
  <div class="p-5 grid gird-cols-2 md:grid-cols-3 xl:grid-cols-5 lg:grid-cols-4 gap-6 mb-5">
    <div v-for="i in 12" :key="i" class="">
      <div
        class="max-w-sm p-4 m-2 border border-gray-300 rounded-md shadow max-h-md"
      >
        <div class="flex space-x-4 animate-pulse">
          <div class="flex-1 py-1 space-y-4">
            <div class="w-full h-40 bg-gray-400 rounded"></div>
            <div class="space-y-2">
              <div class="h-4 bg-gray-400 rounded"></div>
              <div class="w-5/6 h-4 bg-gray-400 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
