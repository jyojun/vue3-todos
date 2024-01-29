<template>
  <h1>To-Do Page</h1>
  <div v-if="loading">Loading..</div>
  <form v-else @submit.prevent="onSave">
    <div class="row">
      <div class="col-6">
        <div class="form-group">
          <label>Todo Subject</label>
          <input v-model="todo.subject" type="text" class="form-control" />
        </div>
      </div>
      <div class="col-6">
        <div class="form-group">
          <label>Status</label>
          <div>
            <button
              type="button"
              @click="toggleTodoStatus"
              class="btn"
              :class="todo.completed ? 'btn-success' : 'btn-danger'"
            >
              {{ todo.completed ? "Complete" : "Incomplete" }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <button type="submit" class="btn btn-primary" :disabled="!todoUpdated">
      Save
    </button>
    <button class="btn btn-outline-dark m-2" @click="moveBack">Cancel</button>
  </form>
  <toast v-if="showToast" :message="toastMessage" :type="toastAlertType" />
  <div id="kossie"></div>
</template>

<script>
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { ref, computed } from "vue";
import _ from "lodash";
import Toast from "@/components/Toast.vue";
import { useToast } from "@/composables/toast";

export default {
  components: {
    Toast,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const todo = ref(null);
    const originalTodo = ref(null);
    const loading = ref(true);
    const id = route.params.id;

    const { toastMessage, toastAlertType, showToast, triggerToast } =
      useToast();

    const todoUpdated = computed(() => {
      return !_.isEqual(todo.value, originalTodo.value);
    });

    const getTodo = async () => {
      loading.value = true;
      try {
        const res = await axios.get(`http://localhost:3000/todos/${id}`);
        todo.value = { ...res.data };
        originalTodo.value = { ...res.data };
        loading.value = false;
      } catch (err) {
        console.log(err);
        triggerToast("Something went wrong.", "danger");
      }
    };

    const toggleTodoStatus = () => {
      todo.value.completed = !todo.value.completed;
    };

    const moveBack = () => {
      router.push({
        name: "Todos",
      });
    };

    const onSave = async () => {
      try {
        const res = await axios.put(
          `http://localhost:3000/todos/${id}`,
          todo.value
        );

        getTodo();
        triggerToast("Successfully saved!");
      } catch (err) {
        console.log(err);
        triggerToast("Something went wrong.", "danger");
      }
    };

    getTodo();

    return {
      todo,
      loading,
      todoUpdated,
      toggleTodoStatus,
      moveBack,
      onSave,
      showToast,
      toastMessage,
      toastAlertType,
    };
  },
};
</script>

<style></style>
