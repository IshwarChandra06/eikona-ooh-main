<template>
  <v-container>
    <v-btn
      v-if="isSearching"
      @click="back"
      dark
      color="primary"
      class="back-button"
    >
      <v-icon color="white"> mdi-arrow-left </v-icon>Back</v-btn
    >
    <v-card color="primary">
      <div class="d-flex justify-start flex-wrap">
        <v-card-title class="justify-start" style="color: white"
          >Campaign Daily Report</v-card-title
        ><v-spacer></v-spacer>
        <p class="campName mt-6">{{ campaginName }}</p>
        <v-spacer></v-spacer>
        <div class="d-flex justify-space-between flex-nowrap mr-3">
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            :return-value.sync="selectedDate"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-autocomplete
                v-model="selectedFields"
                label="Add Filter"
                :items="tableFields"
                required
                multiple
                return-object
                item-text="field"
                item-value="field"
                color="white"
                dark
                class="mr-6"
              ></v-autocomplete>
              <v-text-field
                v-model="selectedDate"
                label="Select Date"
                prepend-icon="mdi-calendar"
                dark
                hide-details
                clearable
                v-bind="attrs"
                v-on="on"
                class="mr-2"
              ></v-text-field>
            </template>

            <v-date-picker
              v-model="selectedDate"
              type="date"
              no-title
              scrollable
            >
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
              <v-btn
                text
                color="primary"
                @click="$refs.menu.save(selectedDate)"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>
          <v-btn
            fab
            small
            class="ml-2 mt-3"
            :loading="loading"
            :disabled="loading"
            color="white darken-4"
            @click="searchFilter"
          >
            <v-icon color="primary"> mdi-magnify </v-icon>
          </v-btn>
        </div>
      </div>
      <v-card dark color="primary" flat>
        <div v-if="chipFields && chipFields.length">
          <v-chip
            class="ma-2 white--text"
            v-for="(item, index) in chipFields"
            :key="index"
            close
            @click:close="updateSelectedFields(item)"
            color="rgba(255,255,255,.15)"
          >
            {{ item.field }} :
            <v-text-field
              v-model="item.searchKey"
              label="value"
              flat
              single-line
              width="50px"
              @keydown="trigerFilter"
              @input="onChangeFilter"
            >
            </v-text-field>
          </v-chip>
        </div>
      </v-card>
    </v-card>

    <v-timeline
      dense
      clipped
      v-if="
        campaignDateReportData &&
        Object.keys(campaignDateReportData).length &&
        isSearching
      "
    >
      <v-slide-x-transition group>
        <v-timeline-item
          v-for="(assetByDate, key) in campaignDateReportData"
          :key="key"
          class="mb-4"
          color="pink"
          small
          ><div class="mb-3" hide-dot>
            <h3 class="primary--text">
              {{
                assetByDate.mediaSite.assetCode
                  ? assetByDate.mediaSite.assetCode
                  : "-"
              }}
            </h3>
            <h4>
              {{
                (assetByDate.mediaSite.locality
                  ? assetByDate.mediaSite.locality + ", "
                  : "") +
                (assetByDate.mediaSite.city
                  ? assetByDate.mediaSite.city + ", "
                  : "") +
                (assetByDate.mediaSite.pincode
                  ? assetByDate.mediaSite.pincode
                  : "-")
              }}
            </h4>
            <h4>
              {{
                (assetByDate.mediaSite.mediaType
                  ? assetByDate.mediaSite.mediaType.value + ", "
                  : "") +
                (assetByDate.mediaSite.material
                  ? assetByDate.mediaSite.material.value
                  : "-")
              }}
            </h4>
            <h4>
              {{
                assetByDate.mediaSite.ownedByOrgId
                  ? assetByDate.mediaSite.ownedByOrgId.name
                  : "-"
              }}
            </h4>
            <h4>
              {{
                "H: " +
                assetByDate.mediaSite.height +
                ", " +
                ("W: " + assetByDate.mediaSite.width)
              }}
            </h4>
          </div>
          <v-row justify="space-between">
            <v-col cols="12" lg="12" md="12">
              <div class="report__imageBox">
                <v-row dense>
                  <v-slide-group
                    v-model="model"
                    active-class="success"
                  >
                  <!--class="pa-4"
                    active-class="success"
                    show-arrows
                     v-viewer.options="{
                      rotatable: false,
                      title: false,
                      scalable: false,
                    }" -->
                    <v-slide-item
                      v-for="(asset, key2) in assetByDate.data"
                      :key="key2"
                    >
                      <v-card class="ma-4 slider-card">

                        <span v-if="asset.mediaSite.camera.saveImage" @click="dialogMethod(asset)">
                         
                          <!-- <img
                            :src="'data:image/png;base64,' + asset.image"
                            class="white--text align-end image"
                            width="300px"
                          /> -->
                         
                          <img 
                            :src="asset.thumbnailUrl"
                            class="white--text align-end image"
                            width="300px"
                          />
                        </span>

                        <span v-else-if="asset.mediaSite.camera.saveVideo" small @click="dialogMethod(asset)">
                          <!-- asset.mediaSite.camera.saveVideo <img
                            :src="'data:image/png;base64,' + asset.image"
                            class="white--text align-end image"
                            width="300px"
                          /> -->
                          
                          <img
                            :src="asset.videoFirstFramePath"
                            class="white--text align-end image"
                            width="300px"
                          />
                        </span>
                        <div class="overlay">{{ asset.time }}</div>
                      </v-card>
                    </v-slide-item>
                    <v-dialog v-model="dialog" v-if="dialog" :retain-focus="false" max-width="1000px" hide-overlay>
                      <v-card>
                        <v-card-text>
                          <v-container>
                            <span v-if="isImage">
                                <img height="100%" width="100%"
                                  :src="imagePath"
                                  class="white--text align-end image"
                                 
                                />
                            </span>
                            <span v-else-if="isVideo">
                              <video height="100%" width="100%" controls autoplay muted="true">
                                <source :src="videoPath" type="video/mp4">
                              </video>
                            </span>
                           
                          </v-container>
                        </v-card-text>

                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn 
                            color="primary darken-1" 
                            @click="close"> Cancel 
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </v-slide-group>
                </v-row>
              </div>
            </v-col>
          </v-row>
        </v-timeline-item>
      </v-slide-x-transition>
    </v-timeline>

    <h3
      v-if="
        !isLoadingReport &&
        campaignDateReportData &&
        !Object.keys(campaignDateReportData).length &&
        !show
      "
      class="py-5 text-center font-weight-bold primary--text"
    >
      No data available
    </h3>

    <CampaignDailyReport
      v-if="show"
      :isPage="true"
      :chipFieldsFromDailyReportPage="chipFields"
      @getCompId="grabCompId"
    />
    <h3
      v-if="isLoadingReport"
      class="py-5 text-center font-weight-bold primary--text"
    >
      <v-container style="height: 400px">
        <v-row class="fill-height" align-content="center" justify="center">
          <v-col class="text-subtitle-1 text-center font-weight-bold" cols="12">
            Getting your files
          </v-col>
          <v-col cols="6">
            <v-progress-linear
              color="primary accent-4"
              indeterminate
              rounded
              height="6"
            ></v-progress-linear>
          </v-col>
        </v-row>
      </v-container>
    </h3>
  </v-container>
