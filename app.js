// app.js

import router from '/router.js';

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
  created() {
    console.log('App: created');
  },
  template: `
    <Header />

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
app.mount('#app');
