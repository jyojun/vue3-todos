<template>
  <List :items="todos">
    <template #default="{ item, index }">
      <div
        class="card-body p-3 d-flex justify-content-between align-items-center"
        style="cursor: pointer"
        @click="moveToPage(item.id)"
      >
        <div>
          <input
            style="margin-right: 5px"
            type="checkbox"
            :checked="item.completed"
            @change="toggleTodo(index, $event)"
            @click.stop
          />
          <span :class="{ todo: item.completed }">{{ item.subject }}</span>
        </div>
        <div>
          <button class="btn btn-danger" @click.stop="openModal(item.id)">
            Delete
          </button>
        </div>
      </div>
    </template>
  </List>
  <Teleport to="#modal"
    ><Modal
      v-if="showModal"
      @close-modal="closeModal"
      @delete-todo="deleteTodo"
    />
  </Teleport>
</template>

<script>
import { useRouter } from "vue-router";
import { ref, getCurrentInstance } from "vue";
import Modal from "@/components/DeleteModal.vue";
import List from "@/components/List.vue";
export default {
  components: { Modal, List },
  props: {
    todos: {
      type: Array,
      required: true,
    },
  },
  emits: ["toggle-todo", "delete-todo"],
  setup() {
    const { emit } = getCurrentInstance();
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