</template>
<script>
import { mapState } from "vuex";
import CampaignDailyReport from "../components/campaign/CampaignDailyReport.vue";
import Campaign from "./campaign.vue";
import * as _ from "lodash";
import "viewerjs/dist/viewer.css";
import VueViewer from "v-viewer";
import Vue from "vue";
Vue.use(VueViewer);
export default {
  components: {
    CampaignDailyReport,
    Campaign,
  },
  data: () => ({
    isImage: false,
    isVideo: true,
    dialog :false,
    imagePath:"",
    videoPath : "",
    show: true,
    singleSelect: true,
    events: [],
    expanded: [],
    loading: true,
    isSearching: false,
    input: null,
    nonce: 0,
    selectedDate: "",
    menu: false,
    modal: false,
    campaignId: "",
    campaignData: [],
    agencyOrg: [],
    brandOrg: [],
    campaignIdFromSelector: null,
    isLoadingReport: false,
    // isBack: true,
    model: null,
    campaginName: "",
    options: { pageNumber: null, page: 1, itemsPerPage: 10 },
    loading: false,
    headers: [
      { text: "Id", align: "start", value: "id" },
      { text: "Name", value: "name" },
      { text: "Agency", value: "agency.name" },
      { text: "Brand", value: "brand.name" },
      { text: "Start Date", value: "startDate" },
      { text: "End Date", value: "endDate" },
      { text: "Owned Asset", value: "ownedAsset" },
    ],
    editedItem: {
      name: "",
      organization: {
        id: "",
      },
      agency: {
        id: "",
      },
      brand: {
        id: "",
      },
      startDate: "",
      endDate: "",
      ownedAsset: "",
      mediasite: [],
    },
    defaultItem: {
      name: "",
      organization: "",
      agency: "",
      brand: "",
      startDate: "",
      endDate: "",
      ownedAsset: "",
      mediasite: [],
    },
    tableFields: [],
    selectedFields: [],
    chipFields: [],
    comapaignSchema: {
      id: "",
      name: "",
      mediasite: "",
      agency: "",
      brand: "",
      organization: "",
      startDate: "",
      endDate: "",
    },
    campDailyPayload: {
      searchData: {},
      sortField: "id",
      sortOrder: "dec",
      pageNo: 1,
      pageSize: 10,
      orgId: null,
    },
  }),

  computed: {
    ...mapState({
      campaignDateReportData: (state) => state.reports.campaignDateReportData,
      campaignList: (state) => state.campaign.campaign,
      getCampaignData: (state) => state.campaign.campaign,
      agencyOrgList: (state) => state.organizations.agencyOrgList,
      brandOrgList: (state) => state.organizations.brandOrgList,
      isSerching: (state) => state.campaign.isSearching,
      getCampaignDaiyStats: (state) => state.campaign.campaignDailyStats,
      isSearchingCampAssetReport: (state) =>
        state.reports.isSearchingCampAssetReport,
    }),
    isNoData() {
      if (
        this.campaignDateReportData &&
        !Object.keys(this.campaignDateReportData).length &&
        this.isSearching
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  watch: {
    isSearchingCampAssetReport(val) {
      console.log("isSearchingCampAssetReport watcher", val);
      this.isLoadingReport = val;
    },
    getCampaignDaiyStats(val) {
      console.log("vals", val);
    },
    campaignDateReportData(val) {
      if (val && val.length) {
        this.loading = false;
      } else {
        this.loading = false;
      }
    },
    getCampaignData(val) {
      if (val && val.length) {
        this.loading = false;
        this.campaignData = val;
      } else {
        this.loading = false;
        this.campaignData = [];
      }
    },
    agencyOrgList(val) {
      if (val && val.length) {
        this.agencyOrg = val;
      }
    },
    brandOrgList(val) {
      if (val && val.length) {
        this.brandOrg = val;
      }
    },
    startDate(val) {
      console.log("date", val);
      this.startDate = new Date(val).toISOString();
      console.log("date", val);
    },
    endDate(val) {
      this.endDate = new Date(val).toISOString().substring(0, 10);
    },

    selectedFields(val) {
      if (val) {
        const diffOnSelection = val.filter(
          ({ field: id1 }) =>
            !this.chipFields.some(({ field: id2 }) => id2 === id1)
        );
        const diffOnDeselection = this.chipFields.filter(
          ({ field: id1 }) => !val.some(({ field: id2 }) => id2 === id1)
        );
        if (diffOnSelection && diffOnSelection.length) {
          this.chipFields = [...this.chipFields, ...diffOnSelection];
        }
        if (diffOnDeselection && diffOnDeselection.length) {
          const latestChipFIelds = this.chipFields.filter(
            ({ field: id1 }) =>
              !diffOnDeselection.some(({ field: id2 }) => id2 === id1)
          );
          this.chipFields = latestChipFIelds;
        }
        this.chipFields = JSON.parse(JSON.stringify(this.chipFields));
      }
    },
    isSerching(val) {
      console.log("searching wtach", val);
      this.loading = val;
    },
    chipFields(val) {
      if (val && !val.length) {
        this.$store.dispatch("campaign/fetchCampaignWithFilter");
      }
    },
  },
  methods: {
    close(){
      this.dialog = false
    },
    dialogMethod(asset){
      console.warn(asset)
      this.isImage = asset.mediaSite.camera.saveImage
      this.isVideo = asset.mediaSite.camera.saveVideo
      this.imagePath  = asset.originalUrl
      this.videoPath = asset.videoUrl
      this.dialog = true
    },

    async searchFilter() {
      console.log("df", this.selectedDate, this.campaignIdFromSelector);

      if (this.campaignIdFromSelector && this.selectedDate) {
        this.loading = true;
        this.show = false;
        this.isSearching = true;
        this.campDailyPayload.searchData["date"] = this.selectedDate;
        this.campDailyPayload.searchData["campaginId"] =
          this.campaignIdFromSelector;

        await this.$store.dispatch("reports/breakLoading", {
          breakLoading: false,
        });
        this.$store.dispatch("reports/cleanupReportStates");
        this.$store
          .dispatch(
            "reports/fetchCampaignDailyReportRecursive",
            this.campDailyPayload
          )
          .then(() => {})
          .catch(() => {
            this.$showErrorToast(this, "No report found");
          });
      } else {
        this.$showErrorToast(this, "Please enter the required field");
        this.loading = false;
      }
    },
    resetFields() {
      this.selectedDate = "";
      this.campaignId = "";
      this.isSearching = false;
    },
    grabCompId(selectedCamp) {
      console.log("compId", selectedCamp);

      this.campaginName = selectedCamp.name;
      this.campaignIdFromSelector =
        selectedCamp && selectedCamp.id ? selectedCamp.id : "";
    },
    back() {
      this.isSearching = false;
      this.show = true;
      this.selectedDate = "";
      this.isLoadingReport = false;
      this.campaginName = "";
      this.$store.dispatch("reports/cleanupReportStates");
      this.$store.dispatch("reports/setcampaignAssetReportSearch", {
        loader: false,
      });
      this.$store.dispatch("reports/breakLoading", { breakLoading: true });
    },
    setTableFields() {
      if (this.comapaignSchema && Object.keys(this.comapaignSchema).length) {
        const keysArray = Object.keys(this.comapaignSchema);
        keysArray.forEach((item) => {
          this.tableFields.push({ field: item, searchKey: "" });
        });
      }
    },
    updateSelectedFields(item) {
      this.chipFields = this.chipFields.filter(
        (obj) => obj.field !== item.field
      );
      this.selectedFields = this.selectedFields.filter(
        (obj) => obj.field !== item.field
      );
    },
    trigerFilter(e) {
      var obj = {
        searchData: {},
        pageNo: 1,
        pageSize: this.itemsPerPage,
      };
      if (this.sort) obj.sortField = this.sort;
      if (this.sortDirection) {
        obj.sortOrder = this.sortDirection;
      }
      if (this.chipFields && this.chipFields.length) {
        const searchObj = {};
        this.chipFields.forEach((item) => {
          item = JSON.parse(JSON.stringify(item));
          searchObj[item.field] = item.searchKey;
        });
        obj.searchData = searchObj;
      }

      if (e && e.keyCode == 13) {
        this.$store.dispatch("campaign/fetchCampaignWithFilter", obj);
      }
    },
    preparePayload() {
      var obj = {
        searchData: {},
        pageNo: 1,
        pageSize: this.itemsPerPage || 10,
      };
      if (this.sort) obj.sortField = this.sort;
      if (this.sortDirection) {
        obj.sortOrder = this.sortDirection;
      }
      if (this.chipFields && this.chipFields.length) {
        const searchObj = {};
        this.chipFields.forEach((item) => {
          item = JSON.parse(JSON.stringify(item));
          searchObj[item.field] = item.value;
        });
        obj.searchData = searchObj;
      }
      return obj;
    },
    onChangeFilter: _.debounce(function () {
      var obj = {
        searchData: {},
        pageNo: 1,
        pageSize: this.itemsPerPage || 10,
      };
      if (this.sort) obj.sortField = this.sort;
      if (this.sortDirection) {
        obj.sortOrder = this.sortDirection;
      }
      if (this.chipFields && this.chipFields.length) {
        var searchObj = {};
        this.chipFields.forEach((item) => {
          item = JSON.parse(JSON.stringify(item));
          searchObj[item.field] = item.searchKey;
        });
        obj.searchData = searchObj;
      }
      this.$store.dispatch("campaign/fetchCampaignWithFilter", obj);
    }, 1500),
  },
  created() {
    this.$store.dispatch("campaign/fetchCampaign");
    this.$store.dispatch("reports/cleanupReportStates");
    this.$store.dispatch("organizations/fetchOrgListByAgency");
    this.$store.dispatch("media/fetchOrganizations");
    this.$store.dispatch("organizations/fetchOrgListByBrand");
    this.setTableFields();
  },
};
</script>

<style>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
.back-button {
  margin-bottom: 0.4rem;
}
.container {
  padding: 3px;
}
.slider-card {
  position: relative;
  width: 100%;
  max-width: 300px;
}
.image {
  display: block;
  width: 100%;
  height: auto;
}
.overlay {
  position: absolute;
  bottom: 0;
  width: 20%;
  transition: 0.5s ease;
  opacity: 1;
  color: #fff;
  font-size: 20px;
  padding-left: 0.5rem;
}

.v-label {
  margin-top: 0.2rem;
  margin-left: 0.3rem;
  font-weight: normal;
}

.v-text-field input {
  padding-left: 0.4rem;
  font-weight: normal;
}
.v-application .ma-2 {
  padding: 1.5rem 1rem;
}
.v-chip .v-chip__content {
  font-weight: bold;
}
.theme--light.v-label {
  font-weight: normal;
}
.v-text-field input {
  font-weight: normal;
}
.v-chip {
  border-radius: 3rem;
}
.v-chip.v-size--default {
  border-radius: 3rem;
}
.v-sheet.v-card {
  border-radius: 0;
}
.campName {
  font-size: 1rem;
  color: #fff;
}

@media screen and (max-width: 768px) {
  .slider-card {
    width: 300px;
  }
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
