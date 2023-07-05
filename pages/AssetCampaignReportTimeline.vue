<template>
  <v-container>
  
    <v-card color="primary">
      <div class="d-flex justify-start flex-wrap">
        <v-card-title class="justify-start mb-2 py-2" style="color: white"
          >{{ isComponentLocal ? "" : "Campaign Media" }} Report
          Timeline</v-card-title
        ><v-spacer></v-spacer>
        <v-btn v-if="!isComponentLocal" class="ma-2" @click="$router.go(-1)"
          >Back</v-btn
        >
      </div>
    </v-card>
    <v-timeline
      dense
      clipped
      v-if="
        !isSearching &&
        campaignAssetReportData &&
        Object.keys(campaignAssetReportData).length
      "
    >
      <v-slide-x-transition group>
        <v-timeline-item
          v-for="(assetByDate, key) in campaignAssetReportData"
          :key="key"
          class="mb-4"
          color="pink"
          small
          ><div class="mb-3" hide-dot>
            <h3>{{ key }}</h3>
          </div>
          <v-row justify="space-between">
            <v-col cols="12" lg="12" md="12">
             
              <v-slide-group
                class="pa-4"
                active-class="success"
                show-arrows
                
              >
              <!-- v-viewer.options="{
                  rotatable: false,
                  title: false,
                  scalable: false,
                }" -->
                <v-slide-item v-for="(asset, key2) in assetByDate" :key="key2">
                  <v-card class="ma-4 slider-card">
                    <!-- <img
                      :src="'data:image/png;base64,' + asset.image"
                      class="white--text align-end image"
                      width="300px"
                    /> 
                    <div class="overlay">{{ asset.time }}</div>-->

                    <span v-if="asset.mediaSite.camera.saveImage" small @click="dialogMethod(asset)">
                         
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
                         <div class="overlay">{{ asset.time }}</div>
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
                <v-dialog v-model="dialog" v-if="dialog" :retain-focus="false" max-width="100%" hide-overlay>
                      <v-card>
                        <v-card-text>
                          <v-container>
                            <span v-if="isImage">
                                <img
                                  :src="imagePath"
                                  class="white--text align-end image"
                                  width="300px"
                                />
                            </span>
                            <span v-else-if="isVideo">
                              <video height="100%" width="100%" controls autoplay>
                                <source :src="videoPath" type="video/mp4">
                              </video>
                            </span>
                            <!-- <span v-for="v in path" :key="v.id"> -->
                                <!-- <video height="100%" width="100%" controls>
                                  <source :src="videoPath" type="video/mp4">
                                </video> &nbsp; -->
                            <!-- </span> -->
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
            </v-col>
          </v-row>
        </v-timeline-item>
      </v-slide-x-transition>
    </v-timeline>

    <h3
      v-else-if="
        !isSearching &&
        campaignAssetReportData &&
        Object.keys(campaignAssetReportData).length == 0 &&
        !showLoadMoreBtn &&
        !isLoader
      "
      class="py-5 text-center font-weight-bold primary--text"
    >
      No data available
    </h3>
    <h3
      v-if="
        isSearching ||
        (campaignAssetReportData &&
          Object.keys(campaignAssetReportData).length == 0 &&
          isLoader)
      "
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

    <v-btn
      v-if="!isSearching && showLoadMoreBtn"
      dark
      primary
      color="#e0e0e0"
      class="black--text"
      elevation="0"
      block
      :loading="isLoader"
      @click="loadMore"
      >Load More</v-btn
    >
  </v-container>
