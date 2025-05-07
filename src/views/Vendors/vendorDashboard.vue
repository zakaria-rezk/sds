<template>
  <div class="mx-8">
    <div>
      <BreadCrumpsComponent :BreadCrumps="breadCrumps" :disabled="false" />

      <!-- :btn="$t('Add Items')" -->

      <!-- supplier main info  -->
      <section class="m-5 lg:grid lg:grid-cols-2 grid-cols-1  gap-10">
        <div class="card py-4 px-4 mb-4">
          <h6 class="text-lg font-bold">Supplier Information</h6>

          <div class="flex justify-between items-center mt-4 mb-3">
            <span class="text-md"> Supplier Name : </span>
            <span class="gray"> {{ vendor?.name }} </span>
          </div>
          <div class="flex justify-between items-center mt-4 mb-3">
            <span class="text-md"> Tax Card : </span>
            <span class="gray"> {{ vendor?.tax_card }} </span>
          </div>
          <div class="flex justify-between items-center mt-4 mb-3">
            <span class="text-md"> Commercial Record : </span>
            <span class="gray"> {{ vendor?.commercial_record }} </span>
          </div>
          <div class="flex justify-between items-center mt-4 mb-3">
            <span class="text-md"> Bank Account : </span>
            <span class="gray"> {{ vendor?.bank_account }} </span>
          </div>
        </div>
        <div class="card py-4 px-4 mb-4">
          <h6 class="text-lg font-bold">Current Debt And Payments</h6>

          <div class="flex justify-between items-center flex-wrap mt-4 mb-3">
            <!-- single  -->
            <div class="md:w-1/2">
              <h6 class="gray text-md">Remining Debt</h6>

              <div class="font-bold text-2xl my-5">
                {{
                  ((vendor?.total_bills_remaining_amount / vendor?.total_bills_price) *100).toFixed(2)

                }}
                %
              </div>


              <div class="progress">
                    <div class="progress-done" :data-done=" (vendor?.total_bills_remaining_amount / vendor?.total_bills_price) * 100">
                    </div>
                </div>


                
            </div>
            <!-- single  -->
            <div class="md:w-1/2 px-4" >
              <h6 class="gray text-md">Paid Debt</h6>
              <div class="font-bold text-2xl my-5">
                {{
                 ( (vendor?.total_bills_paid_amount / vendor?.total_bills_price) * 100).toFixed(2)
                }}
                %
              </div>

              <div class="progress">
                    <div class="progress-done1" :data-done1="  (vendor?.total_bills_paid_amount / vendor?.total_bills_price) * 100"></div>
                </div>

               
            </div>
          </div>
        </div>
      </section>
      <section class="m-5 lg:grid lg:grid-cols-2 grid-cols-1  gap-10">
        <div class="card py-4 px-4">
          <h6 class="text-lg font-bold">Bills</h6>
          <apexchart
            type="donut"
            height="200"
            :options="chartOptions"
            :series="[
              vendor?.total_bills_paid_amount,
              vendor?.total_bills_remaining_amount,
            ]"
          ></apexchart>
        </div>
        <div class="card py-4 px-4">
          <h6 class="text-lg font-bold">Cheques</h6>
          <apexchart
            type="donut"
            height="200"
            :options="chartOptionsCheque"
            :series="[
              new_cheques_rows.reduce(  (acc, item) => acc + item.amount,0)  ,
              cheques_rows.reduce(  (acc, item) => acc + item.amount,0)  ,
            ]"
          ></apexchart>
         
        </div>
      </section>



      <section class="row my-10">
        <section class="col-span-8">
          <section class="">
                <!-- main category Bills And Cheques  -->
                <div class="w-full flex justify-between items-center">
                  <button class=" p-3 w-1/2 flex justify-center" :class="activeMainButton === 'all_bills' ? 'indigo_badge' : 'gray_badge'" @click="setMainActive('all_bills')"  >
                    {{ $t('Bills') }}
                  </button>
                  <button class=" p-3 w-1/2 flex justify-center" :class="activeMainButton === 'all_cheques' ? 'indigo_badge' : 'gray_badge'" @click="setMainActive('all_cheques')"  >
                    {{ $t('Cheques') }}
                  </button>
                </div>

                <!-- sub categories  -->
                <section class="flex">
                  <div v-if="activeMainButton=='all_bills'" class="w-full flex justify-start items-start" >
                    <button class=" p-3 w-1/4 flex justify-center" :class="activeButton === 'Bills' ? 'indigo_badge' : 'gray_badge'" @click="setActive('Bills')"  >
                      {{ $t('Paid Bills') }}
                    </button>
                    <button class=" p-3 w-1/4 flex justify-center" :class="activeButton === 'unpaid' ? 'indigo_badge' : 'gray_badge'" @click="setActive('unpaid')"  >
                      {{ $t('un_paid_bills') }}
                    </button>
                  </div>

                  <div v-if="activeMainButton=='all_cheques'" class="w-full flex justify-end items-end">
                    <button class=" p-3 w-1/4  flex justify-center" :class="activeButton === 'cheques' ? 'indigo_badge' : 'gray_badge'" @click="setActive('cheques')">
                      {{  $t('Old Cheques')  }}
                    </button>
                    <button class=" p-3 w-1/4  flex justify-center" :class="activeButton === 'new_cheques' ? 'indigo_badge' : 'gray_badge'" @click="setActive('new_cheques')">
                      {{  $t('New Chques')  }}
                    </button>
                  </div>
                </section>
          </section>
            <TableSkeletonLoader v-if="loading" />

            <section v-else>
              <!-- all bills  -->
              <TableLayoutComponent
              v-if="activeButton=='Bills'" 
              :columns="columns"
              :rows="rows"
              pageLable="Supplier -> Bills Operations"
            >
              <template #status="{ row }">
                <td>
                  <div
                    class="btn"
                    :class="{
                      indigo_badge: row.additional_data === 'Confirmed',
                      yellow_badge: row.additional_data === 'Closed',
                      green_badge: row.additional_data === 'Open',
                    }"
                  >
                    {{ row.additional_data }}
                  </div>
                </td>
              </template>
              <template #actions="{ row }"
                >
                <td>
                  <div class="btn color-primary">
                    <router-link
                      :to="{
                        name: 'Bill-Operation-Details',
                        params: { form_id: row.id, operation_id: vendor.bills[0].operation_id }, // operation id
                      }"
                    >
                      <font-awesome-icon :icon="['fas', 'list']" />
                    </router-link>

                    
                  </div>
                
              
                </td>
              </template>
              </TableLayoutComponent>
              <!-- un paid bills  -->
              <TableLayoutComponent
              v-if="activeButton=='unpaid'" 
              :columns="unpaid_columns"
              :rows="unpaid_rows"
              pageLable="Supplier -> Bills Operations"
            >
              <template #status="{ row }">
                <td>
                  <div
                    class="btn"
                    :class="{
                      indigo_badge: row.additional_data === 'Confirmed',
                      yellow_badge: row.additional_data === 'Closed',
                      green_badge: row.additional_data === 'Open',
                    }"
                  >
                    {{ row.additional_data }}
                  </div>
                </td>
              </template>
              <template #actions="{ row }"
                  >
                  <td>
                    <div class="btn color-primary">
                      <router-link
                        :to="{
                          name: 'Bill-Operation-Details',
                          params: { form_id: row.id, operation_id: vendor.bills[0].operation_id }, // operation id
                        }"
                      >
                        <font-awesome-icon :icon="['fas', 'list']" />
                      </router-link>

                      
                    </div>
                  
                
                  </td>
                </template>

              </TableLayoutComponent>

              <!-- old cheques  -->
              <TableLayoutComponent
              v-if="activeButton=='cheques'"
                :columns="cheques_columns"
                :rows="cheques_rows"
                :pageLable="$t('cheques')"
              >
                <template #status="{ row }">
                  <td>
                    <div
                      class="btn"
                      :class="{
                        indigo_badge: row.additional_data === t('New') || row.additional_data === t('Returned'),
                        yellow_badge: row.additional_data === t('Delivered') || row.additional_data === t('Rescheduled'),
                        green_badge: row.additional_data === t('WithDrawed')|| row.additional_data === t('Signtured'),
                      }"
                    >
                      {{ row.additional_data }}
                    </div>
                  </td>
                </template>
                <template #actions="{ row }"
                  >
                  <td>
                    <button class="btn color-primary"  >
                      <font-awesome-icon :icon="['fas', 'edit']" /> 
                    </button>
                
                  </td>
                </template>
              
              </TableLayoutComponent>

              <!-- new cheques  -->
              <TableLayoutComponent
              v-if="activeButton=='new_cheques'"
                :columns="new_cheques_columns"
                :rows="new_cheques_rows"
                :pageLable="$t('cheques')"
              >
                <template #status="{ row }">
                  <td>
                    <div
                      class="btn"
                      :class="{
                        indigo_badge: row.additional_data === t('New') || row.additional_data === t('Returned'),
                        yellow_badge: row.additional_data === t('Delivered') || row.additional_data === t('Rescheduled'),
                        green_badge: row.additional_data === t('WithDrawed')|| row.additional_data === t('Signtured'),
                      }"
                    >
                      {{ row.additional_data }}
                    </div>
                  </td>
                </template>
                <template #actions="{ row }"
                  >
                  <td>
                    <button class="btn color-primary"  >
                      <font-awesome-icon :icon="['fas', 'edit']" /> 
                    </button>
                
                  </td>
                </template>
              
              </TableLayoutComponent>

            </section>

              <!-- <section class="flex flex-col justify-end items-end">
                <div class="flex  mb-1 w-1/4"               v-if="activeButton=='Bills'" >
                  <h5 class="rounded-span"> Total Bills Amount  :</h5>
                  <h5 class="rounded-output">{{ total_bills }} EGP</h5>
                </div>
                <div class="flex  mb-1 w-1/4"               v-if="activeButton=='unpaid'" >
                  <h5 class="rounded-span"> Total  Bills Amount  :</h5>
                  <h5 class="rounded-output">{{ total_bills }} EGP</h5>
                </div>
                <div class="flex  mb-1 w-1/4"              v-if="activeButton=='cheques'">
                  <h5 class="rounded-span"> Total Cheques Amount  :</h5>
                  <h5 class="rounded-output">{{ total_cheques }} EGP</h5>
                </div>
                <div class="flex  mb-1 w-1/4"              v-if="activeButton=='new_cheques'">
                  <h5 class="rounded-span"> Total Cheques Amount  :</h5>
                  <h5 class="rounded-output">{{ total_cheques }} EGP</h5>
                </div>
              </section> -->
        </section>

        
      </section>
      
    </div>
  </div>
