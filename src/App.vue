<template>
  <div class="container">
    <h2>To-Do List</h2>
    <input
      class="form-control"
      type="text"
      v-model="searchText"
      placeholder="Search"
    />
    <hr />
    <todo-simple-form @add-todo="addTodo" />

    <div v-if="!filteredTodos.length">There is nothing to display.</div>
    <todo-list
      @toggle-todo="toggleTodo"
      @delete-todo="deleteTodo"
      :todos="filteredTodos"
    />
  </div>
</template>

<script>
import { ref, computed } from "vue";
import TodoSimpleForm from "./components/TodoSimpleForm.vue";
import TodoList from "./components/TodoList.vue";

export default {
  components: { TodoSimpleForm, TodoList },
  setup() {
    const toggle = ref(false);
    const items = [
      {
        id: 1,
        subject: "장보기",
        completed: false,
      },
      {
        id: 2,
        subject: "청소하기",
        completed: false,
      },
      {
        id: 3,
        subject: "메이플 랜드 하기",
        completed: false,
      },
      {
        id: 4,
        subject: "코딩하기",
        completed: false,
      },
      {
        id: 5,
        subject: "TV 시청",
        completed: false,
      },
    ];
    const todos = ref([...items]);

    const addTodo = (todo) => {
      todos.value.push(todo);
    };

    const toggleTodo = (index) => {
      todos.value[index].completed = !todos.value[index].completed;
    };

    const onToggle = () => {
      toggle.value = !toggle.value;
    };

    const deleteTodo = (index) => {
      todos.value.splice(index, 1);
    };

    const searchText = ref("");
    const filteredTodos = computed(() => {
      if (searchText.value) {
        return todos.value.filter((todo) =>
          todo.subject.includes(searchText.value)
        );
      }

      return todos.value;
    });

    return {
      toggle,
      todos,
      addTodo,
      toggleTodo,
      onToggle,
      deleteTodo,
      searchText,
      filteredTodos,
    };
  },
};
</script>

<style>
.todo {
  color: gray;
  text-decoration: line-through;
}
</style>
