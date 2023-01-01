// Sidebar.js

const template = `
  <aside class="d-flex flex-column text-nowrap user-select-none overflow-auto position-sticky" style="top: 81px;">
    <div id="sidebar" class="offcanvas-md offcanvas-bottom">
      <div class="offcanvas-body">
        <nav class="nav flex-column nav-pills mb-auto">
          <router-link to="warehouse" class="nav-link mb-1" active-class="active">Lager</router-link>
          <router-link to="turnover" class="nav-link mb-1" active-class="active">Umsatz</router-link>
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
