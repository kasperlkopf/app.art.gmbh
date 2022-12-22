// Turnover.js

import SharedMethods from '/components/SharedMethods.js';

const template = `
  <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">

    <div class="col">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Jahresumsatz</h5>
          <p class="card-text">{{ formatNumbersLocal(yearlyTurnover, 2) }} €</p>
        </div>
      </div>
    </div>

    <div class="col">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Monatsumsatz</h5>
          <p class="card-text">{{ formatNumbersLocal(monthlyTurnover, 2) }} €</p>
        </div>
      </div>
    </div>

    <div class="col">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Tagesumsatz</h5>
          <p class="card-text">{{ formatNumbersLocal(dailyTurnover, 2) }} €</p>
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
      yearlyTurnover: 0,
      monthlyTurnover: 0,
      dailyTurnover: 0,
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

          this.yearlyTurnover = message.yearlyTurnover[0].orderSum;
          this.monthlyTurnover = message.monthlyTurnover[0].orderSum;
          this.dailyTurnover = message.dailyTurnover[0].orderSum;
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
