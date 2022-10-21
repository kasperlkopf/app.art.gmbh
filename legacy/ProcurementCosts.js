// ProcurementCosts.js

import SharedMethods from '/components/SharedMethods.js';
import AutocompleteInput from '/components/AutocompleteInput.js';
import Modal from '/components/Modal.js';
import CopyButton from '/components/CopyButton.js';

const template = `
  <div class="pt-4 pb-5 px-5 mx-auto col-12 col-xl-8">
    <!-- Origin -->
    <div class="pb-4 mb-4 border-bottom">
      <header class="d-flex mb-3">
        <h5 class="display-6 fs-5">Warenursprung</h5>

        <!-- Mode -->
        <div class="d-flex justify-content-end ms-auto">
          <a href="#" class="me-3 link-danger text-decoration-none" @click.prevent="resetEverything" v-if="hasOriginData">
            <i class="bi bi-arrow-counterclockwise me-2"></i>
            <span>Reset</span>
          </a>
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" v-model="advancedMode" role="switch" id="advanced-mode-switch" />
            <label class="form-check-label" for="advanced-mode-switch">Erweitert</label>
          </div>
        </div>
      </header>

      <!-- Supplier -->
      <div class="form-floating mb-2">
        <AutocompleteInput :items="foreignSuppliers" :display="['Matchcode', 'SupplierNumber']" v-model:selected="selectedSupplier" placeholder="Lieferant" :disabled="!foreignSuppliers.length" />
        <label>Lieferant</label>
      </div>

      <!-- Goods receipts -->
      <div class="form-floating mb-2">
        <AutocompleteInput :items="goodsReceipts" :display="['OrderNumber', 'Matchcode']" v-model:selected="selectedGoodsReceipt" placeholder="Wareneingang" :disabled="!goodsReceipts.length" />
        <label>Wareneingang</label>
      </div>

      <div class="row g-md-2">
        <div class="col-12 col-md">
          <!-- Custom origin -->
          <div class="form-floating mb-2" v-if="advancedMode">
            <select class="form-select" v-model="selectedOrigin" :disabled="selectedSupplier">
              <option value="" selected disabled>Bitte auswählen</option>
              <option value="EU">EU</option>
              <option value="NONEU">Drittland</option>
            </select>
            <label>Ursprungsland</label>
          </div>
        </div>
        <div class="col-12 col-md">
          <!-- Currency -->
          <div class="form-floating" v-if="advancedMode">
            <select class="form-select" v-model="selectedCurrency" :disabled="selectedSupplier">
              <option value="" selected disabled>Bitte auswählen</option>
              <option value="EUR">EUR - €</option>
              <option value="USD">USD - $</option>
              <option value="GBP">GBP - £</option>
            </select>
            <label>Währung</label>
          </div>
        </div>
      </div>
    </div>

    <!-- Invoice & transport -->
    <div class="pb-4 mb-4 border-bottom" v-if="hasOriginData">
      <h5 class="mb-3 display-6 fs-5">Rechnung & Transport</h5>

      <!-- Invoice total -->
      <div class="form-floating mb-2">
        <input type="text" placeholder="0,00" class="form-control" v-model.lazy="invoiceTotalDisplay" @focus="$event.target.select()" @keydown.enter.prevent="triggerChange" required />
        <label>Rechnungssumme</label>
        <span class="position-absolute top-50 translate-middle-y me-4 end-0 text-muted">{{ selectedCurrency }}</span>
      </div>

      <!-- Invoice extra costs -->
      <div class="form-floating mb-2">
        <input type="text" placeholder="0,00" class="form-control" v-model.lazy="invoiceExtraCostsDisplay" @focus="$event.target.select()" @keydown.enter.prevent="triggerChange" ref="invoiceExtraCostsInput" required />
        <label>Rechnungsnebenkosten</label>
        <span class="position-absolute top-50 translate-middle-y me-4 end-0 text-muted">{{ selectedCurrency }}</span>
      </div>

      <!-- Invoice value of goods -->
      <div class="form-floating mb-2" v-if="advancedMode">
        <input type="text" placeholder="0,00" class="form-control" :value="invoiceValueOfGoods" disabled required />
        <label>Warenwert</label>
        <span class="position-absolute top-50 translate-middle-y me-4 end-0 text-muted">{{ selectedCurrency }}</span>
      </div>

      <!-- Incoterms -->
      <div class="form-floating mb-2">
        <select class="form-select" v-model="selectedIncoterms">
          <option value="" selected disabled>Bitte auswählen</option>
          <option value="EXW">EXW - ab Lager</option>
          <option value="CPT">Frei Haus</option>
        </select>
        <label>Versandbedingungen</label>
      </div>

      <!-- Transport costs euro -->
      <div class="form-floating mb-2">
        <input type="text" placeholder="0,00" class="form-control" v-model.lazy="shippingCostsDisplay" @focus="$event.target.select()" @keydown.enter.prevent="triggerChange" :disabled="selectedIncoterms !== 'EXW'" ref="shippingCostsInput" required />
        <label>Transportkosten</label>
        <span class="position-absolute top-50 translate-middle-y me-4 end-0 text-muted">EUR</span>
      </div>
    </div>

    <!-- Customs & currency -->
    <div class="pb-4 mb-4 border-bottom" v-if="needsCustomsAndCurrency">
      <h5 class="mb-3 display-6 fs-5">Zoll & Co.</h5>

      <!-- Material -->
      <div class="form-floating mb-2" v-if="selectedOrigin !== 'EU'">
        <select class="form-select" v-model="selectedMaterial">
          <option value="" selected disabled>Bitte auswählen</option>
          <option value="plastic">Kunststoff, Plastik</option>
          <option value="metal">Metall</option>
          <option value="rubber">Gummi, Kautschuk</option>
          <option value="other">Andere</option>
        </select>
        <label>Material</label>
      </div>

      <!-- Duty rate -->
      <div class="form-floating mb-2" v-if="selectedOrigin !== 'EU'">
        <input type="text" class="form-control" v-model.lazy="dutyRateDisplay" @focus="$event.target.select()" @keydown.enter.prevent="triggerChange" :disabled="selectedMaterial !== 'other'" required />
        <label>Zollabgabensatz</label>
        <span class="position-absolute top-50 translate-middle-y me-4 end-0 text-muted">%</span>
      </div>

      <!-- Freight charges portion -->
      <div class="form-floating mb-2" v-if="advancedMode && selectedOrigin !== 'EU'">
        <input type="number" class="form-control" :value="freightChargesPortion.toFixed(2)" required disabled />
        <label>Beförderungskostenanteil</label>
        <span class="position-absolute top-50 translate-middle-y me-4 end-0 text-muted">%</span>
      </div>

      <!-- Currency exchange rate -->
      <div class="form-floating mb-2" v-if="advancedMode && selectedCurrency !== 'EUR'">
        <input type="number" min="0.01" step="0.01" class="form-control" v-model="selectedCurrencyRate" @focus="$event.target.select()" @keydown.enter.prevent="triggerChange" required />
        <label>Tageskurs</label>
        <span class="position-absolute top-50 translate-middle-y me-4 end-0 text-muted">EUR/{{ selectedCurrency }}</span>
      </div>

      <!-- Future currency exchange rate EUR/USD -->
      <div class="form-floating mb-2" v-if="advancedMode && selectedCurrency === 'USD'">
        <input type="number" min="0.01" step="0.01" class="form-control" v-model="futureCurrencyRateEURUSD" @focus="$event.target.select()" @keydown.enter.prevent="triggerChange" required />
        <label>Devisentermingeschäft</label>
        <span class="position-absolute top-50 translate-middle-y me-4 end-0 text-muted">EUR/USD</span>
      </div>
    </div>

    <!-- Markup -->
    <div class="row row-cols-1 g-4 justify-content-end">
      <div class="col">
        <div class="card text-end">
          <div class="card-body">
            <small class="text-muted">Bezugskosten</small>
            <p class="h2 mb-0">{{ formatNumbersLocal(procurementCosts, 2) }} €</p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card text-end">
          <div class="card-body">
            <small class="text-muted">Bezugskostenanteil</small>
            <p class="h2 mb-0">{{ formatNumbersLocal(procurementCosts, 2) }} %</p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card text-end">
          <div class="card-body">
            <small class="text-muted">Verrechnungsaufschlag</small>
            <p class="h2 mb-3">{{ formatNumbersLocal(procurementCostsMarkup, 2) }} %</p>

            <CopyButton :value="formatNumbersLocal(procurementCostsMarkup, 2)" />
          </div>
        </div>
      </div>
    </div>

    <div class="d-none pb-4 mb-4 border-bottom" v-if="hasOriginData && hasInvoiceData">
      <h5 class="mb-3 display-6 fs-5">Bezugskosten</h5>

      <div class="form-floating mb-2">
        <input type="text" class="form-control" :value="formatNumbersLocal(procurementCosts, 2)" required disabled />
        <label>Bezugskosten</label>
        <span class="position-absolute top-50 translate-middle-y me-4 end-0 text-muted">EUR</span>
      </div>

      <div class="d-flex">
        <div class="form-floating w-100">
          <input type="text" class="form-control" :value="formatNumbersLocal(procurementCostsMarkup, 2)" required disabled />
          <label>Verrechnungsaufschlag</label>
          <span class="position-absolute top-50 translate-middle-y me-4 end-0 text-muted">%</span>
        </div>

        <CopyButton :value="formatNumbersLocal(procurementCostsMarkup, 2)" />
      </div>
    </div>

    <footer class="d-none justify-content-end">
      <a href="#" class="link-primary text-decoration-none" @click.prevent="showHowToModal = true" tabindex="-1">
        <i class="bi bi-question-circle me-2"></i>
        <span>Wohin damit?</span>
      </a>
    </footer>
  </div>

  <!-- modal -->
  <Teleport to="body">
    <modal :show="showHowToModal" @close="showHowToModal = false" :hasFooter="false">
      <template #title> Wohin mit den Bezugskosten? </template>
      <template #body>
        <img class="w-100" src="https://cdn.art.gmbh/img/bezugskosten-how-to.gif" />
      </template>
    </modal>
  </Teleport>
`;

