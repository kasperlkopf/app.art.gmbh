// Sidebar.js

const template = `
  <aside class="d-flex flex-column text-nowrap user-select-none overflow-auto py-md-3">
    <div id="sidebar-offcanvas" class="offcanvas-md offcanvas-bottom rounded-top">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title">Navigation</h5>
      </div>
      <div class="offcanvas-body">
        <nav class="nav flex-column nav-pills mb-auto w-100">
          <router-link to="warehouse" class="nav-link mb-1" active-class="active">Lager</router-link>
          <router-link to="turnover" class="nav-link mb-1" active-class="active">Umsatz</router-link>
          <h6 class="d-flex align-items-center fw-semibold mt-4 mb-3">
            <i class="bi bi-code-slash me-2"></i> 
            Experimental
          </h6>
          <router-link to="test" class="nav-link mb-1" active-class="active">Test</router-link>
        </nav>
      </div>
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
  created() {
    console.log('Sidebar: created');
  },
  template,
};
