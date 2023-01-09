// StatusIcon.js

const template = `
  <div v-if="status === 'loading'" class="spinner-border spinner-border-sm text-primary"></div>

  <i v-else-if="status === 'success'" class="bi bi-check-circle-fill text-success"></i>

  <i v-else-if="status === 'error'" class="bi bi-x-circle-fill text-danger"></i>

  <span v-else-if="status !== ''" :title="status">
    <i class="bi bi-exclamation-circle-fill text-warning"></i>
  </span>

  <i v-else class="bi bi-three-dots text-muted"></i>
`;

export default {
  name: 'StatusIcon',
  props: ['status'],
  template,
};
