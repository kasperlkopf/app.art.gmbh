// Turnover.js

import SharedMethods from '/components/SharedMethods.js';

const template = `
  <div class="row row-cols-1 row-cols-md-2 g-3">

    <div class="col-12 col-md-6">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Tagesumsatz</h5>
          <h6 class="card-subtitle mb-2 text-body-tertiary">{{ formatDate() }}</h6>
          <p class="card-text fs-4 fw-semibold placeholder-wave text-end">
            <span v-if="isLoading" class="placeholder rounded opacity-25" style="width: 120px;"></span>
            <span v-else>{{ formatNumbersLocal(dailyTurnover, 2) }} €</span>
          </p>
        </div>
      </div>
    </div>

    <div class="col-12 col-md-6">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Wochenumsatz</h5>
          <h6 class="card-subtitle mb-2 text-body-tertiary">KW{{ getISOWeek() }}</h6>
          <p class="card-text fs-4 fw-semibold placeholder-wave text-end">
            <span v-if="isLoading" class="placeholder rounded opacity-25" style="width: 120px;"></span>
            <span v-else>{{ formatNumbersLocal(weeklyTurnover, 2) }} €</span>
          </p>
        </div>
      </div>
    </div>

    <div class="col-12 col-md-6">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Monatsumsatz</h5>
          <h6 class="card-subtitle mb-2 text-body-tertiary">{{ formatDate({month: 'long'}) }}</h6>
          <p class="card-text fs-4 fw-semibold placeholder-wave text-end">
            <span v-if="isLoading" class="placeholder rounded opacity-25" style="width: 120px;"></span>
            <span v-else>{{ formatNumbersLocal(monthlyTurnover, 2) }} €</span>
          </p>
        </div>
      </div>
    </div>

    <div class="col-12 col-md-6">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Quartalsumsatz</h5>
          <h6 class="card-subtitle mb-2 text-body-tertiary">{{ getQuarter() }}</h6>
          <p class="card-text fs-4 fw-semibold placeholder-wave text-end">
            <span v-if="isLoading" class="placeholder rounded opacity-25" style="width: 120px;"></span>
            <span v-else>{{ formatNumbersLocal(quarterlyTurnover, 2) }} €</span>
          </p>
        </div>
      </div>
    </div>

    <div class="col-12">
      <div class="card border-success">
        <div class="card-body">
          <h5 class="card-title">Jahresumsatz</h5>
          <h6 class="card-subtitle mb-2 text-body-tertiary">{{ formatDate({year: 'numeric'}) }}</h6>
          <p class="card-text fs-4 fw-semibold placeholder-wave text-end">
            <span v-if="isLoading" class="placeholder rounded opacity-25" style="width: 120px;"></span>
            <span v-else>{{ formatNumbersLocal(yearlyTurnover, 2) }} €</span>
          </p>
        </div>
      </div>
    </div>

  </div>
`;

export default {
  name: 'Turnover',
  mixins: [SharedMethods],
  data() {
    return {
      isLoading: false,
      dailyTurnover: 0,
      weeklyTurnover: 0,
      monthlyTurnover: 0,
      quarterlyTurnover: 0,
      yearlyTurnover: 0,
    };
  },
  created() {
    console.log('Turnover: created');

    this.getTurnover();
  },
  methods: {
    getTurnover() {
      this.isLoading = true;

      window.axios
        .get('https://api.art.gmbh/myfactory/getTurnover?ts=' + Date.now())
        .then((res) => {
          console.log(res);

          const message = res.data.message[0];

          this.dailyTurnover = message.dailyTurnover[0].orderSum;
          this.weeklyTurnover = message.monthlyTurnover[0].orderSum;
          this.monthlyTurnover = message.monthlyTurnover[0].orderSum;
          this.quarterlyTurnover = message.quarterlyTurnover[0].orderSum;
          this.yearlyTurnover = message.yearlyTurnover[0].orderSum;
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
