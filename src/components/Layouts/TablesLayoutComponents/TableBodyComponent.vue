<template>
  <tbody v-for="(row, index) in rows" :key="index" class="divide-y">
    <tr v-if="rows.length > 0">
      <td
        class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 border-y"
        v-for="(value, key, colIndex) in row"
        v-show="String(key) !== 'additional_data' && String(key) !== 'id'"
        :key="colIndex"
      >
        {{ value }}
      </td>
      <slot name="status" :index="index" :row="row" />
      <slot name="actions" :index="index" :row="row" />

      <slot
        name="toggle"
        :row="row"
        :additional_data="row?.additional_data"
        :index="index"
      />
    </tr>
    <div v-else>NO DATA FOUNDED</div>
  </tbody>
</template>
<script lang="ts">
interface Item {
  text: string;
  id: number;
}
export default {
  props: {
    // columns: {
    //   type: Array as () => Item[],
    //   required: true,
    // },
    rows: {
      type: Array as any,
      required: true,
    },
  },
};
</script>
