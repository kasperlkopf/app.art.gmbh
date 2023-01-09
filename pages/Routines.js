// Routines.js

import StatusIcon from '../components/StatusIcon.js';

const template = `
  <div class="routines">

    <div v-for="routine in routines" class="list-group mb-4">
      <header class="d-flex align-items-center list-group-item">
        <i class="bi me-2" :class="routine.icon"></i>
        <span class="fw-semibold">{{ routine.title }}</span>
      </header>
      <button v-for="action in routine.actions" type="button" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" @click="handleClick(action)" :disabled="isBusy">
        <span class="text-truncate">{{ action.name }}</span>

        <StatusIcon v-if="['loading', 'success', 'error'].includes(action.status)" :status="action.status" />
        <i v-else class="bi bi-arrow-right-short"></i>
      </button>
    </div>

  </div>
`;

export default {
  name: 'Routines',
  components: {
    StatusIcon,
  },
  data() {
    return {
      isBusy: false,
      routines: [
        {
          title: 'Outlook',
          icon: 'bi-envelope',
          actions: [
            {
              name: 'Offene Bestellungen bündeln',
              url: 'outlook/bundlePurchaseOrders',
            },
            {
              name: 'Offene Bestellungen synchronisieren',
              url: 'outlook/syncPurchaseOrders',
            },
            {
              name: 'Importe bündeln',
              url: 'outlook/bundleImports',
            },
            {
              name: 'Importe aufräumen',
              url: 'outlook/sweepImports',
            },
            {
              name: 'E-Mails auto-taggen [TEST]',
              url: 'outlook/autoTagEmails',
            },
          ],
        },
        {
          title: 'myfactory',
          icon: 'bi-play-circle-fill',
          actions: [
            {
              name: 'Geisterpreise löschen',
              url: 'myfactory/deleteGhostPrices',
            },
            {
              name: 'EANs reparieren',
              url: 'myfactory/repairEANs',
            },
            {
              name: 'Tel.-Nr. bereinigen',
              url: 'myfactory/cleanUpPhoneNumbers',
            },
            {
              name: 'Ansprechpartnerkurzbezeichnungen reparieren',
              url: 'myfactory/repairContactMatchcodes',
            },
            {
              name: 'Artikelgewichte korrigieren',
              url: 'myfactory/correctProductWeights',
            },
            {
              name: 'Rahmenaufträge taggen [Rahmen]',
              url: 'myfactory/tagBlanketOrders',
            },
            {
              name: 'Dispositionskennzeichen setzen [MATZE]',
              url: 'myfactory/setProposalFlags',
            },
          ],
        },
        {
          title: 'PEET',
          icon: 'bi-box-seam',
          actions: [
            {
              name: 'Gelöschte KS loggen',
              url: 'peet/logDeletedOrders',
            },
            {
              name: 'Gelöschte KS entfernen',
              url: 'peet/clearDeletedOrders',
            },
          ],
        },
      ],
    };
  },
  mounted() {
    console.log('Routines: mounted');
  },
  methods: {
    handleClick(action) {
      this.isBusy = true;
      action.status = 'loading';

      fetch('https://api.art.gmbh/' + action.url + '?ts=' + Date.now())
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          action.status = 'success';
        })
        .catch(({ code }) => {
          console.error(code);
          action.status = 'error';
        })
        .finally(() => {
          setTimeout(() => {
            action.status = '';
            this.isBusy = false;
          }, 2000);
        });
    },
  },
  template,
};
