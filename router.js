// router.js

import store from '/store.js';

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes: [
    {
      path: '/status',
      name: 'Status',
      component: () => import('/pages/Status.js'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/routines',
      name: 'Routinen',
      component: () => import('/pages/Routines.js'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/turnover',
      name: 'Umsatz',
      component: () => import('/pages/Turnover.js'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/warehouse',
      name: 'Lager',
      component: () => import('/pages/Warehouse.js'),
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/lorem-ipsum',
      name: 'Lorem ipsum',
      component: () => import('/pages/LoremIpsum.js'),
      meta: {
        requiresAuth: true,
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  store.dispatch('toggleLoading', true);

  if (to.path === '/') {
    document.body.innerHTML = '';

    return false;
  }

  // auth
  if (to.meta.requiresAuth) {
    const hasAuth = store.getters.hasAuth;

    if (hasAuth) {
      next();
    } else {
      next({ path: '/status' });
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
