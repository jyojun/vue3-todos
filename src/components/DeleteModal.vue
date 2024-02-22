<template>
  <modal>
    <template v-slot:title> Delete Todo! </template>
    <template v-slot:body> Are you sure you want to delete this? </template>
    <template v-slot:footer>
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
  </modal>
</template>

<script>
import Modal from "@/components/Modal.vue";
export default {
  components: { Modal },
  emits: ["close-modal", "delete-todo"],
  setup(props, { emit }) {
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
