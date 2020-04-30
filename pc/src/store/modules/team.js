const state = {
  teams: []
};

const getters = {};
const actions = {};
const mutations = {
  add_teams(state, payload) {
    state.teams = state.teams.concat(payload);
  },
  reload_teams(state, payload) {
    state.teams = payload;
  },
  edit_team_members(state, payload) {
    const { teamId, members } = payload;
    for (let team of state.teams) {
      if (team["_id"] === teamId) {
        team["members"] = members;
      }
    }
  },
  remove_team(state, payload) {
    state.teams = state.teams.filter(team => team["_id"] !== payload);
  },
  reset_team(state) {
    state.teams = [];
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
