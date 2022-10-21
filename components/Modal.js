// Modal.js

const template = `
  <Transition name="modal">
    <div v-if="show" class="modal d-block" tabindex="-1" style="backdrop-filter: blur(2px); background: rgba(0, 0, 0, 0.5); z-index: 9000" @click.self="$emit('close')">
      <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable modal-fullscreen-lg-down">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <slot name="title">default title</slot>
            </h5>
            <button type="button" class="btn-close" @click="$emit('close')"></button>
          </div>
          <div class="modal-body">
            <slot name="body"></slot>
          </div>
          <div class="modal-footer" v-if="hasFooter">
            <slot name="footer">
              <button type="button" class="btn btn-secondary" @click="$emit('close')">Close</button>
              <button type="button" class="btn btn-primary" @click="$emit('confirm')">Save changes</button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </Transition>
`;

export default {
  name: 'Modal',
  props: ['show', 'hasFooter'],
  emits: ['close', 'confirm'],
  watch: {
    show(newVal) {
      document.body.style.overflow = newVal ? 'hidden' : null;
    },
  },
  mounted() {
    console.log('Modal: mounted');
  },
  template,
};
