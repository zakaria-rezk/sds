// composables/useModal.js
import { ref } from "vue";
export function useModal() {
  const isModalOpen = ref<boolean>(false);
  const isEditModalOpen = ref<boolean>(false);
  const displayForm = ref<boolean>(true);
  const openModal = () => {
    isModalOpen.value = true;
  };

  const closeModal = () => {
    displayForm.value = true;
    isModalOpen.value = false;
    isEditModalOpen.value = false;
  };
  const openEditModal = () => {
    isEditModalOpen.value = true;
  };
  const closeEditModal = () => {
    isEditModalOpen.value = false;
  };
  const toggleModal = () => {
    isModalOpen.value = !isModalOpen.value;
  };

  return {
    isModalOpen,
    openModal,
    closeModal,
    toggleModal,
    displayForm,
    closeEditModal,
    isEditModalOpen,
    openEditModal,
  };
}
