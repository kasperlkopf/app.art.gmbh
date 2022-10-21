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

    this.connectionStatus = 'connecting';

    window.axios
      .get('https://api.art.gmbh/status/ping-database?' + Date.now())
      .then((res) => {
        console.log(res);

        if (res.data.message === 'OK') {
          this.connectionStatus = 'success';
        } else {
          this.connectionStatus = 'error';
        }
      })
      .catch((err) => {
        this.connectionStatus = 'error';
        console.log(err);
      })
      .finally(() => {
        //
      });
  },
  methods: {
    //
  },
});

// use
app.use(router);
app.use(store);

app.mount('#app');
