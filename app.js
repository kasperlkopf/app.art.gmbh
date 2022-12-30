// app.js

const { createRouter, createWebHistory } = VueRouter;
const { createApp } = Vue;

const router = createRouter({
  history: createWebHistory(),
  routes: [
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
  data() {
    return {
      //
    };
  },
  created() {
    console.log('App: created');

    /*
    const auth = localStorage.getItem('auth');

    if (!auth) {
      const pw = prompt('Passwort');

      if (btoa(pw) === 'a29tYmlzY2hyYXViZW4=') {
        localStorage.setItem('isAuthenticated', true)
      } else {
        document.body.innerHTML = '';
      }
    }
    */

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