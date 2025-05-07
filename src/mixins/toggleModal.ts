export const modalMixin = {
  data() {
    return {
      showModal: false,
      isEditModalOpen: false,
    };
  },
  methods: {
    toggleModal() {
      this.showModal = true;
    },
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.formInputs = true;
      this.showModal = false;
      this.isEditModalOpen = false;
    },
    openEditModal() {
      this.isEditModalOpen = true;
    },
    closeEditModal() {
      this.isEditModalOpen = false;
    },
  },
};
