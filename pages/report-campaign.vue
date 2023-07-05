<template>
  <div>
    <v-card color="primary" class="mb-2">
      <div class="d-flex flex-wrap">
        <v-card-title class="justify-start py-2" style="color: white"
          >Campaign Media Report </v-card-title
        ><v-spacer></v-spacer>
        <div class="Campaign mr-8">
          <h4
            class="white--text mt-4 campHeading"
            v-if="campaignIdFromSelector"
          >
            Campaign
            <p class="campText">{{ campaignIdFromSelector.camapignName }}</p>
          </h4>
        </div>
        <div class="Media ml-8">
          <h4 v-if="selectedMedia" class="white--text mt-4 mediaHeading">
            Media
            <p class="mediaText">{{ selectedMedia.mediaTypeValue }}</p>
          </h4>
        </div>
        <v-spacer></v-spacer>
        <div class="d-flex justify-space-between flex-nowrap">
          <div>
            <v-dialog v-model="dialog" fullscreen>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  class="my-4 mr-4"
                  @click="dialog = false"
                  v-bind="attrs"
                  v-on="on"
                >
                  Select Campaign
                </v-btn>
              </template>
              <CampaignDailyReport
                isPopUP="true"
                @getCompId="grabCompId"
                @closeCampPopup="dialog = false"
              />
              <v-card color="white" flat>
                <v-card-title>
                  <v-spacer></v-spacer>
                </v-card-title>
              </v-card>
            </v-dialog>
          </div>

          <div>
            <v-dialog v-model="dialog2" fullscreen>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  class="my-4 mr-4"
                  @click="toggleMediaPopup(true)"
                  v-bind="attrs"
                  v-on="on"
                  :disabled="!showMediaTab"
                >
                  Select Media
                </v-btn>
              </template>
              <MediaListNew
                :selectedCampaign="this.selectedCampaign"
                :isMediaPopUp="dialog2"
                @getInfo="grabMediaInfo"
                @closeMediaPopup="toggleMediaPopup(false)"
              />
            </v-dialog>
          </div>
        </div>
      </div>
    </v-card>

    <AssetCampaignReportTimeline
      class="mt-2"
      v-if="isShowReport"
      isComponent="true"
      :payloadForAPI="payloadForAPI"
      :selectedCampaign="selectedCampaign"
      @getInfo="grabMediaInfo"
    />
    <!-- <v-btn @click="checkData">checkData</v-btn> -->
  </div>
</template>

