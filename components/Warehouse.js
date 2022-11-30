// Warehouse.js

const template = `
  <div class="col-12 col-sm-6 col-lg-4 mx-auto mt-5">
    <label class="form-label">Etikettendrucker Kamil</label>
    <select v-model="selectedPrinterPath" class="form-select" :disabled="isLoading">
      <option value="" disabled>Drucker auswählen...</option>
      <option value="\\\\SRVMNG\\04-Etikett-Lager1">04-Etikett-Lager1</option>
      <option value="\\\\SRVMNG\\05-Etikett-Lager">05-Etikett-Lager</option>
    </select>
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

      window.axios
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

      window.axios
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
