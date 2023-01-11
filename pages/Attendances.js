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
              <i class="bi bi-person-fill"></i>
            </th>
            <th class="text-end pe-2" style="width: 65px;" title="Personio">
              <i class="bi bi-clock" style="margin-right: 11px;"></i>
            </th>
            <th class="text-end pe-2" style="width: 65px;" title="Windows">
              <i class="bi bi-windows" style="margin-right: 11px;"></i>
            </th>
            <th class="text-end pe-2" style="width: 65px;" title="Slack">
              <i class="bi bi-slack" style="margin-right: 11px;"></i>
            </th>
            <th class="text-end pe-2" style="width: 65px;" title="myfactory">
              <i class="bi bi-play-circle-fill" style="margin-right: 11px;"></i>
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
        <i class="bi bi-arrow-clockwise me-1"></i>
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
