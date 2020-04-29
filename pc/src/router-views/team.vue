<template>
  <div class="mainboard">
    <div class="mainboard-title">
      <div class="mainboard-title-name">
        <span style="font-size: 40px;">{{ $t("TEAM") }}</span>
      </div>
    </div>
    <div class="mainboard-body">
      <vue-scroll>
        <div class="team-selection">
          <span class="form-label-bold">{{ $t("CHOOSE_TEAM") }}</span>
          <select
            v-model="selectedTeam"
            class="custom-select"
            style="margin-top: 5px; height: 30px; width: 260px; border-radius: 10px; font-size: 14px"
          >
            <option
              :value="index"
              v-for="(team, index) in teams"
              :key="index"
              >{{ team["name"] }}</option
            >
          </select>
        </div>
        <div class="team-member">
          <div class="members">
            <div
              class="member"
              v-for="(user, index) in computedTeamMembers"
              :key="index"
            >
              <user-card
                :item="user"
                :is-creator="computedIsTeamCreator(user)"
              />
            </div>
          </div>
        </div>
        <div v-if="computedIsTeamCreator" class="team-ops">
          <a @click="editMember" class="text-primary display-only">{{
            $t("EDIT_TEAM_MEMBER")
          }}</a>
          <a @click="deleteTeam" class="text-danger display-only">{{
            $t("DELETE_TEAM")
          }}</a>
        </div>
        <div v-else class="team-ops">
          <a @click="leaveTeam" class="text-danger display-only">{{
            $t("LEAVE_TEAM")
          }}</a>
        </div>
      </vue-scroll>
    </div>
    <modal ref="edit-team-members">
      <h5 class="modal-title display-only" slot="modal-header">
        {{ $t("EDIT_TEAM_MEMBER") }}
      </h5>
      <div slot="modal-body" class="modal-body">
        <form style="wrapper">
          <div class="form-group form-left-centered">
            <label>{{ $t("ADD_TEAM_MEMBER") }}</label>
            <div style="width: 100%; height: 50px">
              <search-input
                style="height: 100%; width: 100%; border-radius: 10px"
                :url="computedSearchUrl"
                :data-source="searchResult"
                :limit="5"
                @on-error="onSearchError"
                @on-result="onSearchResult"
                @input-change="searchInputChange"
              />
            </div>
            <div style="width: 100%">
              <div class="source-display">
                <vue-scroll v-if="computedShowSearchResult" :ops="ops">
                  <div
                    class="user-cell-wrapper"
                    v-for="(item, index) in searchResult[searchValue]['data']"
                    :key="index"
                  >
                    <user-add-delete-cell
                      :item="item"
                      :exclude-list="members"
                      @remove-user="removeUser"
                      @add-user="addUser"
                    />
                  </div>
                </vue-scroll>
                <span v-else-if="searchValue" style="margin-top: 10px">{{
                  $t("NO_USER_FOUND")
                }}</span>
                <div v-else></div>
              </div>
            </div>
            <div class="selected-display" v-show="members.length > 0">
              <label>{{ $t("ADDED_MEMBER") }}</label>
              <div class="selected">
                <user-avatar-cell
                  v-for="item in members"
                  :key="item._id"
                  :item="item"
                  :can-remove="computedCanRemove(item)"
                  @on-remove="removeUser"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
      <div class="modal-footer" slot="modal-footer">
        <button
          :disabled="computedEditBtnDisabled"
          type="submit"
          :class="computedEditBtnClass"
          @click.stop="editTeamMembers"
        >
          <span
            v-if="edit === 'doing'"
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          <span v-else-if="edit === 'todo'">{{ $t("CONFIRM") }}</span>
          <span v-else>{{ $t("DONE") }}</span>
        </button>
      </div>
    </modal>
  </div>
</template>