export default {
  name: 'ProcurementCosts',
  mixins: [SharedMethods],
  components: {
    AutocompleteInput,
    Modal,
    CopyButton,
  },
  data() {
    return {
      supplierDefaultMaterials: {
        71005: 'plastic',
        71076: 'metal',
        71048: 'plastic',
        71057: 'metal',
        71105: 'metal',
        71042: 'metal',
        71037: 'plastic',
        71031: 'plastic',
        71030: 'rubber',
        71073: 'metal',
        71118: 'metal',
      },
      transportationCostsDutyShares: {
        CN: 70.0,
        HK: 70.0,
        TW: 70.0,
        US: 78.0,
      },
      materialDutyRates: {
        plastic: 6.5,
        metal: 3.7,
        rubber: 2.5,
        other: 0,
      },
      selectedSupplier: null,
      selectedGoodsReceipt: null,
      selectedOrigin: '',
      selectedCurrency: '',
      // --
      invoiceTotal: 0,
      invoiceExtraCosts: 0,
      selectedIncoterms: '',
      shippingCosts: 0,
      // --
      selectedMaterial: '',
      dutyRate: 0,
      selectedCurrencyRate: 1,
      futureCurrencyRateEURUSD: 1.2065,
      euCountries: ['AT', 'BE', 'BG', 'CY', 'CZ', 'DE', 'DK', 'EE', 'ES', 'FI', 'FR', 'GB', 'GR', 'HU', 'HR', 'IE', 'IT', 'LT', 'LU', 'LV', 'MT', 'NL', 'PL', 'PT', 'RO', 'SE', 'SI', 'SK'],
      advancedMode: false,
      showHowToModal: false,
    };
  },
  watch: {
    selectedSupplier(newVal) {
      if (newVal) {
        this.selectedOrigin = this.selectedSupplier.Taxation === 4 ? 'NONEU' : 'EU';
        this.selectedCurrency = this.selectedSupplier.CurrencyUnit;
        this.selectedIncoterms = this.selectedSupplier.DeliveryCondition === 'CPT' ? 'CPT' : 'EXW';
        this.selectedMaterial = this.defaultMaterial;

        if (this.selectedGoodsReceipt) {
          this.selectedGoodsReceipt = this.selectedGoodsReceipt.SupplierNumber === this.selectedSupplier.SupplierNumber ? this.selectedGoodsReceipt : null;
        }
      } else {
        this.resetEverything();
      }

      this.invoiceExtraCosts = 0;
      this.shippingCosts = 0;
    },
    selectedGoodsReceipt(newVal) {
      if (newVal) {
        const newSelectedSupplier = this.foreignSuppliers.find((el) => el.SupplierNumber === this.selectedGoodsReceipt.SupplierNumber);

        this.selectedSupplier = newSelectedSupplier;
      }

      this.invoiceTotal = this.selectedGoodsReceipt ? this.selectedGoodsReceipt.OrderSumGross : 0;
    },
    selectedIncoterms(newVal) {
      if (newVal === 'CPT') {
        this.shippingCosts = 0;
      }
    },
    selectedMaterial(newVal) {
      if (newVal) {
        this.dutyRate = this.materialDutyRates[newVal];
      } else {
        this.dutyRate = 0;
      }
    },
    selectedCurrency() {
      if (this.currencyRates && this.selectedCurrency && this.selectedCurrency !== 'EUR') {
        const symbol = this.selectedCurrency.toLowerCase();
        const rate = Number(this.currencyRates[symbol].rate);

        this.selectedCurrencyRate = Math.round(rate * 10000) / 10000;
      } else {
        this.selectedCurrencyRate = 1;
      }
    },
  },
  computed: {
    isLoading() {
      return this.$store.state.procurementCosts.isLoading;
    },
    hasError() {
      return this.$store.state.procurementCosts.hasError;
    },
    foreignSuppliers() {
      return this.$store.state.supplierData ? this.$store.state.supplierData.foreignSuppliers : [];
    },
    goodsReceipts() {
      return []; // this.$store.state.supplierData ? this.$store.state.supplierData.goodsReceipts.filter((el) => !this.selectedSupplier || (this.selectedSupplier && el.SupplierNumber === this.selectedSupplier.SupplierNumber)) : [];
    },
    hasOriginData() {
      return this.selectedOrigin && this.selectedCurrency;
    },
    invoiceTotalDisplay: {
      get() {
        return this.formatNumbersLocal(this.invoiceTotal, 2);
      },
      set(newVal) {
        this.invoiceTotal = false;
        this.invoiceTotal = this.parseNumberInput(newVal);
      },
    },
    invoiceExtraCostsDisplay: {
      get() {
        return this.formatNumbersLocal(this.invoiceExtraCosts, 2);
      },
      set(newVal) {
        this.invoiceExtraCosts = false;
        this.invoiceExtraCosts = this.parseNumberInput(newVal);
      },
    },
    invoiceValueOfGoods() {
      return this.formatNumbersLocal(this.invoiceTotal - this.invoiceExtraCosts, 2);
    },
    shippingCostsDisplay: {
      get() {
        return this.formatNumbersLocal(this.shippingCosts, 2);
      },
      set(newVal) {
        this.shippingCosts = false;
        this.shippingCosts = this.parseNumberInput(newVal);
      },
    },
    hasInvoiceData() {
      return Number(this.invoiceTotal) > 0 && ((this.selectedIncoterms === 'EXW' && Number(this.shippingCosts) > 0) || this.selectedIncoterms === 'CPT');
    },
    needsCustomsAndCurrency() {
      if (this.hasOriginData && this.hasInvoiceData) {
        if (this.selectedOrigin !== 'EU' || this.selectedCurrency !== 'EUR') {
          return true;
        }
      }

      return false;
    },
    defaultMaterial() {
      return this.supplierDefaultMaterials[this.selectedSupplier.SupplierNumber] || 'other';
    },
    currencyRates() {
      return this.$store.state.currencyRates;
    },
    dutyRateDisplay: {
      get() {
        return this.formatNumbersLocal(this.dutyRate, 1);
      },
      set(newVal) {
        this.dutyRate = false;
        this.dutyRate = this.parseNumberInput(newVal);
      },
    },
    freightChargesPortion() {
      if (this.selectedOrigin !== 'EU') {
        if (this.selectedSupplier) {
          const supplierCountry = this.selectedSupplier.Country;

          if (this.transportationCostsDutyShares[supplierCountry]) {
            return this.transportationCostsDutyShares[supplierCountry];
          } else {
            return 100;
          }
        } else {
          return 0;
        }
      } else {
        return 0;
      }
    },
    procurementCosts() {
      const invoiceCurrencyRate = this.selectedCurrency === 'USD' ? this.futureCurrencyRateEURUSD : this.selectedCurrencyRate;
      const extraCosts = this.invoiceExtraCosts / invoiceCurrencyRate;

      const valueOfGoodsCustoms = this.invoiceTotal / this.selectedCurrencyRate;
      const shippingCostsCustoms = (this.shippingCosts * this.freightChargesPortion) / 100;
      const totalValueCustoms = valueOfGoodsCustoms + shippingCostsCustoms;
      const customsDuty = (totalValueCustoms * this.dutyRate) / 100;

      const finalCosts = this.shippingCosts + extraCosts + customsDuty;

      console.log('invoiceCurrencyRate: ', invoiceCurrencyRate);
      console.log('extraCosts: ', extraCosts);
      console.log('valueOfGoodsCustoms: ', valueOfGoodsCustoms);
      console.log('shippingCostsCustoms: ', shippingCostsCustoms);
      console.log('totalValueCustoms: ', totalValueCustoms);
      console.log('customsDuty: ', customsDuty);
      console.log('procurementCosts: ', finalCosts);

      return Math.round(finalCosts * 100) / 100;
    },
    procurementCostsMarkup() {
      const invoiceCurrencyRate = this.selectedCurrency === 'USD' ? this.futureCurrencyRateEURUSD : this.selectedCurrencyRate;
      const landedCost = this.invoiceTotal / invoiceCurrencyRate + this.procurementCosts;

      const finalMarkup = (landedCost / this.invoiceTotal) * 100 - 100 || 0;

      console.log('landedCost: ', landedCost);
      console.log('procurementCostsMarkup: ', finalMarkup);

      return Math.round(finalMarkup * 100) / 100;
    },
  },
  created() {
    this.$store.dispatch('getForeignSuppliers');
    this.$store.dispatch('getCurrencyRates');
  },
  methods: {
    resetEverything() {
      this.selectedGoodsReceipt = null;
      this.selectedSupplier = null;
      this.selectedOrigin = '';
      this.selectedCurrency = '';

      this.invoiceTotal = 0;
      this.invoiceExtraCosts = 0;
      this.selectedIncoterms = '';
      this.shippingCosts = 0;

      this.selectedMaterial = '';
    },
    triggerChange(e) {
      console.log(e.target);
      e.target.blur();

      // jump to next input
    },
  },
  template,
};
