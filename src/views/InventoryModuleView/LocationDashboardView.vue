<template>
  <div class="">
    <BreadCrumpsComponent :BreadCrumps="breadCrumps" />
    <div>
      <DashboardFilterComponent />
      <div class="grid grid-cols-5 gap-4">
        <div
          class="flex flex-col justify-between bg-indigo-500 text-xl font-bold text-white"
          v-for="(inbox, index) in InboxOperations"
          :class="{ [colors[index].primary]: true }"
          :key="index"
        >
          <div
            class="flex items-center mb-2 border-b border-gray-500 border-opacity-50 py-2 px-2"
            :class="{ [colors[index].secondray]: true }"
          >
            <font-awesome-icon :icon="['fas', 'envelope-open-text']" />
            <span class="font-medium mx-2">New {{ inbox.operation_name }}</span>
          </div>

          <div class="text-4xl px-2 font-bold mb-2 py-5">
            {{ inbox.status_counts }}
          </div>
          <div
            class="flex items-center justify-end border-t py-2 border-gray-500 border-opacity-50"
            :class="{ [colors[index].secondray]: true }"
          >
            <span class="mr-1">More info</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
      <div class="w-full flex flex-wrap px-10 gap-8 py-8 rounded-lg shadow-md">
        <div
          id="chart"
          v-for="(operation, index) in operationStatistics"
          :key="index"
          class="relative bg-white p-4 rounded-lg shadow-lg"
        >
          <h2 class="text-xl font-semibold mb-4 text-gray-500 text-center">
            {{ operation.operation_name }}
          </h2>
          <apexchart
            type="donut"
            :options="chartOptions(operation.operation_name)"
            :labels="data"
            :series="[
              operation.status_counts.Open,
              operation.status_counts.Close,
              operation.status_counts.Confirmed,
              operation.status_counts.PQ_Confirmed,
              operation.status_counts.PQ_Open,
            ]"
          ></apexchart>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
//Global Imports
import DashboardFilterComponent from "@/components/Layouts/Dashboards/DashboardFilterComponent.vue";
import BreadCrumpsComponent from "@/components/Layouts/AppLayoutComponents/BreadCrumpsComponent.vue";
const colors = [
  { primary: "bg-indigo-500 ", secondray: "bg-indigo-600" },
  { primary: "bg-red-400", secondray: "bg-red-600" },
  { primary: "bg-teal-500	", secondray: "bg-teal-600" },
  { primary: "bg-red-500	 ", secondray: "bg-red-600	" },
  { primary: "bg-blue-500 ", secondray: "bg-blue-600" },
];
interface StatusCounts {
  Open: number;
  Close: number;
  Confirmed: number;
  PQ_Confirmed: number;
  PQ_Open: number;
}

interface Operation {
  operation_name: string;
  status_counts: StatusCounts;
}
const breadCrumps = [];
import { ref, onMounted, shallowRef } from "vue";
import apexchart from "vue3-apexcharts";
const data = ref<string[]>([
  t("Open"),
  t("Closed"),
  t("Confirmed"),
  t("PQOpen"),
  t("PQConfirmed"),
]);

const series = ref<number[]>([]);
//chart doun
const chartOptions = (opertion_name: string) => {
  return {
    chart: {
      type: "donut",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "80%",
          labels: {
            show: true,
            total: {
              show: true,
              label: opertion_name,
              color: "#373d3f",
              fontSize: "16px",
              fontWeight: "bold",
            },
          },
        },
      },
    },
    labels: data.value,

    legend: {
      show: true,
    },
    tooltip: {
      enabled: true,
    },
    colors: ["#FF4560", "#008FFB", "#00E396", "#FEB019", "#FF66B2", "#000"],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 0,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };
};

import { useRoute } from "vue-router";
import dashboard_api from "@/services/dashboard_api";
import { OperationStatistics } from "@/types/dashboard/LocationStatistics";
import store from "@/Middelware/store";

const operationStatistics = shallowRef<OperationStatistics[]>();
const InboxOperations = shallowRef<any>();
const route = useRoute();
const getStatistics = async () => {
  const payload = { location_id: store.getters["location_module/LocationId"] };
  try {
    const operationCounts = await dashboard_api.getStatistics(payload);
    operationStatistics.value = operationCounts;
    const inboxOperations = await dashboard_api.getInboxOperations(payload);
    InboxOperations.value = inboxOperations;
    // chartOptions.value.labels = data.value; // Update labels in chart options
  } catch (error) {
    throw error;
  }
};
const getLocations = () => {
  store.dispatch("location_module/locations");
};

onMounted(() => {
  getStatistics();
  getLocations();
});
</script>
