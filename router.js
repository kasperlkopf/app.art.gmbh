// router.js

import store from '/store.js';

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('/components/Index.js'),
      meta: {
        isRestricted: false,
      },
    },
    {
      path: '/status',
      component: () => import('/components/Status.js'),
      meta: {
        isRestricted: false,
      },
    },
    {
      path: '/lieferprobleme',
      component: () => import('/components/DeliveryProblems.js'),
      meta: {
        isRestricted: false,
      },
    },
    {
      path: '/warehouse',
      component: () => import('/components/Warehouse.js'),
      meta: {
        isRestricted: true,
      },
    },
    {
      path: '/turnover',
      component: () => import('/components/Turnover.js'),
      meta: {
        isRestricted: false,
      },
    },
    {
      path: '/test',
      component: () => import('/components/Test.js'),
      meta: {
        isRestricted: false,
      },
    },
  ],
});

router.beforeEach((to, from) => {
  store.dispatch('toggleLoading', true);
});

router.afterEach((to, from) => {
  const sidebar = document.querySelector('#sidebar');
  const offcanvas = bootstrap.Offcanvas.getOrCreateInstance(sidebar);

  offcanvas.hide();

  store.dispatch('toggleLoading', false);
});

export default router;
