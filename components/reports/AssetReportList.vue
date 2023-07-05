<template>
  <div>
    <div v-if="!isShowReport">
      <v-row justify="start" align="center">
        <v-col
          v-for="item in mediaData"
          :key="item.id"
          col="12"
          xs="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-hover v-slot="{ hover }" open-delay="200">
            <v-card
              height="200px"
              color="item.color"
              :elevation="hover ? 16 : 2"
              :class="{ 'on-hover': hover }"
              class="card-sensor"
            >
              <div class="d-flex flex-no-wrap justify-space-between">
                <div>
                  <v-card-title class="text-h5 text-ellipsis font-weight-bold">
                    {{ item.locality ? item.locality + ", " : "-" }}
                    {{ item.city ? item.city : "" }}
                  </v-card-title>

                  <v-card-subtitle class="py-1 pb-0 font-weight-bold">
                    {{ item.assetCode ? item.assetCode : "-" }}
                  </v-card-subtitle>
                  <v-card-subtitle class="py-1">
                    {{ item.mediaType ? item.mediaType.value : "-" }}
                  </v-card-subtitle>
                  <v-card-subtitle class="py-1">
                    {{ item.material ? item.material.value : "-" }}
                  </v-card-subtitle>
                  <v-card-subtitle class="py-1">
                    {{ "H: " + (item.height ? item.height : "-") }},
                    {{ "W: " + (item.width ? item.width : "-") }}
                  </v-card-subtitle>
                  <v-card-subtitle class="py-1">
                    {{ item.ownedByOrgId ? item.ownedByOrgId.name : "-" }}
                  </v-card-subtitle>

                 
                </div>
              </div>
              <v-icon class="ico-sensor" color="#c72027">mdi-blur</v-icon>
              <div class="ico-actions">
                <v-icon @click="navigate(item)" class="mr-1" color="#c72027"
                  >mdi-eye</v-icon
                >
              </div>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>
    </div>

    <AssetReportTimelineVue
      v-if="isShowReport"
      :assetId="assetId"
      :selectedMonth="selectedMonth"
      @closeReport="closeReportTimeline"
      :assetCode="assetCode"
      :newRep="newRep"
      @f="f2"
    />
  </div>
</template>
<script>
import AssetReportTimelineVue from "./AssetReportTimelineNew.vue";
export default {
  props: ["mediaData", "selectedMonth", "inReport"],
  components: {
    AssetReportTimelineVue,
  },

  data() {
    return {
      mediaDataID: null,
      showAssetCards: true,
      isShowReport: false,
      assetId: null,
      assetCode: "",
      newRep: this.inReport,
    };
  },
  methods: {
    f2(val) {
      console.log("in asset", val);
      this.newRep = true;
      this.$emit("f5", this.newRep);
    },
    navigate(data) {
      console.log("dadada", data);

      if (data && data.id && this.selectedMonth) {
        this.assetId = data.id;
        this.isShowReport = true;
        this.assetCode = data.assetCode;
        this.newRep = false;
        this.$emit("p", this.newRep);
        console.log("newRep", this.newRep);
      } else {
        this.$showErrorToast(this, "Please select the required month");
      }
    },
    closeReportTimeline() {
      this.$store.dispatch("reports/cleanupReportStates");
      this.isShowReport = false;
    },
  },
};
</script>
<style scoped>
.text-ellipsis {
  white-space: nowrap;
  word-break: normal;
  overflow: hidden;
  text-overflow: ellipsis;
}
.card-sensor {
  overflow: hidden;
  cursor: pointer;
  position: relative;
}
.ico-sensor {
  position: absolute;
  font-size: 150px;
  top: 6px;
  right: -40px;
  transition: transform 0.5s ease;
}
.ico-actions {
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 8;
}
.ico-actions i {
}
.v-card:hover .ico-sensor {
  transform: scale(1.5);
}
.v-card:hover .v-btn {
  background-color: #000 !important;
}

</style>
