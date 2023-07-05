<template>
  <div>
    <v-card color="primary" flat dark>
      <v-card-title>
        <v-btn class="mr-2" icon dark @click="closePopup">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        Media Report <v-spacer></v-spacer>

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
          z-index="10"
        ></v-autocomplete>

        <v-spacer></v-spacer>
        <v-btn color="white" class="black--text mr-4" @click="addMedia"
          >SELECT</v-btn
        >
      </v-card-title>
    </v-card>
    <v-card dark color="primary" flat>
      <div v-if="chipFields && chipFields.length">
        <v-chip
          class="ma-2"
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
    <!-- <p>{{ id }}{{ mediaTypeValue }}</p> -->
    <v-row justify="start" align="center" v-if="mediaData && !loading">
      <v-col
        v-for="(item, index) in mediaData"
        :key="index"
        col="12"
        xs="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-hover v-slot="{ hover }" open-delay="200">
          <v-card
            height="200px"
            :elevation="hover ? 16 : 2"
            :class="{ 'on-hover': hover }"
            class="card-sensor"
            v-model="card"
            @click="cardClick(item, index)"
            :style="index == selectedIndex ? 'border: 5px solid red' : ''"
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
          </v-card>
        </v-hover>
      </v-col>
    </v-row>

    <h3
      v-show="!loading && !(mediaData && mediaData.length)"
      class="py-5 text-center font-weight-bold primary--text"
    >
      No data available
    </h3>
    <h3 v-if="loading" class="py-5 text-center font-weight-bold primary--text">
      <v-container style="height: 400px">
        <v-row class="fill-height" align-content="center" justify="center">
          <v-col class="text-subtitle-1 text-center font-weight-bold" cols="12">
            Getting Your Media..
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

  
    <div class="pagination">
      <PaginationBar :page="'mediaListNew'" @changePage="onPageChange" />
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import PaginationBar from "../../components/media/paginationBar.vue";
export default {
  props: ["selectedCampaign", "isMediaPopUp"],
  components: {
    PaginationBar,
  },
  data() {
    return {
      dialogDelete: false,
      mediaDataID: null,
      card: "",
      mediaTypeValue: null,
      id: null,
      isChangeColor: null,
      selectedIndex: null,
      searchMedia: "",
      loading: false,
      sort: "id",
      sortDirection: "dec",
      pageNumber: 1,
      itemsPerPage: 8,
      mediaSchema: {
        id: "",
        assetCode: "",
        vendorAssetCode: "",
        ownedByOrgId: "",
        status: "",
        length: "",
        width: "",
        height: "",
        orientation: "",
        captureFrequency: "",
        illumination: "",
        latitude: "",
        longitude: "",
        road: "",
        locality: "",
        city: "",
        district: "",
        state: "",
        pincode: "",
        cityTier: null,
        mediaClass: "",
        structureType: "",
        mediaType: "",
        placeType: "",
        material: "",
        placementType: "",
        catchmentStrata: "",
        locationType: "",
        trafficType: "",
        trafficDensity: "",
        trafficSignal: "",
        ageGroup: "",
        viewingDistance: "",
        viewingTime: "",
        quality: "",
        managedByStartDate: "",
        managedByEndDate: "",
        managedByOrgId: "",
      },
      tableFields: [],
      selectedFields: [],
      chipFields: [],
      chipFilterObj: {},
    };
  },
  created() {
    this.$store.dispatch("media/fetchMedia");
  },
  computed: {
    ...mapState({
     
      userPrivileges: (state) => state.userPrivileges,
      mediaData: (state) => state.campaignMedia.mediaDataByCampaign,
      isMediaSearching: (state) => state.campaignMedia.isMediaSearching,

    }),
  
  },
  methods: {
    onPageChange(page) {
      console.log("listening to emit", page);
      if (page > 0) {
        this.pageNumber = page;
      }
      this.triggerApi();
    },
    appendCamapiagnId(searchObj) {
      console.log("inside appendCamapiagnId");
      if (this.selectedCampaign && this.selectedCampaign.id) {
        searchObj.searchData = {
          ...searchObj.searchData,
          campaignId: String(this.selectedCampaign.id),
        };
      }
      return searchObj;
    },
    cardClick(item, index) {
      if (item.id && item.assetCode) {
        this.mediaTypeValue = item.assetCode;
        this.id = item.id;
        this.selectedIndex = index;
        console.log("index", this.selectedIndex);
      } else {
        console.log(" id or media value not found");
      }
    },
    addMedia() {
      const info = {
        mediaTypeValue: this.mediaTypeValue,
        mediaId: this.id,
      };
      if (info.mediaTypeValue) {
        this.$emit("getInfo", info);
      } else {
        console.log("no data");
        this.$showErrorToast(this, "Please select Media");
      }
    },

    update(data) {
      this.$router.push({ name: "media-view-id", params: { id: data.id } });
    },
    navigate(data) {
      this.$router.push({
        name: "media-view-block-id",
        params: { id: data.id },
      });
    },
    deleteMediaModal(data) {
      this.dialogDelete = true;
      this.mediaDataID = data.id;
    },
    deleteMedia() {
      if (this.mediaDataID != null) {
        this.$store
          .dispatch("media/deleteMediaData", this.mediaDataID)
          .then(() => {
            this.$showSuccessToast(this, "Deleted Successfully");
          })
          .catch(() => {
            this.$showErrorToast(this, "Error !");
          });
        this.dialogDelete = false;
      }
    },
    resetData() {
      this.selectedIndex = null;
    },
    closePopup() {
      this.$emit("closeMediaPopup");
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
    

      if (e && e.keyCode == 13) {
        this.triggerApi();
      }
    },
    preparePayload() {
      var obj = {
        searchData: {},
        pageNo: 1,
        pageSize: this.itemsPerPage || 8,
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
    setTableFields() {
      if (this.mediaSchema && Object.keys(this.mediaSchema).length) {
        const keysArray = Object.keys(this.mediaSchema);
        keysArray.forEach((item) => {
          this.tableFields.push({ field: item, searchKey: "" });
        });
      }
    },
    onChangeFilter: _.debounce(function () {
     
      this.triggerApi();
    }, 1500),
    async triggerApi() {
      console.log("triggerApi");
      this.resetData();
      var obj = {
        searchData: {},
        pageNo: this.pageNumber || 1,
        pageSize: this.itemsPerPage || 8,
      };
      if (this.sort) obj.sortField = this.sort;
      if (this.sortDirection) {
        obj.sortOrder = this.sortDirection;
      }

      await this.grabChipFilter();
      if (this.chipFilterObj && Object.keys(this.chipFilterObj).length) {
        obj.searchData = { ...obj["searchData"], ...this.chipFilterObj };
      }

      const searchObj = await this.appendCamapiagnId(obj);

      if (
        searchObj &&
        searchObj.searchData &&
        searchObj.searchData.campaignId
      ) {
        console.log("paylopad", searchObj);
        this.$store.dispatch(
          "campaignMedia/fetchMediaListByCampaignId",
          searchObj
        );
      } else {
        console.log("Error :: select camapaign");
      }
    },
    grabChipFilter() {
      if (this.chipFields && this.chipFields.length) {
        const searchObj = {};
        this.chipFields.forEach((item) => {
          item = JSON.parse(JSON.stringify(item));
          searchObj[item.field] = item.searchKey;
        });
        this.chipFilterObj = searchObj;
      } else {
        this.chipFilterObj = {};
      }
    },
  },
  watch: {
    
    mediaData(val) {
      console.log("mediadata state", val);
      this.loading = false;
    },

    isMediaPopUp(val) {
      if (val) {
        console.log("trigger api");
        this.triggerApi();
      }
    },

    isMediaSearching(val) {
      this.loading = val;
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
      this.loading = val;
    },
    chipFields(val) {
      if (val && !val.length) {
        this.triggerApi();
      }
    },
  },
  mounted() {
    this.resetData();
    this.triggerApi();
    this.setTableFields();
  },
};
</script>
<style scoped>
.pagination {
  position: absolute;
  display: flex;
  justify-content: center;
  bottom: 0px;
  width: 100%;
}
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

</style>
