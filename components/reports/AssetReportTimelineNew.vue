<template vm.$destroy()>
  <v-container>
    <v-card color="primary">
      <div class="d-flex justify-start flex-wrap">
        <v-card-title class="justify-start mb-2 py-2" style="color: white"
          >Asset Report Timeline</v-card-title
        ><v-spacer></v-spacer>
        <p class="assetCode mt-3">{{ assetCode }}</p>
        <v-spacer></v-spacer>
        <v-btn class="ma-2" @click="clearReport">Back</v-btn>
      </div>
    </v-card>
    <v-timeline
      dense
      clipped
      v-if="!loading && assetReportData && Object.keys(assetReportData).length"
    >
      <v-slide-x-transition group>
        <v-timeline-item
          v-for="(assetByDate, key) in assetReportData"
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
                v-model="model"
                
                active-class="success"
                show-arrows
               
              >
              <!-- class="pa-4"
              v-viewer.options="{
                  rotatable: false,
                  title: false,
                  scalable: false,
                }" -->
                <v-slide-item v-for="(asset, key2) in assetByDate" :key="key2">
                  <v-card class="mx-2 slider-card">
                    <!-- <img
                      :src="'data:image/png;base64,' + asset.image"
                      class="white--text align-end image"
                    />
                    <div class="overlay">{{ asset.time }}</div> -->

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
                <v-dialog v-model="dialog"  v-if="dialog" :retain-focus="false" max-width="1000px" hide-overlay>
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
                              <video id="video_container" height="100%" width="100%" controls autoplay>
                                <source :src="videoPath" type="video/mp4" >
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
      v-if="
        !loading &&
        assetReportData &&
        Object.keys(assetReportData).length == 0 &&
        !isLoader
      "
      class="py-5 text-center font-weight-bold primary--text"
    >
      No data available
    </h3>

    <h3 v-if="loading" class="py-5 text-center font-weight-bold primary--text">
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
      v-if="!loading && showLoadMoreBtn"
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
Vue.use(VueViewer);
export default {
  props: ["assetId", "selectedMonth", "assetCode", "newRep"],
  data: () => ({
    isImage: false,
    isVideo: true,
    dialog :false,
    imagePath:"",
    videoPath : "",
    events: [],
    input: null,
    nonce: 0,
    menu: false,
    model: null,
    loading: false,
    scrolledToBottom: false,
    enableScroll: false,
    bottomOfWindow: false,
    startDate: new Date(),
    endDate: new Date(),
    lazyLoadingPageSize: 5,
    pageCounter: 0,
    buttonLoader: false,
    showLoadMoreBtn: true,
  }),
  computed: {
    ...mapState({
      assetReportData: (state) => state.reports.assetReportData,
      isSearchingAssetReport: (state) => state.reports.isSearchingAssetReport,
      isLoader: (state) => state.reports.isLoader,
      autoLoadMore: (state) => state.reports.autoLoadMore,
    }),
  },
  created() {
    this.scroll();
  },
  async mounted() {
    this.startDate = new Date(this.selectedMonth);
    this.startDate.setMonth(this.startDate.getMonth() + 1);
    this.startDate.setDate(
      this.startDate.getDate() - 1 - this.lazyLoadingPageSize
    );

    this.endDate = new Date(this.startDate);
    this.endDate.setDate(this.endDate.getDate() + this.lazyLoadingPageSize);

    console.log("start - end", this.startDate, this.endDate);
    this.enableScroll = true;

    this.loading = true;
    console.log(
      "this.mediaData && this.selectedMonth",
      this.assetId,
      this.selectedMonth
    );

    if (this.assetId && this.selectedMonth) {
      this.$store.dispatch("reports/fetchAssetReportLazy", {
        assetId: this.assetId,
        month: this.selectedMonth,
        startDate: this.startDate,
        endDate: this.endDate,
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
      this.isImage = asset.mediaSite.camera.saveImage
      this.isVideo = asset.mediaSite.camera.saveVideo
      this.imagePath  = asset.originalUrl
      this.videoPath = asset.videoUrl
      this.dialog = true
    },

    scroll() {
      window.onscroll = () => {
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
        new Date(this.selectedMonth).getMonth() != this.startDate.getMonth() &&
        new Date(this.selectedMonth).getMonth() == this.endDate.getMonth()
      ) {
        this.startDate = new Date(this.endDate);
        this.startDate.setDate(1);
      }

      console.log("start - end - watch", this.startDate, this.endDate);
      if (
        this.assetId &&
        this.selectedMonth &&
        new Date(this.selectedMonth).getMonth() == this.startDate.getMonth()
      ) {
        this.$store.dispatch("reports/fetchAssetReportLazy", {
          assetId: this.assetId,
          startDate: this.startDate,
          endDate: this.endDate,
        });
      }
    },
    clearReport() {
      console.log("newRep2", this.newRep);
      this.$emit("f", this.newRep);
      this.assetCode = "";
      this.$store.dispatch("reports/clearIfSeraching");
      this.$emit("closeReport");
    },
    computeLoadingBtn() {
      this.showLoadMoreBtn =
        new Date(this.selectedMonth).getMonth() == this.startDate.getMonth();
    },
  },

  watch: {
    isSearchingAssetReport(val) {
      console.log("is searching asset report", val);
      this.loading = val;
    },
    bottomOfWindow(val) {
      if (val) {
        this.startDate.setDate(
          this.startDate.getDate() - this.lazyLoadingPageSize
        );
        this.endDate.setDate(this.endDate.getDate() - this.lazyLoadingPageSize);

        console.log("start - end - watch", this.startDate, this.endDate);

        this.computeLoadingBtn();
        if (
          new Date(this.selectedMonth).getMonth() !=
            this.startDate.getMonth() &&
          new Date(this.selectedMonth).getMonth() == this.endDate.getMonth()
        ) {
          this.startDate = new Date(this.endDate);
          this.startDate.setDate(1);
        }
        if (
          this.assetId &&
          this.selectedMonth &&
          new Date(this.selectedMonth).getMonth() == this.startDate.getMonth()
        ) {
          this.$store.dispatch("reports/fetchAssetReportLazy", {
            assetId: this.assetId,
            startDate: this.startDate,
            endDate: this.endDate,
          });
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
.slider-card {
  position: relative;
  width: 300px;
  height: auto;
}
.image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
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
.assetCode {
  color: #fff;
  font-size: 1rem;
  margin-right: 5rem;
}
@media screen and (max-width: 768px) {
  .slider-card {
    width: 300px;
  }
}
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
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
