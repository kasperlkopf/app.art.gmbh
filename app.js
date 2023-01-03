// app.js

import router from '/router.js';
import store from '/store.js';

import Header from '/components/Header.js';
import ProgressBar from '/components/ProgressBar.js';
import Sidebar from '/components/Sidebar.js';

const app = Vue.createApp({
  name: 'App',
  components: {
    Header,
    ProgressBar,
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

    <!-- loading -->
    <ProgressBar v-if="isLoading || hasError" :error="hasError" class="position-relative mb-3" />

    <div class="container-xxl">
      <Sidebar />

      <main class="py-3">
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
