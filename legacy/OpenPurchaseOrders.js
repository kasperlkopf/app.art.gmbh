// OpenPurchaseOrders.js

import SharedMethods from '/components/SharedMethods.js';
import MultiSelect from '/components/MultiSelect.js';
import SkeletonCard from '/components/SkeletonCard.js';
import ErrorCard from '/components/ErrorCard.js';
import ProgressBar from '/components/ProgressBar.js';
import PurchaseOrderCard from '/components/PurchaseOrderCard.js';

const template = `
  <!-- header -->
  <header class="pt-4 px-4">
    <h3>Offene Bestellungen</h3>

    <div class="row placeholder-glow">
      <div class="col">
        <span class="placeholder rounded opacity-25" style="width: 290px" v-if="isLoading"></span>
        <span v-else>Zeige {{ visibleList.length }} von {{ filteredList.length }} Aufträgen ({{ openPurchaseOrders.length }} insgesamt)</span>
      </div>
      <div class="col-auto text-end">
        <div v-if="!isLoading">
          <span class="text-muted fst-italic d-none d-md-inline" v-if="timeSinceUpdated !== ''">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-stopwatch mb-1 me-2" viewBox="0 0 16 16">
              <path d="M8.5 5.6a.5.5 0 1 0-1 0v2.9h-3a.5.5 0 0 0 0 1H8a.5.5 0 0 0 .5-.5V5.6z" />
              <path d="M6.5 1A.5.5 0 0 1 7 .5h2a.5.5 0 0 1 0 1v.57c1.36.196 2.594.78 3.584 1.64a.715.715 0 0 1 .012-.013l.354-.354-.354-.353a.5.5 0 0 1 .707-.708l1.414 1.415a.5.5 0 1 1-.707.707l-.353-.354-.354.354a.512.512 0 0 1-.013.012A7 7 0 1 1 7 2.071V1.5a.5.5 0 0 1-.5-.5zM8 3a6 6 0 1 0 .001 12A6 6 0 0 0 8 3z" />
            </svg>
            <span>{{ timeSinceUpdated }}</span>
            <span class="mx-2">·</span>
          </span>
          <a class="text-decoration-none" href="#" @click.prevent="refreshOpenDocuments" :disabled="isLoading">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-repeat mb-1 me-2" viewBox="0 0 16 16">
              <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z" />
              <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z" />
            </svg>
            <span>Aktualisieren</span>
          </a>
        </div>
      </div>
    </div>
  </header>

  <!-- nav filters -->
  <nav class="sticky-top bg-white py-3 px-4">
    <div class="row flex-nowrap">
      <div class="col">
        <div class="position-relative">
          <input class="form-control ps-5" type="search" v-model.trim="search" placeholder="Suche..." autocomplete="off" />

          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
          </svg>
        </div>
      </div>

      <div class="col-auto">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sliders mt-2" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M11.5 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM9.05 3a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0V3h9.05zM4.5 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM2.05 8a2.5 2.5 0 0 1 4.9 0H16v1H6.95a2.5 2.5 0 0 1-4.9 0H0V8h2.05zm9.45 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-2.45 1a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0v-1h9.05z" />
        </svg>
      </div>

      <div class="col-auto pe-0">
        <div class="btn-group">
          <MultiSelect :items="availableUsernames" v-model:selected="selectedUsernames" label="Sachbearbeiter">
            <template #body>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-people-fill mb-1" viewBox="0 0 16 16">
                <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                <path fill-rule="evenodd" d="M5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216z" />
                <path d="M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
              </svg>
            </template>
          </MultiSelect>

          <MultiSelect :items="availableStatuses" v-model:selected="selectedStatuses" label="Belegstatus" buttonClass="rounded-end">
            <template #body>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-activity mb-1" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M6 2a.5.5 0 0 1 .47.33L10 12.036l1.53-4.208A.5.5 0 0 1 12 7.5h3.5a.5.5 0 0 1 0 1h-3.15l-1.88 5.17a.5.5 0 0 1-.94 0L6 3.964 4.47 8.171A.5.5 0 0 1 4 8.5H.5a.5.5 0 0 1 0-1h3.15l1.88-5.17A.5.5 0 0 1 6 2Z" />
              </svg>
            </template>
          </MultiSelect>
        </div>
      </div>

      <div class="col-auto">
        <select class="form-select" v-model="sorting">
          <option value="0" selected>Beleg: aufsteigend</option>
          <option value="1">Beleg: absteigend</option>
          <option value="2">Datum: aufsteigend</option>
          <option value="3">Datum: absteigend</option>
          <option value="4" selected>Name: A-Z</option>
          <option value="5">Name: Z-A</option>
          <option value="6" selected>LF#: aufsteigend</option>
          <option value="7">LF#: absteigend</option>
        </select>
      </div>
    </div>
  </nav>

  <!-- sticky shadow -->
  <div class="w-100 border-top" style="position: sticky; top: 70px; z-index: 1"></div>
  <div class="w-100 border-top border-white" style="position: sticky; z-index: 1; margin-top: -1px"></div>

  <!-- content -->
  <div class="px-4">
    <!-- loading -->
    <progress-bar v-if="isLoading || hasError" :error="hasError" class="position-relative mb-3" />

    <!-- results-->
    <template v-if="visibleList.length && !isLoading">
      <purchase-order-card v-for="item in visibleList" :purchaseOrder="item" :key="item.OrderID" />

      <div class="d-flex justify-content-center my-4">
        <button type="button" class="btn btn-primary" v-if="visibleList.length < filteredList.length" @click="showMore">Zeige {{ Math.min(filteredList.length - visibleList.length, pageSize) }} mehr</button>
        <button type="button" class="btn btn-outline-secondary px-4" v-else disabled>Ende</button>
      </div>
    </template>

    <!-- loading -->
    <template v-else-if="isLoading">
      <skeleton-card v-for="index in 5" :key="index" :style="{ opacity: 1 - 0.15 * index }" />
    </template>

    <!-- error -->
    <error-card type="connection" v-else-if="hasError" />

    <!-- no results -->
    <error-card type="empty" v-else />
  </div>
`;

