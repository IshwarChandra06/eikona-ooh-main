<template>
  <div>
      
    <v-row  justify="start" align="center">
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
                  {{ item.ownedByOrgId ? item.ownedByOrgId.name : "-" }}
                </v-card-title>

                <v-card-subtitle class="py-1 pb-0 font-weight-bold">
                  {{ item.mediaType ? item.mediaType.value : "-" }}
                </v-card-subtitle>
                <v-card-subtitle class="py-1">
                  {{ item.material ? item.material.value : "-" }}
                </v-card-subtitle>
                <v-card-subtitle class="py-1">
                  {{ item.locality ? item.locality + ", " : "-" }}
                  {{ item.city ? item.city : "" }}
                </v-card-subtitle>
                <v-card-subtitle class="py-1">
                  {{ "H: " + (item.height ? item.height : "-") }},
                  {{ "W: " + (item.width ? item.width : "-") }}
                </v-card-subtitle>
                <v-card-subtitle class="py-1">
                  {{ item.assetCode ? item.assetCode : "-" }}
                </v-card-subtitle>

                
              </div>
            </div>
            <v-icon class="ico-sensor" color="#c72027">mdi-blur</v-icon>
            <div class="ico-actions">
              <v-icon @click="navigate(item)" color="#c72027">mdi-eye</v-icon>
            </div>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
    
  </div>
</template>
<script>
export default {
  props: ["mediaData", "searchCampaignID"],
  
  data() {
    return {
      mediaDataID: null,
      showAssetCards:true
    };
  },
  methods: {
    navigate(data) {
      if (data && data.id && this.searchCampaignID) {
        this.$store.dispatch("reports/fetchCampaignAssetReport", {
          assetId: data.id,
          campaginId: this.searchCampaignID,
        })
        .catch((err) => {
        console.error("errors", err);
      });
       this.$router.push('AssetCampaignReportTimeline')
      }
       else {
        this.$showErrorToast(this, "Please Select Campaign");
       
      }
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
  z-index: 10;
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