</template>
<script setup lang="ts">
// page
import apexchart from "vue3-apexcharts";
import BreadCrumpsComponent from "@/components/Layouts/AppLayoutComponents/BreadCrumpsComponent.vue";
import vendor_api from "@/services/vendor_api";
import { computed, onMounted, ref } from "vue";

import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
const route = useRoute();

//table
import TableSkeletonLoader from "@/components/Layouts/TablesLayoutComponents/TableLoadersComponents/TableSkeletonLoader.vue";
import TableLayoutComponent from "@/components/Layouts/TablesLayoutComponents/TableLayoutComponent.vue";

const rows = ref([]);
const unpaid_rows = ref([]);
const vendor = ref<any>();

const { t, messages, locale } = useI18n();
const breadCrumps = ref([
  { text: "Suppliers", route: `Vendors` },
  { text: "Details", route: "" },
]);

const loading = ref(false);
const itemStatus = ref(null);
const activeButton = ref('Bills')
const activeMainButton = ref('all_bills')
  const setActive = (button )=>{
    activeButton.value = button 
  }
  const setMainActive = (button )=>{
    activeMainButton.value = button 
  }
const columns = [
    t("adjustment_form.table.form_lable"),
    t('Location From'),
    t('location to'),
    t('rfq_form.form.doc_number'),
    t('rfq_form.form.work_order_line_num'),
    t('rfq_form.form.form_datetime'),
    t('categories.table.cat_name'),
    t('payment_type'),
    t('payment_method'),
    t("Type"),
    t("Total Price"),
    t('total_paid_amount'),
    t('Remaining Amount'),
    // t('operation_details.header.total_items'),
    // t("Description"),
    // t("rfq_form.form.created_at"),
        t("release_form.table.created_by"),
        t('buyer'),
        t("release_form.table.status"),
    t("release_form.table.actions"),
  ];
