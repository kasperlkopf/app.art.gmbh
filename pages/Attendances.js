// Attendances.js

const template = `
  <div class="attendances">

    <div class="form-floating mb-3">
      <input type="date" class="form-control" placeholder="Datum" v-model="selectedDate" :max="currentDate" :disabled="isLoading" @change="change" />
      <label>Datum</label>
    </div>

    <!-- loading -->
    <div v-if="isLoading" class="progress-bar-custom position-relative mb-3">
      <div class="indeterminate bg-primary"></div>
    </div>

    <!-- today warning -->
    <div v-if="selectedDate === currentDate" class="alert alert-warning mb-3">
      <strong>Obacht!</strong> Daten von heute sind evtl. noch unvollständig!
    </div>

    <div class="table-responsive">
      <table class="table mb-0" style="table-layout: fixed;">
        <thead>
          <tr>
            <th style="min-width: 100px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill mb-1" viewBox="0 0 16 16">
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
              </svg>
            </th>
            <th class="text-end pe-2" style="width: 65px;" title="Personio">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clock mb-1" style="margin-right: 11px;" viewBox="0 0 16 16">
                <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
              </svg>
            </th>
            <th class="text-end pe-2" style="width: 65px;" title="Windows">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-windows mb-1" style="margin-right: 11px;" viewBox="0 0 16 16">
                <path d="M6.555 1.375 0 2.237v5.45h6.555V1.375zM0 13.795l6.555.933V8.313H0v5.482zm7.278-5.4.026 6.378L16 16V8.395H7.278zM16 0 7.33 1.244v6.414H16V0z"/>
              </svg>
            </th>
            <th class="text-end pe-2" style="width: 65px;" title="Slack">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-slack mb-1" style="margin-right: 11px;" viewBox="0 0 16 16">
                <path d="M3.362 10.11c0 .926-.756 1.681-1.681 1.681S0 11.036 0 10.111C0 9.186.756 8.43 1.68 8.43h1.682v1.68zm.846 0c0-.924.756-1.68 1.681-1.68s1.681.756 1.681 1.68v4.21c0 .924-.756 1.68-1.68 1.68a1.685 1.685 0 0 1-1.682-1.68v-4.21zM5.89 3.362c-.926 0-1.682-.756-1.682-1.681S4.964 0 5.89 0s1.68.756 1.68 1.68v1.682H5.89zm0 .846c.924 0 1.68.756 1.68 1.681S6.814 7.57 5.89 7.57H1.68C.757 7.57 0 6.814 0 5.89c0-.926.756-1.682 1.68-1.682h4.21zm6.749 1.682c0-.926.755-1.682 1.68-1.682.925 0 1.681.756 1.681 1.681s-.756 1.681-1.68 1.681h-1.681V5.89zm-.848 0c0 .924-.755 1.68-1.68 1.68A1.685 1.685 0 0 1 8.43 5.89V1.68C8.43.757 9.186 0 10.11 0c.926 0 1.681.756 1.681 1.68v4.21zm-1.681 6.748c.926 0 1.682.756 1.682 1.681S11.036 16 10.11 16s-1.681-.756-1.681-1.68v-1.682h1.68zm0-.847c-.924 0-1.68-.755-1.68-1.68 0-.925.756-1.681 1.68-1.681h4.21c.924 0 1.68.756 1.68 1.68 0 .926-.756 1.681-1.68 1.681h-4.21z"/>
              </svg>
            </th>
            <th class="text-end pe-2" style="width: 65px;" title="myfactory">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-circle-fill mb-1" style="margin-right: 11px;" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z"/>
              </svg>
            </th>
          </tr>
        </thead>

        <tbody class="placeholder-glow">

          <template v-if="selectedDate === ''">
            <tr>
              <td colspan="5" class="text-center align-middle text-muted fst-italic" style="height: 287px;">
                Kein Datum ausgewählt.<br>Wie wär's mit <a href="#" @click="getYesterday">gestern</a> oder <a href="#" @click="getToday">heute</a>?
              </td>
            </tr>
          </template>

          <!-- results-->
          <template v-else-if="sortedAttendances.length && !isLoading">
            <tr v-for="item, index in sortedAttendances" :key="index" :class="{ 'opacity-50': item.personioStartTime === '' }">
              <td>
                <span class="d-none d-sm-inline">{{ item.name }}</span>
                <span class="d-sm-none">{{ item.name[0] + item.name.split(' ')[1][0] }}</span>
              </td>
              <td class="text-end text-nowrap fw-semibold">{{ item.personioStartTime ? item.personioStartTime : '—' }}</td>
              <td class="text-end text-nowrap">{{ item.windowsSignInTime ? new Date(item.windowsSignInTime).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) : '—' }}</td>
              <td class="text-end text-nowrap">{{ item.slackAccessTime ? new Date(item.slackAccessTime * 1000).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) : '—' }}</td>
              <td class="text-end text-nowrap">{{ item.myfactoryLoginTime ? item.myfactoryLoginTime : '—' }}</td>
            </tr>
          </template>

          <!-- loading -->
          <template v-if="isLoading">
            <tr v-for="i in 7" :key="i">
              <td colspan="5"><span class="placeholder rounded opacity-25 w-100"></span></td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <footer class="d-flex justify-content-end mt-2">
      <button class="btn btn-link text-decoration-none p-0" @click="getAttendances" :disabled="isLoading || selectedDate === '' || !attendances.length">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-clockwise mb-1 me-1" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
          <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
        </svg>
        <span>Neuladen</span>
      </button>
    </footer>

  </div>
`;

export default {
  name: 'Attendances',
  data() {
    return {
      currentDate: new Date().toLocaleDateString('en-CA'),
      selectedDate: '',
      isLoading: false,
      attendances: [],
    };
  },
  computed: {
    sortedAttendances() {
      const logged = this.attendances.filter((el) => el.personioStartTime !== '');
      const sortedLogged = logged.sort((a, b) => parseInt(a.personioStartTime.replace(':', '')) - parseInt(b.personioStartTime.replace(':', '')));

      const partiallyLogged = this.attendances.filter((el) => el.personioStartTime === '' && (el.windowsSignInTime !== '' || el.slackAccessTime !== '' || el.myfactoryLoginTime !== ''));
      const notLogged = this.attendances.filter((el) => el.personioStartTime === '' && el.windowsSignInTime === '' && el.slackAccessTime === '' && el.myfactoryLoginTime === '');

      return [...sortedLogged, ...partiallyLogged, ...notLogged];
    },
  },
  created() {
    console.log('Attendances: created');
  },
  methods: {
    getYesterday() {
      const yesterday = new Date(this.currentDate);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayDate = yesterday.toLocaleDateString('en-CA');

      this.selectedDate = yesterdayDate;
      this.getAttendances();
    },
    getToday() {
      this.selectedDate = this.currentDate;
      this.getAttendances();
    },
    change() {
      if (this.selectedDate !== '') {
        this.getAttendances();
      }
    },
    getAttendances() {
      this.attendances = [];
      this.isLoading = true;

      fetch('https://api.art.gmbh/attendances/' + this.selectedDate + '?ts=' + Date.now())
        .then((res) => res.json())
        .then((data) => {
          console.log(data);

          this.attendances = data.message;
        })
        .catch(({ code, response }) => {
          console.error(code);

          if (response.data.message && response.data.message.length) {
            this.attendances = response.data.message;
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
  template,
};
