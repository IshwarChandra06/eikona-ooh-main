export const state = () => ({
  assetReportData: {},
  campaignAssetReportData: {},
  campaignDateReportData: {},
  isSearchingCampAssetReport: false,
  isSearchingAssetReport: false,
  assestData: [],
  isLoader: false,
  autoLoadMore: false,
  breakLoading: false,
});

export const mutations = {
  SET_ASSEST(state: any, data: any) {
    state.assestData = data;
  },
  SET_ASSET_REPORT(state: any, data: any) {
    let assetData: any = {};
    if (data && data.length > 0) {
      // Sort By Date Ascending
      //data.sort((a:any,b:any) => (a.timeStamp > b.timeStamp) ? 1 : ((b.timeStamp > a.timeStamp) ? -1 : 0))

      // Group images with same date
      data.forEach((element: any) => {
        if (!element.deleted) {
          let dateTime = new Date(element.timeStamp);

          let dateStr =
            dateTime.getFullYear() +
            "-" +
            (dateTime.getMonth() + 1) +
            "-" +
            dateTime.getDate();
          let timeStr = dateTime.getHours() + ":" + dateTime.getMinutes();

          element.date = dateStr;
          element.time = timeStr;

          if (!assetData[dateStr]) {
            assetData[dateStr] = [];
          }

          assetData[dateStr].push(element);
        }
      });
    }
    state.assetReportData = assetData;
  },
  APPEND_ASSET_REPORT(state: any, data: any) {
    let assetData: any = {};
    if (data && data.length > 0) {
      // Sort By Date Ascending
      //data.sort((a:any,b:any) => (a.timeStamp > b.timeStamp) ? 1 : ((b.timeStamp > a.timeStamp) ? -1 : 0))

      // Group images with same date
      data.forEach((element: any) => {
        if (!element.deleted) {
          let dateTime = new Date(element.timeStamp);

          let dateStr =
            dateTime.getFullYear() +
            "-" +
            (dateTime.getMonth() + 1) +
            "-" +
            dateTime.getDate();
          let timeStr = dateTime.getHours() + ":" + dateTime.getMinutes();

          element.date = dateStr;
          element.time = timeStr;

          if (!assetData[dateStr]) {
            assetData[dateStr] = [];
          }

          assetData[dateStr].push(element);
        }
      });
    }
    state.assetReportData = { ...state.assetReportData, ...assetData };

    // TODO: Need to sort
  },
  SET_CAMPAIGN_ASSET_REPORT(state: any, data: any) {
    let campaignAssetData: any = {};
    if (data && data.length > 0) {
      // Sort By Date Ascending
      //data.sort((a:any,b:any) => (a.timeStamp > b.timeStamp) ? 1 : ((b.timeStamp > a.timeStamp) ? -1 : 0))

      // Group images with same date
      data.forEach((element: any) => {
        if (!element.deleted) {
          let dateTime = new Date(element.timeStamp);
          let dateStr =
            dateTime.getFullYear() +
            "-" +
            (dateTime.getMonth() + 1) +
            "-" +
            dateTime.getDate();
          let timeStr = dateTime.getHours() + ":" + dateTime.getMinutes();

          element.date = dateStr;
          element.time = timeStr;

          if (!campaignAssetData[dateStr]) {
            campaignAssetData[dateStr] = [];
          }

          campaignAssetData[dateStr].push(element);
        }
      });
    }

    state.campaignAssetReportData = {
      ...state.campaignAssetReportData,
      ...campaignAssetData,
    };
  },

  SET_CAMPAIGN_DATE_REPORT(state: any, data: any) {
    let campaignAssetCodeData: any = {};
    if (data && data.length > 0) {
      // Sort By Date Ascending
      //data.sort((a:any,b:any) => (a.timeStamp > b.timeStamp) ? 1 : ((b.timeStamp > a.timeStamp) ? -1 : 0))
      console.log("any data", data);
      // Group images with same date
      data.forEach((element: any) => {
        if (!element.deleted) {
          let dateTime = new Date(element.timeStamp);
          let dateStr =
            dateTime.getFullYear() +
            "-" +
            (dateTime.getMonth() + 1) +
            "-" +
            dateTime.getDate();
          let timeStr = dateTime.getHours() + ":" + dateTime.getMinutes();

          element.date = dateStr;
          element.time = timeStr;

          // By Asset Code
          let assetCode = element.mediaSite ? element.mediaSite.assetCode : "-";
          console.log("check assest code", assetCode);
          if (!campaignAssetCodeData[assetCode]) {
            campaignAssetCodeData[assetCode] = {};
            campaignAssetCodeData[assetCode].data = [];
            campaignAssetCodeData[assetCode].mediaSite = element.mediaSite;
          }
          campaignAssetCodeData[assetCode].data.push(element);
        }
      });
    }
    state.campaignDateReportData = campaignAssetCodeData;
  },
  APPEND_CAMPAIGN_DATE_REPORT(state: any, data: any) {
    let campaignAssetCodeData: any = Object.assign(
      {},
      state.campaignDateReportData
    );
    if (data && data.length > 0) {
      // Sort By Date Ascending
      //data.sort((a:any,b:any) => (a.timeStamp > b.timeStamp) ? 1 : ((b.timeStamp > a.timeStamp) ? -1 : 0))
      console.log("any data", data);
      // Group images with same date
      data.forEach((element: any) => {
        if (!element.deleted) {
          let dateTime = new Date(element.timeStamp);
          let dateStr =
            dateTime.getFullYear() +
            "-" +
            (dateTime.getMonth() + 1) +
            "-" +
            dateTime.getDate();
          let timeStr = dateTime.getHours() + ":" + dateTime.getMinutes();

          element.date = dateStr;
          element.time = timeStr;

          // By Asset Code
          let assetCode = element.mediaSite ? element.mediaSite.assetCode : "-";
          console.log("check assest code", assetCode);
          if (!campaignAssetCodeData[assetCode]) {
            campaignAssetCodeData[assetCode] = {};
            campaignAssetCodeData[assetCode].data = [];
            campaignAssetCodeData[assetCode].mediaSite = element.mediaSite;
          }
          campaignAssetCodeData[assetCode].data.push(element);
        }
      });
    }
    state.campaignDateReportData = campaignAssetCodeData;
  },
  CLEANUP_STATE(state: any, data: any) {
    state.assetReportData = {};
    state.campaignAssetReportData = {};
    state.campaignDateReportData = {};
  },
  SET_IS_SEARCHING_CAMP_ASSET_REPORT(state: any, data: any) {
    state.isSearchingCampAssetReport = data;
  },
  SET_IS_SEARCHING_ASSET_REPORT(state: any, data: any) {
    state.isSearchingAssetReport = data;
  },
  SET_BTN_LOADER(state: any, data: any) {
    state.isLoader = data;
  },
  CLEAR_SEARCHING(state: any, data: any) {
    state.isSearchingAssetReport = false;
  },
  SER_AUTO_LOAD_MORE(state: any, data: any) {
    state.autoLoadMore = data;
  },
  TOGGLE_BREAK_LOADING(state: any, data: any) {
    state.breakLoading = data;
  },
};