const unpaid_columns =[
    t("adjustment_form.table.form_lable"),
    t('Location From'),
    t('location to'),
    t('rfq_form.form.doc_number'),
    t('rfq_form.form.work_order_line_num'),
    t('rfq_form.form.form_datetime'),
    t('categories.table.cat_name'),
    t('payment_type'),
    t('payment_method'),
    t("Type"),
    t("Total Price"),
    t('total_paid_amount'),
    t('Remaining Amount'),
    // t('operation_details.header.total_items'),
    // t("Description"),
    // t("rfq_form.form.created_at"),
        t("release_form.table.created_by"),
        t('buyer'),
        t("release_form.table.status"),
    t("release_form.table.actions"),
  ];
const cheques_columns = ref([
t('recipient_name'),
    t('bank_name'),
    t('bank_account'),
    t('cheque_number'),
    t('check_created_at'),
    t('maturity_date'),
    t('cashing_date'),
    t('Amount'),
    t("release_form.table.status"),
    t("release_form.table.actions"),

])
const new_cheques_columns = ref([
t('recipient_name'),
    t('bank_name'),
    t('bank_account'),
    t('cheque_number'),
    t('check_created_at'),
    t('maturity_date'),
    t('cashing_date'),
    t('Amount'),
    t("release_form.table.status"),
    t("release_form.table.actions"),

])
const cheques_rows = ref([])
const new_cheques_rows = ref([])
const total_cheques = ref(null)
const total_bills = ref(null)
const total_unpaid_bills = ref(null)
const total_new_cheque = ref(null)
const getRFQDetails = async () => {
  loading.value = true;
  try {
    const response = await vendor_api.getVendorDetails(+route.params.form_id);

    vendor.value = response;

    rows.value = vendor.value.bills.map((bill: any) => ({
        id: bill.id,
        form_lable: bill.form_label,
        from_location: bill.from_location?.location_name,
        location_to: bill.to_location?.location_name,
        doc_number: bill.doc_number,
        work_order_line_num: bill.work_order_line_num,
        form_datetime: bill.form_datetime,
        category_name: bill.category_name,
        payment_type: bill.payment_type, // Get value or null if not found
        payment_method: bill.payment_method,
        type: bill.type,
        total_price: bill.total_price,
        total_paid_amount: bill.total_paid_amount,
        remaining_amount : bill.total_price - bill.total_paid_amount,
        // total_items: bill.total_items,
        // description: bill.description,
        created_by: [{ text: bill.user?.name }, { text: bill.created_at }], // Check if user exists
        buyer: bill.buyer?.name,
        additional_data:
          bill.status === 2
            ? t("status.confirm")
            : response.status === 1
            ? t("status.close")
            : t("status.open"),
    }));
    // all bills 
    // rows.value = rows.value.filter( el => el.total_paid_amount >  el.total_price)
    // unpaid bills 
    unpaid_rows.value = rows.value.filter( el => el.total_paid_amount <  el.total_price)
    //   ----------------------------------------

    cheques_rows.value = vendor.value.cheques.map((cheque: any) => ({
        id: cheque.id,
        recipient_name: cheque.recipient_name,
        bank_name: cheque.bank_name,
        bank_account: cheque.bank_account,
        cheque_number: cheque.cheque_number,
        created_at: cheque.created_at.slice(0, 10),
        maturity_date: cheque.maturity_date.slice(0, 10),
        cashing_date: cheque.cashing_date.slice(0, 10),
        amount: cheque.amount,
        additional_data:
          cheque.status === 0
            ? t("New")
            : cheque.status === 1
            ? t("Delivered")
            : cheque.status === 2
            ? t("WithDrawed")
            : cheque.status === 3
            ? t("Returned")
            : cheque.status === 4
            ? t("Rescheduled")
            : cheque.status === 5
            ? t("Signtured")
            : t("status.open"),
          }));
          // get new cheques 
          new_cheques_rows.value = cheques_rows.value.filter( el => el.bill_id == null ) ;
          cheques_rows.value = cheques_rows.value.filter( el => el.bill_id != null ) ;
          // total cheques 
          total_cheques.value = vendor.value.cheques.reduce(  (acc, item) => acc + item.amount,0) 
          total_bills.value = vendor.value.bills.reduce(  (acc, item) => acc + item.total_price,0) 
  } catch (er) {
    throw er;
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  getRFQDetails();


  setTimeout(() => {
  const progress = document.querySelector('.progress-done') as HTMLElement;
  if (progress) {
    progress.style.width = progress.getAttribute('data-done') + '%';
    progress.style.opacity = '1';
  }

  const progress2 = document.querySelector('.progress-done1') as HTMLElement;
  if (progress2) {
    progress2.style.width = progress2.getAttribute('data-done1') + '%';
    progress2.style.opacity = '1';
  }
}, 1000);




});


