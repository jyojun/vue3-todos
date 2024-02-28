import { computed } from "vue";
import { useStore } from "vuex";

export const useToast = () => {
  const store = useStore();
  const toasts = computed(() => store.state.toast.toasts);
  console.log(toasts.value);
  
  const triggerToast = (message, type = "success") => {
    store.dispatch('toast/triggerToast', { message, type });
  };

  return {
    toasts,
    triggerToast,
  };
};
