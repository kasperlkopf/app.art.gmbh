// app.js

import Header from '/components/Header.js';
import Sidebar from '/components/Sidebar.js';

const { createRouter, createWebHistory } = VueRouter;
const { createApp } = Vue;

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('/components/Index.js'),
    },
    {
      path: '/status',
      component: () => import('/components/Status.js'),
    },
    {
      path: '/lieferprobleme',
      component: () => import('/components/DeliveryProblems.js'),
    },
    {
      path: '/warehouse',
      component: () => import('/components/Warehouse.js'),
    },
    {
      path: '/turnover',
      component: () => import('/components/Turnover.js'),
    },
    {
      path: '/test',
      component: () => import('/components/Test.js'),
    },
  ],
});

router.beforeEach((to, from) => {
  //
});

router.afterEach((to, from) => {
  const sidebar = document.querySelector('#sidebar');
  const offcanvas = bootstrap.Offcanvas.getOrCreateInstance(sidebar);

  offcanvas.hide();
});

const app = createApp({
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