</template>
<script>
import { mapState } from "vuex";
import "viewerjs/dist/viewer.css";
import VueViewer from "v-viewer";
import Vue from "vue";
import { state } from "~/store/campaign";
Vue.use(VueViewer);
export default {
  props: ["isComponent", "payloadForAPI", "selectedCampaign", "isShowReport"],
  data: () => ({
    isImage: false,
    isVideo: true,
    dialog :false,
    imagePath:"",
    videoPath : "",
    events: [],
    input: null,
    nonce: 0,
    campaignId: "",
    menu: false,
    modal: false,
    assetId: "",
    isSearching: false,
    bottomOfWindow: false,
    lazyLoadingPageSize: 5,
    startDate: new Date(),
    endDate: new Date(),
    showLoadMoreBtn: true,
    enableScroll: false,
  }),

  computed: {
    ...mapState({
      campaignAssetReportData: (state) => state.reports.campaignAssetReportData,
      isSearchingCampAssetReport: (state) =>
        state.reports.isSearchingCampAssetReport,
      isLoader: (state) => state.reports.isLoader,
      isSearchingAssetReport: (state) => state.reports.isSearchingAssetReport,
      autoLoadMore: (state) => state.reports.autoLoadMore,
    }),
    isComponentLocal() {
      var data = false;
      if (this.isComponent) {
        data = true;
        this.isSearching = true;
      }
      return data;
    },
  },
  created() {
    this.scroll();
  },
  async mounted() {
   
    const campainEndDate = new Date(this.selectedCampaign.endDate);
    const currentDate = new Date();
    let alteredEndDate = campainEndDate;

    if (campainEndDate > currentDate) {
      alteredEndDate = currentDate;
    }

    this.startDate = new Date(alteredEndDate);
    this.startDate.setDate(this.startDate.getDate() - this.lazyLoadingPageSize);

    this.endDate = new Date(alteredEndDate);

    console.log("start - end", this.startDate, this.endDate);

    this.enableScroll = true;

   

    if (this.payloadForAPI.assetCode && this.startDate && this.endDate) {
      this.$store.dispatch("reports/fetchCampaignMediaReport", {
        assetId: this.payloadForAPI.assetCode,
        campaginId: this.payloadForAPI.campaignId,
        startDateStr: this.startDate,
        endDateStr: this.endDate,
        enablePageLoader: true,
      });
    }
  },
  destroyed: function () {
    this.enableScroll = false;
    console.log("destroyed", this._inactive, this.item);
    this.$store.dispatch("reports/cleanupReportStates");
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

    searchFilter() {
      if (this.assetId && this.campaignId) {
        this.$store.dispatch("reports/fetchCampaignAssetReport", {
          assetId: this.assetId,
          campaginId: this.campaignId,
        });
      } else {
        this.$showErrorToast(this, "Please enter the required field");

        this.resetFields();
      }
    },
    resetFields() {
      this.campaignId = "";
      this.assetId = "";
    },
    clearReport() {
      this.$store.dispatch("reports/clearIfSeraching");
      this.$emit("closeReport");
    },
    computeLoadingBtn() {
      this.showLoadMoreBtn =
        new Date(this.selectedCampaign.startDate) <= this.startDate;
    },
    scroll() {
      window.onscroll = () => {
        // console.log("eableScroll", this.enableScroll);
        if (this.enableScroll) {
          this.bottomOfWindow =
            Math.max(
              window.pageYOffset,
              document.documentElement.scrollTop,
              document.body.scrollTop
            ) +
              window.innerHeight >=
            document.documentElement.offsetHeight * 0.96;
        }
      };
    },
    loadMore() {

      this.startDate.setDate(
        this.startDate.getDate() - this.lazyLoadingPageSize
      );
      this.endDate.setDate(this.endDate.getDate() - this.lazyLoadingPageSize);

      this.computeLoadingBtn();

      if (
        new Date(this.selectedCampaign.startDate) > this.startDate &&
        new Date(this.selectedCampaign.startDate) <= this.endDate
      ) {
        this.startDate = new Date(this.selectedCampaign.startDate);
      }

      console.log("start - end - watch", this.startDate, this.endDate);
      if (
        this.payloadForAPI.assetCode &&
        this.payloadForAPI.campaignId &&
        new Date(this.selectedCampaign.startDate) <= this.startDate
      ) {
        this.$store.dispatch("reports/fetchCampaignMediaReport", {
          assetId: this.payloadForAPI.assetCode,
          campaginId: this.payloadForAPI.campaignId,
          startDateStr: this.startDate,
          endDateStr: this.endDate,
        });
      }
    },

    grabMediaInfo(info) {
      this.selectedMedia = info;
      this.dialog2 = false;
      this.cli = true;

      this.payloadForAPI = { ...this.payloadForAPI, assetCode: info.mediaId };
    },
  },
  watch: {
    async isSearchingAssetReport(val) {
      console.log("is searching/.....", val);
      this.isSearching = val;
    },
    bottomOfWindow(val) {
      console.log("valu of scroll ", val);
      if (val) {
        this.startDate.setDate(
          this.startDate.getDate() - this.lazyLoadingPageSize
        );
        this.endDate.setDate(this.endDate.getDate() - this.lazyLoadingPageSize);

        console.log(
          "in watcher start - end - watch",
          this.startDate,
          this.endDate
        );

        this.computeLoadingBtn();

        if (
          new Date(this.selectedCampaign.startDate) > this.startDate &&
          new Date(this.selectedCampaign.startDate) <= this.endDate
        ) {
          this.startDate = new Date(this.selectedCampaign.startDate);
        }

        if (
          this.payloadForAPI.assetCode &&
          this.payloadForAPI.campaignId &&
          new Date(this.selectedCampaign.startDate) <= this.startDate
        ) {
          this.$store.dispatch("reports/fetchCampaignMediaReport", {
            assetId: this.payloadForAPI.assetCode,
            campaginId: this.payloadForAPI.campaignId,
            startDateStr: this.startDate,
            endDateStr: this.endDate,
          });
          console.log("inside if conditoin in watcher");
        }
        console.log("reached to bottom");
      }
    },
    autoLoadMore(val) {
      if (val) {
        this.loadMore();
      }
    },
  },
};
</script>

<style>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
.slider-card {
  position: relative;
  width: 50%;
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
