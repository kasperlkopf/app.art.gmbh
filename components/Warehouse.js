// Warehouse.js

import axios from 'axios';

const template = `
  <div class="card">
    <div class="card-body">
      <h5 class="card-title">Drucker</h5>
      <div class="row">
        <label class="col-md-6 col-form-label">Etikettendrucker Kamil</label>
        <div class="col-md-6 placeholder-wave">
          <span v-if="isLoading" class="placeholder rounded opacity-25 w-100" style="height: 38px;"></span>
          <select v-else v-model="selectedPrinterPath" class="form-select" :disabled="isLoading">
            <option value="" disabled>Drucker auswählen...</option>
            <option value="\\\\SRVMNG\\04-Etikett-Lager1">04-Etikett-Lager1</option>
            <option value="\\\\SRVMNG\\05-Etikett-Lager">05-Etikett-Lager</option>
          </select>
        </div>
      </div>
    </div>
  </div>
`;

export default {
  name: 'Warehouse',
  data() {
    return {
      isLoading: false,
      selectedPrinterPath: ''
    };
  },
  created() {
    console.log('Warehouse: created');

    this.getLabelPrinterPath();
  },
  watch: {
    selectedPrinterPath(newVal, oldVal) {
      console.log(newVal);

      if (oldVal !== '' && newVal !== '') {
        this.setLabelPrinterPath();
      }
    }
  },
  methods: {
    getLabelPrinterPath() {
      this.isLoading = true;

      axios
        .get('https://api.art.gmbh/myfactory/getLabelPrinterPath?ts=' + Date.now())
        .then((res) => {
          console.log(res);

          this.selectedPrinterPath = res.data.message[0].PrinterPath;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    setLabelPrinterPath() {
      this.isLoading = true;

      const printerPath = this.selectedPrinterPath;

      axios
        .post('https://api.art.gmbh/myfactory/setLabelPrinterPath', { printerPath })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.isLoading = false;
        });
    }
  },
  template,
};
