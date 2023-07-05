export const state = () => ({
  mediaData: [],
  mediaDataList: {},
  organizationsList: [],
  lastSearchMediaData: {},
  defaultMediaData: {
    searchData: {},
    sortField: "",
    sortOrder: "",
    pageNo: 1,
    pageSize: 8,
    orgId: 0,
  },
  anotherPayload: {
    searchData: {},
    sortField: "",
    sortOrder: "",
    pageNo: 1,
    pageSize: null,
    orgId: 0,
  },
  mediaStats: {},
  isMediaSearching: false,
  totalPages: null,
});

export const mutations = {
  SET_MEDIA(state: any, data: any) {
    state.mediaData = data;
  },
  APPEND_MEDIA(state: any, data: any) {
    let mediaAllData: any = state.mediaData || [];
    if (data && data.length > 0) {
      console.log("media data", data);
      data.forEach((element: any) => {
        mediaAllData.push(element);
      });
    }
    state.mediaData = mediaAllData;
  },
  SET_MEDIA_LIST_DATA(state: any, data: any) {
    state.mediaDataList = data;
  },
  SET_MEDIA_STATS(state: any, data: any) {
    state.mediaStats = data;
    state.totalPages = data.total_pages;
  },
  SET_DEFAULT_MEDIA(state: any, data: any) {
    state.defaultMediaData.orgId = data;
  },
  SET_MEDIA_ORGANIZATION(state: any, data: any) {
    state.organizationsList = data;
  },
  GET_MEDIA_ORGANIZATION(state: any, data: any) {
    state.searchOrganization = data;
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
  SET_FILTER(state: any, data: any) {
    state.anotherPayload.pageSize = data;
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
  async fetchOrganizations({ commit, state, rootGetters }: any, payload: any) {
    if (payload === undefined || payload === null) {
      payload = state.defaultMediaData;
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

      commit("SET_MEDIA_ORGANIZATION", response.data);
    } catch (err) {
      console.error("fetch organizations list: " + err);
      return Promise.reject(err);
    }
  },
  async fetchMedia(
    { commit, state, rootGetters }: any,
    payload: any,
    temp: any
  ) {
    if (!payload) {
      payload = state.defaultMediaData;
    }
    payload = JSON.parse(JSON.stringify(payload));
    if (rootGetters.getOrgId) {
      payload.orgId = rootGetters.getOrgId;
    }
    try {
      const response = await (this as any).$axios.$post(
        `api/mediasite/search`,
        payload
      );
      console.log("resposne", response);
      commit("SET_FILTER", response.filter_record);

      state.anotherPayload.pageSize = response.filter_record;
      commit("LAST_SEARCH_MEDIA_DATA", payload);
      commit("SET_MEDIA", response.data);
      const response2 = await (this as any).$axios.$post(
        `api/mediasite/stats`,
        payload
      );
      commit("SET_MEDIA_STATS", response2);
    } catch (err) {
      console.error("fetch media: " + err);
      return Promise.reject(err);
    }
  },
  // another Media
  async anotherMedia({ commit, state, rootGetters }: any, payload: any) {
    payload = state.anotherPayload;
    payload = JSON.parse(JSON.stringify(payload));
    if (rootGetters.getOrgId) {
      payload.orgId = rootGetters.getOrgId;
    }
    try {
      const response = await (this as any).$axios.$post(
        `api/mediasite/search`,
        payload
      );
      console.log("resposne", response);
      commit("LAST_SEARCH_MEDIA_DATA", payload);
      commit("SET_MEDIA", response.data);
      const response2 = await (this as any).$axios.$post(
        `api/mediasite/stats`,
        payload
      );
      commit("SET_MEDIA_STATS", response2);
    } catch (err) {
      console.error("fetch media: " + err);
      return Promise.reject(err);
    }
  },

  // fetch media recursive
  async fetchMediaRecursive(
    { commit, dispatch, state, rootGetters }: any,
    payload: any
  ) {
    if (!payload) {
      payload = state.defaultMediaData;
    }
    console.log("got called again");
    payload = JSON.parse(JSON.stringify(payload));
    if (rootGetters.getOrgId) {
      payload.orgId = rootGetters.getOrgId;
    }
    try {
      if (payload.pageNo == 1) {
        commit("SET_MEDIA", []);
        const response2 = await (this as any).$axios.$post(
          `api/mediasite/stats`,
          payload
        );
        commit("SET_MEDIA_STATS", response2);
        commit("LAST_SEARCH_MEDIA_DATA", JSON.parse(JSON.stringify(payload)));
      }

      const response = await (this as any).$axios.$post(
        `api/mediasite/search`,
        payload
      );
      commit("APPEND_MEDIA", response.data);
      if (response.data && response.data.length > 0) {
        payload.pageNo++;
        await dispatch("fetchMediaRecursive", payload);
      }
    } catch (err) {
      console.error("fetch media: " + err);
      return Promise.reject(err);
    }
  },
  // end
  async fetchMediaWithFilter(
    { commit, state, rootGetters, dispatch }: any,
    payload: any
  ) {
    try {
      if (!state.isSearching) {
        await dispatch("invertIsSearching");
        if (!payload) {
          payload = state.defaultMediaData;
        }
        if (payload) {
          payload = JSON.parse(JSON.stringify(payload));
        }
        if (rootGetters.getOrgId) {
          payload.orgId = rootGetters.getOrgId;
        }
        const response = await (this as any).$axios.$post(
          `api/mediasite/search`,
          payload
        );

        commit("LAST_SEARCH_MEDIA_DATA", payload);
        commit("SET_MEDIA", response.data);

        dispatch("invertIsSearching");

        const response2 = await (this as any).$axios.$post(
          `api/mediasite/stats`,
          payload
        );
        commit("SET_MEDIA_STATS", response2);
      } else {
        console.log("not trigering search for media");
      }
    } catch (err) {
      console.error("fetch mediaWithFilter: " + err);
      dispatch("invertIsSearching");
      return Promise.reject(err);
    }
  },
  async exportMedia({ state, rootGetters }: any, payload: any) {
    if (!payload) {
      payload = JSON.parse(JSON.stringify(state.lastSearchMediaData));
      payload.pageSize = state.mediaStats.total_record || 10;
    }
    if (rootGetters.getOrgId) {
      payload.orgId = rootGetters.getOrgId;
    }
    try {
      const response = await (this as any).$axios.$post(
        `api/mediasite/search`,
        payload
      );

      return Promise.resolve(response.data);
    } catch (err) {
      console.error("fetch error media: " + err);
      return Promise.reject(err);
    }
  },
  async importMedia({ dispatch }: any, payload: any) {
    try {
      const response = await (this as any).$axios.$post(
        `api/mediasite/importlist`,
        payload
      );
      dispatch("fetchMedia");
    } catch (err) {
      console.error("import error media: " + err);
      return Promise.reject(err);
    }
  },
  async fetchMediaListData({ commit }: any, id: any) {
    try {
      const response = await (this as any).$axios.$get(
        "/api/mediasite/id/" + id
      );
      commit("SET_MEDIA_LIST_DATA", response);
    } catch (err) {
      console.error("fetch media list data by id: " + err);
      return Promise.reject(err);
    }
  },
  async updateMediaData({ dispatch }: any, payload: any) {
    try {
      const response = await (this as any).$axios.$put(
        `api/mediasite/update/${payload.id}`,
        payload
      );
      dispatch("fetchMedia");
    } catch (err) {
      console.error("update media list: " + err);
      return Promise.reject(err);
    }
  },
  async addMediaData({ dispatch }: any, payload: any) {
    try {
      const response = await (this as any).$axios.$post(
        `api/mediasite/create`,
        payload
      );
      dispatch("fetchMedia");
    } catch (err) {
      console.error("add media list: " + err);
      return Promise.reject(err);
    }
  },
  async deleteMediaData({ dispatch, state }: any, id: any) {
    try {
      const response = await (this as any).$axios.$delete(
        `api/mediasite/delete/${id}`
      );
      if (id) {
        dispatch("fetchMedia", state.defaultMediaData);
      }
    } catch (err) {
      console.error("delete media list: " + err);
      return Promise.reject(err);
    }
  },
};

export const getters = {};
