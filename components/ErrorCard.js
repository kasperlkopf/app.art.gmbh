// ErrorCard.js

const template = `
  <div class="alert alert-light d-flex justify-content-center align-items-center p-5 vstack" role="alert" style="border: 2px dashed #ced4da !important">
    <svg v-if="type === 'empty'" xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" class="bi bi-search opacity-25" viewBox="0 0 16 16">
      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
    </svg>

    <svg v-else-if="type === 'connection'" xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" class="bi bi-cloud-slash opacity-25" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M3.112 5.112a3.125 3.125 0 0 0-.17.613C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13H11l-1-1H3.781C2.231 12 1 10.785 1 9.318c0-1.365 1.064-2.513 2.46-2.666l.446-.05v-.447c0-.075.006-.152.018-.231l-.812-.812zm2.55-1.45-.725-.725A5.512 5.512 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773a3.2 3.2 0 0 1-1.516 2.711l-.733-.733C14.498 11.378 15 10.626 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3c-.875 0-1.678.26-2.339.661z" />
      <path d="m13.646 14.354-12-12 .708-.708 12 12-.707.707z" />
    </svg>

    <h5 class="my-3">{{ display[type].message }}</h5>
    <a href="#" class="btn btn-primary" @click.prevent="refreshParent">Nochmal versuchen</a>
  </div>
`;

export default {
  name: 'ErrorCard',
  props: ['type'],
  emits: ['update:selected'],
  data() {
    return {
      display: {
        empty: {
          message: 'Keine Ergebnisse.',
        },
        connection: {
          message: 'Keine Verbindung.',
        },
      },
    };
  },
  methods: {
    refreshParent() {
      this.$parent.refreshOpenDocuments();
    },
  },
  template,
};
