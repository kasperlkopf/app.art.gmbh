// store.js

const store = Vuex.createStore({
  state() {
    return {
      isLoading: false,
      loadingTimeout: null,
      hasAuth: localStorage.getItem('auth'),
    };
  },
  mutations: {
    toggleLoading(state, loadingState) {
      state.isLoading = loadingState;
    },
    toggleAuth(state, authState) {
      state.hasAuth = authState;
      localStorage.setItem('auth', authState);
    }
  },
  actions: {
    toggleLoading({ commit, state }, loadingState) {
      clearTimeout(state.loadingTimeout);

      if (loadingState) {
        state.loadingTimeout = setTimeout(() => commit('toggleLoading', loadingState), 1000);
      } else {
        commit('toggleLoading', loadingState);
      }
    },
    toggleAuth({ commit }, authState) {
      commit('toggleAuth', authState);
    },
  },
});

export default store;
