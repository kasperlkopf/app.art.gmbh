// SeaFreight.js

import SharedMethods from '/components/SharedMethods.js';
import CopyButton from '/components/CopyButton.js';

const template = `
  <div class="pt-4 pb-5 px-5 mx-auto col-12 col-xl-8">
    <!-- tab nav -->
    <div class="d-flex mb-4 justify-content-center">
      <div class="btn-group">
        <input type="radio" class="btn-check" value="delivery-time" id="tab-delivery-time" v-model="selectedTab" autocomplete="off" />
        <label class="btn btn-outline-primary" for="tab-delivery-time">Transportzeit</label>

        <input type="radio" class="btn-check" value="freight-charges" id="tab-freight-charges" v-model="selectedTab" autocomplete="off" />
        <label class="btn btn-outline-primary" for="tab-freight-charges">Frachtkosten</label>
      </div>
    </div>

    <!-- tab #1 -->
    <div v-show="selectedTab === 'delivery-time'">
      <!-- Lieferant -->
      <div class="pb-4 mb-4 border-bottom">
        <header class="d-flex mb-3">
          <h5 class="display-6 fs-5">Lieferant</h5>

          <!-- Mode -->
          <div class="d-flex justify-content-end ms-auto">
            <a href="#" class="me-3 link-danger text-decoration-none" @click.prevent="resetDeliveryTime" v-if="hasChangesDeliveryTime">
              <i class="bi bi-arrow-counterclockwise me-2"></i>
              <span>Reset</span>
            </a>
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" v-model="deliveryTimeAdvancedMode" role="switch" id="delivery-time-advanced-mode-switch" />
              <label class="form-check-label" for="delivery-time-advanced-mode-switch">Erweitert</label>
            </div>
          </div>
        </header>

        <div class="form-floating mb-2 d-none">
          <input type="text" id="etd-supplier" class="form-control" @focus="$event.target.select()" placeholder="Bestätigter Liefertermin" required />
          <label>Bestätigter Liefertermin</label>
          <span class="position-absolute top-50 translate-middle-y me-4 end-0 text-muted">KW {{ getISOWeek(etdSupplier) }}</span>
        </div>

        <div class="row mb-2">
          <div class="col">
            <div class="form-floating">
              <input type="date" class="form-control" min="2022-01-01" max="2100-01-01" placeholder="Bestätiger Liefertermin" v-model="etdSupplierDate" required />
              <label>Bestätiger Liefertermin</label>
            </div>
          </div>
          <div class="col-auto pt-3">||</div>
          <div class="col">
            <div class="form-floating">
              <input type="week" class="form-control" placeholder="Bestätigte Lieferwoche" v-model="etdSupplierWeek" required />
              <label>Bestätigte Lieferwoche</label>
            </div>
          </div>
        </div>

        <div class="form-floating">
          <input type="number" min="0" max="100" class="form-control pe-5" v-model="bufferTime" @focus="$event.target.select()" placeholder="Pufferzeitraum" required />
          <label>Pufferzeitraum</label>
          <span class="position-absolute top-50 translate-middle-y me-4 end-0 text-muted">Tage</span>
        </div>

        <div class="d-none form-floating input-group my-2" v-if="deliveryTimeAdvancedMode">
          <input type="number" min="0" max="100" class="form-control pe-5" v-model="precarriageTime" @focus="$event.target.select()" placeholder="Vorlaufzeit" required />
          <label>Vorlaufzeit</label>
          <span class="position-absolute top-50 translate-middle-y me-4 end-0 text-muted">Tage</span>
        </div>
      </div>

      <!-- Verschiffung -->
      <div class="pb-4 mb-4 border-bottom" v-if="deliveryTimeAdvancedMode">
        <h5 class="display-6 fs-5 mb-3">Verschiffung</h5>

        <div class="form-floating mb-2">
          <input type="number" min="0" max="100" class="form-control pe-5" v-model="precarriageTime" @focus="$event.target.select()" required />
          <label>Vorlaufzeit</label>
          <span class="position-absolute top-50 translate-middle-y me-4 end-0 text-muted">Tage</span>
        </div>

        <div class="form-floating mb-2">
          <input type="date" class="form-control" v-model="closingDate" disabled required />
          <label>Closing Date Ausgangshafen</label>
          <span class="position-absolute top-50 translate-middle-y me-4 end-0 text-muted">KW {{ getISOWeek(closingDate) }}</span>
        </div>

        <div class="form-floating mb-2">
          <input type="number" min="0" max="100" class="form-control pe-5" v-model="checkInTime" @focus="$event.target.select()" required />
          <label>Check-in Ausgangshafen</label>
          <span class="position-absolute top-50 translate-middle-y me-4 end-0 text-muted">Tage</span>
        </div>

        <div class="form-floating">
          <input type="number" min="0" max="100" class="form-control pe-5" v-model="shippingTime" @focus="$event.target.select()" required />
          <label>Schiff</label>
          <span class="position-absolute top-50 translate-middle-y me-4 end-0 text-muted">Tage</span>
        </div>
      </div>

      <!-- Zielhafen -->
      <div class="pb-4 mb-4 border-bottom" v-if="deliveryTimeAdvancedMode">
        <h5 class="display-6 fs-5 mb-3">Zielhafen</h5>

        <div class="form-floating mb-2">
          <input type="date" class="form-control" v-model="etaHamburg" disabled required />
          <label>ETA Hamburg (HAM)</label>
          <span class="position-absolute top-50 translate-middle-y me-4 end-0 text-muted">KW {{ getISOWeek(etaHamburg) }}</span>
        </div>

        <div class="form-floating mb-2">
          <input type="number" min="0" max="100" class="form-control pe-5" v-model="checkOutTime" @focus="$event.target.select()" required />
          <label>Check-out Zielhafen</label>
          <span class="position-absolute top-50 translate-middle-y me-4 end-0 text-muted">Tage</span>
        </div>

        <div class="form-floating mb-2">
          <input type="number" min="0" max="100" class="form-control pe-5" v-model="customsTime" @focus="$event.target.select()" required />
          <label>Verzollung</label>
          <span class="position-absolute top-50 translate-middle-y me-4 end-0 text-muted">Tage</span>
        </div>

        <div class="form-floating">
          <input type="number" min="0" max="100" class="form-control pe-5" v-model="oncarriageTime" @focus="$event.target.select()" required />
          <label>Nachlaufzeit</label>
          <span class="position-absolute top-50 translate-middle-y me-4 end-0 text-muted">Tage</span>
        </div>
      </div>

      <!-- ETA München -->
      <div class="row row-cols-1 row-cols-sm-2 g-4">
        <div class="col">
          <div class="card text-end">
            <div class="card-body">
              <small class="text-muted">Zustellung München <span class="badge rounded-pill bg-primary">ETA</span></small>
              <p class="h2 mb-0">{{ formatDate(etaMunich) }}</p>
              <p class="text-muted mb-0">KW {{ getISOWeek(etaMunich) }}</p>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="card text-end">
            <div class="card-body">
              <small class="text-muted">Liefertermin für myfactory</small>
              <p class="h2 mb-0">{{ formatDate(etaMunichFriday) }}</p>
              <p class="text-muted">Freitag, KW {{ getISOWeek(etaMunichFriday) }}</p>

              <CopyButton :value="formatDate(etaMunichFriday)" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- tab #2 -->
    <div v-show="selectedTab === 'freight-charges'">
      <!-- alert price date -->
      <div class="alert alert-danger alert-dismissible fade show" v-if="new Date() - new Date(importCharges.updated) > 5184000000">
        <strong>Achtung!</strong> Letzte Preisaktualisierung: {{ formatDate(importCharges.updated) }}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>

      <!-- Sendung -->
      <div class="pb-4 mb-4 border-bottom">
        <header class="d-flex mb-2">
          <h5 class="mb-3 display-6 fs-5">Sendungsdaten</h5>

          <!-- Mode -->
          <div class="d-flex justify-content-end ms-auto">
            <a href="#" class="me-3 link-danger text-decoration-none" @click.prevent="resetFreightCharges" v-if="hasChangesFreightCharges">
              <i class="bi bi-arrow-counterclockwise me-2"></i>
              <span>Reset</span>
            </a>
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" v-model="freightChargesAdvancedMode" role="switch" id="freight-charges-advanced-mode-switch" />
              <label class="form-check-label" for="freight-charges-advanced-mode-switch">Erweitert</label>
            </div>
          </div>
        </header>

        <div class="form-floating mb-2">
          <input type="number" min="0.00" step="0.001" class="form-control" v-model.number="grossWeight" @focus="$event.target.select()" placeholder="Bruttogewicht" required />
          <label>Bruttogewicht</label>
          <span class="position-absolute top-50 translate-middle-y me-4 end-0 text-muted">kg</span>
        </div>

        <div class="form-floating">
          <input type="number" min="0.00" step="0.001" max="100" class="form-control pe-5" v-model.number="volume" @focus="$event.target.select()" placeholder="Volumen" required />
          <label>Volumen</label>
          <span class="position-absolute top-50 translate-middle-y me-4 end-0 text-muted">m³</span>
        </div>
      </div>

      <!-- Currency -->
      <div class="pb-4 mb-4 border-bottom" v-if="freightChargesAdvancedMode">
        <h5 class="mb-3 display-6 fs-5">Währung</h5>

        <!-- Currency exchange rate -->
        <div class="form-floating mb-2">
          <input type="number" min="0.01" step="0.01" class="form-control" v-model.number="selectedCurrencyRate" @focus="$event.target.select()" required />
          <label>Tageskurs</label>
          <span class="position-absolute top-50 translate-middle-y me-4 end-0 text-muted">EUR/USD</span>
        </div>

        <!-- Premium -->
        <div class="form-floating">
          <input type="number" min="0" max="100" step="0.1" class="form-control" v-model.number="importCharges.premium" @focus="$event.target.select()" required />
          <label>Premium</label>
          <span class="position-absolute top-50 translate-middle-y me-4 end-0 text-muted">%</span>
        </div>
      </div>

      <!-- result -->
      <div class="row row-cols-1 row-cols-sm-2 g-4 justify-content-end">
        <div class="col">
          <div class="card text-end">
            <div class="card-body">
              <small class="text-muted">Nachlauf</small>
              <p class="h2 mb-0">{{ formatNumbersLocal(oncarriageCharge, 2) }} €</p>
              <p class="text-muted mb-0">HAM-MUC</p>
            </div>
          </div>
        </div>

        <div class="col">
          <div class="card text-end">
            <div class="card-body">
              <small class="text-muted">Transportkosten</small>
              <p class="h2 mb-0">≈ {{ formatNumbersLocal(transportationCosts, 2) }} €</p>
              <p class="text-muted">FOB</p>

              <CopyButton :value="formatNumbersLocal(transportationCosts, 2)" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
`;

