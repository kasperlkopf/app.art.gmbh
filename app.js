// app.js

import router from '/modules/router.js';
import store from '/modules/store.js';

import SharedMethods from '/components/SharedMethods.js';
import Modal from '/components/Modal.js';

const app = Vue.createApp({
  name: 'App',
  mixins: [SharedMethods],
  components: {
    Modal,
  },
  data() {
    return {
      currentDate: this.formatDate(new Date()),
      connectionStatus: '',
    };
  },
  created() {
    console.log('App: created');
  },
  mounted() {
    console.log('App: mounted');
  },
  methods: {
    //
  },
});

app.use(router);
app.use(store);

app.mount('#app');
