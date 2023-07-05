export const state = () => ({
  query: {
    searchData: {},
    sortField: "id",
    sortOrder: "asc",
    pageNo: 1,
    pageSize: 10,
    orgId: 1,
  },
  masterPrivileges: [],
  privilegeStats: {},
  /* DO NOT INCLUDE UNDERSCORE (_) IN PAGE NAMES, IT WILL RESULT IN UNEXPECTED BEHAVIOUR */
  pages: ['dashboard', 'media', 'organization', 'reports', 'campaign', 'report-campaign', 'report-campaign-date', 'user-management', 'privileges', 'roles', 'campaign-view-id', 'media-view-id', 'media-view-block-id']
});

export const mutations = {
  SET_PRIVILEGES(state: any, data: any) {
    state.masterPrivileges = data;
  },
  SET_PRIVILEGE_STATS(state: any, data: any) {
    state.privilegeStats = data;
  },
};

export const actions = {
  async fetchMasterPrivileges({ commit, state, rootGetters }: any, payload: any) {
    let isDefaultQuery = false;
    if (!payload) {
      payload = JSON.parse(JSON.stringify(state.query));
      isDefaultQuery = true;
    }
    if (rootGetters.getOrgId) {
      payload.orgId = rootGetters.getOrgId;
    }
    try {
      const response2 = await (this as any).$axios.$post(
        `api/privilege/stats`,
        payload
      );
      if (isDefaultQuery) {
        payload.pageSize = response2.total_record;
      }
      commit("SET_PRIVILEGE_STATS", response2);
      const response = await (this as any).$axios.$post(
        `api/privilege/search`,
        payload
      );
      commit("SET_PRIVILEGES", response.data);
    } catch (err) {
      console.error("fetch privilege failed: " + err);
      return Promise.reject(err);
    }
  },
  async addPrivilege({ dispatch, state }: any, payload: any) {
    try {
      const response = await (this as any).$axios.$post(
        "api/privilege/create",
        payload
      );

      if (response.id) {
        dispatch("fetchMasterPrivileges");
      }
      return Promise.resolve();
    } catch (err) {
      console.error("add: " + err);
      return Promise.reject(err);
    }
  },
  async updatePrivilege({ state, dispatch }: any, payload: any) {
    try {
      const response = await (this as any).$axios.$put(
        `api/privilege/update/${payload.id || payload._id}`,
        payload
      );
      if (response.id) {
        dispatch("fetchMasterPrivileges");
      }
      return Promise.resolve();
    } catch (err) {
      console.error("update: " + err);
      return Promise.reject(err);
    }
  },
  async deletePrivilege({ commit, dispatch, state }: any, payload: any) {
    try {
      const response = await (this as any).$axios.$delete(
        `api/privilege/delete/${payload.id || payload._id}`
      );
      if (payload.id) {
        dispatch("fetchMasterPrivileges");
      }
      return Promise.resolve();
    } catch (err) {
      console.error("remove: " + err);
      return Promise.reject(err);
    }
  }
};

export const getters = {};