export default {
  name: 'OpenPurchaseOrders',
  mixins: [SharedMethods],
  components: {
    MultiSelect,
    SkeletonCard,
    ErrorCard,
    ProgressBar,
    PurchaseOrderCard,
  },
  data() {
    return {
      search: '',
      selectedUsernames: [],
      selectedStatuses: [],
      sorting: '0',
      interval: '',
      timeSinceUpdated: '',
      currentPage: 1,
      pageSize: 20,
    };
  },
  watch: {
    filteredList() {
      this.currentPage = 1;
    },
  },
  computed: {
    openPurchaseOrders() {
      return this.$store.state.openDocuments.documents.openPurchaseOrders;
    },
    isLoading() {
      return this.$store.state.openDocuments.isLoading;
    },
    hasError() {
      return this.$store.state.openDocuments.hasError;
    },
    filteredList() {
      return this.openPurchaseOrders.filter((el) => {
        const str = this.makeFilterString(el);
        const hasUsername = !this.selectedUsernames.length || this.selectedUsernames.includes(el.Username);
        const hasStatus = !this.selectedStatuses.length || this.selectedStatuses.includes(el.OrderStateDesc);

        return str.includes(this.search.toLowerCase()) && hasUsername && hasStatus;
      });
    },
    sortedList() {
      return this.filteredList.slice(0).sort((a, b) => {
        if (this.sorting === '0') {
          return a.OrderNumber.localeCompare(b.OrderNumber);
        } else if (this.sorting === '1') {
          return b.OrderNumber.localeCompare(a.OrderNumber);
        } else if (this.sorting === '2') {
          return new Date(a.BookingDate) - new Date(b.BookingDate);
        } else if (this.sorting === '3') {
          return new Date(b.BookingDate) - new Date(a.BookingDate);
        } else if (this.sorting === '4') {
          return a.Matchcode.localeCompare(b.Matchcode);
        } else if (this.sorting === '5') {
          return b.Matchcode.localeCompare(a.Matchcode);
        } else if (this.sorting === '6') {
          return a.SupplierNumber.localeCompare(b.SupplierNumber);
        } else if (this.sorting === '7') {
          return b.SupplierNumber.localeCompare(a.SupplierNumber);
        }

        return false;
      });
    },
    visibleList() {
      return this.sortedList.slice(0, this.currentPage * this.pageSize);
    },
    availableStatuses() {
      const arr = this.openPurchaseOrders.map((el) => el.OrderStateDesc);
      const set = [...new Set(arr)];
      const sorted = set.sort((a, b) => a.localeCompare(b));

      return sorted;
    },
    availableUsernames() {
      const arr = this.openPurchaseOrders.map((el) => el.Username);
      const set = [...new Set(arr)];
      const sorted = set.sort((a, b) => a.localeCompare(b));

      return sorted;
    },
    lastUpdated() {
      return this.$store.state.openDocuments.lastUpdated;
    },
  },
  methods: {
    makeFilterString(el) {
      const arr = [el.OrderNumber, el.Matchcode, el.SupplierNumber, el.Username, el.OrderStateDesc, el.MemoText];

      el.PurchaseOrderPos.forEach((pop) => arr.push(...[pop.ProductNumber, pop.Name1, pop.Name2, pop.Quantity]));

      return arr.join(' ').toLowerCase();
    },
    updateTimeSinceUpdated() {
      this.timeSinceUpdated = this.lastUpdated ? this.getTimeSinceString(this.lastUpdated) : '';
    },
    showMore() {
      this.currentPage++;
    },
    refreshOpenDocuments() {
      this.$store.dispatch('getOpenDocuments');
    },
  },
  created() {
    console.log('created: OpenPurchaseOrders');

    if (!this.openPurchaseOrders.length) {
      // this.$store.dispatch('getOpenDocuments');
    }
  },
  activated() {
    this.updateTimeSinceUpdated();
    this.interval = setInterval(this.updateTimeSinceUpdated, 1000);
  },
  deactivated() {
    clearInterval(this.interval);
  },
  template,
};
