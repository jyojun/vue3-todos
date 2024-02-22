<template>
  <div v-for="(todo, index) in todos" :key="todo.id" class="card mt-2">
    <div
      class="card-body p-3 d-flex justify-content-between align-items-center"
      style="cursor: pointer"
      @click="moveToPage(todo.id)"
    >
      <div>
        <input
          style="margin-right: 5px"
          type="checkbox"
          :checked="todo.completed"
          @change="toggleTodo(index, $event)"
          @click.stop
        />
        <span :class="{ todo: todo.completed }">{{ todo.subject }}</span>
      </div>
      <div>
        <button class="btn btn-danger" @click.stop="openModal(todo.id)">
          Delete
        </button>
      </div>
    </div>
  </div>
  <Teleport to="#modal"
    ><modal
      v-if="showModal"
      @close-modal="closeModal"
      @delete-todo="deleteTodo"
    />
  </Teleport>
</template>

<script>
import { useRouter } from "vue-router";
import { ref } from "vue";
import Modal from "@/components/DeleteModal.vue";
export default {
  components: { Modal },
  props: {
    todos: {
      type: Array,
      required: true,
    },
  },
  emits: ["toggle-todo", "delete-todo"],
  setup(props, { emit }) {
    const router = useRouter();
    const showModal = ref(false);
    const todoDeleteId = ref(null);
    const toggleTodo = (index, event) => {
      emit("toggle-todo", index, event.target.checked);
    };

    const deleteTodo = () => {
      emit("delete-todo", todoDeleteId.value);
      closeModal();
    };

    const moveToPage = (id) => {
      //   router.push("/todos/" + id);
      router.push({
        name: "Todo",
        params: {
          id,
        },
      });
    };

    const openModal = (id) => {
      todoDeleteId.value = id;
      showModal.value = true;
    };

    const closeModal = () => {
      todoDeleteId.value = null;
      showModal.value = false;
    };

    return {
      toggleTodo,
      deleteTodo,
      moveToPage,
      showModal,
      openModal,
      closeModal,
    };
  },
};
</script>

<style></style>
