// Sidebar.js

const template = `
  <aside id="sidebar" class="offcanvas-md offcanvas-start text-nowrap user-select-none overflow-auto position-fixed py-md-3 pe-md-3" style="width: 256px;">
    <div class="offcanvas-header">
      <h5 class="offcanvas-title">Navigation</h5>
    </div>
    <div class="offcanvas-body">
      <nav class="nav flex-column nav-pills mb-auto w-100">
        <router-link v-if="isAllowed || currentPath === 'warehouse'"" to="warehouse" class="nav-link mb-1" active-class="active">Lager</router-link>
        <router-link v-if="isAllowed || currentPath === 'turnover'" to="turnover" class="nav-link mb-1" active-class="active">Umsatz</router-link>
        <h6 class="d-none align-items-center fw-semibold mt-4 mb-3">
          <i class="bi bi-code-slash me-2"></i> 
          Experimental
        </h6>
        <router-link v-if="isAllowed || currentPath === 'test'" to="test" class="nav-link mb-1" active-class="active">Test</router-link>
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
    isAllowed() {
      return !this.$route.meta.isRestricted;
    },
  },
  created() {
    console.log('Sidebar: created');
  },
  template,
};
