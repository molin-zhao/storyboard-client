import {
  addLog,
  removeLog,
  addTask,
  addGroup,
  addPhase,
  addProject,
  deleteTask,
  deleteGroup,
  deletePhase,
  deleteProject,
  addProjectMembers,
  editTaskMembers,
  mergeLogs
} from "@/common/utils/log";
import {
  updateGlobalProjectMembers,
  updateGlobalMemberStatus
} from "@/common/utils/socket";
const state = {
  projects: [],
  projectsMap: {}, // unwind arrays to objects
  activeIndex: 0,
  logs: {}, // tree
  taskLookup: {}, // reverse index for task
  groupLookup: {}, // reverse index for group
  phaseLookup: {}, // reverse index for phase
  projectLookup: {}, // reverse index for project
  globalProjectMembers: {} // set of project members
};

const getters = {};
const actions = {};
const mutations = {
  add_project(state, payload) {
    addProject(state, payload);
    state.projects = state.projects.concat(payload);
  },
  sync_project(state, payload) {
    state.projects = state.projects.map(
      project => project["_id" === payload["_id"] ? payload : project]
    );
  },
  reload_projects(state, payload) {
    state.projects = payload;
  },
  select_index(state, payload) {
    state.activeIndex = payload;
  },
  add_log(state, payload) {
    state.logs = addLog(state, payload);
  },
  remove_log(state, payload) {
    state.logs = removeLog(state, payload);
  },
  add_task(state, payload) {
    const { groupId, task } = payload;
    addTask(state, groupId, task);
  },
  add_group(state, payload) {
    const { phaseId, group } = payload;
    addGroup(state, phaseId, group);
  },
  add_phase(state, payload) {
    const { projectId, phase } = payload;
    addPhase(state, projectId, phase);
  },
  delete_task(state, payload) {
    const { groupId, taskId } = payload;
    deleteTask(state, groupId, taskId);
  },
  delete_group(state, payload) {
    const { phaseId, groupId } = payload;
    deleteGroup(state, phaseId, groupId);
  },
  delete_phase(state, payload) {
    const { projectId, phaseId } = payload;
    deletePhase(state, projectId, phaseId);
  },
  delete_project(state, payload) {
    const { projectId } = payload;
    deleteProject(state, projectId);
  },
  add_lookup(state, payload) {
    state.groupLookup = payload.groupLookup;
    state.phaseLookup = payload.phaseLookup;
    state.projectLookup = payload.projectLookup;
    state.taskLookup = payload.taskLookup;
  },
  add_project_members(state, payload) {
    const { _id, members } = payload;
    addProjectMembers(state, _id, members);
  },
  edit_task_members(state, payload) {
    editTaskMembers(state, payload.groupId, payload.taskId, payload.members);
  },
  merge_logs(state, payload) {
    const { ids, logs } = payload;
    mergeLogs(state, ids, logs);
  },
  update_global_members(state, payload) {
    state.globalProjectMembers = updateGlobalProjectMembers(state, payload);
  },
  update_global_member_status(state, payload) {
    const { user, status } = payload;
    state.globalProjectMembers = updateGlobalMemberStatus(state, user, status);
  },
  reset_project(state) {
    state.projects = [];
    state.activeIndex = 0;
    state.logs = {};
    state.taskLookup = {};
    state.groupLookup = {};
    state.phaseLookup = {};
    state.projectLookup = {};
    state.globalProjectMembers = {};
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
