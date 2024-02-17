<template>
  <div>
    <div class="d-flex justify-content-between mb-3">
      <h2>To-Do List</h2>
      <button class="btn btn-primary" @click="moveToCreatePage">
        Create Todo
      </button>
    </div>
    <input
      class="form-control"
      type="text"
      v-model="searchText"
      placeholder="Search"
      @keyup.enter="searchTodo"
    />
    <hr />
    <todo-simple-form @add-todo="addTodo" />

    <div v-if="!todos.length">There is nothing to display.</div>
    <todo-list
      @toggle-todo="toggleTodo"
      @delete-todo="deleteTodo"
      :todos="todos"
    />
    <hr />
    <pagination-bar
      @get-todo="getTodos"
      :currentPage="currentPage"
      :numberOfPages="numberOfPages"
    />
  </div>
  <toast v-if="showToast" :message="toastMessage" :type="toastAlertType" />
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
import TodoSimpleForm from "@/components/TodoSimpleForm.vue";
import TodoList from "@/components/TodoList.vue";
import PaginationBar from "@/components/PaginationBar.vue";
import Toast from "@/components/Toast.vue";
import axios from "axios";
import { useToast } from "@/composables/toast";
import { useRouter } from "vue-router";

export default {
  components: { TodoSimpleForm, TodoList, PaginationBar, Toast },
  setup() {
    const toggle = ref(false);
    const numberOfTodos = ref(0);
    const limit = 5;
    const currentPage = ref(1);
    const todos = ref([]);
    const searchText = ref("");
    const router = useRouter();

    const { toastMessage, toastAlertType, showToast, triggerToast } =
      useToast();

    const numberOfPages = computed(() => {
      return Math.ceil(numberOfTodos.value / limit);
    });

    // on mounted
    onMounted(() => {
      getTodos();
    });

    const moveToCreatePage = () => {
      router.push({
        name: "TodoCreate",
      });
    };

    // debounce 적용
    let timeout = null;
    watch(searchText, () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => getTodos(1), 2000); // 검색 delay 추가
    });

    // methods
    const getTodos = async (page = currentPage.value) => {
      currentPage.value = page;
      try {
        const res = await axios.get(
          `http://localhost:3000/todos?_sort=id&_order=desc&subject_like=${searchText.value}&_page=${page}&_limit=${limit}`
        );
        numberOfTodos.value = res.headers["x-total-count"];
        todos.value = res.data;
      } catch (err) {
        console.log(err);
        triggerToast("Something went wrong,", "danger");
      }
    };

    const searchTodo = () => {
      clearTimeout(timeout);
      getTodos(1);
    };

    const addTodo = async (todo) => {
      // json db fetch
      error.value = "";
      try {
        await axios.post("http://localhost:3000/todos", {
          subject: todo.subject,
          completed: todo.completed,
        });
        getTodos(1);
      } catch (err) {
        console.log(err);
        triggerToast("Something went wrong,", "danger");
      }
    };

    const toggleTodo = async (index, checked) => {
      const id = todos.value[index].id;
      try {
        await axios.patch(`http://localhost:3000/todos/${id}`, {
          completed: checked,
        });
        todos.value[index].completed = checked;
      } catch (err) {
        console.log(err);
        triggerToast("Something went wrong,", "danger");
      }
    };

    const onToggle = () => {
      toggle.value = !toggle.value;
    };

    const deleteTodo = async (index) => {
      const id = todos.value[index].id;
      try {
        await axios.delete(`http://localhost:3000/todos/${id}`);
        getTodos(1);
      } catch (err) {
        console.log(err);
        triggerToast("Something went wrong,", "danger");
      }
    };

    return {
      todos,
      addTodo,
      searchTodo,
      toggleTodo,
      onToggle,
      deleteTodo,
      searchText,
      getTodos,
      numberOfPages,
      currentPage,
      showToast,
      toastMessage,
      toastAlertType,
      moveToCreatePage,
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
