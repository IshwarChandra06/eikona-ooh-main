import axios from "~/plugins/axios";

export const state = () => ({
  users: [],
  searchUsers: {},
  lastUserSearchData: {},
  restData: {},
  defaultUserData: {
    searchData: {},
    sortField: "",
    sortOrder: "",
    pageNo: 1,
    pageSize: 10,
    orgId: 0,
  },
  usersStats: {},
  isSearching: false,
});

export const mutations = {
  SET_USERS(state: any, data: any) {
    state.users = data;
  },
  SET_USERS_STATS(state: any, data: any) {
    state.usersStats = data;
  },
  SET_DEFAULT_USERS(state: any, data: any) {
    state.defaultUserData.orgId = data;
  },
  LAST_USER_SEARCH_DATA(state: any, data: any) {
    state.lastUserSearchData = data;
  },
  SET_IS_SERACHING(state: any, data: any) {
    state.isSearching = data;
  },
  CLEAR_IS_SERACHING(state: any, data: any) {
    state.isSearching = data;
  },
  SET_RESET_PASSWORD(state: any, data: any) {
    state.restData = data;
  },
};

export const actions = {
  async invertIsSearching({ commit, state, rootGetters }: any, payload: any) {
    try {
      commit("SET_IS_SERACHING", !state.isSearching);
    } catch (err) {
      console.error("fetch organizations: " + err);
      return Promise.reject(err);
    }
  },
  async clearIsSearching({ commit, state, rootGetters }: any, payload: any) {
    try {
      commit("CLEAR_IS_SERACHING", false);
    } catch (err) {
      console.error("fetch clearIsSearching: " + err);
      return Promise.reject(err);
    }
  },
  async fetchUsers({ commit, state, rootGetters }: any, payload: any) {
    try {
      if (!payload) {
        payload = state.defaultUserData;
      }
      payload = JSON.parse(JSON.stringify(payload));
      if (rootGetters.getOrgId) {
        payload.orgId = rootGetters.getOrgId;
      }

      const response = await (this as any).$axios.$post(
        `api/user/search`,
        payload
      );
      commit("LAST_USER_SEARCH_DATA", payload);
      commit("SET_USERS", response.data);
      const response2 = await (this as any).$axios.$post(
        `api/user/stats`,
        payload
      );
      commit("SET_USERS_STATS", response2);
    } catch (err) {
      console.error("fetch users: " + err);
      return Promise.reject(err);
    }
  },
  async fetchUsersWithFilter(
    { commit, state, rootGetters, dispatch }: any,
    payload: any
  ) {
    try {
      if (!state.isSearching) {
        await dispatch("invertIsSearching");
        if (!payload) {
          payload = state.defaultUserData;
        }
        payload = JSON.parse(JSON.stringify(payload));
        if (rootGetters.getOrgId) {
          payload.orgId = rootGetters.getOrgId;
        }
        const response = await (this as any).$axios.$post(
          `api/user/search`,
          payload
        );

        commit("LAST_USER_SEARCH_DATA", payload);
        commit("SET_USERS", response.data);

        dispatch("invertIsSearching");

        const response2 = await (this as any).$axios.$post(
          `api/user/stats`,
          payload
        );
        commit("SET_USERS_STATS", response2);
      } else {
        console.log("not trigering search");
      }
    } catch (err) {
      console.error("fetchUsersWithFilter: " + err);
      dispatch("invertIsSearching");
      return Promise.reject(err);
    }
  },
  async addUser({ dispatch, state }: any, payload: any) {
    try {
      const response = await (this as any).$axios.$post(
        "api/user/create",
        payload
      );

      if (response.id) {
        dispatch("fetchUsers", state.defaultSearchOrgData);
      }
      return Promise.resolve();
    } catch (err) {
      console.error("add: " + err);
      return Promise.reject(err);
    }
  },
  async updateUser({ state, dispatch }: any, payload: any) {
    try {
      const response = await (this as any).$axios.$put(
        `api/user/update/${payload.id || payload._id}`,
        payload
      );
      if (response.id) {
        dispatch("fetchUsers", state.defaultSearchOrgData);
      }
      return Promise.resolve();
    } catch (err) {
      console.error("update: " + err);
      return Promise.reject(err);
    }
  },
  async deleteUser({ commit, dispatch, state }: any, payload: any) {
    try {
      const response = await (this as any).$axios.$delete(
        `api/user/delete/${payload.id || payload._id}`
      );
      if (payload.id) {
        dispatch("fetchUsers", state.defaultSearchOrgData);
      }
      return Promise.resolve();
    } catch (err) {
      console.error("remove: " + err);
      return Promise.reject(err);
    }
  },
  async callDefaultUserSearchData({ commit, dispatch }: any, orgId: any) {
    if (orgId) {
      commit("SET_DEFAULT_USERS", orgId);
    }
    dispatch("fetchUsers");
  },
  async resetPassword({ commit, dispatch }: any, payload: any) {
    try {
      const response = await (this as any).$axios.$post(
        `api/user/resetPassword`,
        payload
      );
      console.log("reset response", response);

      commit("SET_RESET_PASSWORD", response);
    } catch (err: any) {
      let errorMsg = err;
      if (err.response && err.response.data && err.response.data.message) {
        errorMsg = err.response.data.message;
      }
      console.log("error message", errorMsg);

      return Promise.reject(err);
    }
  },
};

export const getters = {};
