// router.js

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes: [
    {
      path: '/lieferprobleme',
      component: () => import('/DeliveryProblems.js'),
    },
    {
      path: '/printers',
      component: () => import('/components/Printers.js'),
    },
  ],
});

router.beforeEach((to, from) => {
  // document.title = to.meta.title;
});

export default router;