<script>
import vueScroll from "vuescroll";
import userCard from "@/components/userCard";
import modal from "@/components/modal";
import searchInput from "@/components/searchInput";
import userAddDeleteCell from "@/components/userAddDeleteCell";
import userAvatarCell from "@/components/userAvatarCell";
import { ops } from "@/common/theme/style";
import * as URL from "@/common/utils/url";
import { mapState, mapMutations } from "vuex";
import { parser, arrayEqual } from "@/common/utils/array";
export default {
  components: {
    vueScroll,
    userCard,
    modal,
    searchInput,
    userAddDeleteCell,
    userAvatarCell
  },
  computed: {
    ...mapState("team", ["teams"]),
    ...mapState("user", ["id", "token"]),
    computedTeamMembers() {
      const { teams, selectedTeam } = this;
      return teams[selectedTeam]["members"];
    },
    computedIsTeamCreator() {
      return function(item) {
        const { teams, selectedTeam, id } = this;
        if (!item) return teams[selectedTeam]["creator"]["_id"] === id;
        return teams[selectedTeam]["creator"]["_id"] === item["_id"];
      };
    },
    computedCanRemove() {
      return function(item) {
        const { teams, selectedTeam } = this;
        const creatorId = teams[selectedTeam]["creator"]["_id"];
        return item["_id"] !== creatorId;
      };
    },
    computedSearchUrl() {
      return URL.POST_SEARCH_USER();
    },
    computedShowSearchResult() {
      const { searchResult, searchValue } = this;
      let trimmedValue = searchValue.trim(" ");
      let resultObject = searchResult[trimmedValue];
      return (
        trimmedValue && resultObject != null && resultObject.data.length > 0
      );
    },
    computedTeamMemberIds() {
      const { computedTeamMembers } = this;
      return parser(computedTeamMembers, "_id");
    },
    computedEditBtnDisabled() {
      const { edit, computedTeamMemberIds, members } = this;
      let teamMembersIds = members.map(val => val["_id"]);
      let disabled =
        edit !== "todo" || arrayEqual(teamMembersIds, computedTeamMemberIds);
      return disabled;
    },
    computedEditBtnClass() {
      const { edit } = this;
      return `btn btn-sm btn-${
        edit === "done" ? "success" : "primary"
      } create-btn`;
    }
  },
  data() {
    return {
      selectedTeam: 0,
      searchResult: {},
      searchValue: "",
      searchLimit: 5,
      ops,
      members: [],
      edit: "todo",
      deleting: false,
      leaving: false
    };
  },
  methods: {
    ...mapMutations({
      edit_team_members: "team/edit_team_members",
      delete_team: "team/delete_team"
    }),
    onSearchError(err) {
      console.log(err);
    },
    onSearchResult(res) {
      const { searchLimit, searchResult } = this;
      const { data, value } = res;
      let hasMore = data.length < searchLimit ? false : true;
      let newData = searchResult[value]
        ? searchResult[value].data.concat(data)
        : data;
      let newProperty = { data: newData, hasMore };
      this.$set(this.searchResult, value, newProperty);
    },
    searchInputChange(val) {
      this.searchValue = val.trim();
    },
    removeUser(user) {
      this.members = this.members.filter(u => u._id !== user._id);
    },
    addUser(user) {
      let containUser = this.members.some(u => {
        if (u._id === user._id) return true;
      });
      if (!containUser) this.members = this.members.concat(user);
    },
    deleteTeam() {
      return this.$confirm.show({
        title: this.$t("DELETE_TEAM_TITLE"),
        message: this.$t("DELETE_TEAM_MESSAGE"),
        success: async () => {
          try {
            const { teams, selectedTeam } = this;
            const teamId = teams[selectedTeam]["_id"];
            let url = URL.DELETE_TEAM(teamId);
            this.deleting = true;
            const resp = await this.$http.delete(url);
            if (resp.data.data === "ok") this.delete_team(teamId);
          } catch (err) {
          } finally {
            this.deleting = false;
          }
        },
        confirmLabel: this.$t("CONFIRM"),
        cancelLabel: this.$t("CANCEL")
      });
    },
    editMember() {
      let modal = this.$refs["edit-team-members"];
      if (modal) modal.show();
    },
    async editTeamMembers() {
      try {
        const { teams, selectedTeam, id, members } = this;
        const teamId = teams[selectedTeam]["_id"];
        const memberIds = parser(members, "_id");
        const url = URL.PUT_EDIT_TEAM_MEMBER();
        const data = {
          memberIds,
          teamId
        };
        this.edit = "doing";
        const resp = await this.$http.put(url, data);
        if (resp.data.data === "ok")
          this.edit_team_members({ teamId, members });
        this.edit = "done";
        setTimeout(() => {
          let modal = this.$refs["edit-team-members"];
          if (modal) return modal.hide();
        }, 1000);
      } catch (err) {
        this.edit = "todo";
      }
    },
    leaveTeam() {
      return this.$confirm.show({
        title: this.$t("LEAVE_TEAM_TITLE"),
        message: this.$t("LEAVE_TEAM_MESSAGE"),
        success: async () => {
          try {
            const { teams, selectedTeam, id } = this;
            const teamId = teams[selectedTeam]["_id"];
            let url = URL.PUT_LEAVE_TEAM();
            this.leaving = true;
            const resp = await this.$http.put(url, { teamId, userId: id });
            if (resp.data.data === "ok") this.delete_team(teamId);
          } catch (err) {
          } finally {
            this.leaving = false;
          }
        },
        confirmLabel: this.$t("CONFIRM"),
        cancelLabel: this.$t("CANCEL")
      });
    }
  },
  watch: {
    selectedTeam(newVal, oldVal) {
      const members = this.teams[newVal]["members"];
      this.members = members;
    }
  },
  created() {
    this.members = this.teams[this.selectedTeam]["members"];
  }
};
</script>

<style lang="scss" scoped>
.team-selection {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 98%;
  height: 100px;
  margin-left: 2%;
}
.team-member {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 98%;
  margin-left: 2%;
  .members {
    width: 50%;
    min-width: 720px;
    border-radius: 10px;
    border: 1px gainsboro solid;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
    .member {
      width: 25%;
      min-width: 180px;
      height: 100px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  }
}
.team-ops {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 28%;
  margin-left: 2%;
  height: 100px;
  a {
    cursor: pointer;
    width: 40%;
    min-width: 120px;
    border: 1px lightgrey solid;
    box-shadow: -5px 2px 5px gainsboro;
    -webkit-box-shadow: -5px 2px 5px gainsboro;
    height: 40px;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  a:active {
    -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
    box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
  }
}

.source-display {
  width: 100%;
  height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  .user-cell-wrapper {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.selected-display {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-top: 10px;
}
.selected {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  margin-top: 10px;
  .selected-user {
    cursor: pointer;
    width: 20%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    .selected-user-remove {
      position: absolute;
      top: 0px;
      right: 10px;
      width: 20px;
      height: 20px;
      font-weight: bold;
    }
  }
}
</style>
