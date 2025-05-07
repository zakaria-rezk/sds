<template>
  <thead class="bg-gray-50">
    <tr>
      <th
        v-for="(col, index) in columns"
        :key="index"
        class="text-start px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell"
      >
        {{ col }}
      </th>
    </tr>
  </thead>
</template>
<script lang="ts">
export default {
  props: {
    columns: {
      type: Array,
      required: true,
    },
  },
};
</script>
