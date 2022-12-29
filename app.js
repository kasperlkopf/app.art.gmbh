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
  computed: {
    currentTheme() {
      return document.documentElement.getAttribute('data-bs-theme');
    }
  },
  methods: {
    toggleTheme() {
      const theme = this.currentTheme === 'dark' ? 'light' : 'dark';

      console.log(this.currentTheme);

      // const theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

      document.documentElement.setAttribute('data-bs-theme', theme);
    }
  },
});

app.use(router);
app.mount('#app');

// theme
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.documentElement.setAttribute('data-bs-theme', 'dark');
}
