// Sidebar.js

const template = `
  <div class="list-group">
    <router-link to="warehouse" class="list-group-item list-group-item-action">Warehouse</router-link>
    <router-link to="turnover" class="list-group-item list-group-item-action">Turnover</router-link>
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
