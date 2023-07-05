<template>
  <div>
    <v-card color="primary" class=" d-flex flex-wrap">
      <v-card-title class="justify-start" style="color: white"
        >Media</v-card-title
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
     
      <v-icon color="primary"> mdi-magnify </v-icon>
      <!-- </v-btn> -->
      <v-btn
        fab
        small
        class="mr-5 mt-4"
        color="white darken-4"
        @click="sortOrderAction"
      >
        <v-icon v-if="this.sortOrder == 'asc'" color="primary">
          mdi-arrow-up
        </v-icon>
        <v-icon v-else-if="this.sortOrder == 'dec'" color="primary" class="">
          mdi-arrow-down
        </v-icon>
        <v-icon v-else color="primary"> mdi-arrow-up </v-icon>
      </v-btn>

      <v-btn
        v-if="
          userPrivileges[$route.name] &&
          userPrivileges[$route.name].includes('add')
        "
        class="mt-4 mr-2"
        @click.stop="addMedia"
      >
        Add New
      </v-btn>
      <!-- Hidden the import functionality as 'id' parameter cannot be remembered to be entered in CSV by user -->
      <v-btn
        v-if="
          userPrivileges[$route.name] &&
          userPrivileges[$route.name].includes('add')
        "
        class="mt-4 mr-2"
        @click="showImportModal = true"
      >
        Import
      </v-btn>
      <v-btn class="mt-4 mr-2">
        <download-excel
          :fields="json_fields_download"
          :fetch="fetchData"
          worksheet="Media Data"
          type="csv"
          :name="getFileName('csv')"
        >
          CSV
          <v-icon right dark> mdi-download </v-icon>
        </download-excel>
      </v-btn>
      <v-btn class="mt-4 mr-2">
        <download-excel
          :fields="json_fields_download"
          :fetch="fetchData"
          worksheet="mediaData"
          :name="getFileName('xls')"
        >
          Excel
          <v-icon right dark> mdi-download </v-icon>
        </download-excel>
      </v-btn>
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

    <!-- import dialog  -->
    <v-dialog
      v-model="showImportModal"
      transition="dialog-bottom-transition"
      max-width="600"
    >
      <v-card>
        <v-toolbar color="primary" dark
          >Import Media<v-spacer></v-spacer>
          <v-btn
            href="/excel-templates/Media-Data.xlsx"
            download="Media-Data.xlsx"
            target="_blank"
            class="mt-2 mr-2"
            light
          >
            <v-icon left dark> mdi-download </v-icon> Template
          </v-btn></v-toolbar
        >

        <v-card-text>
          <v-file-input
            v-model="uploadMediaCSV"
            accept=".xls,.xlsx"
            placeholder="Upload"
            label="Upload"
            class="mt-3"
            type="file"
            ref="file"
            @change="readExcelFile"
            clearable
          ></v-file-input>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="showImportModal = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- end of import  dialog -->

    <AddMedia :showModal="showModal" @close="closePopup" />
    <div>
      <MediaList v-if="!loading" :mediaData="mediaData" class="mt-2 mb-15" />

      <div class="pagination">
        <PaginationBar :page="'mediaList'" @changePage="onPageChange" />
      </div>
    </div>

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
  </div>
</template>

<script>
import { mapState } from "vuex";
import MediaList from "@/components/media/MediaList";
import AddMedia from "@/components/media/AddMedia";
import Vue from "vue";
import JsonExcel from "vue-json-excel";
Vue.component("downloadExcel", JsonExcel);
import * as _ from "lodash";
import XLSX from "xlsx";
import PaginationBar from "../components/media/paginationBar.vue";

