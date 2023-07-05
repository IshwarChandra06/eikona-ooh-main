export const state = () => ({
  organizations: [],
  searchOrganization: {},
  lastSearchData: {},
  defaultSearchOrgData: {
    searchData: {},
    sortField: "",
    sortOrder: "dec",  
    pageNo: 1,
    pageSize: 10,
    orgId: 0,
  },
  organizationStats: {},
  orgroles: [],
  organizationDetails: {},
  agencyOrgList: [],
  brandOrgList: [],
  isSearching: false,
  isLoading: false,
});

export const mutations = {
  SET_ORGANIZATION(state: any, data: any) {
    state.organizations = data;
  },
  GET_ORGANIZATION(state: any, data: any) {
    state.searchOrganization = data;
  },
  SET_ORGANIZATION_STATS(state: any, data: any) {
    state.organizationStats = data;
  },
  SET_ORGANIZATION_DETAILS(state: any, data: any) {
    state.organizationDetails = data;
  },
  SET_DEFAULT_ORG(state: any, data: any) {
    state.defaultSearchOrgData.orgId = data;
  },
  LAST_SEARCH_DATA(state: any, data: any) {
    state.lastSearchData = data;
  },
  SET_ROLES(state: any, data: any) {
    state.orgroles = data;
  },
  SET_AGENCY_ORGLIST(state: any, data: any) {
    state.agencyOrgList = data;
  },
  SET_BRAND_ORGLIST(state: any, data: any) {
    state.brandOrgList = data;
  },
  SET_IS_SERACHING(state: any, data: any) {
    state.isSearching = data;
  },
  CLEAR_IS_SERACHING(state: any, data: any) {
    state.isSearching = data;
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
  async fetchOrganizations({ commit, state, rootGetters }: any, payload: any) {
    if (!payload) {
      payload = state.defaultSearchOrgData;
    }
    payload = JSON.parse(JSON.stringify(payload));
    if (rootGetters.getOrgId) {
      payload.orgId = rootGetters.getOrgId;
    }

    try {
      const response = await (this as any).$axios.$post(
        `api/organization/search`,
        payload
      );

      commit("LAST_SEARCH_DATA", payload);
      commit("SET_ORGANIZATION", response.data);

      const response2 = await (this as any).$axios.$post(
        `api/organization/stats`,
        payload
      );
      commit("SET_ORGANIZATION_STATS", response2);
    } catch (err) {
      console.error("fetch organizations: " + err);
      return Promise.reject(err);
    }
  },
  async fetchOrganizationsWithFilter(
    { commit, state, rootGetters, dispatch }: any,
    payload: any
  ) {
    try {
      if (!state.isSearching) {
        await dispatch("invertIsSearching");
        if (!payload) {
          payload = state.defaultSearchOrgData;
        }
        payload = JSON.parse(JSON.stringify(payload));
        if (rootGetters.getOrgId) {
          payload.orgId = rootGetters.getOrgId;
        }
        const response = await (this as any).$axios.$post(
          `api/organization/search`,
          payload
        );

        commit("LAST_SEARCH_DATA", payload);
        commit("SET_ORGANIZATION", response.data);

        dispatch("invertIsSearching");

        const response2 = await (this as any).$axios.$post(
          `api/organization/stats`,
          payload
        );
        commit("SET_ORGANIZATION_STATS", response2);
      } else {
        console.log("not trigering search");
      }
    } catch (err) {
      console.error("fetch organizations: " + err);
      dispatch("invertIsSearching");
      return Promise.reject(err);
    }
  },
  async fetchOrganizationById({ commit, state, rootGetters }: any, orgId: any) {
    try {
      const response = await (this as any).$axios.$get(
        `/api/organization/id/${orgId}`
      );
      commit("SET_ORGANIZATION_DETAILS", response);
    } catch (err) {
      console.error("fetch organization by id: " + err);
      return Promise.reject(err);
    }
  },
  async exportOrganizations({ state, rootGetters }: any, payload: any) {
    if (!payload) {
      payload = JSON.parse(JSON.stringify(state.lastSearchData));
      payload.pageSize = state.organizationStats.total_record || 10;
    }
    try {
      if (rootGetters.getOrgId) {
        payload.orgId = rootGetters.getOrgId;
      }

      const response = await (this as any).$axios.$post(
        `api/organization/search`,
        payload
      );
      console.log("searchapi", response);
      return Promise.resolve(response.data);
    } catch (err) {
      console.error("fetch organizations: " + err);
      return Promise.reject(err);
    }
  },
  async importMedia({ dispatch, state }: any, payload: any) {
    try {
      const response = await (this as any).$axios.$post(
        `api/organization/importorganization`,
        payload
      );
      console.log("importResponse", response);
    } catch (err) {
      console.error("import error media: " + err);
      return Promise.reject(err);
    }
  },
  async addOrganizations({ commit, dispatch }: any, payload: any) {
    try {
      console.log("payload", payload);
      const response = await (this as any).$axios.$post(
        "api/organization/create",
        payload
      );
      if (response.id) {
        dispatch("callDefaultSearchData", response.id);
      }
    } catch (err) {
      console.error("add: " + err);
      return Promise.reject(err);
    }
  },
  async updateOrganizations({ commit, dispatch }: any, payload: any) {
    try {
      const response = await (this as any).$axios.$put(
        `api/organization/update/${payload.id || payload._id}`,
        payload
      );
      if (payload.id) {
        dispatch("callDefaultSearchData", payload.id);
      }
    } catch (err) {
      console.error("update: " + err);
      return Promise.reject(err);
    }
  },
  async deleteOrganizations({ commit, dispatch, state }: any, payload: any) {
    try {
      const response = await (this as any).$axios.$delete(
        `api/organization/delete/${payload.id || payload._id}`
      );
      if (payload.id) {
        dispatch("fetchOrganizations", state.defaultSearchOrgData);
      }
    } catch (err) {
      console.error("remove: " + err);
      return Promise.reject(err);
    }
  },
  async orgRoles({ commit }: any) {
    try {
      const response = await (this as any).$axios.$get(`api/roles/getorgroles`);
      commit("SET_ROLES", response);
    } catch (err) {
      console.error("fetch Roles: " + err);
      return Promise.reject(err);
    }
  },

  async callDefaultSearchData({ commit, dispatch }: any, orgId: any) {
    if (orgId) {
      commit("SET_DEFAULT_ORG", orgId);
    }
    dispatch("fetchOrganizations");
  },
  async fetchOrgListByAgency(
    { commit, state, rootGetters }: any,
    payload: any
  ) {
    console.log("executing fetchOrgListByAgency");

    try {
      var agency: any = {};
      var orgRoles: any = [];
      if (rootGetters.getAllOrgRoles && rootGetters.getAllOrgRoles.length) {
        orgRoles = rootGetters.getAllOrgRoles;
      } else {
        const response = await (this as any).$axios.$get(
          `api/roles/getorgroles`
        );
        if (response && response.length) {
          orgRoles = response;
        }
      }
      if (orgRoles && orgRoles.length) {
        orgRoles = JSON.parse(JSON.stringify(orgRoles));

        const agencyIndex = orgRoles.findIndex(
          (item: any) => item.name === "Agency"
        );
        agency = orgRoles[agencyIndex];
      }

      if (agency && agency.id) {
        const response = await (this as any).$axios.$get(
          `api/organization/getorganizationbyrole/${agency.id}`,
          payload
        );

        commit("SET_AGENCY_ORGLIST", response);
      } else {
        console.log("getorganizationbyrole is not hitting..");
        return Promise.reject("Something went wrong!");
      }
    } catch (err) {
      console.error("fetch organizations: " + err);
      return Promise.reject(err);
    }
  },
  async fetchOrgListByBrand({ commit, state, rootGetters }: any, payload: any) {
    try {
      var brand: any = {};
      var orgRoles: any = [];
      if (rootGetters.getAllOrgRoles && rootGetters.getAllOrgRoles.length) {
        orgRoles = rootGetters.getAllOrgRoles;
      } else {
        const response = await (this as any).$axios.$get(
          `api/roles/getorgroles`
        );
        if (response && response.length) {
          orgRoles = response;
        }
      }
      if (orgRoles && orgRoles.length) {
        orgRoles = JSON.parse(JSON.stringify(orgRoles));

        const brandIndex = orgRoles.findIndex(
          (item: any) => item.name === "Brand"
        );
        brand = orgRoles[brandIndex];
      }

      if (brand && brand.id) {
        const response = await (this as any).$axios.$get(
          `api/organization/getorganizationbyrole/${brand.id}`,
          payload
        );

        commit("SET_BRAND_ORGLIST", response);
      } else {
        return Promise.reject("Something went wrong!");
      }
    } catch (err) {
      console.error("fetch organizations: " + err);
      return Promise.reject(err);
    }
  },
};

export const getters = {
  getOrgStats(state: any) {
    return state.organizationStats;
  },
};