export default {
  name: 'SeaFreight',
  mixins: [SharedMethods],
  components: {
    CopyButton,
  },
  data() {
    return {
      defaults: {
        bufferTime: 14,
        precarriageTime: 3,
        checkInTime: 10,
        shippingTime: 28,
        checkOutTime: 7,
        customsTime: 7,
        oncarriageTime: 7,
      },
      bufferTime: 14,
      precarriageTime: 3,
      checkInTime: 10,
      shippingTime: 28,
      checkOutTime: 7,
      customsTime: 7,
      oncarriageTime: 7,
      etdSupplier: this.getISOString(),
      datepicker: null,
      deliveryTimeAdvancedMode: false,
      selectedTab: 'delivery-time',
      // --
      grossWeight: 0,
      volume: 0,
      freightChargesAdvancedMode: false,
      importCharges: {
        freightChargesLCL: 312.0, // USD
        serviceChargeLCL: 31.0,
        lowSulphurFee: 3.0,
        importChargeISPS: 5.0,
        importProcessing: 10.0,
        customsClearance: 75.0,
        releaseFee: 20.0,
        dsvProtect: 5.0,
        premium: 5.0,
        importServiceCharge: {
          minimum: 50.0,
          rate: 9.3,
        },
        deliveryCharges: {
          minimum: 71.0,
          rates: [
            { t: 0, p: 47.0 },
            { t: 100, p: 38.0 },
            { t: 1000, p: 33.0 },
            { t: 1500, p: 28.0 },
            { t: 2500, p: 26.0 },
          ],
        },
        updated: '2022-03-03',
      },
    };
  },
  watch: {
    currentNumbers() {
      this.bufferTime = !this.bufferTime || this.bufferTime < 0 ? 0 : this.bufferTime;
      this.precarriageTime = !this.precarriageTime || this.precarriageTime < 0 ? 0 : this.precarriageTime;
      this.checkInTime = !this.checkInTime || this.checkInTime < 0 ? 0 : this.checkInTime;
      this.shippingTime = !this.shippingTime || this.shippingTime < 0 ? 0 : this.shippingTime;
      this.checkOutTime = !this.checkOutTime || this.checkOutTime < 0 ? 0 : this.checkOutTime;
      this.customsTime = !this.customsTime || this.customsTime < 0 ? 0 : this.customsTime;
      this.oncarriageTime = !this.oncarriageTime || this.oncarriageTime < 0 ? 0 : this.oncarriageTime;
    },
  },
  computed: {
    etdSupplierDate: {
      get() {
        return this.etdSupplier;
      },
      set(newVal) {
        this.etdSupplier = newVal;
      },
    },
    etdSupplierWeek: {
      get() {
        const date = this.etdSupplier;
        const year = date.substring(0, 4);
        const isoWeek = this.getISOWeek(date);

        return year + '-W' + isoWeek;
      },
      set(newVal) {
        const date = this.getDateOfISOWeek(newVal);

        this.etdSupplierDate = this.getISOString(date);
      },
    },
    currentNumbers() {
      return [this.bufferTime, this.precarriageTime, this.checkInTime, this.shippingTime, this.checkOutTime, this.customsTime, this.oncarriageTime];
    },
    hasChangesDeliveryTime() {
      return this.supplierValuesChanged || this.shippingValuesChanged || this.destinationValuesChanged;
    },
    supplierValuesChanged() {
      return this.bufferTime !== this.defaults.bufferTime || this.precarriageTime !== this.defaults.precarriageTime;
    },
    shippingValuesChanged() {
      return this.checkInTime !== this.defaults.checkInTime || this.shippingTime !== this.defaults.shippingTime;
    },
    destinationValuesChanged() {
      return this.checkOutTime !== this.defaults.checkOutTime || this.customsTime !== this.defaults.customsTime || this.oncarriageTime !== this.defaults.oncarriageTime;
    },
    closingDate() {
      const date = new Date(this.etdSupplier);

      date.setHours(0, 0, 0);
      date.setDate(date.getDate() + parseInt(this.bufferTime, 10));
      date.setDate(date.getDate() + parseInt(this.precarriageTime, 10));

      if (date.getDate() > 15) {
        date.setDate(date.getDate() + 17);
      }

      date.setDate(15);

      return this.getISOString(date);
    },
    etaHamburg() {
      const date = new Date(this.closingDate);

      date.setHours(0, 0, 0);
      date.setDate(date.getDate() + parseInt(this.checkInTime, 10));
      date.setDate(date.getDate() + parseInt(this.shippingTime, 10));

      return this.getISOString(date);
    },
    etaMunich() {
      const date = new Date(this.etaHamburg);

      date.setHours(0, 0, 0);
      date.setDate(date.getDate() + parseInt(this.checkOutTime, 10));
      date.setDate(date.getDate() + parseInt(this.customsTime, 10));
      date.setDate(date.getDate() + parseInt(this.oncarriageTime, 10));

      return this.getISOString(date);
    },
    etaMunichFriday() {
      const date = new Date(this.etaMunich);

      date.setHours(0, 0, 0);

      const weekday = date.getDay();
      const daysUntilFriday = (5 + 7 - weekday) % 7;

      date.setDate(date.getDate() + daysUntilFriday);

      return this.getISOString(date);
    },
    currencyRates() {
      return this.$store.state.currencyRates;
    },
    selectedCurrencyRate() {
      if (this.currencyRates) {
        const rate = Number(this.currencyRates['usd'].rate);

        return Math.round(rate * 10000) / 10000;
      } else {
        return 1;
      }
    },
    oncarriageCharge() {
      if (!this.grossWeight || !this.volume) {
        return 0;
      }

      const oncarriageWeightContainer = Math.ceil(this.grossWeight / 100);
      const oncarriagePriceBracket = this.importCharges.deliveryCharges.rates.filter((el) => el.t <= Math.ceil(this.grossWeight)).at(-1);
      const oncarriageCosts = Math.max(oncarriagePriceBracket.p * oncarriageWeightContainer, this.importCharges.deliveryCharges.minimum);

      return oncarriageCosts;
    },
    transportationCosts() {
      if (!this.grossWeight || !this.volume) {
        return 0;
      }

      const costBasis = Math.max(Math.floor(this.grossWeight) / 1000, this.volume);

      const freightChargesLCL = Math.max(this.importCharges.freightChargesLCL * costBasis, this.importCharges.freightChargesLCL) / this.selectedCurrencyRate;
      const serviceChargeLCL = Math.max(this.importCharges.serviceChargeLCL * costBasis, this.importCharges.serviceChargeLCL);
      const importServiceCharge = Math.max(this.importCharges.importServiceCharge.rate * costBasis, this.importCharges.importServiceCharge.minimum);

      const flatFees = this.importCharges.importChargeISPS + this.importCharges.importProcessing + this.importCharges.customsClearance + this.importCharges.releaseFee + this.importCharges.dsvProtect;

      console.log('costBasis: ' + costBasis);
      console.log('freightChargesLCL: ' + freightChargesLCL);
      console.log('serviceChargeLCL: ' + serviceChargeLCL);
      console.log('importServiceCharge: ' + importServiceCharge);
      console.log('flatFees: ' + flatFees);

      const sum = freightChargesLCL + serviceChargeLCL + importServiceCharge + flatFees + this.oncarriageCharge;
      const adjustedSum = sum * (1 + this.importCharges.premium / 100);

      return adjustedSum;
    },
    hasChangesFreightCharges() {
      return this.grossWeight || this.volume;
    },
  },
  methods: {
    resetDeliveryTime() {
      this.bufferTime = this.defaults.bufferTime;
      this.precarriageTime = this.defaults.precarriageTime;
      this.checkInTime = this.defaults.checkInTime;
      this.shippingTime = this.defaults.shippingTime;
      this.checkOutTime = this.defaults.checkOutTime;
      this.customsTime = this.defaults.customsTime;
      this.oncarriageTime = this.defaults.oncarriageTime;
    },
    resetFreightCharges() {
      this.grossWeight = 0;
      this.volume = 0;
    },
  },
  created() {
    console.log('SeaFreight: created');

    this.$store.dispatch('getCurrencyRates');
  },
  mounted() {
    //
  },
  template,
};