<script>
import { mapState } from "vuex";
import AssetCampaignReportList from "@/components/reports/AssetCampaignReportList";
import AssetCampaignReportTimeline from "@/pages/AssetCampaignReportTimeline";
import CampaignDailyReport from "../components/campaign/CampaignDailyReport.vue";
import AddMedia from "@/components/media/AddMedia";
import MediaListNew from "@/components/media/MediaListNew.vue";
export default {
  components: {
    AssetCampaignReportList,
    AddMedia,
    CampaignDailyReport,
    MediaListNew,
    AssetCampaignReportTimeline,
  },
  data() {
    return {
      searchMedia: "",
      loading: false,
      pageNumber: 1,
      itemsPerPage: 10,
      sortField: "",
      sortOrder: "asc",
      orgId: 0,
      searchData: {},
      noData: false,
      showModal: false,
      searchCampaignID: "",
      campaignIdFromSelector: null,

      dialog: false,
      dialog2: false,
      isShow: false,
      selectedMedia: "",
      cli: false,
      payloadForAPI: {},
      showMediaTab: false,
      selectedCampaign: {},
      isShowReport: false,
      campaign: null,
      media: null,
    };
  },
  created() {
    this.$store.dispatch("media/fetchMedia");
    this.$store.dispatch("campaign/fetchCampaign");
    this.$store.dispatch("reports/cleanupReportStates");
    this.$store.dispatch("organizations/fetchOrgListByAgency");
    this.$store.dispatch("media/fetchOrganizations");
    this.$store.dispatch("organizations/fetchOrgListByBrand");
  },
  computed: {
    ...mapState({
      mediaData: (state) => state.media.mediaData,
      campaignList: (state) => state.campaign.campaign,
      campaignDateReportData: (state) => state.reports.campaignDateReportData,
      agencyOrgList: (state) => state.organizations.agencyOrgList,
      brandOrgList: (state) => state.organizations.brandOrgList,
    }),
    triggerAPIforReports() {
      console.log("In computed");
      var triggerApi = false;
      return triggerApi;
    },
  },
  mounted() {
    let self = this;
  },
  methods: {
    searchFilter() {
      this.loading = true;
      const payload = {
        pageNo: this.pageNumber,
        pageSize: this.itemsPerPage,
        sortField: this.sortField,
        sortOrder: this.sortOrder,
        orgId: this.orgId,
      };
      if (this.searchMedia) {
        let tempSearchArr1 = this.searchMedia.split(",");
        let tempSearchArr2 = tempSearchArr1.filter(function (e) {
          return e != null && e.trim().length > 0;
        });
        tempSearchArr1 = tempSearchArr2.map((s) => s.trim());

        payload.searchData = { assetCode: tempSearchArr1 };
        this.loading = false;
        this.$store.dispatch("media/fetchMedia", payload);
        this.noData = false;
      } else {
        payload.searchMedia = {};
        this.$store.dispatch("media/fetchMedia", payload);
        this.loading = false;
        this.noData = true;
      }
    },
    sortOrderAction() {
      this.loading = true;
      this.noData = false;
      this.sortOrder = this.sortOrder !== "asc" ? "asc" : "dec";
      const obj = {
        searchData: this.searchData,
        pageNo: this.pageNumber,
        pageSize: this.itemsPerPage,
        sortField: this.sortField,
        sortOrder: this.sortOrder,
        orgId: this.orgId,
      };
      this.$store.dispatch("media/fetchMedia", obj).catch((err) => {
        console.error("errors", err);
      });
      this.loading = false;
    },
    grabCompId(selectedCamp) {
      this.selectedMedia = "";
      console.log("compId", selectedCamp);
      this.campaignIdFromSelector =
        selectedCamp && selectedCamp.id
          ? {
              camapignId: selectedCamp.id,
              camapignName: selectedCamp.name,
            }
          : "";
      this.payloadForAPI = {
        ...this.payloadForAPI,
        campaignId: selectedCamp.id,
      };
      this.selectedCampaign = selectedCamp;

      this.dialog = false;
    },
    checkData() {
      if (this.payloadForAPI && this.payloadForAPI.campaignId) {
        this.showMediaTab = true;
        this.isShowReport = false;
      }
      this.campaign = JSON.parse(JSON.stringify(this.selectedCampaign));
      this.media = JSON.parse(JSON.stringify(this.selectedMedia));
      let payloadForReport = {
        campaginId: this.payloadForAPI.campaignId,
        assetId: this.payloadForAPI.assetCode,
        startDateStr: this.selectedCampaign.startDate,
        endDateStr: this.selectedCampaign.endDate,
      };
      console.log("log", payloadForReport);
      console.log("selected ate", this.selectedCampaign.startDate);
      this.$store.dispatch(
        "reports/fetchCampaignMediaReport",
        payloadForReport
      );
    },
    add() {
      console.log("added is called");

      if (this.campaignIdFromSelector) {
        this.dialog = false;
        console.log("added", this.campaignIdFromSelector);
      } else {
        console.log("no campaign data found");
        this.$showErrorToast(this, "Please select Campaign");
      }
    },
    check() {
      if (this.campaignIdFromSelector) {
        this.campaignIdFromSelector = null;
        console.log(this.campaignIdFromSelector);
        this.dialog = false;
      } else {
        console.log("no data", this.campaignIdFromSelector);
        this.dialog = false;
        console.log("closing");
      }
    },
    grabMediaInfo(info) {
      this.selectedMedia = info;
      this.dialog2 = false;
      this.cli = true;

      this.payloadForAPI = { ...this.payloadForAPI, assetCode: info.mediaId };
    },
    toggleMediaPopup(val) {
      console.log("toggleMediaPopup", val);
      this.dialog2 = val;
    },
  },
  watch: {
    payloadForAPI(val) {
      console.log("payloadForAPI", val);
      if (val && val.campaignId) {
        this.showMediaTab = true;
        this.isShowReport = false;
      }
      let campaign = JSON.parse(JSON.stringify(this.selectedCampaign));
      let media = JSON.parse(JSON.stringify(this.selectedMedia));
      if (
        val &&
        val.campaignId &&
        val.assetCode &&
        campaign &&
        campaign.id &&
        media.mediaId &&
        this.selectedCampaign.startDate &&
        this.selectedCampaign.endDate
      ) {
        console.log("trigger search api");

        console.log("itemsPerPage", this.itemsPerPage);

        this.isShowReport = true;
      }
    },
  },
};
</script>
<style>
.inner-text {
  text-align: center;
  position: absolute;
  left: 50%;
  top: 90%;
  transform: translate(-50%, -50%);
}

.inner-text span {
  font-size: 24px;
  font-weight: 700;
}
.v-data-table,
.v-sheet.v-card {
  border-radius: 0;
}
.row {
  margin: 0;
}
.v-dialog--fullscreen {
  background-color: #ffffff;
}
.v-dialog--fullscreen > .v-card {
  min-height: 0;
}
.Campaign,
.Media {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  text-align: center;
}
.campHeading,
.mediaHeading {
  font-size: 1.25rem;
}
.campText,
.mediaText {
  font-size: 1rem;
}
</style>
