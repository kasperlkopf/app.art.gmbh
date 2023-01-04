// Sidebar.js

const template = `
  <aside id="sidebar" class="offcanvas-md offcanvas-start text-nowrap user-select-none overflow-auto position-fixed py-md-3 pe-md-3" style="width: 256px;">
    <div class="offcanvas-header">
      <h5 class="offcanvas-title">Navigation</h5>
    </div>
    <div class="offcanvas-body">
      <nav class="nav flex-column nav-pills mb-auto w-100">
        <router-link v-if="!requiresAuth || currentPath === 'status'" to="status" class="nav-link mb-1" active-class="active">Status</router-link>
        <router-link v-if="!requiresAuth || currentPath === 'turnover'" to="turnover" class="nav-link mb-1" active-class="active">Umsatz</router-link>
        <router-link v-if="!requiresAuth || currentPath === 'warehouse'" to="warehouse" class="nav-link mb-1" active-class="active">Lager</router-link>
        <router-link v-if="!requiresAuth || currentPath === 'lorem-ipsum'" to="lorem-ipsum" class="nav-link mb-1" active-class="active">Lorem ipsum</router-link>
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
    currentPath() {
      return this.$route.path.slice(1);
    },
    requiresAuth() {
      return !this.$route.meta.requiresAuth;
    },
    hasAuth() {
      return localStorage.getItem('auth', true);
    },
  },
  created() {
    console.log('Sidebar: created');
  },
  template,
};
