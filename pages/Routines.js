// Routines.js

import StatusIcon from '../components/StatusIcon.js';

const template = `
  <div class="routines">

    <div v-for="routine in routines" class="list-group mb-4">
      <header class="d-flex align-items-center list-group-item">
        <div v-html="routine.icon" class="d-flex me-2"></div>
        <span class="fw-semibold">{{ routine.title }}</span>
      </header>

      <button v-for="action in routine.actions" type="button" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" @click="handleClick(action)" :disabled="isBusy">
        <span class="text-truncate">{{ action.name }}</span>

        <StatusIcon v-if="['loading', 'success', 'error'].includes(action.status)" :status="action.status" />

        <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-short" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z" />
        </svg>
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
          icon: `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope" viewBox="0 0 16 16">
              <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />
            </svg>
          `,
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
          icon: `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-circle-fill" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z" />
            </svg>
          `,
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
          icon: `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-seam" viewBox="0 0 16 16">
              <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2l-2.218-.887zm3.564 1.426L5.596 5 8 5.961 14.154 3.5l-2.404-.961zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z" />
            </svg>
          `,
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

      fetch('/' + action.url + '?ts=' + Date.now())
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