export default {
  components: {
    MediaList,
    AddMedia,
    PaginationBar,
  },
  data() {
    return {
      uploadMedia: "",
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
      showImportModal: false,
      uploadMediaCSV: [],
      media_fields: {
        assetCode: "assetCode",
        vendorAssetCode: "vendorAssetCode",
        ownedByOrgId: "ownedByOrgId",
        status: "status",
        viewingDistance: "ownedByOrgId",
        viewingTime: "viewingTime",
        quality: "quality",
        length: "length",
        width: "width",
        height: "height",
        orientation: "orientation",
        captureFrequency: "captureFrequency",
        illumination: "illumination",
        mediaClass: "mediaClass",
        structureType: "structureType",
        mediaType: "mediaType",
        placeType: "placeType",
        material: "material",
        placementType: "placementType",
        catchmentStrata: "catchmentStrata",
        locationType: "locationType",
        trafficType: "trafficType",
        trafficDensity: "trafficDensity",
        trafficSignal: "trafficSignal",
        ageGroup: "ageGroup",
        latitude: "latitude",
        longitude: "longitude",
        road: "road",
        locality: "locality",
        city: "city",
        district: "district",
        state: "state",
        pincode: "pincode",
        cityTier: "cityTier",
        managedByOrgId: "managedByOrgId",
        managedByStartDate: "managedByStartDate",
        managedByEndDate: "managedByEndDate",
      },
      json_fields_download: {
        assetCode: "assetCode",
        vendorAssetCode: "vendorAssetCode",
        ownedByOrgId: "ownedByOrgId.name",
        status: "status.value",
        viewingDistance: "viewingDistance.value",
        viewingTime: "viewingTime",
        quality: "quality.value",
        length: "length",
        width: "width",
        height: "height",
        orientation: "orientation.value",
        captureFrequency: "captureFrequency.value",
        illumination: "illumination.value",
        mediaClass: "mediaClass.value",
        structureType: "structureType.value",
        mediaType: "mediaType.value",
        placeType: "placeType.value",
        material: "material.value",
        placementType: "placementType.value",
        catchmentStrata: "catchmentStrata.value",
        locationType: "locationType.value",
        trafficType: "trafficType.value",
        trafficDensity: "trafficDensity.value",
        trafficSignal: "trafficSignal",
        ageGroup: "ageGroup.value",
        latitude: "latitude",
        longitude: "longitude",
        road: "road",
        locality: "locality",
        city: "city",
        district: "district",
        state: "state",
        pincode: "pincode",
        cityTier: "cityTier.value",
        managedByOrgId: "managedByOrgId.name",
        managedByStartDate: "managedByStartDate",
        managedByEndDate: "managedByEndDate",
      },
      json_fields: {
        assetCode: "assetCode",
        vendorAssetCode: "vendorAssetCode",
        ownedByOrgId: "ownedByOrgId",
        status: "status",
        viewingDistance: "viewingDistance",
        viewingTime: "viewingTime",
        quality: "quality",
        length: "length",
        width: "width",
        height: "height",
        orientation: "orientation",
        captureFrequency: "captureFrequency",
        illumination: "illumination",
        mediaClass: "mediaClass",
        structureType: "structureType",
        mediaType: "mediaType",
        placeType: "placeType",
        material: "material",
        placementType: "placementType",
        catchmentStrata: "catchmentStrata",
        locationType: "locationType",
        trafficType: "trafficType",
        trafficDensity: "trafficDensity",
        trafficSignal: "trafficSignal",
        ageGroup: "ageGroup",
        latitude: "latitude",
        longitude: "longitude",
        road: "road",
        locality: "locality",
        city: "city",
        district: "district",
        state: "state",
        pincode: "pincode",
        cityTier: "cityTier",
        managedByOrgId: "managedByOrgId",
        managedByStartDate: "managedByStartDate",
        managedByEndDate: "managedByEndDate",
      },
      json_data: [],
      json_meta: [
        [
          {
            key: "charset",
            value: "utf-8",
          },
        ],
      ],
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
  },
  computed: {
    ...mapState({
      mediaData: (state) => state.media.mediaData,
      userPrivileges: (state) => state.userPrivileges,
      isMediaSearching: (state) => state.media.isMediaSearching,
    }),
  },
  mounted() {
    let self = this;
    this.triggerApi();

    window.addEventListener("keyup", function (event) {
      if (event.keyCode === 13) {
        self.searchFilter();
      }
    });
    this.setTableFields();
  },
  methods: {
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
    readExcelFile(file) {
      try {
        if (!this.uploadMediaCSV) {
          return;
        }
        if (file) {
          const reader = new FileReader();

          reader.onload = (e) => {
            /* Parse data */
            const bstr = e.target.result;
            const wb = XLSX.read(bstr, { type: "binary" });
            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            /* Convert array of arrays */
            const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
            console.log("excel", data);

            let result = [];
            let headers = data[0];
            let currentLine = [];

            for (var i = 1; i < data.length; i++) {
              var obj = {};
              let currentLine = data[i];

              for (var j = 0; j < headers.length; j++) {
                let head =
                  this.json_fields[headers[j].trim()] || headers[j].trim();
                let value = currentLine[j]
                  ? currentLine[j] + ""
                  : currentLine[j];
                if (head && head.length > 0) {
                  if (head.indexOf(".") > -1) {
                    let nested = head.split(".");
                    obj[nested[0].trim()] = {};
                    obj[nested[0].trim()][nested[1].trim()] =
                      value && value.length > 0 && value.toLowerCase() == "true"
                        ? true
                        : value && value.toLowerCase() == "false"
                        ? false
                        : value || "";
                  } else {
                    obj[head] =
                      value && value.length > 0 && value.toLowerCase() == "true"
                        ? true
                        : value && value.toLowerCase() == "false"
                        ? false
                        : value || "";
                  }
                }
              }
              result.push(obj);
            }
            this.$showProgressToast(this, "Importing Excel");
            this.$store
              .dispatch("media/importMedia", result)
              .then(() => {
                this.$showSuccessToast(this, "Excel Imported");
                this.showImportModal = false;
                this.uploadMediaCSV = null;
                this.$store.dispatch("media/fetchMedia");
              })
              .catch((err) => {
                console.error("errors", err);
                this.$showErrorToast(this, "Import Failed");
                console.log();
                this.showImportModal = true;
              });
          };
          reader.readAsBinaryString(file);
        } else {
          this.$showWarningToast(this, "Unable to validate file!");
          return;
        }
      } catch (err) {
        if (err.response && err.response.data && err.response.data.data)
          this.$showErrorToast(this, err.response.data.data);
        else this.$showErrorToast(this, "Error Importing");
      }
    },
    async fetchData() {
      const response = await this.$store.dispatch("media/exportMedia");
      if (response && response.length) {
        response.forEach((item) => {
          if (item.managedByStartDate) {
            let newDate = new Date(item.managedByStartDate)
              .toISOString()
              .substring(0, 10);

            item.managedByStartDate = this.formatDate(newDate);
          }
          if (item.managedByEndDate) {
            let newDate = new Date(item.managedByEndDate)
              .toISOString()
              .substring(0, 10);

            item.managedByEndDate = this.formatDate(newDate);
          }
        });
      }
      return response;
    },
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },
    getFileName(ext) {
      return "Media-Data-" + new Date().getTime() + "." + ext;
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
    async sortOrderAction() {
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

      await this.grabChipFilter();
      if (this.chipFilterObj && Object.keys(this.chipFilterObj).length) {
        obj.searchData = { ...obj["searchData"], ...this.chipFilterObj };
      }

      this.$store.dispatch("media/fetchMedia", obj).catch((err) => {
        console.error("errors", err);
      });
      this.loading = false;
    },
    addMedia() {
      this.showModal = true;
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
    clearRecord() {
      this.searchMedia = "";
      const obj = {
        searchData: this.searchData,
        pageNo: this.pageNumber,
        pageSize: this.itemsPerPage,
        sortField: this.sortField,
        sortOrder: this.sortOrder,
        orgId: this.orgId,
      };
      this.$store.dispatch("media/fetchMedia", obj).catch((err) => {
        console.log("errors", err);
      });
      this.loading = false;
    },
    closePopup() {
      this.showModal = false;
      this.noData = false;
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
<style>
.pagination {
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
.v-application .mb-2 {
  margin-bottom: 0 !important;
}
</style>
