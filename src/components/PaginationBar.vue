<template>
  <nav aria-label="Page navigation example">
    <ul class="pagination">
      <li v-if="currentPage !== 1" class="page-item">
        <a
          style="cursor: pointer"
          class="page-link"
          @click="getTodos(currentPage - 1)"
          >Previous</a
        >
      </li>
      <li
        v-for="page in numberOfPages"
        :key="page"
        class="page-item"
        :class="currentPage === page ? 'active' : ''"
      >
        <a style="cursor: pointer" class="page-link" @click="getTodos(page)">{{
          page
        }}</a>
      </li>
      <li v-if="currentPage !== numberOfPages" class="page-item">
        <a
          style="cursor: pointer"
          class="page-link"
          @click="getTodos(currentPage + 1)"
          >Next</a
        >
      </li>
    </ul>
  </nav>
</template>

<script>
import { getCurrentInstance } from "vue";
export default {
  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    numberOfPages: {
      type: Number,
      required: true,
    },
  },
  setup() {
    const { emit } = getCurrentInstance();
    const getTodos = (page) => {
      emit("get-todo", page);
    };

    return { getTodos };
  },
};
</script>

<style></style>
