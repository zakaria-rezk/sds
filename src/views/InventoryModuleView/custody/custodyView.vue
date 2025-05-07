<template>
    <div class="mx-12">
      <BreadCrumpsComponent
        :BreadCrumps="breadCrumps"
        :btn="$t('Add Custody')"
       
        @toggleModalEmit="openModal"
      />
  
      <TableSkeletonLoader v-if="loading" />
      <div v-else>
        <TableLayoutComponent
          :columns="columns"
          :rows="rows"
          :pageLable="$t('Custodys Operations')"
        >
          <template #status="{ row }">
            <td>
              <div
                class="btn"
                :class="{
                  indigo_badge: row.additional_data === $t('status.confirm'),
                  yellow_badge: row.additional_data === $t('status.close'),
                  green_badge: row.additional_data === $t('status.open'),
                }"
              >
                {{ row.additional_data }}
              </div>
            </td>
          </template>
          <!-- <template #actions="{ row }"
            ><td>
              <div class="btn color-primary">
                <router-link
                  :to="{
                    name: 'adjustment-details',
                    params: { form_id: row.id, operation_id: route.params.id }, // operation id
                  }"
                >
                  <font-awesome-icon :icon="['fas', 'list']" />
                </router-link>
              </div>
              <button
                class="btn color-primary"
                v-if="
                  row.additional_data !== 'Confirmed' &&
                  row.additional_data !== 'Received'
                "
                @click="openModal"
              >
                <font-awesome-icon :icon="['fas', 'edit']" />
              </button>
            </td>
          </template> -->
          <!-- <template #toggle="{ row }"
      ><td>
        <div class="btn color-primary">
          
        </div>
      </td>
        </template> -->
        </TableLayoutComponent>

        <section class="flex justify-end items-end">
         
         <section class="flex flex-col  justify-end items-end w-1/2"> 
             <div class="flex  mb-1 w-1/2" >
               <h5 class="rounded-span">{{ $t('Settlement Amount') }} :</h5>
               <h5 class="rounded-output">{{ recipient.settlement_amount }} EGP</h5>
             </div>
           
             <div class="flex  mb-1 w-1/2" >
               <h5 class="rounded-span">{{ $t('Custodies Amoun') }} :</h5>
               <h5 class="rounded-output">{{ recipient.custodies_amount }}  EGP</h5>
             </div>
             <div class="flex  mb-1 w-1/2" >
               <h5 class="rounded-span">{{ $t('Remaining') }} :</h5>
               <h5 class="rounded-output">{{ recipient.remaining }}  EGP</h5>
             </div>
         </section>
        
       
      </section>

      </div>
      <ModalComponent :showModal="isModalOpen" v-if="isModalOpen" 
        ><FormPopUpLayoutComponent
          @closeModal="toggleModal"
          v-click-outside="toggleModal"
          :title="$t('Add New Custody')"
        >
          <div class="flex flex-col" v-if="displayForm">
            <div class="input flex flex-col w-full py-2 mt-1">
              <InputLableLayoutComponent
                lableFor="name"
                :text="$t('Amount')"
              />
              <input
                type="number"
                id="name"
                v-model="formData.amount"
                class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
                :placeholder="$t('Add Amount')"
              />
              <p v-if="errors.amount" class="pt-2 text-xs text-red-500">
                {{ errors.amount }}
              </p>
            </div>

            <div class="input flex flex-col w-full py-2 mt-1">
              <InputLableLayoutComponent
                lableFor="user"
                :text="$t('Custody User')"
              />
             
            <select
                id="user"
                class="py-2 rounded-md border-2 bg-gray-100 text-gray-500 px-2"
                v-model="formData.user"
                >
                <option  value="" disabled selected hidden>
                    {{  $t('Custody User')  }}
                </option>
                <option  v-for="(user , index) in users" :key="index" :value="user.id">
                    {{user.name}}
                </option>
             
            </select>
              <p v-if="errors.user" class="pt-2 text-xs text-red-500">
                {{ errors.user }}
              </p>
            </div>


            <div class="input flex flex-col w-full py-2 mt-1">
              <InputLableLayoutComponent
                lableFor="type"
                :text="$t('Custody Type')"
              />
             
            <select
                id="operation-type"
                class="py-2 rounded-md border-2 bg-gray-100 text-gray-500 px-2"
                v-model="formData.type"
                >
                <option  value="permanent">
                    {{  $t('permanent')  }}
                </option>
                <option  value="settlement">
                    {{ $t('settlement') }}
                </option>
                <option  value="temporary">
                    {{  $t('temporary')  }}
                </option>
               
             
            </select>
              <p v-if="errors.amount" class="pt-2 text-xs text-red-500">
                {{ errors.amount }}
              </p>
            </div>
            <div class="input flex flex-col w-full py-2 mt-1">
              <InputLableLayoutComponent
                lableFor="description"
                :text="$t('Describtion')"
              />
              <textarea
               
                id="description"
                v-model="formData.description"
                class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
                :placeholder="$t('Add Description')"
              />
              <p v-if="errors.amount" class="pt-2 text-xs text-red-500">
                {{ errors.amount }}
              </p>
            </div>
           
            <ButtonComponent
              :loading="ButtonLoad"
              :title="$t('Add New Custody')"
              @click="submitForm"
              class="form_btn"
            />
          </div>
          <SuccessModalComponent
            v-else
            @closeModal="
              toggleModal();
              displayForm = true;
            "
            :text="$t('Custody Added Successfully')"
          ></SuccessModalComponent>
        </FormPopUpLayoutComponent>
      </ModalComponent>
    </div>
  </template>
  <script setup lang="ts">
  //GOLBAL IMPORTS
  import { computed, onMounted, ref } from "vue";
  import { useRoute } from "vue-router";
  import { useRouter } from "vue-router";
