// MultiSelect.js

const template = `
  <div class="btn-group">
    <button class="btn border position-relative bg-white" :class="buttonClass" type="button" data-bs-toggle="dropdown" data-bs-auto-close="outside" :disabled="!items.length">
      <slot name="body"></slot>

      <span v-if="checked.length" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary" style="z-index: 1">
        {{ checked.length }}
      </span>
    </button>

    <ul class="dropdown-menu whitespace-nowrap overflow-hidden text-truncate shadow">
      <li>
        <h6 class="dropdown-header">{{ label }}</h6>
      </li>
      <li v-for="(value, index) in items" :key="index">
        <label class="dropdown-item">
          <input class="form-check-input me-2" type="checkbox" :value="value" v-model="checked" @change="updateSelected" autocomplete="off" />
          <span>{{ value }}</span>
        </label>
      </li>
      <li>
        <hr class="dropdown-divider" />
      </li>
      <li>
        <a class="dropdown-item" href="#" @click.prevent="selectAll" :disabled="checked.length === items.length">Alle auswählen</a>
      </li>
      <li>
        <a class="dropdown-item" href="#" @click.prevent="resetFilter" :disabled="!checked.length">Filter löschen</a>
      </li>
    </ul>
  </div>
`;

export default {
  name: 'MultiSelect',
  props: ['items', 'label', 'selected', 'buttonClass'],
  emits: ['update:selected'],
  data() {
    return {
      checked: this.selected,
      rand: Math.floor(Date.now() * Math.random()),
    };
  },
  methods: {
    updateSelected() {
      this.$emit('update:selected', this.checked);
    },
    selectAll() {
      this.checked = this.items;
      this.updateSelected();
    },
    resetFilter() {
      this.checked = [];
      this.updateSelected();
    },
  },
  template,
};
