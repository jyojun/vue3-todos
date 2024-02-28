<template>
  <NavBar />
  <div class="container">
    <router-view />
  </div>
  <Toast :message="'hello'" :type="'success'" />
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import Toast from "@/components/Toast.vue";
export default {
  components: { NavBar, Toast },
};
</script>

<style scoped></style>
