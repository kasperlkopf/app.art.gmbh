// Index.js

const template = `
  <router-link to="warehouse">Warehouse</router-link>
`;

export default {
  name: 'Index',
  data() {
    return {
      //
    };
  },
  created() {
    console.log('Index: created');
  },
  template,
};
