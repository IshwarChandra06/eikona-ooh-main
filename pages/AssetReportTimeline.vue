<template>
  <v-container>
    <v-card color="primary">
      <div class="d-flex justify-start flex-wrap">
        <v-card-title class="justify-start mb-2 py-2" style="color: white"
          >Asset Report Timeline</v-card-title
        ><v-spacer></v-spacer>
        <v-btn class="ma-2" @click="$router.go(-1)">Back</v-btn>
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
                class="pa-4"
                active-class="success"
                show-arrows
              >
                <v-slide-item v-for="(asset, key2) in assetByDate" :key="key2">
                  <v-card class="ma-4 slider-card">
                    <v-img
                      :src="'data:image/png;base64,' + asset.image"
                      class="white--text align-end"
                      height="200px"
                    >
                      <v-card-title v-text="asset.time"></v-card-title>
                    </v-img>
                  </v-card>
                </v-slide-item>
              </v-slide-group>
            
            </v-col>
          </v-row>
        </v-timeline-item>
      </v-slide-x-transition>
    </v-timeline>
    <h3
      v-if="
        !loading && assetReportData && Object.keys(assetReportData).length == 0
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
  </v-container>
</template>
<script>
import { mapState } from "vuex";
export default {
  data: () => ({
    events: [],
    input: null,
    nonce: 0,
    selectedMonth: "",
    menu: false,
    model: null,
    assetId: "",
    loading: false,
  }),

  computed: {
    ...mapState({
      assetReportData: (state) => state.reports.assetReportData,
      isSearchingAssetReport: (state) => state.reports.isSearchingAssetReport,
    }),
  },
  async mounted() {
    
    console.log("params", this.$route.params["data.id"]);
  },
  methods: {
    resetFields() {
      this.selectedMonth = "";
      this.assetId = "";
    },
  },
  watch: {
    isSearchingAssetReport(val) {
      console.log("is searching asset report", val);
      this.loading = val;
    },
  },
};
</script>

<style>
.slider-card {
  width: 300px;
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
