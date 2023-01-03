// app.js

import router from '/router.js';
import store from '/store.js';

import Header from '/components/Header.js';
import Sidebar from '/components/Sidebar.js';

const app = Vue.createApp({
  name: 'App',
  components: {
    Header,
    Sidebar,
  },
  data() {
    return {
      //
    };
  },
  computed: {
    isLoading() {
      return this.$store.state.isLoading;
    },
  },
  created() {
    console.log('App: created');
  },
  template: `
    <Header />

    <div class="container-xxl">
      <Sidebar />

      <main class="py-3">
        <!-- loading -->
        <div v-if="isLoading" class="d-flex justify-content-center py-3">
          <div class="spinner-border text-primary" role="status"></div>
        </div>

        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
      </main>
    </div>
  `,
});

app.use(router);
app.use(store);

app.mount('#app');
