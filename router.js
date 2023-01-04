// router.js

import store from '/store.js';

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('/components/Index.js'),
    },
    {
      path: '/status',
      component: () => import('/components/Status.js'),
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
    {
      path: '/test',
      component: () => import('/components/Test.js'),
    },
  ],
});

router.beforeEach((to, from) => {
  store.dispatch('toggleLoading', true);

  comsole.log(to);
});

router.afterEach((to, from) => {
  const sidebar = document.querySelector('#sidebar');
  const offcanvas = bootstrap.Offcanvas.getOrCreateInstance(sidebar);

  offcanvas.hide();

  store.dispatch('toggleLoading', false);
});

export default router;
