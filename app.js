// app.js

import Sidebar from '/components/Sidebar.js';

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
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
  // document.title = to.meta.title;
});

const app = Vue.createApp({
  name: 'App',
  components: {
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
});

app.use(router);
app.mount('#app');

// theme
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  // document.documentElement.setAttribute('data-bs-theme', 'dark');
}
