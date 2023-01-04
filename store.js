// store.js

const store = Vuex.createStore({
  state() {
    return {
      isLoading: false,
      loadingTimeout: null,
      user: localStorage.getItem('user'),
    };
  },
  mutations: {
    toggleLoading(state, loadingState) {
      state.isLoading = loadingState;
    },
    setUser(state, val) {
      state.user = val;
      localStorage.setItem('user', val);
    }
  },
  actions: {
    toggleLoading({ state, commit }, loadingState) {
      clearTimeout(state.loadingTimeout);

      if (loadingState) {
        state.loadingTimeout = setTimeout(() => commit('toggleLoading', loadingState), 1000);
      } else {
        commit('toggleLoading', loadingState);
      }
    },
    toggleUser({ state, commit }, newVal) {
      const val = newVal ? newVal : state.user === 'guest' ? 'admin' : 'guest';

      commit('setUser', val);
    },
  },
  getters: {
    hasAuth(state) {
      return state.user !== 'guest';
    },
  },
});

export default store;
