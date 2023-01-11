// Status.js

import StatusIcon from '../components/StatusIcon.js';

const template = `
  <div class="status">

    <!-- group -->
    <ul class="list-group mb-4">
      <li class="d-flex align-items-center list-group-item">
        <i class="bi bi-terminal-fill me-2"></i>
        <span class="fw-semibold">Netzwerk</span>
      </li>
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <span>IIS Server</span>
        <StatusIcon :status="status.network.server" />
      </li>
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <span>SQL Database</span>
        <StatusIcon :status="status.network.database" />
      </li>
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <span>Microsoft Graph</span>
        <StatusIcon :status="status.network.graph" />
      </li>
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <span>CDN</span>
        <StatusIcon :status="status.network.cdn" />
      </li>
    </ul>

    <!-- group -->
    <ul class="list-group mb-4">
      <li class="d-flex align-items-center list-group-item">
        <i class="bi bi-play-circle-fill me-2"></i>
        <span class="fw-semibold">myfactory</span>
      </li>
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <span>Lieferstapel</span>
        <StatusIcon :status="status.myfactory.shippingProposals" />
      </li>
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <span>Rechnungsstapel</span>
        <StatusIcon :status="status.myfactory.invoiceProposals" />
      </li>
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <span>Dispostapel</span>
        <StatusIcon :status="status.myfactory.purchasingProposals" />
      </li>
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <span>Zahlungsvorschläge</span>
        <StatusIcon :status="status.myfactory.paymentBatches" />
      </li>
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <span>Fertigungsaufträge</span>
        <StatusIcon :status="status.myfactory.productionOrders" />
      </li>
    </ul>

    <!-- group -->
    <ul class="list-group">
      <li class="d-flex align-items-center list-group-item">
        <i class="bi bi-box-seam me-2"></i>
        <span class="fw-semibold">Lager</span>
      </li>
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <span>Wareneingang</span>
        <StatusIcon :status="status.warehouse.receivingWarehouse" />
      </li>
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <span>Versandlager</span>
        <StatusIcon :status="status.warehouse.shippingWarehouse" />
      </li>
    </ul>

    <footer class="d-flex justify-content-end mt-2">
      <button class="btn btn-link text-decoration-none p-0" @click="loadEverything" :disabled="isLoading">
        <i class="bi bi-arrow-clockwise me-1"></i>
        <span>Neuladen</span>
      </button>
    </footer>

  </div>
`;

