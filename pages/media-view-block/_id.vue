<template>
  <div v-if="mediaListData && Object.keys(mediaListData).length">
    <v-btn color="primary" @click="goBack" class="my-2">
      <v-icon color="white"> mdi-arrow-left </v-icon> Back</v-btn
    >
    <v-btn
      color="primary"
      class="ml-4 my-2"
      v-if="
        userPrivileges[$route.name] &&
        userPrivileges[$route.name].includes('update')
      "
      @click="update(mediaListData)"
    >
      <v-icon color="white">mdi-pencil</v-icon>Edit
    </v-btn>
    <v-card v-if="mediaListData && mediaListData.id" class="mx-auto my-6">
      <!--Informtion -->
      <v-row>
        <v-col sm="12" md="12" lg="12">
          <v-card light elevation="3" class="ma-3">
            <v-card-text>
              <div class="d-flex justify-start flex-wrap">
                <v-card-title class="pa-0 primary--text"
                  >Information</v-card-title
                >
              </div>
              <v-divider class="mx-0 my-3"></v-divider>
              <v-row>
                <v-col sm="12" md="6" lg="6">
                  <span class=""><small>Asset Code1:</small></span>
                  <v-card-title class="pa-0 text--primary">
                    {{ mediaListData.assetCode }}</v-card-title
                  >
                </v-col>
                <v-col sm="12" md="6" lg="6">
                  <span class=""><small>Vendor Asset Code:</small></span>
                  <v-card-title class="pa-0 text--primary">
                    {{ mediaListData.vendorAssetCode }}</v-card-title
                  >
                </v-col>
                <v-col sm="12" md="6" lg="6">
                  <span class="">
                    <!-- <small>Owned By Org ID:</small> -->
                    <small>Owned By Org Name:</small>
                  </span>
                  <v-card-title class="pa-0 text--primary">
                    <!-- {{ mediaListData.ownedByOrgId.id }} -->
                    {{ mediaListData.ownedByOrgId.name }}
                  </v-card-title>
                </v-col>
                <v-col sm="12" md="6" lg="6">
                  <span class=""><small>Status:</small></span>
                  <v-card-title
                    class="pa-0 text--primary"
                    v-if="mediaListData.status && mediaListData.status.value"
                  >
                    {{ mediaListData.status.value }}</v-card-title
                  >
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Attributes -->
      <v-row>
        <v-col sm="12" md="12" lg="12">
          <v-card light elevation="3" class="ma-3">
            <v-card-text>
              <div class="d-flex justify-start flex-wrap">
                <v-card-title class="pa-0 primary--text"
                  >Attributes</v-card-title
                >
              </div>
              <v-divider class="mx-0 my-3"></v-divider>
              <v-row>
                <v-col sm="12" md="6" lg="6">
                  <span class=""><small>Length:</small></span>
                  <v-card-title class="pa-0 text--primary">
                    {{ mediaListData.length }}</v-card-title
                  >
                </v-col>
                <v-col sm="12" md="6" lg="6">
                  <span class=""><small>Width:</small></span>
                  <v-card-title class="pa-0 text--primary">
                    {{ mediaListData.width }}</v-card-title
                  >
                </v-col>
                <v-col sm="12" md="6" lg="6">
                  <span class=""><small>Height:</small></span>
                  <v-card-title class="pa-0 text--primary">
                    {{ mediaListData.height }}</v-card-title
                  >
                </v-col>
                <v-col sm="12" md="6" lg="6">
                  <span class=""><small>Orientation:</small></span>
                  <v-card-title
                    class="pa-0 text--primary"
                    v-if="
                      mediaListData.orientation &&
                      mediaListData.orientation.value
                    "
                  >
                    {{ mediaListData.orientation.value }}</v-card-title
                  >
                </v-col>
                <v-col sm="12" md="6" lg="6">
                  <span class=""><small>Capture Frequency:</small></span>
                  <v-card-title
                    class="pa-0 text--primary"
                    v-if="
                      mediaListData.captureFrequency &&
                      mediaListData.captureFrequency.value
                    "
                  >
                    {{ mediaListData.captureFrequency.value }}</v-card-title
                  >
                </v-col>
                <v-col sm="12" md="6" lg="6">
                  <span class=""><small>Illumination:</small></span>
                  <v-card-title
                    class="pa-0 text--primary"
                    v-if="
                      mediaListData.illumination &&
                      mediaListData.illumination.value
                    "
                  >
                    {{ mediaListData.illumination.value }}</v-card-title
                  >
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Location -->
      <v-row>
        <v-col sm="12" md="12" lg="12">
          <v-card light elevation="3" class="ma-3">
            <v-card-text>
              <div class="d-flex justify-start flex-wrap">
                <v-card-title class="pa-0 primary--text">Location</v-card-title>
              </div>
              <v-divider class="mx-0 my-3"></v-divider>
              <v-row>
                <v-col sm="12" md="6" lg="4">
                  <span class=""><small>Latitude:</small></span>
                  <v-card-title
                    class="pa-0 text--primary"
                    v-if="mediaListData.latitude"
                  >
                    {{ mediaListData.latitude }}</v-card-title
                  >
                </v-col>
                <v-col sm="12" md="6" lg="4">
                  <span class=""><small>Longitude:</small></span>
                  <v-card-title
                    class="pa-0 text--primary"
                    v-if="mediaListData.longitude"
                  >
                    {{ mediaListData.longitude }}</v-card-title
                  >
                </v-col>
                <v-col sm="12" md="6" lg="4">
                  <span class=""><small>Road:</small></span>
                  <v-card-title
                    class="pa-0 text--primary"
                    v-if="mediaListData.road"
                  >
                    {{ mediaListData.road }}</v-card-title
                  >
                </v-col>
                <v-col sm="12" md="6" lg="4">
                  <span class=""><small>Locality:</small></span>
                  <v-card-title
                    class="pa-0 text--primary"
                    v-if="mediaListData.locality"
                  >
                    {{ mediaListData.locality }}</v-card-title
                  >
                </v-col>
                <v-col sm="12" md="6" lg="4">
                  <span class=""><small>City:</small></span>
                  <v-card-title
                    class="pa-0 text--primary"
                    v-if="mediaListData.city"
                  >
                    {{ mediaListData.city }}</v-card-title
                  >
                </v-col>
                <v-col sm="12" md="6" lg="4">
                  <span class=""><small>District:</small></span>
                  <v-card-title
                    class="pa-0 text--primary"
                    v-if="mediaListData.district"
                  >
                    {{ mediaListData.district }}</v-card-title
                  >
                </v-col>
                <v-col sm="12" md="6" lg="4">
                  <span class=""><small>State:</small></span>
                  <v-card-title
                    class="pa-0 text--primary"
                    v-if="mediaListData.state"
                  >
                    {{ mediaListData.state }}</v-card-title
                  >
                </v-col>
                <v-col sm="12" md="6" lg="4">
                  <span class=""><small>Pincode:</small></span>
                  <v-card-title
                    class="pa-0 text--primary"
                    v-if="mediaListData.pincode"
                  >
                    {{ mediaListData.pincode }}</v-card-title
                  >
                </v-col>
                <v-col sm="12" md="6" lg="4">
                  <span class=""><small>City Tier:</small></span>
                  <v-card-title
                    class="pa-0 text--primary"
                    v-if="
                      mediaListData.cityTier && mediaListData.cityTier.value
                    "
                  >
                    {{ mediaListData.cityTier.value }}</v-card-title
                  >
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Media & Placement -->
      <v-row>
        <v-col sm="12" md="12" lg="12">
          <v-card light elevation="3" class="ma-3">
            <v-card-text>
              <div class="d-flex justify-start flex-wrap">
                <v-card-title class="pa-0 primary--text"
                  >Media & Placement</v-card-title
                >
              </div>
              <v-divider class="mx-0 my-3"></v-divider>
              <v-row>
                <v-col sm="12" md="6" lg="6">
                  <span class=""><small>Media Class:</small></span>
                  <v-card-title
                    class="pa-0 text--primary"
                    v-if="
                      mediaListData.mediaClass && mediaListData.mediaClass.value
                    "
                  >
                    {{ mediaListData.mediaClass.value }}</v-card-title
                  >
                </v-col>
                <v-col sm="12" md="6" lg="6">
                  <span class=""><small>Structure Type:</small></span>
                  <v-card-title
                    class="pa-0 text--primary"
                    v-if="
                      mediaListData.structureType &&
                      mediaListData.structureType.value
                    "
                  >
                    {{ mediaListData.structureType.value }}</v-card-title
                  >
                </v-col>
                <v-col sm="12" md="6" lg="6">
                  <span class=""><small>Media Type:</small></span>
                  <v-card-title
                    class="pa-0 text--primary"
                    v-if="
                      mediaListData.mediaType && mediaListData.mediaType.value
                    "
                  >
                    {{ mediaListData.mediaType.value }}</v-card-title
                  >
                </v-col>
                <v-col sm="12" md="6" lg="6">
                  <span class=""><small>Place Type:</small></span>
                  <v-card-title
                    class="pa-0 text--primary"
                    v-if="
                      mediaListData.placeType && mediaListData.placeType.value
                    "
                  >
                    {{ mediaListData.placeType.value }}</v-card-title
                  >
                </v-col>
                <v-col sm="12" md="6" lg="6">
                  <span class=""><small>Material:</small></span>
                  <v-card-title
                    class="pa-0 text--primary"
                    v-if="
                      mediaListData.material && mediaListData.material.value
                    "
                  >
                    {{ mediaListData.material.value }}</v-card-title
                  >
                </v-col>
                <v-col sm="12" md="6" lg="6">
                  <span class=""><small>Placement Type:</small></span>
                  <v-card-title
                    class="pa-0 text--primary"
                    v-if="
                      mediaListData.placementType &&
                      mediaListData.placementType.value
                    "
                  >
                    {{ mediaListData.placementType.value }}</v-card-title
                  >
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Demography -->
      <v-row>
        <v-col sm="12" md="12" lg="12">
          <v-card light elevation="3" class="ma-3">
            <v-card-text>
              <div class="d-flex justify-start flex-wrap">
                <v-card-title class="pa-0 primary--text"
                  >Demography</v-card-title
                >
              </div>
              <v-divider class="mx-0 my-3"></v-divider>
              <v-row>
                <v-col sm="12" md="6" lg="6">
                  <span class=""><small>catchment Strata:</small></span>
                  <v-card-title
                    class="pa-0 text--primary"
                    v-if="
                      mediaListData.catchmentStrata &&
                      mediaListData.catchmentStrata.value
                    "
                  >
                    {{ mediaListData.catchmentStrata.value }}</v-card-title
                  >
                </v-col>
                <v-col sm="12" md="6" lg="6">
                  <span class=""><small>Location Type:</small></span>
                  <v-card-title
                    class="pa-0 text--primary"
                    v-if="
                      mediaListData.locationType &&
                      mediaListData.locationType.value
                    "
                  >
                    {{ mediaListData.locationType.value }}</v-card-title
                  >
                </v-col>
                <v-col sm="12" md="6" lg="6">
                  <span class=""><small>Traffic Type:</small></span>
                  <v-card-title
                    class="pa-0 text--primary"
                    v-if="
                      mediaListData.trafficType &&
                      mediaListData.trafficType.value
                    "
                  >
                    {{ mediaListData.trafficType.value }}</v-card-title
                  >
                </v-col>
                <v-col sm="12" md="6" lg="6">
                  <span class=""><small>Traffic Density:</small></span>
                  <v-card-title
                    class="pa-0 text--primary"
                    v-if="
                      mediaListData.trafficDensity &&
                      mediaListData.trafficDensity.value
                    "
                  >
                    {{ mediaListData.trafficDensity.value }}</v-card-title
                  >
                </v-col>
                <v-col sm="12" md="6" lg="6">
                  <span class=""><small>Traffic Signal:</small></span>
                  <v-card-title
                    class="pa-0 text--primary"
                    v-if="mediaListData.trafficSignal !== null"
                  >
                    {{ mediaListData.trafficSignal }}</v-card-title
                  >
                </v-col>
                <v-col sm="12" md="6" lg="6">
                  <span class=""><small>Age Group:</small></span>
                  <v-card-title
                    class="pa-0 text--primary"
                    v-if="
                      mediaListData.ageGroup && mediaListData.ageGroup.value
                    "
                  >
                    {{ mediaListData.ageGroup.value }}</v-card-title
                  >
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <!--Rating -->
      <v-row>
        <v-col sm="12" md="12" lg="12">
          <v-card light elevation="3" class="ma-3">
            <v-card-text>
              <div class="d-flex justify-start flex-wrap">
                <v-card-title class="pa-0 primary--text">Rating</v-card-title>
              </div>
              <v-divider class="mx-0 my-3"></v-divider>
              <v-row>
                <v-col sm="12" md="6" lg="6">
                  <span class=""><small>Viewing Distance:</small></span>
                  <v-card-title
                    class="pa-0 text--primary"
                    v-if="
                      mediaListData.viewingDistance &&
                      mediaListData.viewingDistance.value
                    "
                  >
                    {{ mediaListData.viewingDistance.value }}</v-card-title
                  >
                </v-col>
                <v-col sm="12" md="6" lg="6">
                  <span class=""><small>Viewing Time:</small></span>
                  <v-card-title class="pa-0 text--primary">
                    {{ mediaListData.viewingTime }}</v-card-title
                  >
                </v-col>
                <v-col sm="12" md="6" lg="6">
                  <span class=""><small>Quality:</small></span>
                  <v-card-title
                    class="pa-0 text--primary"
                    v-if="mediaListData.quality && mediaListData.quality.value"
                  >
                    {{ mediaListData.quality.value }}</v-card-title
                  >
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!--Managed By -->
      <v-row>
        <v-col sm="12" md="12" lg="12">
          <v-card light elevation="3" class="ma-3">
            <v-card-text>
              <div class="d-flex justify-start flex-wrap">
                <v-card-title class="pa-0 primary--text"
                  >Managed By</v-card-title
                >
              </div>
              <v-divider class="mx-0 my-3"></v-divider>
              <v-row>
                <v-col sm="12" md="6" lg="6">
                  <span class="">
                    <!-- <small>Managed By Org ID:</small> -->
                    <small>Managed By Org Name:</small>
                  </span>
                  <v-card-title class="pa-0 text--primary">
                    <!-- {{ mediaListData.managedByOrgId.id }} -->
                    {{ mediaListData.managedByOrgId.name }}
                  </v-card-title>
                </v-col>
                <v-col sm="12" md="6" lg="6">
                  <span class=""><small>Managed By Start Time:</small></span>
                  <v-card-title
                    class="pa-0 text--primary"
                    v-if="mediaListData.managedByStartDate !== null"
                  >
                    {{
                      new Date(mediaListData.managedByStartDate)
                        .toISOString()
                        .substring(0, 10)
                    }}</v-card-title
                  >
                </v-col>
                <v-col sm="12" md="6" lg="6">
                  <span class=""><small>Managed By End Time:</small></span>
                  <v-card-title
                    class="pa-0 text--primary"
                    v-if="mediaListData.managedByEndDate !== null"
                  >
                    {{
                      new Date(mediaListData.managedByEndDate)
                        .toISOString()
                        .substring(0, 10)
                    }}</v-card-title
                  >
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {};
  },
  created() {
    this.$store.dispatch("media/fetchMediaListData", this.$route.params.id);
  },
  computed: {
    ...mapState({
      mediaListData: (state) => state.media.mediaDataList,
      userPrivileges: (state) => state.userPrivileges,
    }),
  },
  mounted: function () {
    console.log("$route.name", this.$route.name);
  },
  methods: {
    goBack() {
      this.$router.push("/media");
      console.log("data", mediaListData);
    },
    update(data) {
      this.$router.push({ name: "media-view-id", params: { id: data.id } });
    },
  },
};
</script>
