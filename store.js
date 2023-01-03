// store.js

const store = Vuex.createStore({
  state() {
    return {
      isLoading: false,
    };
  },
  mutations: {
    toggleLoading(state, data) {
      state.isLoading = data;
    },
  },
  actions: {
    toggleLoading({ commit }, state) {
      commit('toggleLoading', state);
    },
  },
});

export default store;
