// PurchaseOrderCard.js

import SharedMethods from '/components/SharedMethods.js';



const template = `
  <div class="card mb-3 purchase-order-card shadow-sm" style="border-left: 4px solid #f0ad4e !important">
    <div class="card-header bg-white border-bottom-0">
      <div class="row flex-md-nowrap">
        <div class="col-auto me-2 text-truncate lh-sm" style="width: 110px">
          <p class="mb-0 text-truncate">{{ purchaseOrder.OrderNumber }}</p>
          <small class="text-muted">{{ formatDate(purchaseOrder.BookingDate) }}</small>
        </div>
        <div class="col me-2 text-truncate lh-sm">
          <p class="mb-0 text-truncate">{{ purchaseOrder.Matchcode }}</p>
          <small class="text-muted">{{ purchaseOrder.SupplierNumber }}</small>
        </div>
        <div class="col-2 text-truncate text-end lh-sm">
          <p class="mb-0 text-truncate">{{ purchaseOrder.Username }}</p>
          <small class="text-muted">{{ purchaseOrder.OrderStateDesc }}</small>
        </div>

        <!-- buttons -->
        <div class="col-auto d-flex flex-nowrap ms-2">
          <div class="dropdown">
            <button class="btn border" type="button" data-bs-toggle="dropdown">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots mb-1" viewBox="0 0 16 16">
                <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
              </svg>
            </button>
            <ul class="dropdown-menu shadow">
              <li>
                <button class="dropdown-item" @click="editMemotext" :disabled="isMemotextEditable">{{ !purchaseOrder.MemoText ? 'Memotext hinzufügen' : 'Memotext bearbeiten' }}</button>
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
      <div class="position-relative mb-3" v-if="purchaseOrder.MemoText || isMemotextEditable">
        <textarea class="form-control" :class="{ 'bg-light': !isMemotextEditable }" :disabled="!isMemotextEditable" v-model="memotext" ref="memotext" placeholder="Hier könnte Ihre Werbung stehen..."></textarea>
        <button type="button" class="btn position-absolute top-0 end-0 text-muted" @click="editMemotext" v-if="!isMemotextEditable"><i class="bi bi-pencil-square"></i></button>
        <div class="mt-2 text-end" v-if="isMemotextEditable">
          <button type="button" class="btn me-1" @click="resetMemotext">Abbrechen</button>
          <button type="button" class="btn btn-primary" @click="saveMemotext">Speichern</button>
        </div>
      </div>

      <!-- pos -->
      <table class="table table-sm table-borderless m-0 purchase-order-positions-table" style="table-layout: fixed">
        <thead>
          <tr class="text-muted" style="font-size: 12px">
            <th class="fw-light text-nowrap" style="width: 40px">Pos.</th>
            <th class="fw-light text-nowrap" style="width: 70px">Art.-Nr.</th>
            <th class="fw-light text-truncate">Art.-Bez.</th>
            <th class="text-end fw-light" style="width: 100px">Menge</th>
            <th class="text-end fw-light" style="width: 100px">Geliefert</th>
            <th class="text-end fw-light" style="width: 100px">Offen</th>
            <th class="text-end fw-light" style="width: 100px">Wunschtermin</th>
            <th class="text-end fw-light" style="width: 100px">Liefertermin</th>
            <th class="text-end fw-light" style="width: 40px"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(pos, index) in purchaseOrder.PurchaseOrderPos" :key="index" :class="{ 'opacity-50': isSonder(pos) || pos.Delivered >= pos.Quantity }">
            <td>{{ pos.PosNumber }}</td>
            <td>{{ pos.ProductNumber }}</td>
            <td class="lh-sm text-truncate">
              {{ pos.Name1 }}<br /><small class="text-muted">{{ pos.Name2 }}</small>
            </td>
            <td class="text-end">{{ formatNumbersLocal(pos.Quantity) }}</td>
            <td class="text-end">{{ isSonder(pos) ? '–' : formatNumbersLocal(pos.Delivered) }}</td>
            <td class="text-end">{{ isSonder(pos) ? '–' : openQuantity(pos) }}</td>
            <td class="text-end">{{ isSonder(pos) ? '–' : formatDate(pos.DeliveryRequestDate) }}</td>
            <td class="text-end">{{ isSonder(pos) ? '–' : formatDate(pos.DeliveryDate) }}</td>
            <td class="text-end" v-html="makeStatusIcon(pos)"></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
`;

export default {
  name: 'PurchaseOrderCard',
  props: ['purchaseOrder'],
  mixins: [SharedMethods],
  data() {
    return {
      isCollapsed: false,
      isMemotextEditable: false,
      memotext: this.purchaseOrder.MemoText,
    };
  },
  methods: {
    openQuantity(pos) {
      const diff = Math.max(0, pos.Quantity - pos.Delivered);

      return this.formatNumbersLocal(diff);
    },
    isSonder(pos) {
      return pos.ProductNumber.startsWith('999');
    },
    makeStatusIcon(pos) {
      if (pos.ProductNumber.startsWith('999')) {
        return '';
      }

      if (pos.DeliveryRequestDate) {
        return `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-check2 text-success mb-1" title="Bestätigt" viewBox="0 0 16 16">
            <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
          </svg>
        `;
      } else {
        return '';
      }
    },
    editMemotext() {
      this.isMemotextEditable = true;
      this.isCollapsed = false;

      setTimeout(() => this.$refs.memotext.focus(), 0);
    },
    resetMemotext() {
      this.isMemotextEditable = false;
      this.memotext = this.purchaseOrder.MemoText;
    },
    saveMemotext() {
      this.isMemotextEditable = false;

      const orderId = this.purchaseOrder.OrderID;
      const orderNumber = this.purchaseOrder.OrderNumber;
      const memotext = this.memotext;

      this.$store.dispatch('updateOpenDocument', { orderId, orderNumber, memotext });
    },
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;

      if (this.isCollapsed) {
        this.resetMemotext();
      }
    },
  },
  template,
};
