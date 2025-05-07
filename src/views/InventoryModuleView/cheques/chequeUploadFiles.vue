<template>
    <div>
      <!-- uploaded files  -->
     <div>
      <button
        class="btn color-primary h-10 relative pointer"
      >
        {{ $t('Uplaod Files') }}
        <font-awesome-icon :icon="['fas', 'image']" class="mx-3" />
        <input
          type="file"
          @change="uploadImages"
          class="inputFile"
          multiple
          name=""
          id=""
        />
      </button>
      <button  class="btn color-primary h-10 relative pointer mx-4" v-if="preview_list.length>0" @click="saveForm">
        {{  $t('Save Files')  }} 
        <font-awesome-icon :icon="['fas', 'upload']" class="mx-3" />
      </button>
     </div>
  
      <!-- uploaded files table  -->
      <div class="p-2 mt-3">
        <table
          v-if="preview_list.length"
          class="previewed-table flex flex-col rounded-border"
        >
          <thead class="second-thead">
            <tr>
              <th>{{  $t('New File')  }}</th>
              <th>{{  $t('Name')  }}</th>
              <th>{{  $t('Size')  }}</th>
              <th>{{  $t('description')  }}</th>
              <th>{{  $t('Actions')  }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in preview_list"
              :key="index"
              class="image-continer hover-tr flex w-full mx-4 relative"
            >
              <td @click="openImageModal(item, image_list[index].name)" class="my-5"> 
                <img :src="item" class="img-fluid" />
              </td>
              <td class="mb-0 name">{{ image_list[index].name }}</td>
              <td> {{ image_list[index].size / 1024 }}KB</td>
              <td>
                <button
                  class="form_btn"
                  v-if="!image_list[index].description"
                  @click="
                    openModalDescription(
                      image_list[index].name,
                      index
                    )
                  "
                >
                  {{  $t('Add Description')  }}
                </button>
                <span v-else>
                  {{ image_list[index].description }}
                </span>
              </td>
              <!-- Delete Icon -->
              <td>
                <button class="btn red_badge" @click="deleteImage(index)">
                  <font-awesome-icon :icon="['fas', 'trash']" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <table
          v-if="props.form_files.length"
          class="previewed-table flex flex-col rounded-border"
        >
          <thead class="second-thead">
            <tr>
              <th>{{  $t('File')  }}</th>
              <th>{{  $t('Name')  }}</th>
              <th>{{  $t('operation_details.header.created_at')  }}</th>
              <th>{{ $t('Description') }}</th>
              <th>{{  $t('Actions')  }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in props.form_files"
              :key="index"
              class="image-continer hover-tr flex w-full mx-4 relative"
            >
              <td class="my-2" @click="openImageModal(item.url, item.file_name)"> 
                <img :src="item.url" class="img-fluid my-5"  />
              </td>
              <td class="mb-0 name"> {{ item.file_name }}</td>
              <td>{{ item.created_at.slice(0,10) }}</td>
              <td>
                <button
                  class="form_btn"
                  v-if="!item.desc"
                  @click="
                    openModalDescription(
                      item.file_name,
                      index
                    )
                  "
                >
                  {{ $t('Add Description') }}
                </button>
                <span v-else>
                  {{ item.desc }}
                </span>
              </td>
              <!-- Delete Icon -->
              <td>
                <button class="btn red_badge" @click="deleteFile(item.id)">
                  <font-awesome-icon :icon="['fas', 'trash']" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- add description  -->
      <ModalComponent :showModal="isModalOpen" v-if="isModalOpen"
        ><FormPopUpLayoutComponent
          @closeModal="toggleModal"
          v-click-outside="toggleModal"
          :title="title"
        >
          <div class="flex flex-col">
            <div class="input flex flex-col w-full py-2 mt-1">
              <InputLableLayoutComponent
                lableFor="description"
                :text="$t('Description')"
              />
              <textarea
                id="description"
                v-model="description"
                class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
                :placeholder="$t('Add Description')"
              />
            </div>
  
            <button @click="submitForm" class="form_btn">{{ $t('Add Description') }}</button>
          </div>
        </FormPopUpLayoutComponent>
      </ModalComponent>
      <!-- show image  -->
      <ModalComponent :showModal="isImageOPen"
        ><FormPopUpLayoutComponent
          @closeModal="closeImageModal"
          :title="title"
        >
          <div class="">
              
              <img :src="itemImage" alt="" class="w-full h-full mx-auto mt-5">
          </div>
        </FormPopUpLayoutComponent>
      </ModalComponent>
    </div>
  </template>
  <script setup lang="ts">
  import { ref, defineProps, defineEmits } from "vue";
  import { useModal } from "@/composables/useModal";
  import FormPopUpLayoutComponent from "@/components/Layouts/PopUpLayoutComponent/FormPopUpLayoutComponent.vue";
  import ModalComponent from "@/components/Layouts/AppLayoutComponents/ModalComponent.vue";
  import InputLableLayoutComponent from "@/components/Layouts/InputsFromLayoutCompoennts/InputLableLayoutComponent.vue";
  import { useRoute } from "vue-router";
  const route = useRoute();

  import rfq_api from "@/services/rfq_api";
  import { ToastProps, useToast } from "vue-toast-notification";
  const $toast = useToast();
  const toastOption: ToastProps = {
    position: "top-right",
    duration: 2000,
    pauseOnHover: true,
  };
  
  
  const props = defineProps<{ 
    form_files : any[]}>();
  
  const emits = defineEmits(['upadatePQ'])
  
  const { isModalOpen, openModal, closeModal, toggleModal } = useModal();
  
  const preview_list = ref([]);
  const image_list = ref([]);
  const image = ref(null);
  const preview = ref(null);
  const description = ref("");
  const title = ref("");
  const itemIndex = ref(null);
  const itemImage = ref('');
  const isImageOPen = ref(false) ;
  const openModalDescription = (name, index) => {
      description.value='';
    openModal();
    title.value = name;
    itemIndex.value = index;
  };
  // upload images
  const uploadImages = (event) => {
    const target = event.target;
    const files = target.files;
    var input = event.target;
    var count = input.files.length;
    var index = 0;
    if (input.files) {
      while (count--) {
        var reader = new FileReader();
        reader.onload = (e) => {
          preview_list.value.push(e.target.result);
        };
        image_list.value.push(input.files[index]);
        reader.readAsDataURL(input.files[index]);
        index++;
      }
    }
    console.log(image_list.value)
  };
  
  const deleteImage = (index) => {
    preview_list.value.splice(index, 1); // Remove from preview_list
    image_list.value.splice(index, 1); // Remove from image_list
  };
  
  const submitForm = () => {
    console.log(image_list.value[itemIndex.value])
      image_list.value[itemIndex.value].description = description.value;
      closeModal()
  };
  const openImageModal = (image, name)=>{
      isImageOPen.value = true ;
      itemImage.value = image ;
      title.value=name ;
  }
  const closeImageModal = ()=>{
      isImageOPen.value=false
  }
  
  
  const saveForm = async()=>{
    try{
      const formData = new FormData();
      image_list.value.forEach((file, index) => {
        formData.append(`files[${index}][file]`, file);
        formData.append(`files[${index}][desc]`, file.description);
      });
  
      formData.append("form_id", String(+route.params.form_id));
      formData.append("operation_type", "cheque");
      formData.append("desc", description.value)
      await rfq_api.uploadFiles(formData);
      preview_list.value = [] ;
      emits('upadatePQ')
      $toast.success('File Added Successfully', toastOption);
    }catch(err){
      $toast.error(err, toastOption);
    }
  }
  const deleteFile = async(id)=>{
    try{
      await rfq_api.deleteImage(id)
      $toast.success('File Deleted Successfully', toastOption);
      emits('upadatePQ');
    }catch(err){
      $toast.error(err, toastOption);
    }
  }
  </script>
  
  <style>
  .previewed-table tr {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #ccc;
  }
  .previewed-table td,
  .previewed-table th {
    border: none !important;
    width: 20%;
    display: flex;
    justify-content: start;
    align-items: center;
  }
  .image-continer {
    width: 100%;
  }
  .previewed-table .name {
    text-overflow: ellipsis;
    width: 300px;
    overflow: hidden;
  }
  .image-continer img {
    width: 100px;
    height: 100%;
    border-radius: 10px;
  }
  .inputFile {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    right: 0;
    opacity: 0;
    cursor: pointer;
  }
  
  .indigo_badge:disabled {
    opacity: 0.4;
    cursor: not-allowed !important;
  }
  </style>
  