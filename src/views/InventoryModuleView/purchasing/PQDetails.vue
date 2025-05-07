<template>
  <div>
    <div>
      <div class="flex items-center justify-between">
        <BreadCrumpsComponent
          :BreadCrumps="breadCrumps"
          @toggleModalEmit="navigateToAddItemsPage"
        />
        <!-- :btn="$t('Add Items')" -->

        <!-- table operations  -->
        <div class="flex items-center justify-end w-2/3">
          <button
            class="cursor-pointer indigo_badge p-3"
            @click="generateCustody"
            v-if="
              (itemStatus == 4 || itemStatus == 5) &&
              (custody_rows.length == 0 || last_custody_amount < totalPrice)
            "
          >
            {{ $t("Create Custody") }}
          </button>
          <button
            class="cursor-pointer indigo_badge p-3"
            @click="covertRfqToPq"
            v-if="itemStatus == 2"
            title="please enter items prices and vendors to Start Qoutation"
          >
            {{ $t("Start Qoutation") }}
          </button>

          <div class="m-3 w-2/4 rounded-span" v-if="itemStatus == 3">
            <label for="" class="block">{{ $t("Select Vendor") }}</label>
            <select
              class="mt-1 block w-full border py-2 rounded-md border-gray-300 shadow-sm h-100px rounded-output"
              name=""
              @change="updateVendors"
              v-model="vendor"
              id=""
            >
              <option
                v-for="(vendor, index) in vendors"
                :key="index"
                :value="vendor.id"
              >
                {{ vendor.name }}
              </option>
            </select>
          </div>

          <button
            @click="printTable"
            class="btn color-primary p-2 h-10"
            v-if="itemStatus == 3 || itemStatus == 4 || itemStatus == 5"
          >
            <span> {{ $t("Print Table") }}</span>
            <font-awesome-icon :icon="['fas', 'print']" class="mx-1" />
          </button>

          <button
            @click="generatePDF"
            class="btn color-primary p-2 h-10"
            v-if="itemStatus == 3 || itemStatus == 4 || itemStatus == 5"
          >
            {{ $t("Generate PDF") }}
            <font-awesome-icon :icon="['fas', 'file-pdf']" class="mx-1" />
          </button>
        </div>
      </div>

      <!--  -->
      <TableSkeletonLoader v-if="loading" />

      <section v-else>
        <TableLayoutComponent
          ref="tableContent"
          id="table"
          :columns="columns"
          :rows="rows"
          :itemStatus="itemStatus"
          :status-counter="statusCounter"
          :vendors="vendors"
          :isApprove="HasItemData"
          :pageLable="$t('PQ Operations')"
          :allFields="opHeader"
          :slotTDcolName="slotTDcolName"
          @getUpdatedData="getUpdatedData"
          @updatePq="getUpdatedData"
          @updateTableIds="updateTableIds"
        >
          <template #columnAction="{ row }">
            <span v-if="row.additional_data == 0" class="mx-2">
              <button
                @click="
                  openModal();
                  row_id = row.id;
                "
                class="cursor-pointer indigo_badge"
              >
                <font-awesome-icon :icon="['far', 'pen-to-square']" />
              </button>
            </span>
          </template>

          <template #actions="{ row }">
            <td v-if="itemStatus == 3">
              <button
                v-if="row.additional_data != 'blocked'"
                :title="'edit'"
                :loading="loading"
                class="btn color-primary"
                @click="openModalForUpdate(row.status, row.id, row)"
              >
                <font-awesome-icon :icon="['fas', 'edit']" />
              </button>

              <button
                v-if="row.additional_data == 'blocked'"
                :title="'edit'"
                :loading="loading"
                class="btn color-primary"
                @click="submitFormToSwitch(row.additional_data, row.id)"
              >
                <font-awesome-icon :icon="['fas', 'lock-open']" />
              </button>

              <button
                v-if="row.additional_data == 'Open'"
                :title="'edit'"
                :loading="loading"
                class="btn color-primary"
                @click="submitFormToSwitch(row.additional_data, row.id)"
              >
                <font-awesome-icon :icon="['fas', 'lock']" />
              </button>
              <button
                v-if="row.additional_data == 'Open'"
                :title="'edit'"
                :loading="loading"
                class="btn color-primary"
                @click="duplicateRow(row.id)"
              >
                <font-awesome-icon :icon="['fas', 'clone']" />
              </button>

              <button
                v-if="row.additional_data != 'blocked'"
                class="btn color-primary"
                @click="editItem(row)"
              >
                <font-awesome-icon :icon="['fas', 'edit']" />
                <span class="mx-3">
                  {{ $t("Add Card") }}
                </span>
              </button>
            </td>
            <td v-if="itemStatus == 4">
              <button
                :title="'edit'"
                :loading="loading"
                class="btn color-primary"
                @click="openModalForUpdate(row.status, row.id, row)"
              >
                <font-awesome-icon :icon="['fas', 'edit']" />
              </button>
            </td>
          </template>
        </TableLayoutComponent>

        <section class="flex justify-end items-end w-full">
          <div
            class="flex m-5 w-1/4"
            v-if="itemStatus == 3 || itemStatus == 4 || itemStatus == 5"
          >
            <h5 class="rounded-span">{{ $t("Total Price") }} :</h5>
            <h5 class="rounded-output">{{ totalPrice }} EGP</h5>
          </div>
        </section>
      </section>
    </div>

    <section
      class="flex justify-between items-center"
      v-if="itemStatus == 3 || itemStatus == 4 || itemStatus == 5"
    >
      <button
        class="p-3 w-1/3 flex justify-center"
        :class="activeButton === 'Filles' ? 'indigo_badge' : 'gray_badge'"
        @click="setActive('Filles')"
      >
        {{ $t("Uplaod Files") }} ( {{ form_files.length }} )
      </button>
      <button
        class="p-3 w-1/3 flex justify-center"
        :class="activeButton === 'Custody' ? 'indigo_badge' : 'gray_badge'"
        @click="setActive('Custody')"
      >
        {{ $t("Custodys") }} ( {{ custody_rows.length }} )
      </button>
      <button
        class="p-3 w-1/3 flex justify-center"
        :class="activeButton === 'Receive' ? 'indigo_badge' : 'gray_badge'"
        @click="setActive('Receive')"
      >
        {{ $t("Receives") }} ( {{ receives_rows.length }} )
      </button>
    </section>

    <!-- custodys for this pq  -->
    <section v-if="custody_rows.length > 0 && activeButton == 'Custody'">
      <TableLayoutComponent1
        :columns="custody_columns"
        :rows="custody_rows"
        pageLable="Custodys Operations"
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
      </TableLayoutComponent1>
    </section>
    <div
      class="yellow_badge flex items-center justify-center h-[50px]"
      v-if="custody_rows.length == 0 && activeButton == 'Custody'"
    >
      {{ $t("No Custodies Found") }}
    </div>
    <!-- receives for this pq  -->
    <section v-if="receives_rows.length > 0 && activeButton == 'Receive'">
      <TableLayoutComponent1
        ref="tableContent"
        id="table"
        :columns="receives_columns"
        :rows="receives_rows"
        pageLable="Recives Operations"
        :slotTDcolName="slotTDcolName"
        @getUpdatedData="getUpdatedData"
        @updateTableIds="updateTableIds"
      >
        <template #columnAction="{ row }">
          <span v-if="row.additional_data == 0" class="mx-2">
            <button
              @click="
                openModal();
                row_id = row.id;
              "
              class="cursor-pointer indigo_badge"
            >
              <font-awesome-icon :icon="['far', 'pen-to-square']" />
            </button>
          </span>
        </template>
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

        <template #actions="{ row }">
          <td>
            <div class="btn color-primary">
              <router-link
                :to="{
                  name: 'receive-details',
                  params: {
                    form_id: row.id,
                    operation_id: operation_id_Receive,
                  }, // operation id
                }"
              >
                <font-awesome-icon :icon="['fas', 'list']" />
              </router-link>
            </div>
            <button
              class="btn color-primary"
              @click="generateBill(row.id)"
              v-if="
                PQS.in_operations.filter((el) => el.id == row.id)[0].bills
                  .length == 0
              "
            >
              {{ $t("Generate Bill") }}
            </button>
          </td>
        </template>
      </TableLayoutComponent1>
    </section>
    <div
      class="yellow_badge flex items-center justify-center h-[50px]"
      v-if="receives_rows.length == 0 && activeButton == 'Receive'"
    >
      {{ $t("No Receives Found") }}
    </div>
    <!-- uploadedFiles  -->
    <section v-if="activeButton == 'Filles'">
      <pqUploadFiles
        :itemStatus="itemStatus"
        :form_files="form_files"
        @upadatePQ="getRFQDetails"
      />
    </section>
    <div
      class="yellow_badge flex items-center justify-center h-[50px]"
      v-if="
        form_files.length == 0 &&
        activeButton == 'Filles' &&
        (itemStatus == 3 || itemStatus == 4 || itemStatus == 5)
      "
    >
      {{ $t("No Files Uploaded Yet") }}
    </div>

    <ModalComponent :showModal="isModalOpen"
      ><FormPopUpLayoutComponent @closeModal="toggleModal" :title="row_name">
        <div class="flex flex-col">
          <div class="input flex flex-col w-full py-2 mt-1">
            <InputLableLayoutComponent
              lableFor="name"
              :text="$t('adjustment_item_form.form.I1.lable')"
              :required="true"
            />
            <input
              type="number"
              id="name"
              v-model="formData.new_quantity"
              class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
              :placeholder="$t('adjustment_item_form.form.I1.lable')"
            />
            <p v-if="errors.new_quantity" class="pt-2 text-xs text-red-500">
              {{ errors.new_quantity }}
            </p>
          </div>

          <div class="input flex flex-col w-full py-2 mt-1">
            <InputLableLayoutComponent
              lableFor="name"
              :text="$t('rfq_form.form.item_price')"
              :required="true"
            />
            <input
              type="number"
              id="name"
              v-model="formData.item_price"
              class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
              :placeholder="$t('rfq_form.form.item_price')"
            />
            <p v-if="errors.item_price" class="pt-2 text-xs text-red-500">
              {{ errors.item_price }}
            </p>
          </div>

          <!-- <div class="input flex flex-col w-full py-2 mt-1">
            <InputLableLayoutComponent lableFor="name" :text="$t('rfq_form.form.discount_price')" />
            <input
              type="number"
              id="name"
              v-model="item_discount"
              class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
              :placeholder="$t('rfq_form.form.discount_price')"
            />
         
          </div> -->
          <div class="input flex flex-col w-full py-2 mt-1">
            <InputLableLayoutComponent
              lableFor="name"
              :text="$t('rfq_form.form.select_vendor')"
              :required="true"
            />
            <select
              class="mt-1 block w-full border py-2 rounded-md border-gray-300 shadow-sm h-100px"
              name=""
              id=""
              v-model="formData.vendor_id"
            >
              <option
                v-for="(vendor, index) in vendors"
                :key="index"
                :value="vendor.id"
              >
                {{ vendor.name }}
              </option>
            </select>
            <p v-if="errors.vendor_id" class="pt-2 text-xs text-red-500">
              {{ errors.vendor_id }}
            </p>
          </div>

          <ButtonComponent
            :loading="ButtonLoad"
            :title="$t('adjustment_item_form.form.button')"
            @click="submitForm"
            class="form_btn"
          />
        </div>
        <SuccessModalComponent
          @closeModal="toggleModal()"
          :text="$t('adjustment_item_form.form.success')"
        ></SuccessModalComponent>
      </FormPopUpLayoutComponent>
    </ModalComponent>

    <!-- Hidden container for the PDF content -->

    <div style="position: absolute; left: -9999px">
      <pdfContent id="contentToPdf" />
    </div>

    <!-- modal for  choose batch  -->
    <ModalComponent :showModal="editItemOpen">
      <FormPopUpLayoutComponent
        style="width: 80% !important"
        @closeModal="editItemOpen = false"
        :title="$t('Select Card')"
      >
        <div v-if="item_batches.length > 0" class="flex flex-col">
          <table class="batches-table flex flex-col rounded-border">
            <thead class="second-thead">
              <tr>
                <th style="display: none"></th>

                <th>{{ $t("Item") }}</th>
                <th>{{ $t("Sku Code") }}</th>
                <th>{{ t("rfq_form.items.material") }}</th>
                <th>{{ t("rfq_form.items.shape") }}</th>
                <th>{{ t("rfq_form.items.origin") }}</th>
                <th>{{ t("rfq_form.items.color") }}</th>
                <!-- <th>{{  $t('add_items_to_form.filter.finishing_level')  }}</th>
            <th>{{  $t('adjustment_items.table.production_date')  }}</th>
            <th>{{  $t('Expiration Date')  }}</th> -->
                <th>{{ $t("operation_details.header.created_at") }}</th>
                <th>{{ $t("Actions") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in item_batches"
                :key="index"
                class="image-continer hover-tr flex w-full relative"
              >
                <td class="" style="display: none"></td>
                <td class="mb-0 name">{{ item.item_name }}</td>
                <td class="mb-0 name">{{ item.item_sku_code }}</td>
                <td class="mb-0 name">
                  {{ item.material?.material_nicknames }}
                </td>
                <td class="mb-0 name">{{ item.shape?.shape_name }}</td>
                <td class="mb-0 name">{{ item.origin?.origin_name }}</td>
                <td class="mb-0 name">{{ item.color?.color_name }}</td>
                <!-- <td class="mb-0 name"> {{ item.finishing_level }}</td>
            <td class="mb-0 name"> {{ item.production_date }}</td>
            <td class="mb-0 name"> {{ item.exp_date }}</td> -->
                <td class="mb-0 name">{{ item.created_at?.slice(0, 10) }}</td>

                <!-- Delete Icon -->
                <td class="mb-0 name">
                  <button class="btn">
                    <input
                      type="radio"
                      name="item_id"
                      :value="item.id"
                      v-model="card_item_id"
                    />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- <PaginationComponent
            :totalItems="item_batches"
            :itemsPerPageOptions="[10, 20, 30, 50]"
          ></PaginationComponent> -->
        </div>
        <!-- <div class="empty" v-else> No Item Batches avilable , please add one </div> -->

        <div class="flex justify-center">
          <button
            class="form_btn w-1/4"
            @click="submitFormToUpdate"
            v-if="card_item_id"
          >
            {{ $t("Choose Card") }}
          </button>
          <button class="form_btn mx-3 w-1/4" @click="newBatch">
            {{ $t("Add New Card") }}
          </button>
        </div>
      </FormPopUpLayoutComponent>
    </ModalComponent>

    <!-- modal for  Add batch  -->
    <ModalComponent :showModal="AddItemBatch">
      <FormPopUpLayoutComponent
        width="600"
        @closeModal="AddItemBatch = false"
        :title="$t('Add New Card')"
      >
        <div class=""></div>
        <div
          class="relative flex min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0"
        >
          <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
            <div>
              <h6 class="text-sm mt-3 mb-6 font-bold uppercase">
                {{ $t("create_item.form.part_one") }}
              </h6>
              <div class="flex flex-col flex-wrap item_information">
                <div class="w-full px-4">
                  <div class="input flex w-full py-2 mt-1">
                    <InputLableLayoutComponent
                      class="rounded-span w-fit"
                      :text="$t('create_item.form.I1.label')"
                      lable-for="name"
                      :required="false"
                    ></InputLableLayoutComponent>
                    <input
                      type="text"
                      class="py-2 rounded-md border-2 bg-violet-50 px-2 w-full"
                      v-model="formDataForCard.item_name"
                      :placeholder="$t('create_item.form.I1.placeholder')"
                    />
                    <p
                      v-if="errors.item_name"
                      class="pt-2 text-xs text-red-500"
                    >
                      {{ errors.item_name }}
                    </p>
                  </div>
                </div>
                <div class="w-full px-4">
                  <div class="input flex w-full py-2 mt-1">
                    <InputLableLayoutComponent
                      class="rounded-span w-fit"
                      :text="$t('create_item.form.I2.label')"
                      lable-for="Sku_code"
                      :required="false"
                    ></InputLableLayoutComponent>
                    <input
                      type="text"
                      class="py-2 rounded-md border-2 bg-violet-50 px-2 w-full"
                      v-model="formDataForCard.item_sku_code"
                      :placeholder="$t('create_item.form.I2.placeholder')"
                    />
                    <p
                      v-if="errors.item_sku_code"
                      class="pt-2 text-xs text-red-500"
                    >
                      {{ errors.item_sku_code }}
                    </p>
                  </div>
                </div>
                <div class="w-full px-4">
                  <div class="input flex w-full py-2 mt-1">
                    <InputLableLayoutComponent
                      class="rounded-span w-fit"
                      :text="$t('create_item.form.I3.label')"
                      lable-for="Sku_code"
                      :required="false"
                    ></InputLableLayoutComponent>
                    <select
                      name="uom"
                      id=""
                      v-model="formDataForCard.uom_id"
                      class="py-2 rounded-md border-2 bg-violet-50 px-2 w-full"
                    >
                      <option :value="0" selected disabled>
                        {{ $t("create_item.form.I3.placeholder") }}
                      </option>
                      <option :value="uom.id" v-for="uom in uom" :key="uom.id">
                        {{ uom.name }}
                      </option>
                    </select>
                    <p
                      v-if="errors.item_sku_code"
                      class="pt-2 text-xs text-red-500"
                    >
                      {{ errors.item_sku_code }}
                    </p>
                  </div>
                </div>
              </div>

              <hr class="mt-6 border-b-1 border-blueGray-300" />

              <h6
                class="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase"
              >
                {{ $t("create_item.form.part_three") }}
              </h6>
              <div class="flex flex-wrap flex-col">
                <div
                  class="w-full px-4"
                  v-for="(item, key, index) in dropDownData"
                  :key="index"
                >
                  <div class="input flex w-full py-2 mt-1">
                    <InputLableLayoutComponent
                      class="rounded-span w-fit"
                      :text="
                        $t(`create_item.form.drop_down.I${index + 1}.label`)
                      "
                      lable-for="item"
                      :required="false"
                    ></InputLableLayoutComponent>
                    <select
                      v-model="formDataForCard[key]"
                      id="operation-type"
                      class="py-2 rounded-md border-2 bg-violet-50 px-2 w-full"
                    >
                      <option :value="0" selected disabled>
                        {{
                          $t(
                            `create_item.form.drop_down.I${
                              index + 1
                            }.placeholder`
                          )
                        }}
                      </option>
                      <option :value="i.id" v-for="i in item" :key="i.id">
                        {{ i.name }}
                      </option>
                    </select>
                  </div>
                  <p v-if="errors[key]" class="pt-2 text-xs text-red-500">
                    {{ errors[key] }}
                  </p>
                </div>
                <div
                  class="mt-4 p-4 border-t border-gray-200 dark:border-gray-500"
                >
                  <button
                    class="w-full flex justify-between items-center font-bold cursor-pointer hover:underline text-gray-800 dark:text-gray-50"
                  >
                    <label for="fileInput" class="flex justify-between">
                      <p class="text-base cursor-pointer">
                        {{ $t("material-title.add-img-btn") }}
                      </p>
                    </label>
                    <input
                      ref="fileInput"
                      type="file"
                      id="fileInput"
                      accept="image/*"
                      multiple
                      @change="handleFileChange($event)"
                      class="hidden"
                    />
                  </button>
                  <div class="mt-4 grid grid-cols-6 gap-4 relative">
                    <div
                      v-for="(img, index) in imagePreviews"
                      :key="index"
                      class="relative"
                    >
                      <img
                        :src="img"
                        alt="Uploaded Preview"
                        class="w-full h-full object-cover rounded shadow"
                        width="400"
                        height="200"
                      />
                      <!-- Close button -->
                      <button
                        @click="removeImage(index)"
                        class="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg hover:bg-red-600"
                      >
                        <font-awesome-icon
                          :icon="['fas', 'x']"
                          class="w-2 h-2"
                        />
                      </button>
                    </div>
                  </div>
                </div>
                <div class="flex justify-center w-full">
                  <div class="">
                    <button
                      class="form_btn w-[200px]"
                      type="button"
                      @click="submitFormForCreateCard"
                    >
                      {{ $t("create_item.form.submit") }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FormPopUpLayoutComponent>
    </ModalComponent>
  </div>
</template>
<script setup lang="ts">
import jsPDF from "jspdf";
import html2canvas from "html2canvas"; // Alternative for complex styling
import pqUploadFiles from "@/views/InventoryModuleView/purchasing/pqUploadFiles.vue";
import pdfContent from "@/views/InventoryModuleView/purchasing/pqContentToPdf.vue";

import BreadCrumpsComponent from "@/components/Layouts/AppLayoutComponents/BreadCrumpsComponent.vue";
import ButtonComponent from "@/components/Layouts/AppLayoutComponents/ButtonComponent.vue";
import rfq_api from "@/services/rfq_api";
import custody_api from "@/services/custody_api";
import receive_api from "@/services/receive_api";
import PaginationComponent from "@/components/Layouts/TablesLayoutComponents/PaginationComponent.vue";

import { computed, onMounted, ref } from "vue";

import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
const route = useRoute();
const router = useRouter();
import axios from "axios";
import env from "@/env";
import store from "@/Middelware/store";
//form
import { useModal } from "@/composables/useModal";
import { useButtonLoad } from "@/composables/useButtonLoad";
import { useResetValue } from "@/composables/useResetValue";
import FormPopUpLayoutComponent from "@/components/Layouts/PopUpLayoutComponent/FormPopUpLayoutComponent.vue";
import ModalComponent from "@/components/Layouts/AppLayoutComponents/ModalComponent.vue";
import InputLableLayoutComponent from "@/components/Layouts/InputsFromLayoutCompoennts/InputLableLayoutComponent.vue";
import { useSchemaValidation } from "@/composables/useValidationSchema";
import { ToastProps, useToast } from "vue-toast-notification";

const { getValidationSchema } = useSchemaValidation();

// create ITem
import create_item_api from "@/services/create_item_api";
import ItemCard from "@/types/itemsettings/CreateItem";
import CreateItmeDropDown from "@/types/itemsettings/CreateItmeDropDown.";

const $toast = useToast();
const toastOption: ToastProps = {
  position: "top-right",
  duration: 2000,
  pauseOnHover: true,
};

const dropDownData = ref<CreateItmeDropDown>();
const form = ref<any>();

const formDataForCard = ref<ItemCard>({
  location_id: +store.getters["location_module/LocationId"],
  item_name: "",
  uom_id: 0,
  item_sku_code: "",
  item_material_id: 0,
  shape_id: 0,
  origin_id: 0,
  media: null,
  bundle_id: null,
  length: null,
  width: null,
  thick_height: null,
  weight: null,
});

const cleanedFormData = computed(() => {
  return Object.fromEntries(
    Object.entries(formDataForCard.value).filter(([_, v]) => v !== null)
  );
});

const Item_id = ref(null);
const imagePreviews = ref<string[]>([]);
const removeImage = (index: number) => {
  imagePreviews.value.splice(index, 1);
};
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (!files) return;
  form.value = new FormData();
  for (let i = 0; i < files.length; i++) {
    form.value.append("media[]", files[i]);
    imagePreviews.value.push(URL.createObjectURL(files[i]));
  }
};

const submitFormForCreateCard = async () => {
  const schema = getValidationSchema(cleanedFormData.value, "create_item");

  // Ensure form is a new FormData instance
  const form = new FormData();

  Object.entries(cleanedFormData.value).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      form.append(key, value);
    }
  });

  form.append("category_id", Item_id.value);

  try {
    const response = await create_item_api.addItem(form);
    $toast.success("Item created successfully");

    AddItemBatch.value = false;
    setTimeout(() => {
      editItemOpen.value = true;
      editItem(rowToEdit.value);
    }, 100);
  } catch (error) {
    if (error.inner) {
      error.inner.forEach((validationError: any) => {
        errors.value[validationError.path] = validationError.message;
      });
    }
  }
};

