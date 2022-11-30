// Printers.js

const template = `
  <div class="col-4 mx-auto mt-5">
    <label class="form-label">Etikettendrucker Kamil</label>
    <select v-model="selectedPrinterPath" class="form-select" :disabled="isLoading">
      <option selected disabled>Drucker auswählen...</option>
      <option value="\\\\SRVMNG\\04-Etikett-Lager1">04-Etikett-Lager1</option>
      <option value="\\\\SRVMNG\\05-Etikett-Lager">05-Etikett-Lager</option>
    </select>
  </div>
`;

export default {
  name: 'Printers',
  data() {
    return {
      isLoading: false,
      selectedPrinterPath: ''
    };
  },
  created() {
    console.log('Printers: created');

    this.getLabelPrinterPath();
  },
  watch: {
    selectedPrinterPath() {
      console.log(this.selectedPrinterPath);

      this.setLabelPrinterPath();
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
