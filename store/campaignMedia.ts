export const state = () => ({
  mediaDataByCampaign: [],
  mediaDataList: {},
  lastSearchMediaData: {},
  lastCampaignId: "",
  defaultMediaData: {
    searchData: {},
    sortField: "",
    sortOrder: "",
    pageNo: 1,
    pageSize: 8,
    orgId: 0,
  },
  mediaStats: {},
  isMediaSearching: false,
  totalPages: null,
});

export const mutations = {
  SET_MEDIA_BY_CAMPAIGNID(state: any, data: any) {
    state.mediaDataByCampaign = data;
  },
  SET_MEDIA_STATS(state: any, data: any) {
    state.totalPages = data;
  },
  LAST_SEARCH_MEDIA_DATA(state: any, data: any) {
    state.lastSearchMediaData = data;
  },
  SET_IS_SERACHING_MEDIA(state: any, data: any) {
    state.isMediaSearching = data;
    console.log("state.isMediaSearching", state.isMediaSearching);
  },
  CLEAR_IS_SERACHING_MEDIA(state: any, data: any) {
    state.isMediaSearching = data;
  },
  CLEAR_MEDIA_BY_CAMPAIGNID(state: any, data: any) {
    state.mediaDataByCampaign = [];
  },
  LAST_CAMPAIGN_ID(state: any, data: any) {
    if (data && data.searchData && data.searchData.campaignId) {
      state.lastCampaignId = data.searchData.campaignId;
    }
  },
};

export const actions = {
  async invertIsSearching({ commit, state, rootGetters }: any, payload: any) {
    try {
      commit("SET_IS_SERACHING_MEDIA", !state.isMediaSearching);
    } catch (err) {
      console.error("Media isSearching error: " + err);
      return Promise.reject(err);
    }
  },
  async clearIsSearching({ commit, state, rootGetters }: any, payload: any) {
    try {
      commit("CLEAR_IS_SERACHING_MEDIA", false);
    } catch (err) {
      console.error("Media clearIsSearching: " + err);
      return Promise.reject(err);
    }
  },
  async clearMediaDataByCampaign(
    { commit, state, rootGetters }: any,
    payload: any
  ) {
    try {
      commit("CLEAR_MEDIA_BY_CAMPAIGNID");
    } catch (err) {
      console.error("Media clearIsSearching: " + err);
      return Promise.reject(err);
    }
  },
  async fetchMediaListByCampaignId(
    { commit, state, rootGetters, dispatch }: any,
    payload: any
  ) {
    if (!payload) {
      payload = state.defaultMediaData;
    }
    payload = JSON.parse(JSON.stringify(payload));
    if (rootGetters.getOrgId) {
      payload.orgId = rootGetters.getOrgId;
    }
    try {
      await dispatch("invertIsSearching");
      if (payload && payload.searchData && payload.searchData.campaignId) {
        const response = await (this as any).$axios.$post(
          `api/eventsreport/assetsbycampaginid`,
          payload
        );
        console.log("resposne", response);
        commit("LAST_SEARCH_MEDIA_DATA", payload);
        commit("SET_MEDIA_BY_CAMPAIGNID", response.data);
        commit("SET_MEDIA_STATS", response.total_pages);
        dispatch("invertIsSearching");
      }
    } catch (err) {
      console.error("fetch media: " + err);
      return Promise.reject(err);
    }
  },
};

export const getters = {};
