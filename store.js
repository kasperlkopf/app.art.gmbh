// store.js

const store = Vuex.createStore({
  state() {
    return {
      isLoading: false,
      loadingTimeout: null,
    };
  },
  mutations: {
    toggleLoading(state, loadingState) {
      state.isLoading = loadingState;
    },
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
  },
});

export default store;
