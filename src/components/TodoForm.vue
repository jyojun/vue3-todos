<template>
  <div v-if="loading">Loading..</div>
  <form v-else @submit.prevent="onSave">
    <div class="row">
      <div class="col-6">
        <Input
          label="Subject"
          v-model:subject="todo.subject"
          :error="subjectError"
        />
      </div>
      <div v-if="editing" class="col-6">
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
      <div class="col-12">
        <div class="form-group">
          <label>Body</label>
          <textarea
            v-model="todo.body"
            class="form-control"
            cols="30"
            rows="10"
          ></textarea>
        </div>
      </div>
    </div>
    <button type="submit" class="btn btn-primary" :disabled="!todoUpdated">
      {{ editing ? "Update" : "Create" }}
    </button>
    <button class="btn btn-outline-dark m-2" @click="moveBack">Cancel</button>
  </form>
</template>

<script>
import { useRoute, useRouter } from "vue-router";
import axios from "@/axios";
import { ref, computed } from "vue";
import _ from "lodash";
import { useToast } from "@/composables/toast";
import Input from "@/components/Input.vue";
export default {
  components: {
    Input,
  },
  props: {
    editing: {
      type: Boolean,
      default: false,
      body: "",
    },
  },
  setup(props) {
    const route = useRoute();
    const router = useRouter();
    const todo = ref({
      subject: "",
      completed: false,
    });
    const subjectError = ref("");
    const originalTodo = ref(null);
    const loading = ref(false);
    const id = route.params.id;

    const { toastMessage, toastAlertType, showToast, triggerToast } =
      useToast();

    const todoUpdated = computed(() => {
      return !_.isEqual(todo.value, originalTodo.value);
    });

    const getTodo = async () => {
      loading.value = true;
      try {
        const res = await axios.get(`todos/${id}`);
        todo.value = { ...res.data };
        originalTodo.value = { ...res.data };
        loading.value = false;
      } catch (err) {
        loading.value = false;
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

    if (props.editing) {
      getTodo();
    }

    const onSave = async () => {
      subjectError.value = "";
      if (!todo.value.subject) {
        subjectError.value = "Subject is required";
        return;
      }
      try {
        let res;
        console.log(props.editing);
        if (props.editing) {
          res = await axios.put(`todos/${id}`, todo.value);
          originalTodo.value = { ...res.data };
        } else {
          res = await axios.post(`todos`, todo.value);
          todo.value.subject = "";
          todo.value.body = "";
        }

        const message =
          "Successfully " + (props.editing ? "Updated" : "Created") + "!";
        triggerToast(message);

        if (!props.editing) {
          router.push({
            name: "Todos",
          });
        }
      } catch (err) {
        console.log(err);
        triggerToast("Something went wrong.", "danger");
      }
    };

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
      subjectError,
    };
  },
};
</script>

<style scoped>
.text-red {
  color: red;
}
</style>
