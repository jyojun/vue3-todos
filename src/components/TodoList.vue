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
        <button class="btn btn-danger" @click.stop="deleteTodo(index)">
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
export default {
  props: {
    todos: {
      type: Array,
      required: true,
    },
  },
  emits: ["toggle-todo", "delete-todo"],
  setup(props, { emit }) {
    const router = useRouter();
    const toggleTodo = (index, event) => {
      emit("toggle-todo", index, event.target.checked);
    };

    const deleteTodo = (index) => {
      emit("delete-todo", index);
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

    return { toggleTodo, deleteTodo, moveToPage };
  },
};
</script>

<style></style>
