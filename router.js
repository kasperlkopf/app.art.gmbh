// router.js

import store from '/store.js';

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('/components/Index.js'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/status',
      component: () => import('/components/Status.js'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/turnover',
      component: () => import('/components/Turnover.js'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/warehouse',
      component: () => import('/components/Warehouse.js'),
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/lorem-ipsum',
      component: () => import('/components/LoremIpsum.js'),
      meta: {
        requiresAuth: true,
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  store.dispatch('toggleLoading', true);

  if (to.path === '/auth') {
    localStorage.setItem('auth', true);
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
