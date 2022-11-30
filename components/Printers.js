// Printers.js

const template = `
  <div class="row mt-5">
    <div class="col-sm-2">Drucker</div>
    <div class="col-sm-10">
    	<div class="form-check">
    	  <input v-model="selectedPrinterPath" class="form-check-input" type="radio" name="printer-radio" id="printer-radio-1" value="\\\\SRVMNG\\04-Etikett-Lager1" :disabled="isLoading">
    	  <label class="form-check-label" for="printer-radio-1">
    	    04-Etikett-Lager1
    	  </label>
    	</div>
    	<div class="form-check">
    	  <input v-model="selectedPrinterPath" class="form-check-input" type="radio" name="printer-radio" id="printer-radio-2" value="\\\\SRVMNG\\05-Etikett-Lager" :disabled="isLoading">
    	  <label class="form-check-label" for="printer-radio-2">
    	    05-Etikett-Lager
    	  </label>
    	</div>
    </div>
  </div>

  <div class="mt-5 mb-3">
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
      console.log(selectedPrinterPath);

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
