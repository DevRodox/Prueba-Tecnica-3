<template>
  <div>
    <Navbar v-if="isLoggedIn && sessionReady" />
    <main class="pt-16">
      <router-view v-if="sessionReady" />
    </main>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import Navbar from '@/components/layout/Navbar.vue';

export default {
  name: 'App',
  components: { Navbar },
  setup() {
    const store = useStore();
    const isLoggedIn = computed(() => store.getters['auth/isLoggedIn']);
    const sessionReady = ref(false);

    onMounted(async () => {
      await store.dispatch('auth/restoreSession');
      sessionReady.value = true;
    });

    return {
      isLoggedIn,
      sessionReady,
    };
  },
};
</script>

<style>
body {
  font-family: 'Inter', sans-serif;
  background-color: #f8f9fa;
  margin: 0;
}
</style>