const uom = ref<any>();
const getDropDownData = async () => {
  try {
    const response = await create_item_api.getItmeDropDownData();
    uom.value = response.uom_id;
    delete response.uom_id; // Remove uom_id

    // Remove categories_id
    const filteredData = Object.fromEntries(
      Object.entries(response).filter(([key]) => key !== "categories_id")
    );

    dropDownData.value = filteredData as unknown as CreateItmeDropDown;
  } catch (error) {
    throw error;
  }
};

onMounted(() => {
  getDropDownData();
});

// end add item

const activeButton = ref("Filles");
const setActive = (button) => {
  activeButton.value = button;
};

const activeLocationId = ref("");
const operation_id_for_recive = ref("");
const operation_id_for_Bill = ref("");
const operation_id_Receive = ref(4);

// get active operatio_id for Custody
const getLocationOperation = async () => {
  try {
    const response = await axios.get(
      env.DOMAIN + "inv-apis/settings/loc-operations",
      {
        params: {
          location_id: +activeLocationId.value,

          operation_type: "CUSTODY",
        },
      }
    );

    operation_id_for_recive.value = response.data.data[0].id;
  } catch (er) {
    throw er;
  }
};
// get active operatio_id for Bill
const getLocationOperationForBill = async () => {
  try {
    const response = await axios.get(
      env.DOMAIN + "inv-apis/settings/loc-operations",
      {
        params: {
          location_id: +activeLocationId.value,

          operation_type: "BILL",
        },
      }
    );

    operation_id_for_Bill.value = response.data.data[0].id;
  } catch (er) {
    throw er;
  }
};

