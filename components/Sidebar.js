// Sidebar.js

const template = `
  <aside id="sidebar" class="offcanvas-md offcanvas-start text-nowrap user-select-none overflow-auto position-fixed py-md-3 pe-md-3" style="width: 256px;">
    <div class="offcanvas-header">
      <h5 class="offcanvas-title">Navigation</h5>
    </div>
    <div class="offcanvas-body">
      <nav class="nav flex-column nav-pills mb-auto w-100">
        <router-link v-for="route in availableRoutes" :to="route.path" class="nav-link mb-1" active-class="active">{{ route.name }}</router-link>
      </nav>
    </div>
  </aside>
`;

export default {
  name: 'Sidebar',
  data() {
    return {
      //
    };
  },
  computed: {
    availableRoutes() {
      const routes = this.$router.getRoutes();
      const namedRoutes = routes.filter((el) => el.name);

      return this.hasAuth ? namedRoutes : namedRoutes.filter((el) => !el.meta.requiresAuth);
    },
    hasAuth() {
      return this.$store.getters.hasAuth;
    },
  },
  created() {
    console.log('Sidebar: created');
  },
  template,
};
