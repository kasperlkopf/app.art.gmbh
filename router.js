// router.js

import store from '/store.js';

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes: [
    {
      path: '/status',
      name: 'Status',
      component: () => import('/components/Status.js'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/turnover',
      name: 'Umsatz',
      component: () => import('/components/Turnover.js'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/warehouse',
      name: 'Lager',
      component: () => import('/components/Warehouse.js'),
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/lorem-ipsum',
      name: 'Lorem ipsum',
      component: () => import('/components/LoremIpsum.js'),
      meta: {
        requiresAuth: true,
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  store.dispatch('toggleLoading', true);

  // auth
  if (to.path === '/auth') {
    localStorage.setItem('auth', true);

    next({ path: '/status' });
  }

  if (to.meta.requiresAuth) {
    const hasAuth = localStorage.getItem('auth', true);

    if (hasAuth) {
      next();
    } else {
      return false;
    }
  } else {
    next();
  }
});

router.afterEach((to, from) => {
  const sidebar = document.querySelector('#sidebar');
  const offcanvas = bootstrap.Offcanvas.getOrCreateInstance(sidebar);

  offcanvas.hide();

  store.dispatch('toggleLoading', false);
});

export default router;
