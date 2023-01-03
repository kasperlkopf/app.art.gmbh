// Warehouse.js

const template = `
  <div class="card">
    <div class="card-body">
      <h5 class="card-title">Drucker</h5>
      <div class="row">
        <label class="col-md-6 col-form-label">Etikettendrucker Kamil</label>
        <div class="col-md-6 placeholder-glow">
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
      selectedPrinterPath: '',
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
    },
  },
  methods: {
    getLabelPrinterPath() {
      this.isLoading = true;

      fetch('https://api.art.gmbh/myfactory/getLabelPrinterPath?ts=' + Date.now())
        .then((res) => res.json())
        .then((data) => {
          console.log(data);

          this.selectedPrinterPath = data.message[0].PrinterPath;
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

      const payload = {
        printerPath: this.selectedPrinterPath,
      };

      fetch('https://api.art.gmbh/myfactory/setLabelPrinterPath', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
  template,
};
