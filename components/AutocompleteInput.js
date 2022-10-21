// AutocompleteInput.js

const template = `
  <input type="search" class="form-control" :placeholder="placeholder" v-model="search" @focus="onFocus" @blur="onBlur" @input="hasFocus = true" @keyup.enter="selectFocusedResult" @keydown.down.up="traverseResults" @keydown.delete.backspace="onDelete" :disabled="disabled" autocomplete="off" />

  <div class="position-relative">
    <div class="position-absolute w-100 mt-2 shadow overflow-auto border rounded" style="max-height: 493px; z-index: 9899" v-if="filteredList.length && hasFocus">
      <div class="list-group list-group-flush">
        <button v-for="(item, index) in filteredList" class="list-group-item list-group-item-action text-truncate" :class="{ 'bg-light': filteredList[listFocusIndex] === item }" @click="updateSelected(item)" :ref="'list-group-item-' + index" :key="index" tabindex="-1">{{ item[display[0]] }} - {{ item[display[1]] }}</button>
      </div>
    </div>
  </div>
`;

export default {
  name: 'AutocompleteInput',
  props: ['items', 'selected', 'placeholder', 'display', 'disabled'],
  emits: ['update:selected'],
  data() {
    return {
      selectedItem: this.selected,
      listFocusIndex: -1,
      search: '',
      hasFocus: false,
    };
  },
  watch: {
    search(newVal) {
      if (newVal === '') {
        this.selectedItem = null;
        this.listFocusIndex = -1;
        this.$emit('update:selected', this.selectedItem);
      } else {
        this.listFocusIndex = 0;
      }
    },
    selected(newVal) {
      console.log(this.placeholder + ': selectedItem has changed');

      this.search = newVal ? this.selected[this.display[0]] + ' - ' + this.selected[this.display[1]] : '';
    },
  },
  computed: {
    filteredList() {
      return this.items.filter((el) => {
        const str = el[this.display[0]].toLowerCase() + ' ' + el[this.display[1]].toLowerCase();

        return str.includes(this.search.toLowerCase());
      });
    },
  },
  methods: {
    onFocus(e) {
      this.hasFocus = this.search === '';
      e.target.select();
    },
    onBlur(e) {
      if (!e.relatedTarget || !e.relatedTarget.classList.contains('list-group-item-action')) {
        this.hasFocus = false;
      }
    },
    onDelete() {
      if (this.selected || this.selectedItem) {
        this.search = '';
      }
    },
    selectFocusedResult(e) {
      if (this.filteredList.length) {
        const focusedResult = this.filteredList[this.listFocusIndex];

        this.updateSelected(focusedResult);
      } else {
        this.hasFocus = false;
      }

      e.target.blur();
    },
    traverseResults(e) {
      e.preventDefault();

      if (e.key === 'ArrowDown') {
        this.listFocusIndex = this.listFocusIndex < this.filteredList.length - 1 ? this.listFocusIndex + 1 : this.filteredList.length - 1;
      } else if (e.key === 'ArrowUp') {
        this.listFocusIndex = this.listFocusIndex > 0 ? this.listFocusIndex - 1 : 0;
      }

      this.$refs['list-group-item-' + this.listFocusIndex][0].scrollIntoView({ block: 'nearest' });
    },
    updateSelected(item) {
      this.selectedItem = item;
      this.hasFocus = false;

      this.$emit('update:selected', this.selectedItem);
    },
  },
  template,
};
