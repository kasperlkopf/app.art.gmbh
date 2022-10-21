// SalesOrderCard.js

import SharedMethods from '/components/SharedMethods.js';
import Modal from '/components/Modal.js';
import ProductDispo from '/components/ProductDispo.js';

const template = `
  <div class="card mb-3 sales-order-card shadow-sm" style="border-left: 4px solid #0d6efd !important">
    <div class="card-header bg-white border-bottom-0">
      <div class="row flex-nowrap">
        <div class="col-auto me-2 text-truncate lh-sm" style="width 110px;">
          <p class="mb-0 text-truncate">{{ salesOrder.OrderNumber }}</p>
          <small class="text-muted">{{ formatDate(salesOrder.BookingDate) }}</small>
        </div>
        <div class="col-2 me-2 text-truncate lh-sm">
          <p class="mb-0 text-truncate" :title="salesOrder.Matchcode">{{ salesOrder.Matchcode }}</p>
          <small class="text-muted">{{ salesOrder.CustomerNumber }}</small>
        </div>
        <div class="col me-2 text-truncate lh-sm">
          <p class="mb-0 text-truncate" :title="salesOrder.ReferenceText">{{ salesOrder.ReferenceText }}</p>
          <small class="text-muted">{{ cleanUpContactName(salesOrder.ContactName) }}</small>
        </div>

        <div class="col-2 text-truncate text-end lh-sm">
          <p class="mb-0 text-truncate">{{ salesOrder.Username }}</p>
          <small class="text-muted">{{ salesOrder.OrderStateDesc }}</small>
        </div>

        <!-- buttons -->
        <div class="col-auto d-flex flex-nowrap ms-2">
          <div class="dropdown">
            <button type="button" class="btn border me-2" :class="{ 'border-primary text-primary': isSnoozed && !isPastSnoozedUntilDate, 'border-danger text-danger': isSnoozed && isPastSnoozedUntilDate }" data-bs-toggle="dropdown" ref="snoozeDropdown">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clock mb-1" viewBox="0 0 16 16">
                <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
              </svg>
              <span class="ms-2" v-if="isSnoozed">{{ formatDate(snoozedUntilDate, { weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit' }) }}</span>
            </button>

            <ul class="dropdown-menu shadow" style="min-width: 240px">
              <li><h6 class="dropdown-header">Snooze bis...</h6></li>
              <li>
                <button class="dropdown-item d-flex" @click="snoozeUntilTomorrow">
                  <span class="me-auto">Morgen</span><small class="text-muted">{{ formatDate(tomorrow, { weekday: 'short', month: '2-digit', day: '2-digit' }) }}</small>
                </button>
              </li>
              <li>
                <button class="dropdown-item d-flex" @click="snoozeUntilNextWeek">
                  <span class="me-auto">Nächste Woche</span><small class="text-muted">{{ formatDate(nextWeek, { weekday: 'short', month: '2-digit', day: '2-digit' }) }}</small>
                </button>
              </li>
              <li><h6 class="dropdown-header">Beliebiges Datum:</h6></li>
              <li><input class="form-control border-0 px-3" type="date" @change="snoozeUntilCustom" :min="today" :value="salesOrder.SnoozedUntilDate" /></li>

              <template v-if="isSnoozed">
                <li><hr class="dropdown-divider" /></li>
                <li>
                  <button class="dropdown-item" @click="unsnooze">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle mb-1 me-2" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                    </svg>
                    <span>Unsnooze</span>
                  </button>
                </li>
              </template>
            </ul>
          </div>

          <div class="dropdown">
            <button class="btn border" type="button" data-bs-toggle="dropdown">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots mb-1" viewBox="0 0 16 16">
                <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
              </svg>
            </button>
            <ul class="dropdown-menu shadow">
              <li>
                <button class="dropdown-item" @click="editMemotext" :disabled="isMemotextEditable">{{ !salesOrder.MemoText ? 'Memotext hinzufügen' : 'Memotext bearbeiten' }}</button>
              </li>
              <li>
                <button class="dropdown-item" @click="toggleCollapse">{{ isCollapsed ? 'Ausklappen' : 'Einklappen' }}</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="card-body border-top overflow-auto bg-white" v-show="!isCollapsed">
      <!-- memotext -->
      <div class="position-relative mb-3" v-if="salesOrder.MemoText || isMemotextEditable">
        <div class="form-floating">
          <textarea class="form-control" v-model="memotext" ref="memotext" placeholder="Memotext" :disabled="!isMemotextEditable"></textarea>
          <label>Memotext</label>
        </div>
        <div class="mt-2 text-end" v-if="isMemotextEditable">
          <button type="button" class="btn me-2" @click="resetMemotext">Abbrechen</button>
          <button type="button" class="btn btn-primary" @click="saveMemotext">Speichern</button>
        </div>
      </div>

      <!-- pos -->
      <table class="table table-sm table-borderless m-0 sales-order-positions-table" style="table-layout: fixed">
        <thead>
          <tr class="text-muted" style="font-size: 12px">
            <th class="fw-light text-nowrap" style="width: 40px">Pos.</th>
            <th class="fw-light text-nowrap" style="width: 70px">Art.-Nr.</th>
            <th class="fw-light text-truncate">Art.-Bez.</th>
            <th class="text-end fw-light" style="width: 100px">Menge</th>
            <th class="text-end fw-light" style="width: 100px">Lager</th>
            <th class="text-end fw-light text-nowrap" style="width: 100px"><abbr title="Kalkulierte verfügbare Menge zum Wunschtermin">Verfügbar WT</abbr></th>
            <th class="text-end fw-light text-nowrap" style="width: 100px"><abbr title="Kalkulierte verfügbare Menge zum Liefertermin">Verfügbar LT</abbr></th>
            <th class="text-end fw-light" style="width: 100px">Wunschtermin</th>
            <th class="text-end fw-light" style="width: 100px">Liefertermin</th>
            <th class="text-end fw-light" style="width: 40px"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(pos, index) in salesOrder.SalesOrderPos" :key="index" :class="{ 'opacity-50': isSonder(pos) || pos.deliveryStatus === 0 }">
            <td>{{ pos.PosNumber }}</td>
            <td>
              <a v-if="!isSonder(pos) && pos.deliveryStatus !== 0" href="#" class="link-dark text-decoration-none" @click.prevent="makeDispoModal(pos)">{{ pos.ProductNumber }}</a>
              <span v-else>{{ pos.ProductNumber }}</span>
            </td>
            <td class="lh-sm text-truncate">
              {{ pos.Name1 }}<br /><small class="text-muted">{{ pos.Name2 }}</small>
            </td>
            <td class="text-end">{{ formatNumbersLocal(pos.Quantity) }}</td>
            <td class="text-end">{{ isSonder(pos) || pos.deliveryStatus === 0 ? '–' : formatNumbersLocal(pos.StockQuantity) }}</td>
            <td class="text-end">{{ isSonder(pos) || pos.deliveryStatus === 0 ? '–' : formatNumbersLocal(pos.availableAtDeliveryRequestDate) }}</td>
            <td class="text-end">{{ isSonder(pos) || pos.deliveryStatus === 0 ? '–' : formatNumbersLocal(pos.availableAtDeliveryDate) }}</td>
            <td class="text-end">{{ isSonder(pos) ? '–' : formatDate(pos.DeliveryRequestDate) }}</td>
            <td class="text-end">{{ isSonder(pos) ? '–' : formatDate(pos.DeliveryDate) }}</td>
            <td class="text-end" v-html="makeStatusIcon(pos)"></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- dispo modal -->
  <Teleport to="body">
    <modal :show="showDispoModal" @close="showDispoModal = false" :hasFooter="false">
      <template #title> {{ selectedProduct.ProductNumber }} - {{ selectedProduct.Name1 }} </template>
      <template #body>
        <product-dispo :product="selectedProduct" :document="salesOrder.OrderNumber" />
      </template>
    </modal>
  </Teleport>
`;