// Add Item Batches
const editItemOpen = ref<boolean>(false);
const AddItemBatch = ref<boolean>(false);
const item_batches = ref([]);
const itemBatchId = ref(null);
const batch_id = ref(null);
const rowToEdit = ref(null);
const editItem = async (row) => {
  rowToEdit.value = row;
  editItemOpen.value = true;
  item_batches.value = [];
  row_id.value = row.id;
  Item_id.value = row.item_id;

  const response = await receive_api.getItemCards(row.item_id);
  item_batches.value = response.reverse();
};
const newBatch = () => {
  editItemOpen.value = false;
  AddItemBatch.value = true;
};

const tableContent = ref(null);
// function for print table
function printTable() {
  const printWindow = window.open("", "", "width=800,height=600");
  printWindow.document.open();
  printWindow.document.write(document.getElementById("contentToPdf").outerHTML);
  printWindow.document.close();
  window.print();
}
// funtion for generate custom pdf
const generatePDF = async () => {
  try {
    const element = document.getElementById("contentToPdf");
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
    });
    const dataUrl = canvas.toDataURL("image/png");

    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const canvasAspectRatio = canvas.width / canvas.height;
    const pageAspectRatio = pageWidth / pageHeight;

    let width = pageWidth;
    let height = pageHeight;
    let x = 0;
    let y = 0;
    if (canvasAspectRatio > pageAspectRatio) {
      height = pageWidth / canvasAspectRatio;
      y = (pageHeight - height) / 2;
    } else if (canvasAspectRatio < pageAspectRatio) {
      // Corrected condition
      width = pageHeight * canvasAspectRatio;
      x = (pageWidth - width) / 2;
    } // If aspect ratios are equal, no change needed (full width and height)

    doc.addImage(dataUrl, "PNG", x, y, width, 100);

    const filename = "El-Alfy-PQ.pdf";
    doc.save(filename);
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};