export const actions = {
  async breakLoading({ commit, dispatch, state }: any, payload: any) {
    if (payload && Object.keys(payload).length) {
      console.log("BreakLoading", payload.breakLoading);

      commit("TOGGLE_BREAK_LOADING", payload.breakLoading);
    }
  },
  async fetchAssetReportLazy(
    { commit, dispatch, state }: any,
    { assetId, startDate, endDate, enablePageLoader = false }: any
  ) {
    try {
      let formattedStartDate =
        startDate.getFullYear() +
        "-" +
        (startDate.getMonth() + 1) +
        "-" +
        startDate.getDate();
      let formattedEndDate =
        endDate.getFullYear() +
        "-" +
        (endDate.getMonth() + 1) +
        "-" +
        endDate.getDate();

      console.log(
        "id, start, end",
        assetId,
        formattedStartDate,
        formattedEndDate
      );

      enablePageLoader ? commit("SET_IS_SEARCHING_ASSET_REPORT", true) : "";
      commit("SET_BTN_LOADER", true);
      commit("SER_AUTO_LOAD_MORE", false);

      const response = await (this as any).$axios.$get(
        `/api/eventsreport/byassetanddaterange?assetId=${assetId}&startDateStr=${formattedStartDate}&endDateStr=${formattedEndDate}`
      );

      enablePageLoader ? commit("SET_IS_SEARCHING_ASSET_REPORT", false) : "";
      commit("SET_BTN_LOADER", false);

      if (response && response.data && response.data.length <= 0) {
        commit("SER_AUTO_LOAD_MORE", true);
      }

      console.log("resp2", response);
      commit("APPEND_ASSET_REPORT", response.data);
    } catch (err) {
      console.error("fetch asset report lazy: " + err);
      return Promise.reject(err);
    }
  },

  async fetchCampaignAssetReport(
    { commit, state }: any,
    { campaginId, assetId }: any
  ) {
    if (!campaginId && !assetId) {
      console.error("fields is required");
      return;
    }
    console.log("api call", campaginId, assetId);

    try {
      await commit("SET_IS_SEARCHING_CAMP_ASSET_REPORT", true);

      const response = await (this as any).$axios.$get(
        `/api/eventsreport/bycampaginandasset?campaginId=${campaginId}&assetId=${assetId}`
      );
      commit("SET_CAMPAIGN_ASSET_REPORT", response.data);
      commit("SET_IS_SEARCHING_CAMP_ASSET_REPORT", false);
    } catch (err) {
      console.error("fetch campaign asset report: " + err);
      commit("SET_IS_SEARCHING_CAMP_ASSET_REPORT", false);
      return Promise.reject(err);
    }
  },

  //campaign media report
  async fetchCampaignMediaReport(
    { commit, state }: any,
    {
      campaginId,
      assetId,
      startDateStr,
      endDateStr,
      enablePageLoader = false,
    }: any
  ) {
    try {
      let formattedStartDate =
        startDateStr.getFullYear() +
        "-" +
        (startDateStr.getMonth() + 1) +
        "-" +
        startDateStr.getDate();
      let formattedEndDate =
        endDateStr.getFullYear() +
        "-" +
        (endDateStr.getMonth() + 1) +
        "-" +
        endDateStr.getDate();
      enablePageLoader ? commit("SET_IS_SEARCHING_ASSET_REPORT", true) : "";
      commit("SET_BTN_LOADER", true);
      commit("SER_AUTO_LOAD_MORE", false);

      const response = await (this as any).$axios.$get(
        `/api/eventsreport/bycampaginandassetanddaterange?campaginId=${campaginId}&assetId=${assetId}&startDateStr=${formattedStartDate}&endDateStr=${formattedEndDate}`
      );

      enablePageLoader ? commit("SET_IS_SEARCHING_ASSET_REPORT", false) : "";

      commit("SET_BTN_LOADER", false);

      if (response && response.data && response.data.length <= 0) {
        commit("SER_AUTO_LOAD_MORE", true);
      }

      commit("SET_IS_SEARCHING_CAMP_ASSET_REPORT", false);

      commit("SET_CAMPAIGN_ASSET_REPORT", response.data);
    } catch (err) {
      console.error("fetch campaign asset report: " + err);

      return Promise.reject(err);
    }
  },
  //end

  async fetchCampaignDateReport({ commit }: any, { campaginId, datestr }: any) {
    console.log("date", datestr);
    if (!campaginId && !datestr) {
      console.error("Fields required");
      return;
    }
    try {
      const response = await (this as any).$axios.$get(
        `/api/eventsreport/bycampaignanddate?campaginId=${campaginId}&datestr=${datestr}`
      );

      console.log("response", response);
      commit("SET_CAMPAIGN_DATE_REPORT", response.data);
    } catch (err) {
      console.error("fetch campaign date report: " + err);

      return Promise.reject(err);
    }
  },

  //New CampaignDailyReport

  async fetchCampaignDailyReport({ commit, rootGetters }: any, payload: any) {
    try {
      if (rootGetters.getOrgId) {
        payload.orgId = rootGetters.getOrgId;
      }

      const response = await (this as any).$axios.$post(
        `/api/eventsreport/bycampaignanddate`,
        payload
      );

      console.log("Campaign response", response);
      commit("SET_CAMPAIGN_DATE_REPORT", response.data);
    } catch (err) {
      console.error("fetch campaign date report: " + err);

      return Promise.reject(err);
    }
  },
  //end of New CampaignDailyReport
  async fetchCampaignDailyReportRecursive(
    { state, commit, dispatch, rootGetters }: any,
    payload: any
  ) {
    try {
      if (!state.breakLoading) {
        await commit("SET_IS_SEARCHING_CAMP_ASSET_REPORT", true);
        if (rootGetters.getOrgId) {
          payload.orgId = rootGetters.getOrgId;
        }

        const response = await (this as any).$axios.$post(
          `/api/eventsreport/bycampaignanddate`,
          payload
        );

        console.log("Campaign response", response);
        if (!state.breakLoading) {
          commit("APPEND_CAMPAIGN_DATE_REPORT", response.data);
          commit("SET_IS_SEARCHING_CAMP_ASSET_REPORT", false);
          if (response.data && response.data.length > 0) {
            payload = JSON.parse(JSON.stringify(payload));
            payload.pageNo++;
            await dispatch("fetchCampaignDailyReportRecursive", payload);
          }
        } else {
          console.log("break loading is true so diidnt append the data");
        }
      }
    } catch (err) {
      commit("SET_IS_SEARCHING_CAMP_ASSET_REPORT", false);
      console.error("fetch campaign date report: " + err);

      return Promise.reject(err);
    }
  },
  async cleanupReportStates({ commit, dispatch, state }: any, payload: any) {
    try {
      console.log("Cleaned report states");

      commit("CLEANUP_STATE");
    } catch (err) {
      console.error("cleanupReportStates: " + err);
      return Promise.reject(err);
    }
  },
  async clearIfSeraching({ commit, dispatch, state }: any) {
    console.log("clearing search");

    commit("CLEAR_SEARCHING");
  },
  async setcampaignAssetReportSearch(
    { commit, dispatch, state }: any,
    payload: any
  ) {
    if (payload && Object.keys(payload).length) {
      commit("SET_IS_SEARCHING_CAMP_ASSET_REPORT", payload.loader);
    }
  },
};

export const getters = {};
