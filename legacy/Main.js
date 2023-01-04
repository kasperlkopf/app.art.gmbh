// Main.js

const template = `
  <main class="py-3">
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </main>
`;

export default {
  name: 'Main',
  data() {
    return {
      //
    };
  },
  created() {
    console.log('Main: created');
  },
  template,
};
