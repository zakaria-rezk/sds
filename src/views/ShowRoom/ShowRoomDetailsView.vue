<template>
  <div class="p-10">
    <div class="text-center text-3xl font-bold">block details</div>
    <div class="flex gap-8 w-full py-10">
      <img
        src="@/assets/pexels-karolina-grabowska-4705933.jpg"
        alt=""
        width="200"
        height="200"
        class="object-cover rounded-t-xl"
      />
      <div class="block-details w-full">
        <h2 class="text-center font-bold">
          {{ batch[0]?.sku_code }}
        </h2>
        <h2 class="text-center">
          {{ batch[0]?.item_name }}
        </h2>
        <div
          class=""
          v-for="(key, index) in Object.keys(batch[0])"
          :key="index"
        >
          <OutputTextComponent
            :label="$t(`show-room.details.api_response.${key}`)"
            :modelValue="batch[0][key]"
          />
          <hr class="w-full my-2 bg-white" />
        </div>
      </div>
    </div>
    <div>
      <div>
        <h2 class="my-2">block details</h2>
        <div class="overflow-hidden position-relative p-5" ref="imgContainer">
          <img
            class="my-5 mx-5 mainimg position-relative cursor-move"
            src="@/assets/pexels-karolina-grabowska-4705933.jpg"
            alt="Stylish Image"
            width="500"
            @mousemove="magnfiy"
            height="500"
            ref="mainImg"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
const imgContainer = ref<HTMLDivElement>();
const mainImg = ref<HTMLImageElement>();
import { useRoute } from "vue-router";
const route = useRoute();

import OutputTextComponent from "@/components/Layouts/FormLayoutComponents/OutputTextComponent.vue";
import show_room_api from "@/services/inventory/show_room_api";
import { onBeforeMount, onMounted, ref } from "vue";
const magnfiy = (e: MouseEvent) => {
  if (!imgContainer.value || !mainImg.value) return;
  const x = e.pageX - imgContainer.value.getBoundingClientRect().left,
    imgWidth = mainImg.value.width,
    Xperc = (x / imgWidth) * 100 + "%";

  // height
  const y = e.pageY - imgContainer.value.getBoundingClientRect().top,
    imgHeight = mainImg.value.height,
    Yperc = (y / imgHeight) * 100 + "%";

  mainImg.value.style.transformOrigin = Xperc + Yperc;
};

const batch = ref<any>();
const batchDetails = async () => {
  try {
    const response = await show_room_api.getBatchDetails(+route.params.id);
    batch.value = response.map((i) => ({
      sku_code: i.item_sku_code,
      item_name: i.item_name,
      origin_name: i.origin_name,
      category_name: i.category_name,
      shape_name: i.shape_name,
      finishing_level: i.finishing_level,
      colour_name: i.colour_name,
    }));
  } catch (error) {
    console.error("Error fetching batch details:", error);
  }
};
onBeforeMount(() => {
  batchDetails();
});
</script>

