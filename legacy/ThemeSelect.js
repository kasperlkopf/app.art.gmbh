// ThemeSelect.js

const template = `
  <div class="dropdown">

    <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown" data-bs-display="static">
      <i v-if="selectedTheme === 'light'" class="bi bi-sun-fill me-1"></i>
      <i v-else-if="selectedTheme === 'dark'" class="bi bi-moon-stars-fill me-1"></i>
      <i v-else class="bi bi-circle-half me-1"></i>
    </a>
    <ul class="dropdown-menu dropdown-menu-end p-1 shadow">
      <li>
        <button type="button" class="dropdown-item d-flex align-items-center rounded mb-1" :class="{'active': selectedTheme === 'light'}" @click="setTheme('light')">
          <i class="bi bi-sun-fill me-2 opacity-50"></i>
          Light
          <i v-if="selectedTheme === 'light'" class="bi bi-check2 ms-auto"></i>
        </button>
      </li>
      <li>
        <button type="button" class="dropdown-item d-flex align-items-center rounded mb-1" :class="{'active': selectedTheme === 'dark'}" @click="setTheme('dark')">
          <i class="bi bi-moon-stars-fill me-2 opacity-50"></i>
          Dark
          <i v-if="selectedTheme === 'dark'" class="bi bi-check2 ms-auto"></i>
        </button>
      </li>
      <li>
        <button type="button" class="dropdown-item d-flex align-items-center rounded" :class="{'active': selectedTheme === 'auto'}" @click="setTheme('auto')">
          <i class="bi bi-circle-half me-2 opacity-50"></i>
          Auto
          <i v-if="selectedTheme === 'auto'" class="bi bi-check2 ms-auto"></i>
        </button>
      </li>
    </ul>

  </div>
`;

export default {
  name: 'ThemeSelect',
  data() {
    return {
      selectedTheme: '',
    };
  },
  created() {
    console.log('ThemeSelect: created');

    this.setTheme();
  },
  methods: {
    setTheme(t) {
      const theme = t ? t : this.getPreferredTheme();

      this.selectedTheme = theme;

      if (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-bs-theme', theme);
      }

      localStorage.setItem('theme', theme);
    },
    getPreferredTheme() {
      const storedTheme = localStorage.getItem('theme');

      if (storedTheme) {
        return storedTheme;
      }

      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    },
  },
  template,
};