const chartOptions = ref({
  chart: {
    type: 'donut',
  },
  labels:['Paid', 'unpaid'],
  plotOptions: {
      pie: {
        donut: {
          size: "80%",
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Bills',
              color: "#373d3f",
              fontSize: "16px",
              fontWeight: "bold",
            },
          },
        },
      },
    },
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

});

const chartOptionsCheque = ref({
  chart: {
    type: 'donut',
  },
  labels:['Old Cheques', 'New Cheques'],
  plotOptions: {
      pie: {
        donut: {
          size: "80%",
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Cheques',
              color: "#373d3f",
              fontSize: "16px",
              fontWeight: "bold",
            },
          },
        },
      },
    },
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

});


</script>

<style scoped>
.card {
  background-color: #fff;
  border-radius: 6px;
  border: 1px solid #ccc;
}
.gray {
  color: gray !important ;
}


.progress {
	background-color: #d8d8d8;
	border-radius: 10px;
	position: relative;
	margin: 15px 0;
	height: 60px;
	width: 300px;
}

.progress-done, .progress-done1 {
	background: rgb(167 139 250 / var(--tw-bg-opacity, 1));
	border-radius: 10px;
	color: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	width: 0;
	opacity: 0;
	transition: 1s ease 0.3s;
}

</style>