const vendor = ref(null);

const { reset } = useResetValue();
const { isModalOpen, openModal, closeModal, toggleModal } = useModal();
const loading = ref<boolean>(true);
const btnLoading = ref<boolean>(false);
const { ButtonLoad, toggleButtonLoad } = useButtonLoad();

const errors = ref<any>({});
const row_id = ref<string>();
const row_name = ref<string>();

const row_status = ref(null);
const row_id_for_edit = ref(null);

const item_discount = ref("");
const formData = ref<any>({
  new_quantity: "",
  vendor_id: "",
  item_price: "",
});
const openModalForUpdate = (status, row_id, row) => {
  openModal();
  row_status.value = status;
  row_id_for_edit.value = row_id;
  row_name.value = row.name;
  formData.value.item_price = row.item_price?.current;
  item_discount.value = row.last_price;
  formData.value.new_quantity = PQS.value.form_details.filter(
    (el) => el.id == row_id
  )[0].form_quantity;
  // for (let i = 0; i < vendors.value.length; i++) {
  //   if (vendors.value[i].id == row.vendor_id) {
  //   }
  // }
  formData.value.vendor_id = PQS.value.form_details.filter(
    (el) => el.id == row_id
  )[0].vendor_id;
};

const card_item_id = ref("");

const submitForm = async () => {
  const schema = getValidationSchema(formData.value, "create_item");
  try {
    toggleButtonLoad();
    await schema.validate(formData.value, { abortEarly: false });
    try {
      const payload = {
        form_quantity: formData.value.new_quantity || null,
        item_discount: item_discount.value || null,
        item_price: formData.value.item_price || null,
        vendor_id: formData.value.vendor_id || null,
      };
      await rfq_api.updatePQDetails(payload, row_id_for_edit.value);
      reset(formData.value);
      closeModal();
      getRFQDetails();
    } catch (er) {
      throw er;
    }
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
// submite form to update card item
const submitFormToUpdate = async () => {
  try {
    toggleButtonLoad();
    try {
      const payload = {
        item_id: card_item_id.value,
      };
      await rfq_api.updatePQDetails(payload, row_id.value);
      reset(formData.value);
      editItemOpen.value = false;
      getRFQDetails();
    } catch (er) {
      throw er;
    }
  } catch (error) {
    console.error(error);
  } finally {
    toggleButtonLoad();
  }
};
// submite form to update card item
const duplicateRow = async (id) => {
  try {
    toggleButtonLoad();
    try {
      const payload = {
        id: id,
      };
      await rfq_api.duplicateRow(payload);
      reset(formData.value);
      editItemOpen.value = false;
      getRFQDetails();
    } catch (er) {
      throw er;
    }
  } catch (error) {
    console.error(error);
  } finally {
    toggleButtonLoad();
  }
};
const submitFormToSwitch = async (status, row_id) => {
  try {
    try {
      let item_status = null;
      if (status == "Open") {
        item_status = -1;
      } else if ((status = "blocked")) {
        item_status = 0;
      }
      const payload = {
        status: item_status,
        item_price: status === "Open" ? "123.45" : "",
        vendor_id: status === "Open" ? "456" : "",
      };

      await rfq_api.updatePQDetails(payload, row_id);
      getRFQDetails();
    } catch (er) {
      throw er;
    }
  } catch (error) {
    console.error(error);
  }
};

const detail_ids = ref([]);
// updates table ids
const updateTableIds = (ids) => {
  detail_ids.value = ids;
};
// convert RFQ to PQ
const covertRfqToPq = async () => {
  try {
    try {
      const response = await rfq_api.convertRfqToPq(
        +route.params.form_id,
        +route.params.operation_id
      );
    } catch (er) {
      throw er;
    }
  } catch (error) {
    console.error(error);
  } finally {
    getUpdatedData();
  }
};
// Generate Custody
const generateCustody = async () => {
  try {
    try {
      const response = await rfq_api.generateCustody(
        +route.params.form_id,
        operation_id_for_recive.value
      );
      $toast.success("Custody Created Successfully", toastOption);
      activeButton.value = "Custody";
      getCustosy();
    } catch (er) {
      $toast.error(er, toastOption);
      throw er;
    }
  } catch (error) {
    console.error(error);
  } finally {
    getUpdatedData();
  }
};

// update vendors
const updateVendors = async () => {
  const payload = {
    detail_ids: detail_ids.value,
    vendor_ids: [vendor.value],
  };
  try {
    const response = await rfq_api.updateVendors(payload);
  } catch (er) {
    throw er;
  } finally {
    setTimeout(() => {
      getRFQDetails();
    }, 1000);
  }
};

// generate bill from receive
const generateBill = async (source_form_id) => {
  try {
    const response = await rfq_api.generateBillFromReceive(
      source_form_id,
      operation_id_for_Bill.value
    );
  } catch (err) {
    console.error(err);
  } finally {
    getRFQDetails();
  }
};
//table
import TableSkeletonLoader from "@/components/Layouts/TablesLayoutComponents/TableLoadersComponents/TableSkeletonLoader.vue";
import TableLayoutComponent from "@/components/Layouts/TablesLayoutComponents/EditableTableLayout.vue";
import TableLayoutComponent1 from "@/components/Layouts/TablesLayoutComponents/TableLayoutComponent.vue";

const rows = ref([]);
const receives_rows = ref([]);
const custody_rows = ref([]);
const opHeader = ref<any>();
const slotTDcolName = "form_quantity";

const PQS = ref<any>();
const disableBtn = computed(() => {
  return Array.isArray(PQS.value) && PQS.value.some((el) => el.status === 0);
});
const status = (status: number, action: boolean) => {
  const isAction = action ? "status." : "";
  return status === 0
    ? t(`${isAction}open`)
    : status === 1
    ? t(`${isAction}close`)
    : status === 2
    ? t(`${isAction}confirm`)
    : "";
};
const { t, messages, locale } = useI18n();
const breadCrumps = ref([
  { text: t("PQs"), route: "PQ" },
  { text: t("finish-level.table.details"), route: "" },
]);
const navigateToAddItemsPage = () => {
  router.push({
    name: "add-RFQ-item",
    params: {
      form_id: +route.params.form_id,
      operation_id: +route.params.operation_id,
    },
  });
};
const itemStatus = ref(null);
const totalPrice = ref(null);

const columns = [
  t("Item"),
  t("Sku Code"),
  t("rfq_form.items.material"),
  t("rfq_form.items.shape"),
  t("rfq_form.items.color"),
  t("rfq_form.items.origin"),
  t("Quantity"),
  t("rfq_form.form.item_price"),
  t("rfq_form.form.last_price"),

  // t('Item Discount'),
  // "status",
  t("Vendor"),
  itemStatus.value === 2 ? t("table.actions") : " ",
];
const form_files = ref([]);
const receives_columns = [
  t("table.form_lable"),
  t("table.source_location"),
  t("table.destination_location"),
  t("table.form_date_time"),
  t("table.created_by"),
  t("table.created_at"),
  t("table.confirmed_at"),
  t("table.status"),
  t("table.actions"),
];
const custody_columns = [
  t("adjustment_form.table.form_lable"),
  // t("Form Code"),
  t("Type"),
  t("Amount"),
  t("Description"),
  t("rfq_form.form.created_at"),
  t("release_form.table.status"),
];
const statusCounter = ref<any>();

const getRFQDetails = async () => {
  loading.value = true;
  try {
    const response = await rfq_api.getPQWithItems(+route.params.form_id);

    PQS.value = response;
    rows.value = PQS.value.form_details.map((opItem: any) => ({
      id: opItem.id,
      item_id: opItem.item?.category_id,
      name: opItem.item.item_name,
      item_sku_code: opItem.item.item_sku_code,
      material: opItem.item?.material?.material_nicknames,
      shape: opItem.item?.shape?.shape_name,
      color: opItem.item?.color?.color_name,
      origin: opItem.item?.origin?.origin_name,
      form_quantity: {
        current: opItem.form_quantity,
        old: opItem.old_form_quantity,
      },
      // +" "+opItem.item?.uom?.uom
      item_price: { current: opItem.item_price, old: opItem.old_item_price },
      last_price: opItem.item?.last_price,
      // item_discount: opItem.item_discount,
      vendor_id: opItem.vendor?.name,

      additional_data:
        opItem.status === 0
          ? "Open"
          : opItem.status === 1
          ? "Closed"
          : opItem.status === -1
          ? "blocked"
          : opItem.status === 2
          ? "Confirmed"
          : opItem.status === 3
          ? "Confirmed"
          : "",
    }));
    itemStatus.value = response.status;
    totalPrice.value = PQS.value.form_details.reduce(
      (acc, item) => acc + item.item_price * item.form_quantity,
      0
    );

    // disabled start quotation untill all items has price and vendors

    // receives rows for this pq
    receives_rows.value = PQS.value.in_operations.map((receive: any) => ({
      id: receive.id,
      form_lable: receive.form_label,
      source_location: receive.from_location,
      destination_location: receive.to_location?.location_name,
      form_datetime: receive.form_datetime,
      created_by: receive.created_by,
      created_at: receive.created_at,
      confirmed_at: receive.confirmed_at,
      additional_data:
        receive.status === 0
          ? "Open"
          : receive.status === 1
          ? "Closed"
          : receive.status === 2
          ? "Confirmed"
          : receive.status === 3
          ? "Confirmed"
          : "",
    }));
    form_files.value = PQS.value.forms_files;
    receives_rows.value = receives_rows.value.filter(
      (el) => el.additional_data == "Confirmed"
    );
    //   ----------------------------------------
    opHeader.value = [
      { label: t("Form Label"), value: response.form_label || "" },
      {
        label: t("Location From"),
        value: response.from_location?.location_name || "",
      },
      {
        label: t("rfq_form.form.doc_number"),
        value: response.doc_number || "",
      },
      {
        label: t("rfq_form.form.form_datetime"),
        value: response.form_datetime || "",
      },

      {
        label: t("created_at"),
        value: `${response.user?.name} , ${response.created_at.slice(0, 16)}`,
      },
      // { label: "Total Items", value: response?.total_items || "" },
      // { label: "Total Price", value: response?.total_price || "" },

      ...(response.status === 4 || response.status === 5
        ? [
            {
              label: t("Approved"),
              value: `${response?.quoted_by?.name || "------"} , ${
                response.approved_at?.slice(0, 16) || "------"
              }`,
            },
            {
              label: t("Status"),
              value:
                response.status === 2
                  ? t("status.waiting_for_confirm")
                  : response.status === 1
                  ? t("status.close")
                  : response.status === 3
                  ? t("status.confirm")
                  : response.status === 4
                  ? t("Approved")
                  : response.status === 5
                  ? t("Edit After Approve")
                  : t("status.open"),
            },
          ]
        : [
            // Only Approved is shown if status is 4
          ]),
      ...(response.status === 3
        ? [
            {
              label: t("Quoted"),
              value: `${response?.quoted_by?.name || "------"} , ${
                response.quoted_at?.slice(0, 16) || "------"
              }`,
            },
          ]
        : [
            // Only Approved is shown if status is 4
          ]),
      { label: "Stu", value: response.status },
    ];

    statusCounter.value = [
      {
        label: t("operation_details.header.total_items"),
        value: rows.value.length,
      },
    ];

    //   ----------------------------------------
  } catch (er) {
    throw er;
  } finally {
    loading.value = false;
  }
};
const HasItemData = computed(() => {
  return rows.value.every(
    (row) =>
      row.item_price !== undefined &&
      row.item_price !== null &&
      row.item_price !== ""
  ); // Check for undefined, null, and empty string
});
// get custodies that may happened for this pq
const custodys = ref([]);
const last_custody_amount = ref("");
const getCustosy = async () => {
  try {
    const payload = {
      operation_id: operation_id_for_recive.value,
      form_id: +route.params.form_id,
    };
    let response = await custody_api.getCustosyForPq(payload);
    response = response.filter(
      (el) => el.source_form_id === +route.params.form_id
    );

    custody_rows.value = response.map((custody: any) => ({
      id: custody.id,
      form_lable: custody.form_label,
      // form_code: custody.form_code,
      type: custody.type,
      amount: custody.amount,
      description: custody.description,
      created_at: custody.created_at,
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
    last_custody_amount.value = custody_rows.value.reduce(
      (sum, row) => sum + row.amount,
      0
    );
  } catch (er) {
    throw er;
  }
};

const getUpdatedData = () => {
  getRFQDetails();
};

const vendors = ref([]);
async function getVendors() {
  try {
    const response = await axios.get(
      env.DOMAIN + "purch-apis/purchasing/creditors"
    );
    vendors.value = response.data.data;
  } catch (er) {
    console.error(er);
    throw er;
  }
}
onMounted(() => {
  getVendors();
});
onMounted(async () => {
  getRFQDetails();
  activeLocationId.value = store.getters["location_module/LocationId"];
  setTimeout(() => {
    getLocationOperation();
    getLocationOperationForBill();
  }, 100);
  setTimeout(() => {
    getCustosy();
  }, 2000);
});
</script>

<style>
.indigo_badge:disabled {
  opacity: 0.4;
  cursor: not-allowed !important;
}

.batches-table th,
.batches-table td {
  width: 12.5%;
}
.batches-table td {
  display: flex;
  justify-content: start;
  align-items: center;
}
</style>
