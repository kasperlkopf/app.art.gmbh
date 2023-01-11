// Log.js

const template = `
  <div class="log text-break">

    <!-- loading -->
    <div v-if="isLoading" class="progress-bar-custom position-relative mb-3">
      <div class="indeterminate bg-primary"></div>
    </div>

    <div v-if="isLoading" class="placeholder-glow">
      <span v-for="i in 10" :key="i" class="placeholder rounded opacity-25 w-100"></span>
    </div>

    <div v-for="item, index in logEntries" :key="index" class="font-monospace">
      {{ item }}
    </div>

  </div>
`;

export default {
  name: 'Log',
  data() {
    return {
      isLoading: false,
      interval: null,
      logEntries: [],
    };
  },
  created() {
    console.log('Log: created');

    this.isLoading = true;
  },
  activated() {
    console.log('Log: activated');

    this.interval = setInterval(() => this.getLog(), 2000);
  },
  deactivated() {
    console.log('Log: deactivated');

    clearInterval(this.interval);
  },
  methods: {
    getLog() {
      fetch('https://api.art.gmbh/log/getLog?ts=' + Date.now())
        .then((res) => res.json())
        .then((data) => {
          console.log(data);

          this.logEntries = data.message;
        })
        .catch((e) => {
          console.error(e);

          if (response.data.message && response.data.message.length) {
            this.logEntries = response.data.message;
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
  template,
};