export default {
  name: 'SalesOrderCard',
  props: ['salesOrder'],
  mixins: [SharedMethods],
  components: {
    Modal,
    ProductDispo,
  },
  data() {
    return {
      isCollapsed: false,
      isMemotextEditable: false,
      memotext: this.salesOrder.MemoText,
      today: this.getISOString(),
      // -- modal
      showDispoModal: false,
      selectedProduct: null,
    };
  },
  computed: {
    isSnoozed() {
      return this.salesOrder.SnoozedUntilDate !== '';
    },
    isPastSnoozedUntilDate() {
      return this.isSnoozed ? new Date(this.salesOrder.SnoozedUntilDate) <= new Date() : false;
    },
    snoozedUntilDate() {
      return this.isSnoozed ? this.salesOrder.SnoozedUntilDate : '';
    },
    tomorrow() {
      const today = new Date();

      today.setHours(0, 0, 0);
      today.setDate(today.getDate() + 1);

      return this.getISOString(today);
    },
    nextWeek() {
      const today = new Date();

      today.setHours(0, 0, 0);

      const weekday = today.getDay();
      const daysUntilMonday = 8 - weekday;

      today.setDate(today.getDate() + daysUntilMonday);

      return this.getISOString(today);
    },
  },
  methods: {
    cleanUpContactName(c = '') {
      return c.replace(/Herrn|Frau|Mr\.|Ms\.|Mrs\./, '').trim();
    },
    makeStatusIcon(pos) {
      if (this.isSonder(pos)) {
        return '';
      }

      if (pos.deliveryStatus === 0) {
        return `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-truck mb-1" viewBox="0 0 16 16">
            <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5v-7zm1.294 7.456A1.999 1.999 0 0 1 4.732 11h5.536a2.01 2.01 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456zM12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12v4zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
          </svg>
        `;
      } else if (pos.deliveryStatus === 1) {
        return `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-seam mb-1" viewBox="0 0 16 16">
              <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2l-2.218-.887zm3.564 1.426L5.596 5 8 5.961 14.154 3.5l-2.404-.961zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z"/>
            </svg>
        `;
      } else if (pos.deliveryStatus === 2) {
        return `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-check-all text-success mb-1" viewBox="0 0 16 16">
              <path d="M8.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L2.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093L8.95 4.992a.252.252 0 0 1 .02-.022zm-.92 5.14.92.92a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 1 0-1.091-1.028L9.477 9.417l-.485-.486-.943 1.179z"/>
            </svg>
        `;
      } else if (pos.deliveryStatus === 3) {
        return `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-stars text-primary mb-1" viewBox="0 0 16 16">
            <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828l.645-1.937zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.734 1.734 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.734 1.734 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.734 1.734 0 0 0 3.407 2.31l.387-1.162zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L10.863.1z"/>
          </svg>
        `;
      } else if (pos.deliveryStatus === 4) {
        return `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-check text-success mb-1" viewBox="0 0 16 16">
            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
          </svg>
        `;
      } else {
        return `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-circle-fill text-danger mb-1" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
          </svg>
        `;
      }
    },
    isSonder(pos) {
      return pos.ProductNumber.startsWith('999') || !pos.Quantity;
    },
    unsnooze() {
      this.saveSnoozedUntilDate('');
    },
    snoozeUntilTomorrow() {
      const tomorrow = this.getISOString(this.tomorrow);
      console.log(this.tomorrow);

      this.saveSnoozedUntilDate(tomorrow);
    },
    snoozeUntilNextWeek() {
      const nextWeek = this.getISOString(this.nextWeek);

      this.saveSnoozedUntilDate(nextWeek);
    },
    snoozeUntilCustom(event) {
      const toggle = this.$refs.snoozeDropdown;
      const dropdown = window.bootstrap.Dropdown.getInstance(toggle);

      dropdown.hide();
      this.saveSnoozedUntilDate(event.target.value);
    },
    saveSnoozedUntilDate(d) {
      const orderId = this.salesOrder.OrderID;
      const orderNumber = this.salesOrder.OrderNumber;
      const snoozedUntilDate = d;

      setTimeout(() => this.$store.dispatch('updateOpenDocument', { orderId, orderNumber, snoozedUntilDate }), 0);
    },
    editMemotext() {
      this.isMemotextEditable = true;
      this.isCollapsed = false;

      setTimeout(() => this.$refs.memotext.focus(), 0);
    },
    resetMemotext() {
      this.isMemotextEditable = false;
      this.memotext = this.salesOrder.MemoText;
    },
    saveMemotext() {
      this.isMemotextEditable = false;

      const orderId = this.salesOrder.OrderID;
      const orderNumber = this.salesOrder.OrderNumber;
      const memotext = this.memotext;

      this.$store.dispatch('updateOpenDocument', { orderId, orderNumber, memotext });
    },
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;

      if (this.isCollapsed) {
        this.resetMemotext();
      }
    },
    makeDispoModal(pos) {
      this.selectedProduct = pos;
      this.showDispoModal = true;
    },
  },
  template,
};
