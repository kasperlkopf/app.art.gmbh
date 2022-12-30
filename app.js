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

    this.setTheme();
  },
  methods: {
    setTheme(t) {
      const theme = t ? t : this.getPreferredTheme();

      localStorage.setItem('theme', theme);
      document.documentElement.setAttribute('data-bs-theme', theme);
    },
    getPreferredTheme() {
      const storedTheme = localStorage.getItem('theme');

      if (storedTheme) {
        return storedTheme;
      }

      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    },
    toggleTheme() {
      const currentTheme = document.documentElement.getAttribute('data-bs-theme');
      const theme = currentTheme ? currentTheme === 'dark' ? 'light' : 'dark' : this.getPreferredTheme();

      this.setTheme(theme);
    }
  },
});

app.use(router);
app.mount('#app');