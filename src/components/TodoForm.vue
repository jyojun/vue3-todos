<template>
  <div v-if="loading">Loading..</div>
  <form v-else @submit.prevent="onSave">
    <div class="row">
      <div class="col-6">
        <div class="form-group">
          <label>Todo Subject</label>
          <input v-model="todo.subject" type="text" class="form-control" />
          <div v-if="subjectError" class="text-red">{{ subjectError }}</div>
        </div>
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
  <transition name="fade">
    <toast v-if="showToast" :message="toastMessage" :type="toastAlertType" />
  </transition>
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
        const res = await axios.get(`http://localhost:3000/todos/${id}`);
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
          res = await axios.put(
            `http://localhost:3000/todos/${id}`,
            todo.value
          );
          originalTodo.value = { ...res.data };
        } else {
          res = await axios.post(`http://localhost:3000/todos`, todo.value);
          todo.value.subject = "";
          todo.value.body = "";
        }

        const message =
          "Successfully " + (props.editing ? "Updated" : "Created") + "!";
        triggerToast(message);
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

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0px);
}
</style>
