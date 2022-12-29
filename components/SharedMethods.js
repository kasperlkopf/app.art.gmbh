// SharedMethods.js

export default {
  methods: {
    parseNumberInput(n = 0) {
      const num = Number(n.toString().replace('.', '').replace(',', '.'));

      return isNaN(num) ? 0 : num;
    },
    formatNumbersLocal(n = 0, d = 0) {
      const num = Number(n);

      return num.toLocaleString('de-DE', {minimumFractionDigits: d, maximumFractionDigits: d})
    },
    formatDate(opts, d) {
      const date = d ? new Date(d) : new Date();
      const options = opts || { year: 'numeric', month: '2-digit', day: '2-digit' };

      return date.toLocaleDateString('de-DE', options);
    },
    getQuarter(d) {
      const date = d ? new Date(d) : new Date();
      const month = date.getMonth();

      return month < 3 ? 'Q1' : month < 6 ? 'Q2' : month < 9 ? 'Q3' : 'Q4';
    },
    getISOWeek(d) {
      const date = d ? new Date(d) : new Date();

      date.setHours(0, 0, 0);
      date.setDate(date.getDate() + 4 - (date.getDay() || 7));

      const week1 = new Date(date.getFullYear(), 0, 4);
      week1.setDate(week1.getDate() + 4 - (week1.getDay() || 7));

      const diff = date.getTime() - week1.getTime();
      const weekNum = 1 + Math.ceil(diff / 86400000 / 7);
      const isoWeek = ('0' + weekNum).substr(-2); // + '/' + date.getFullYear().toString().substr(-2);

      return isoWeek;
    },
    getDateOfISOWeek(w) {
      const year = w.substring(0, 4);
      const week = w.substring(6, 8);

      const simple = new Date(year, 0, 1 + (week - 1) * 7);
      const dow = simple.getDay();
      const ISOweekStart = simple;

      if (dow <= 4){
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
      } else {
        ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
      }

      return ISOweekStart;
    },
    getISOString(d) {
      const date = d ? new Date(d) : new Date();

      return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).substr(-2) + '-' + ('0' + date.getDate()).substr(-2);
    },
    getTimeSinceString(d) {
      const millis = Date.now() - d;
      const secs = Math.floor(millis / 1000);
      const mins = Math.floor(secs / 60);
      const hours = Math.floor(mins / 60);

      return secs < 60 ? 'vor wenigen Sekunden' : mins === 1 ? 'vor einer Minute' : mins < 60 ? 'vor ' + mins + ' Minuten' : hours === 1 ? 'vor einer Stunde' : 'vor ' + hours + ' Stunden';
    },
    idle(ms = 0) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
  },
};