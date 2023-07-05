export const state = () => ({
  query: {
    searchData: {},
    sortField: "id",
    sortOrder: "asc",
    pageNo: 1,
    pageSize: 10,
    orgId: 1,
  },
  roles: [],
  roleStats: {}
});

export const mutations = {
  SET_ROLES(state: any, data: any) {
    state.roles = data;
  },
  SET_ROLE_STATS(state: any, data: any) {
    state.roleStats = data;
  },
};

export const actions = {
  async fetchRoles({ commit, state, rootGetters }: any, payload: any) {
    if (!payload) {
      payload = JSON.parse(JSON.stringify(state.query));
    }
    if (rootGetters.getOrgId) {
      payload.orgId = rootGetters.getOrgId;
    }
    try {
      const response = await (this as any).$axios.$post(
        `api/roles/search`,
        payload
      );
      commit("SET_ROLES", response.data);
      const response2 = await (this as any).$axios.$post(
        `api/roles/stats`,
        payload
      );
      commit("SET_ROLE_STATS", response2);
    } catch (err) {
      console.error("fetch roles failed: " + err);
      return Promise.reject(err);
    }
  },
  async addRole({ dispatch, state }: any, payload: any) {
    try {
      const response = await (this as any).$axios.$post(
        "api/roles/create",
        payload
      );

      if (response.id) {
        dispatch("fetchRoles");
      }
      return Promise.resolve();
    } catch (err) {
      console.error("add: " + err);
      return Promise.reject(err);
    }
  },
  async updateRole({ state, dispatch }: any, payload: any) {
    try {
      const response = await (this as any).$axios.$put(
        `api/roles/update/${payload.id || payload._id}`,
        payload
      );
      if (response.id) {
        dispatch("fetchRoles");
      }
      return Promise.resolve();
    } catch (err) {
      console.error("update: " + err);
      return Promise.reject(err);
    }
  },
  async deleteRole({ commit, dispatch, state }: any, payload: any) {
    try {
      const response = await (this as any).$axios.$delete(
        `api/roles/delete/${payload.id || payload._id}`
      );
      if (payload.id) {
        dispatch("fetchRoles");
      }
      return Promise.resolve();
    } catch (err) {
      console.error("remove: " + err);
      return Promise.reject(err);
    }
  }
};

export const getters = {};
