// ProgressBar.js

const template = `
  <div class="progress-bar-custom">
    <div v-if="progress" class="determinate bg-success" :style="{ width: progress + '%' }"></div>
    <div v-else-if="error" class="determinate bg-danger w-100"></div>
    <div class="indeterminate bg-primary" v-else></div>
  </div>
`;

export default {
  name: 'ProgressBar',
  props: ['progress', 'error'],
  template,
};
