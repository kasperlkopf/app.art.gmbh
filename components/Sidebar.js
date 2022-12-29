// Sidebar.js

const template = `
  <div id="sidebar" class="col-3">
    <div class="list-group">
      <router-link to="warehouse" class="list-group-item list-group-item-action">Warehouse</router-link>
      <router-link to="turnover" class="list-group-item list-group-item-action">Turnover</router-link>
    </div>
  </div>
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
