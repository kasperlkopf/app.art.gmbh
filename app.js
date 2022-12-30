// app.js

import { createRouter, createWebHistory } from 'https://unpkg.com/vue-router@4/dist/vue-router.esm-browser.js';
import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

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