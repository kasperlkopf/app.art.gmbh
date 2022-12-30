// app.js

import { createRouter, createWebHistory } from 'vue-router';
import { createApp } from 'vue';

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
  // document.title = to.meta.title;
});

const app = createApp({
  name: 'App',
  data() {
    return {
      //
    };
  },
  created() {
    console.log('App: created');

    this.toggleTheme();
  },
  methods: {
    toggleTheme() {
      const currentTheme = document.documentElement.getAttribute('data-bs-theme');
      const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

      const theme = currentTheme ? currentTheme === 'dark' ? 'light' : 'dark' : preferredTheme;

      document.documentElement.setAttribute('data-bs-theme', theme);
    }
  },
});

app.use(router);
app.mount('#app');