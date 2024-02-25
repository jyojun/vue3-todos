<template>
  <Modal>
    <template #title> Delete Todo! </template>
    <template #body> Are you sure you want to delete this? </template>
    <template #footer>
      <button
        type="button"
        @click="closeModal"
        class="btn btn-secondary"
        data-dismiss="modal"
      >
        Close
      </button>
      <button type="button" @click="onDelete" class="btn btn-danger">
        Delete
      </button>
    </template>
  </Modal>
</template>

<script>
import Modal from "@/components/Modal.vue";
import { getCurrentInstance } from "vue";
export default {
  components: { Modal },
  emits: ["close-modal", "delete-todo"],
  setup() {
    const { emit } = getCurrentInstance();
    const closeModal = () => {
      emit("close-modal");
    };

    const onDelete = () => {
      emit("delete-todo");
    };

    return { closeModal, onDelete };
  },
};
</script>

<style></style>