const router = useRouter();

  import { useI18n } from "vue-i18n";
  import { defineAsyncComponent, shallowRef } from "vue";
  import ButtonComponent from "@/components/Layouts/AppLayoutComponents/ButtonComponent.vue";
  //GLOBLA DATA
  const route = useRoute();
  const { t } = useI18n();
  const recipient = ref(JSON.parse(localStorage.getItem('recipient'))) ;
  //TABLE
  //TABLE IMPORTS
  import TableSkeletonLoader from "@/components/Layouts/TablesLayoutComponents/TableLoadersComponents/TableSkeletonLoader.vue";
  import BreadCrumpsComponent from "@/components/Layouts/AppLayoutComponents/BreadCrumpsComponent.vue";
  import TableLayoutComponent from "@/components/Layouts/TablesLayoutComponents/TableLayoutComponent.vue";
  import custody_api from "@/services/custody_api";
  
  const ModalComponent = defineAsyncComponent(
    () => import("@/components/Layouts/AppLayoutComponents/ModalComponent.vue")
  );
  
  //TABLE COMPOSABLES
  import { useModal } from "@/composables/useModal";
  const { isModalOpen, openModal, closeModal, toggleModal } = useModal();
  //TABLE DATA
  const loading = ref<boolean>(true);
  const rows = shallowRef<[]>();
  const custodys = shallowRef<any>([]);
  
  const breadCrumps = [
    { 
      text: JSON.parse(localStorage.getItem('recipient')).name,
      route: "CUSTODY",
      params : {operation_id : +route.params.operation_id}  
    },
    { text: t('Custodys'), route: "" },
  ];
  const columns = [
    t("adjustment_form.table.form_lable"),
    t("table.destination_location"),
    t("Type"),
    t("Amount"),
    // t("Description"),
    t("created_at"),
    t('Custody Recipient'),
    t("release_form.table.status"),
  ];
  //TABLE COMPUTED
  const disableBtn = computed(() => {
    return (
      Array.isArray(custodys.value) &&
      custodys.value.some((el) => el.status === 0 || el.status === 1)
    );
  });
  //TABLE METHODS
  const getCustosy = async () => {
    loading.value = true;
    try {
      const payload = {
        form_id : +route.params.form_id,
        operation_id: +route.params.operation_id,
      };
      const response = await custody_api.getCustosyForCustody(payload);
      custodys.value = response;
      
  
      rows.value = response.custodies.map((custody: any) => ({
        id: custody.id,
        form_lable: custody.form_label,
        // source_form_label_to_pq: {label : custody.source_form_label , form_id : custody.source_form_id , operation_id : custody.source_operation_id},
        source_form_label_to_pq: custody.source_form_label,
        type: custody.type,
        amount: custody.amount,
        // description: custody.description,
        created_by: [{ text: custody.created_by?.name }, { text: custody.created_at.slice(0,18) }],
        custody_recipient: [{ text: custody.created_by?.name }, { text: custody.created_at.slice(0,18) }],
        // form_datetime: custody.form_datetime,
        // created_by: [{ text: custody.user.name }, { text: custody.created_at }],
  
        // confirmed_at: [
        //   { text: custody.confirmed_by?.name },
        //   { text: custody.confirmed_at },
        // ],
        additional_data:
          response.status === 2
            ? t("status.confirm")
            : response.status === 1
            ? t("status.close")
            : t("status.open"),
      }));
    } catch (er) {
      throw er;
    } finally {
      loading.value = false;
    }
  };
  const users = ref([]);
  const getUsers = async ()=>{
    try{
       const response  = await custody_api.getUsers();
       users.value = response ;
       console.log(users.value)
    }catch(err){
      console.error(err)
    }
  }
  //FORM
  //FORM COMPONENTS
  const InputLableLayoutComponent = defineAsyncComponent(
    () =>
      import(
        "@/components/Layouts/InputsFromLayoutCompoennts/InputLableLayoutComponent.vue"
      )
  );
  
  const FormPopUpLayoutComponent = defineAsyncComponent(
    () =>
      import(
        "@/components/Layouts/PopUpLayoutComponent/FormPopUpLayoutComponent.vue"
      )
  );
  const SuccessModalComponent = defineAsyncComponent(
    () =>
      import("@/components/Layouts/AppLayoutComponents/SuccessModalComponent.vue")
  );
  
  //FORM COMPOSABLES
  import { useButtonLoad } from "@/composables/useButtonLoad";
  import { useSchemaValidation } from "@/composables/useValidationSchema";
  import { useResetValue } from "@/composables/useResetValue";
  const { ButtonLoad, toggleButtonLoad } = useButtonLoad();
  const { reset } = useResetValue();
  const { getValidationSchema } = useSchemaValidation();
  //FORM DATA
  const displayForm = ref<boolean>(true);
  const errors = ref<any>({});
  const formData = ref<any>({
    amount: null,
    type: "",
    description: "",
    user : ''
  });
  
  //FORM METHODS
  
  const submitForm = async () => {
    const schema = getValidationSchema(formData.value, "create_item");
    try {
      toggleButtonLoad();
      await schema.validate(formData.value, { abortEarly: false });
      await addCustody(formData.value);
      reset(formData.value);
      displayForm.value = false;
    } catch (error) {
      if (error.inner) {
        error.inner.forEach((validationError: any) => {
          errors.value[validationError.path] = validationError.message;
        });
      }
    } finally {
      toggleButtonLoad();
    }
  };
  const addCustody = async (payload) => {
    payload.operation_id = +route.params.operation_id;
  
    loading.value = false;
    try {
      await custody_api.addCustody(payload);
      getCustosy();
    } catch (er) {
      throw er;
    }
  };
  //LIFECYCLE HOOKS
  onMounted(async () => {
    getCustosy();
    getUsers();
  });
  </script>
  