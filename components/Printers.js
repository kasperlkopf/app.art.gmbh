// Printers.js

const template = `
  <div class="row">
    <label for="printer" class="col-sm-2 col-form-label">Drucker</label>
    <div class="col-sm-10">
    	<div class="form-check">
    	  <input v-model="selectedPrinterPath" class="form-check-input" type="radio" name="printer-radio" id="printer-radio-1" value="\\\\SRVMNG\\04-Etikett-Lager1">
    	  <label class="form-check-label" for="printer-radio-1">
    	    04-Etikett-Lager1
    	  </label>
    	</div>
    	<div class="form-check">
    	  <input v-model="selectedPrinterPath" class="form-check-input" type="radio" name="printer-radio" id="printer-radio-2" value="\\\\SRVMNG\\05-Etikett-Lager">
    	  <label class="form-check-label" for="printer-radio-1">
    	    05-Etikett-Lager
    	  </label>
    	</div>
    </div>
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

    // this.getLabelPrinterPath();
  },
  watch: {
    selectedPrinterPath() {
      // this.setLabelPrinterPath();
    }
  },
  methods: {
    getLabelPrinterPath() {
      this.isLoading = true;

      window.axios
        .get('/myfactory/getLabelPrinterPath?ts=' + Date.now())
        .then((res) => {
          console.log(res);
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
        .get('/myfactory/setLabelPrinterPath', { printerPath })
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
