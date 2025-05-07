<template>
    <div class="mx-12">
      <BreadCrumpsComponent
        :BreadCrumps="breadCrumps"
       
      />
      <!-- :btn="$t('Add Custody')" -->

      <TableSkeletonLoader v-if="loading" />
      <div v-else>
        <TableLayoutComponent
          :columns="columns"
          :rows="rows"
          :pageLable="$t('Recipients Operations')"
        >
          
          <template #actions="{ row }"
            ><td>
              <div class="btn color-primary">
                <router-link
                    @click="storeRecipient(row)"
                  :to="{
                    name: 'Recipient-Custodies',
                    params: { form_id: row.id, operation_id: route.params.id }, // operation id
                  }"
                >
                  <font-awesome-icon :icon="['fas', 'list']" />
                </router-link>
              </div>
             
            </td>
          </template> 
        
        </TableLayoutComponent>
      </div>
    
    </div>
  </template>
  <script setup lang="ts">
  //GOLBAL IMPORTS
  import { computed, onMounted, ref } from "vue";
  import { useRoute } from "vue-router";
  
  import { useI18n } from "vue-i18n";
  import { defineAsyncComponent, shallowRef } from "vue";
  //GLOBLA DATA
  const route = useRoute();
  const { t } = useI18n();
  //TABLE
  //TABLE IMPORTS
  import TableSkeletonLoader from "@/components/Layouts/TablesLayoutComponents/TableLoadersComponents/TableSkeletonLoader.vue";
  import BreadCrumpsComponent from "@/components/Layouts/AppLayoutComponents/BreadCrumpsComponent.vue";
  import TableLayoutComponent from "@/components/Layouts/TablesLayoutComponents/TableLayoutComponent.vue";
  import custody_api from "@/services/custody_api";

  
  //TABLE DATA
  const loading = ref<boolean>(true);
  const rows = shallowRef<[]>();
  const Recipients = shallowRef<any>([]);
  
  const breadCrumps = [{ text: t('Recipients'), route: "" }];
  const columns = [
    t("recipient_name"),
    t("recipient_email"),
    t("settlement_amount"),
    t("custodies_amount"),
    t("remaining"),
    t("created_at"),
    t("release_form.table.actions"),
  ];
  //TABLE METHODS
  const getRecipients = async () => {
    loading.value = true;
    try {
      const payload = {
        operation_id: +route.params.operation_id,
      };
      const response = await custody_api.getRecipients(payload);
      Recipients.value = response;
      
  
      rows.value = response.map((recipient: any) => ({
        id: recipient.recipient?.id,
        name: recipient.recipient?.name,
        email: recipient.recipient?.email,
        settlement_amount: recipient.settlement_amount,
        custodies_amount: recipient.custodies_amount,
        remaining: recipient.remaining,
        created_at: recipient.recipient?.created_at.slice(0,10),
      }));
    } catch (er) {
      throw er;
    } finally {
      loading.value = false;
    }
  };

  const storeRecipient = (row)=>{
    localStorage.setItem('recipient', JSON.stringify(row))
  }
  
  //LIFECYCLE HOOKS
  onMounted(async () => {
    getRecipients();
  });
  </script>
  