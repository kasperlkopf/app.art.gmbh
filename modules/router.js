// router.js

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/lieferprobleme',
    },
    {
      path: '/lieferprobleme',
      component: () => import('/DeliveryProblems.js'),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
  },
});

router.beforeEach((to, from) => {
  // document.title = to.meta.title;
});

export default router;
