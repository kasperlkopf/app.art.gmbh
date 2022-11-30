// app.js

import router from '/modules/router.js';

const app = Vue.createApp({
  name: 'App',
  data() {
    return {
      //
    };
  },
  created() {
    console.log('App: created');
  },
});

app.use(router);
app.mount('#app');
