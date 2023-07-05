export const state = () => ({
  campaign: [],
  searchCampaign: {},
  lastSearchCampaignData: {},
  defaultSearchData: {
    searchData: {},
    sortField: "id",
    sortOrder: "dec",
    pageNo: 1,
    pageSize: 10,
    orgId: 0,
  },
  campaignStats: {},
  isSearching: false,
});

export const mutations = {
  SET_CAMPAIGN(state: any, data: any) {
    state.campaign = data;
  },
  GET_CAMPAIGN(state: any, data: any) {
    state.searchCampaign = data;
  },
  SET_CAMPAIGN_STATS(state: any, data: any) {
    state.campaignStats = data;
  },
  SET_DEFAULT_CAMPAIGN(state: any, data: any) {
    state.defaultSearchData.orgId = data;
  },
  LAST_SEARCH_CAMPAIGN_DATA(state: any, data: any) {
    state.lastSearchCampaignData = data;
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
      console.error("campaign invertIsSearching: " + err);
      return Promise.reject(err);
    }
  },
  async fetchCampaign({ commit, state, rootGetters }: any, payload: any) {
    if (!payload) {
      payload = state.defaultSearchData;
    }
    payload = JSON.parse(JSON.stringify(payload));
    if (rootGetters.getOrgId) {
      payload.orgId = rootGetters.getOrgId;
    }

    try {
      const response = await (this as any).$axios.$post(
        `api/campaign/search`,
        payload
      );
      commit("LAST_SEARCH_CAMPAIGN_DATA", payload);
      commit("SET_CAMPAIGN", response.data);
      const response2 = await (this as any).$axios.$post(
        `api/campaign/stats`,
        payload
      );
      console.log("stats got called");

      commit("SET_CAMPAIGN_STATS", response2);
    } catch (err) {
      console.error("fetch campaign: " + err);
      return Promise.reject(err);
    }
  },
  async fetchCampaignWithFilter(
    { commit, state, rootGetters, dispatch }: any,
    payload: any
  ) {
    try {
      if (!state.isSearching) {
        await dispatch("invertIsSearching");
        if (!payload) {
          payload = state.defaultSearchData;
        }
        if (payload) {
          payload = JSON.parse(JSON.stringify(payload));
        }
        if (rootGetters.getOrgId) {
          payload.orgId = rootGetters.getOrgId;
        }
        const response = await (this as any).$axios.$post(
          `api/campaign/search`,
          payload
        );

        commit("LAST_SEARCH_CAMPAIGN_DATA", payload);
        commit("SET_CAMPAIGN", response.data);

        dispatch("invertIsSearching");

        const response2 = await (this as any).$axios.$post(
          `api/campaign/stats`,
          payload
        );
        commit("SET_CAMPAIGN_STATS", response2);
      } else {
        console.log("not trigering search");
      }
    } catch (err) {
      console.error("fetch CampaignWithFilter: " + err);
      dispatch("invertIsSearching");
      return Promise.reject(err);
    }
  },
  async exportCampaign({ state, rootGetters }: any, payload: any) {
    if (!payload) {
      payload = JSON.parse(JSON.stringify(state.lastSearchCampaignData));
      payload.pageSize = state.campaignStats.total_record || 10;
    }
    if (rootGetters.getOrgId) {
      payload.orgId = rootGetters.getOrgId;
    }
    try {
      const response = await (this as any).$axios.$post(
        `api/campaign/search`,
        payload
      );
      return Promise.resolve(response.data);
    } catch (err) {
      console.error("fetch error campaign: " + err);
      return Promise.reject(err);
    }
  },
  async addCampaign({ commit, dispatch, rootGetters }: any, payload: any) {
    try {
      if (rootGetters.getOrgId) {
        payload.organization = { id: rootGetters.getOrgId };
      }

      const response = await (this as any).$axios.$post(
        "api/campaign/create",
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
  async updateCampaign({ commit, dispatch }: any, payload: any) {
    try {
      const response = await (this as any).$axios.$put(
        `api/campaign/update/${payload.id || payload._id}`,
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
  async deleteCampaign({ commit, dispatch, state }: any, payload: any) {
    try {
      const response = await (this as any).$axios.$delete(
        `api/campaign/delete/${payload.id || payload._id}`
      );

      if (payload.id) {
        dispatch("fetchCampaign", state.defaultSearchData);
      }
    } catch (err) {
      console.error("remove: " + err);
      return Promise.reject(err);
    }
  },
  async callDefaultSearchData({ commit, dispatch }: any, orgId: any) {
    if (orgId) {
      commit("SET_DEFAULT_CAMPAIGN", orgId);
    }
    dispatch("fetchCampaign");
  },
};

export const getters = {};
