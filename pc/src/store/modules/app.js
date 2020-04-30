const state = {
  appLoading: false
};

const getters = {};
const actions = {};
const mutations = {
  set_loading(state, payload) {
    state.appLoading = payload;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
