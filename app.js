// app.js

import Header from '/components/Header.js';
import Sidebar from '/components/Sidebar.js';
import Main from '/components/Main.js';

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
  ],
});

router.beforeEach((to, from) => {
  //
});

const app = createApp({
  name: 'App',
  components: {
    Header,
    Sidebar,
    Main,
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

    <div class="container-xxl mt-3">
      <div class="row">
        <div class="col" style="flex: 0 0 256px;">
          <Sidebar />
        </div>
        <div class="col">
          <Main />
        </div>
      </div>
    </div>
  `,
});

app.use(router);
app.mount('#app');