export default {
  name: 'Status',
  components: {
    StatusIcon,
  },
  data() {
    return {
      status: {
        network: {
          server: '',
          database: '',
          graph: '',
          cdn: '',
        },
        myfactory: {
          shippingProposals: '',
          invoiceProposals: '',
          purchasingProposals: '',
          paymentBatches: '',
          productionOrders: ''
        },
        warehouse: {
          receivingWarehouse: '',
          shippingWarehouse: '',
        },
      },
    };
  },
  computed: {
    isLoading() {
      return JSON.stringify(this.status).includes('loading');
    },
  },
  watch: {
    'status.network.database': function(newVal, oldVal) {
      if (newVal === 'error') {
        this.setMyfactoryStatus('error');
      }
    }
  },
  created() {
    console.log('Status: created');

    this.loadEverything();
  },
  mounted() {
    console.log('Status: mounted');
  },
  methods: {
    loadEverything() {
      if (this.isLoading) {
        return;
      }

      this.pingServer();
      this.pingDatabase();
      this.pingGraph();
      this.pingCDN();

      this.setMyfactoryStatus('loading');
    },
    loadMyfactory() {
      this.getShippingProposals();
      this.getInvoiceProposals();
      this.getPurchasingProposals();
      this.getPaymentBatches();
      this.getProductionOrders();

      this.getReceivingWarehouse();
      this.getShippingWarehouse();
    },
    setMyfactoryStatus(status) {
      this.status.myfactory.shippingProposals = status;
      this.status.myfactory.invoiceProposals = status;
      this.status.myfactory.purchasingProposals = status;
      this.status.myfactory.paymentBatches = status;
      this.status.myfactory.productionOrders = status;

      this.status.warehouse.receivingWarehouse = status;
      this.status.warehouse.shippingWarehouse = status;
    },
    pingServer() {
      this.status.network.server = 'loading';

      const img = new Image();

      img.onload = () => {
        clearTimeout(timer);
        this.status.network.server = 'success';
      };

      img.onerror = () => {
        clearTimeout(timer);
        this.status.network.server = 'error';
      };

      const timer = setTimeout(() => (this.status.network.server = 'error'), 7000);

      img.src = 'https://mf.artgmbh.com/ART/images/entry/img/myfactory_logo.svg?ts=' + Date.now();
    },
    pingDatabase() {
      this.status.network.database = 'loading';

      fetch('https://api.art.gmbh/status/pingDatabase?ts=' + Date.now())
        .then((res) => res.json())
        .then((data) => {
          console.log(data);

          if (data.message === 'OK') {
            this.status.network.database = 'success';
            this.loadMyfactory();
          } else {
            this.status.network.database = 'error';
          }
        })
        .catch((err) => {
          this.status.network.database = 'error';
          console.log(err);
        })
        .finally(() => {
          //
        });
    },
    pingGraph() {
      this.status.network.graph = 'loading';

      fetch('https://api.art.gmbh/status/pingGraph?ts=' + Date.now())
        .then((res) => res.json())
        .then((data) => {
          console.log(data);

          if (data.message === 'OK') {
            this.status.network.graph = 'success';
          } else {
            this.status.network.graph = 'error';
          }
        })
        .catch((err) => {
          this.status.network.graph = 'error';
          console.log(err);
        })
        .finally(() => {
          //
        });
    },
    pingCDN() {
      this.status.network.cdn = 'loading';

      fetch('https://cdn.art.gmbh/mf/ping.json?ts=' + Date.now())
        .then((res) => res.json())
        .then((data) => {
          console.log(data);

          if (data.message === 'OK') {
            this.status.network.cdn = 'success';
          } else {
            this.status.network.cdn = 'error';
          }
        })
        .catch((err) => {
          this.status.network.cdn = 'error';
          console.log(err);
        })
        .finally(() => {
          //
        });
    },
    getShippingProposals() {
      this.status.myfactory.shippingProposals = 'loading';

      fetch('https://api.art.gmbh/status/getShippingProposals?ts=' + Date.now())
        .then((res) => res.json())
        .then((data) => {
          console.log(data);

          if (!data.message.length) {
            this.status.myfactory.shippingProposals = 'success';
          } else {
            this.status.myfactory.shippingProposals = data.message.length;
          }
        })
        .catch((err) => {
          this.status.myfactory.shippingProposals = 'error';
          console.log(err);
        })
        .finally(() => {
          //
        });
    },
    getInvoiceProposals() {
      this.status.myfactory.invoiceProposals = 'loading';

      fetch('https://api.art.gmbh/status/getInvoiceProposals?ts=' + Date.now())
        .then((res) => res.json())
        .then((data) => {
          console.log(data);

          if (!data.message.length) {
            this.status.myfactory.invoiceProposals = 'success';
          } else {
            this.status.myfactory.invoiceProposals = data.message.length;
          }
        })
        .catch((err) => {
          this.status.myfactory.invoiceProposals = 'error';
          console.log(err);
        })
        .finally(() => {
          //
        });
    },
    getPurchasingProposals() {
      this.status.myfactory.purchasingProposals = 'loading';

      fetch('https://api.art.gmbh/status/getPurchasingProposals?ts=' + Date.now())
        .then((res) => res.json())
        .then((data) => {
          console.log(data);

          if (!data.message.length) {
            this.status.myfactory.purchasingProposals = 'success';
          } else {
            this.status.myfactory.purchasingProposals = data.message.length;
          }
        })
        .catch((err) => {
          this.status.myfactory.purchasingProposals = 'error';
          console.log(err);
        })
        .finally(() => {
          //
        });
    },
    getPaymentBatches() {
      this.status.myfactory.paymentBatches = 'loading';

      fetch('https://api.art.gmbh/status/getPaymentBatches?ts=' + Date.now())
        .then((res) => res.json())
        .then((data) => {
          console.log(data);

          if (!data.message.length) {
            this.status.myfactory.paymentBatches = 'success';
          } else {
            this.status.myfactory.paymentBatches = data.message.length;
          }
        })
        .catch((err) => {
          this.status.myfactory.paymentBatches = 'error';
          console.log(err);
        })
        .finally(() => {
          //
        });
    },
    getProductionOrders() {
      this.status.myfactory.productionOrders = 'loading';

      fetch('https://api.art.gmbh/status/getProductionOrders?ts=' + Date.now())
        .then((res) => res.json())
        .then((data) => {
          console.log('----------------------------');
          console.log(data);

          if (!data.message.length) {
            this.status.myfactory.productionOrders = 'success';
          } else {
            this.status.myfactory.productionOrders = data.message.length;
          }
        })
        .catch((err) => {
          this.status.myfactory.productionOrders = 'error';
          console.log(err);
        })
        .finally(() => {
          //
        });
    },
    getReceivingWarehouse() {
      this.status.warehouse.receivingWarehouse = 'loading';

      fetch('https://api.art.gmbh/status/getReceivingWarehouse?ts=' + Date.now())
        .then((res) => res.json())
        .then((data) => {
          console.log(data);

          if (!data.message.length) {
            this.status.warehouse.receivingWarehouse = 'success';
          } else {
            this.status.warehouse.receivingWarehouse = data.message.length;
          }
        })
        .catch((err) => {
          this.status.warehouse.receivingWarehouse = 'error';
          console.log(err);
        })
        .finally(() => {
          //
        });
    },
    getShippingWarehouse() {
      this.status.warehouse.shippingWarehouse = 'loading';

      fetch('https://api.art.gmbh/status/getShippingWarehouse?ts=' + Date.now())
        .then((res) => res.json())
        .then((data) => {
          console.log(data);

          if (!data.message.length) {
            this.status.warehouse.shippingWarehouse = 'success';
          } else {
            this.status.warehouse.shippingWarehouse = data.message.length;
          }
        })
        .catch((err) => {
          this.status.warehouse.shippingWarehouse = 'error';
          console.log(err);
        })
        .finally(() => {
          //
        });
    },
  },
  template,
};
