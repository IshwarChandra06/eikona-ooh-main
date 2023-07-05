<template>
  <div>
   
    <v-card color="primary" class="mb-2">
      <div class="d-flex flex-wrap">
        <v-card-title class="justify-start" style="color: white"
          >Media Monthly Report</v-card-title
        ><v-spacer></v-spacer>
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
        <div class="d-flex justify-space-between flex-nowrap">
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            :return-value.sync="selectedMonth"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="auto"
            z-index="10"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                class="mr-4"
                v-model="selectedMonth"
                label="Select Month"
                prepend-icon="mdi-calendar"
                dark
                clearable
                hide-details
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="selectedMonth"
              type="month"
              no-title
              scrollable
            >
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
              <v-btn
                text
                color="primary"
                @click="$refs.menu.save(selectedMonth)"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>
          
          <v-btn
            fab
            small
            class="mr-4 mt-4"
            color="white darken-4"
            @click="sortOrderAction"
          >
            <v-icon v-if="this.sortOrder == 'asc'" color="primary">
              mdi-arrow-up
            </v-icon>
            <v-icon v-else-if="this.sortOrder == 'dec'" color="primary">
              mdi-arrow-down
            </v-icon>
            <v-icon v-else color="primary"> mdi-arrow-up </v-icon>
          </v-btn>
        </div>
      </div>

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
    </v-card>
    <div>
      <AssetReportList
        v-if="!loading"
        :selectedMonth="selectedMonth"
        :mediaData="mediaData"
        class="mt-2 mb-15"
        :inReport="inReport"
        @p="p"
        @f5="f5"
      />

      <div class="p">
        <PaginationBar
          v-show="inReport"
          :page="'mediaList'"
          @changePage="onPageChange"
        />
      </div>
    </div>
    <h3
      v-show="mediaData && !mediaData.length && !loading"
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
  </div>
</template>

<script>
import { mapState } from "vuex";
import AssetReportList from "@/components/reports/AssetReportList";
import AddMedia from "@/components/media/AddMedia";
import PaginationBar from "../components/media/paginationBar.vue";

import * as _ from "lodash";
export default {
  components: {
    AssetReportList,
    AddMedia,
    PaginationBar,
  },
  data() {
    return {
      inReport: true,
      searchMedia: "",
      loading: false,
      pageNumber: 1,
      itemsPerPage: 8,
      sortField: "",
      sortOrder: "asc",
      orgId: 0,
      searchData: {},
      noData: false,
      showModal: false,
      selectedMonth: "",
      menu: false,
      modal: null,
      tableFields: [],
      selectedFields: [],
      chipFields: [],
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
    };
  },
  created() {
    this.$store.dispatch("media/fetchMedia");
  },
  computed: {
    ...mapState({
      mediaData: (state) => state.media.mediaData,
      isMediaSearching: (state) => state.media.isMediaSearching,
    }),
  },
  mounted() {
    let self = this;
   
    this.setTableFields();
  },
  methods: {
    p(val) {
      this.inReport = val;
    },
    f5(val) {
      this.inReport = true;
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
    onPageChange(page) {
      console.log("listening to emit in mdeia.vue", page);
      if (page > 0) {
        this.pageNumber = page;
      }
      this.triggerApi();
    },
    async triggerApi() {
      console.log("triggerApi");
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
      this.$store.dispatch("media/fetchMediaWithFilter", obj);
    },
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
        this.$store.dispatch("media/fetchMediaWithFilter", obj);
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
    setTableFields() {
      if (this.mediaSchema && Object.keys(this.mediaSchema).length) {
        const keysArray = Object.keys(this.mediaSchema);
        keysArray.forEach((item) => {
          this.tableFields.push({ field: item, searchKey: "" });
        });
      }
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
      this.$store.dispatch("media/fetchMediaWithFilter", obj);
    }, 1500),
  },
  watch: {
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
        this.$store.dispatch("media/fetchMediaWithFilter");
      }
    },
  },
};
</script>
<style scoped>
.p {
  position: absolute;
  display: flex;
  justify-content: center;
  bottom: 0px;
  width: 100%;
}
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
</style>
