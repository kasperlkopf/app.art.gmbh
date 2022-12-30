// Index.js

const template = `
  ...
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

    document.body.innerHTML = '';
  },
  template,
};
