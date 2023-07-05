<template>
  <div>
    <v-data-table
      :headers="getHeaders"
      :items="campaignData"
      :search="search"
      :options.sync="options"
      :server-items-length="totalCampaignList"
      :footer-props="{ 'items-per-page-options': [5, 10, 30, 50, 100] }"
      :loading="loading"
      :expanded.sync="expanded"
      show-expand
      loading-text="Loading... Please wait"
      sort-by="id"
      class="elevation-1"
      :height="tableHeight"
    >
      <template v-slot:top>
        <v-toolbar flat color="primary">
          <v-toolbar-title class="white--text">Campaign</v-toolbar-title>
          <v-spacer></v-spacer>

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
            class="mt-4"
          ></v-autocomplete>
          <v-spacer></v-spacer>

          <v-btn
            v-if="
              userPrivileges[$route.name] &&
              userPrivileges[$route.name].includes('add')
            "
            class="mr-2"
            @click="addCamp"
          >
            Add New
          </v-btn>

          <v-dialog v-model="dialog" fullscreen hide-overlay>
            <v-card>
              <v-toolbar dark color="primary">
                <v-btn icon dark @click="dialog = false">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>{{ formTitle }}</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>

              <v-card-text>
                <div class="mt-3">
                  <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                      <v-col cols="12" lg="6">
                        <v-row>
                          <v-col
                            cols="12"
                            sm="6"
                            v-if="editedItem.name !== undefined"
                          >
                            <v-text-field
                              v-model="editedItem.name"
                              label="Name*"
                              :rules="textRule"
                              required
                              maxlength="101"
                              counter="100"
                            ></v-text-field>
                          </v-col>

                          <v-col
                            cols="12"
                            sm="6"
                            v-if="editedItem.agency !== undefined"
                          >
                            <v-autocomplete
                              return-object
                              v-model="editedItem.agency"
                              label="Agency*"
                              required
                              :items="agencyOrg"
                              item-value="id"
                              item-text="name"
                            ></v-autocomplete>
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                            v-if="editedItem.startDate !== undefined"
                          >
                            <v-text-field
                              v-model="editedItem.startDate"
                              type="date"
                              label="Start Date*"
                              required
                              ref="startDate"
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                            v-if="editedItem.endDate !== undefined"
                          >
                            <v-text-field
                              v-model="editedItem.endDate"
                              type="date"
                              label="End Date*"
                              required
                              ref="endDate"
                            ></v-text-field>
                          </v-col>

                          <v-col
                            cols="12"
                            sm="6"
                            v-if="editedItem.brand !== undefined"
                          >
                            <v-autocomplete
                              return-object
                              v-model="editedItem.brand"
                              label="Brand*"
                              :items="brandOrg"
                              item-value="id"
                              item-text="name"
                              required
                            ></v-autocomplete>
                          </v-col>

                          <v-col
                            cols="12"
                            sm="6"
                            v-if="editedItem.ownedAsset !== undefined"
                          >
                            <label class="">Owned Asset*</label>
                            <v-radio-group v-model="editedItem.ownedAsset" row>
                              <v-radio
                                v-for="item in ownedAssetList"
                                :key="item.value"
                                :label="item.text"
                                :value="item.value"
                                required
                              ></v-radio>
                            </v-radio-group>
                          </v-col>
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn text color="primary darken-1" @click="close">
                              Cancel
                            </v-btn>
                            <v-btn
                              color="primary darken-1"
                              @click="save"
                              :disabled="!valid"
                            >
                              Save
                            </v-btn>
                          </v-card-actions>

                          <v-col> </v-col>
                        </v-row>
                      </v-col>
                      <v-col cols="12" lg="6">
                        <v-row>
                          <v-col cols="12" md="6">
                            <h4 class="text-center">Media List</h4>
                            <div id="media-list-left" class="py-2">
                              <draggable
                                tag="ul"
                                group="media list group"
                                class="draggable-list mx-2 rightRow"
                                :list="mediaDataListCopy"
                                :animation="200"
                                style="height: 100%"
                              >
                                <v-card
                                  v-for="item in mediaDataListCopy"
                                  :key="item.id"
                                  class="mb-1"
                                >
                                  <v-card-text>
                                    <div class="media">
                                      <div class="media-body">
                                        <h6 class="mb-1">
                                          {{ item.assetCode }}
                                        </h6>
                                      </div>
                                    </div>
                                  </v-card-text>
                                </v-card>
                              </draggable>
                            </div>
                          </v-col>
                          <v-col cols="12" md="6">
                            <h4 class="text-center">Media List Selected</h4>
                            <div id="media-list-right" class="py-2">
                              <draggable
                                tag="ul"
                                group="media list group"
                                class="draggable-list mx-2 rightRow"
                                ghost-class="moving-card"
                                :list="editedItem.mediasite"
                                :animation="200"
                                style="height: 100%"
                              >
                                <v-card
                                  v-for="item in editedItem.mediasite"
                                  :key="item.id"
                                  class="mb-1"
                                >
                                  <v-card-text>
                                    <div class="media">
                                      <div class="media-body">
                                        <h6 class="mb-1">
                                          {{ item.assetCode }}
                                        </h6>
                                      </div>
                                    </div>
                                  </v-card-text>
                                </v-card>
                              </draggable>
                            </div>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-form>
                </div>
              </v-card-text>
            </v-card>
          </v-dialog>

          <v-btn class="mr-2">
            <download-excel
              :fields="json_fields"
              :fetch="fetchData"
              worksheet="Campaign Data"
              type="csv"
              :name="getFileName('csv')"
            >
              CSV
              <v-icon right dark> mdi-download </v-icon>
            </download-excel>
          </v-btn>
          <v-btn class="mr-2">
            <download-excel
              :fields="json_fields"
              :fetch="fetchData"
              worksheet="Campaign Data"
              :name="getFileName('xls')"
            >
              Excel
              <v-icon right dark> mdi-download </v-icon>
            </download-excel>
          </v-btn>

          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="headline justify-center"
                >Are you sure you want to delete ?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary darken-1" @click="closeDelete"
                  >Cancel</v-btn
                >
                <v-btn color="primary darken-1" @click="deleteItemConfirm"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
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
      </template>
      <template v-slot:item.organization="{ item }">
        {{ item.id }}
      </template>
      <template v-slot:item.startDate="{ item }">
        {{ new Date(item.startDate).toISOString().substring(0, 10) }}
      </template>
      <template v-slot:item.endDate="{ item }">
        {{ new Date(item.endDate).toISOString().substring(0, 10) }}
      </template>
      <template v-slot:item.agency="{ item }">
        {{ item.agency.name }}
      </template>
      <template v-slot:item.brand="{ item }">
        {{ item.brand.name }}
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <span v-for="(subItem, index) in item.mediasite" :key="index"
            ><span v-if="index == 0">Media Site List :</span>
            {{
              subItem.assetCode +
              (item.mediasite.length - 1 <= index ? "" : ",")
            }}
          </span>
        </td>
      </template>

      <template v-slot:item.actions="{ item }">
        <div class="d-flex">
          <v-icon
            v-if="
              userPrivileges[$route.name] &&
              userPrivileges[$route.name].includes('update')
            "
            small
            class="mr-2"
            @click="editItem(item)"
          >
            mdi-pencil
          </v-icon>

          <v-icon
            v-if="
              userPrivileges[$route.name] &&
              userPrivileges[$route.name].includes('delete')
            "
            small
            @click="deleteItem(item)"
          >
            mdi-delete
          </v-icon>
        </div>
      </template>
    </v-data-table>
  </div>
</template>
<script>
import { mapState } from "vuex";
import Vue from "vue";
import draggable from "vuedraggable";
import jsPDF from "jspdf";
import "jspdf-autotable";
import JsonExcel from "vue-json-excel";
Vue.component("downloadExcel", JsonExcel);
import * as _ from "lodash";

export default {
  components: {
    draggable,
  },
  data: () => ({
    search: "",
    textRule: [(v) => v.length <= 100 || "Text not more than 100 Characters"],
    loading: true,
    searchData: {},
    expanded: [],
    totalCampaignList: null,
    page: null,
    numberOfPages: null,
    pageNumber: null,
    sort: null,
    sortDirection: "dec",
    mediasiteOptions: [
      {
        id: 1,
      },
      {
        id: 2,
      },
    ],
    itemsPerPage: null,
    orgId: 0,
    options: { pageNumber: null, page: 1, itemsPerPage: 10 },
    valid: true,
    dialog: false,
    dialogDelete: false,
    fromDatePicker: false,
    toDatePicker: false,
    searchCampaign: {
      name: "",
      id: "",
      brand: "",
      agency: "",
      startDate: "",
      endDate: "",
      ownedAsset: "",
    },
    headers: [
      { text: "Actions", value: "actions", sortable: false },
      { text: "Id", align: "start", value: "id" },
      { text: "Name", value: "name" },
      { text: "Agency", value: "agency" },
      { text: "Brand", value: "brand" },
      { text: "Start Date", value: "startDate" },
      { text: "End Date", value: "endDate" },
      { text: "Owned Asset", value: "ownedAsset" },
    ],
    campaignData: [],
    ownedAssetList: [
      {
        text: "true",
        value: true,
      },
      {
        text: "false",
        value: false,
      },
    ],
    editedIndex: -1,
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
    json_fields: {
      Id: "id",
      Name: "name",
      Agency: "agency.name",
      Brand: "brand.name",
      "Start Date": "startDate",
      "End Date": "endDate",
      "Owned Asset": "ownedAsset",
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
    mediaDataListCopy: [],
    agencyOrg: [],
    brandOrg: [],
    tableHeight: "450px",
    tableFields: [],
    selectedFields: [],
    chipFields: [],
    chipFilterObj: {},
  }),
  created() {
    this.$store.dispatch("media/fetchOrganizations");
    this.$store.dispatch("media/fetchMedia");
    this.$store.dispatch("organizations/fetchOrgListByAgency");
    this.$store.dispatch("organizations/fetchOrgListByBrand");
    this.setTableFields();
  },
  mounted() {
    this.mediaDataListCopy = JSON.parse(JSON.stringify(this.mediaDataList));
    this.tableHeight = window.innerHeight - 250;
  },

  computed: {
    ...mapState({
      getCampaignData: (state) => state.campaign.campaign,
      getCampaignStats: (state) => state.campaign.campaignStats,
      organizationsList: (state) => state.media.organizationsList,
      mediaDataList: (state) => state.media.mediaData,
      userPrivileges: (state) => state.userPrivileges,
      agencyOrgList: (state) => state.organizations.agencyOrgList,
      brandOrgList: (state) => state.organizations.brandOrgList,
      isSerching: (state) => state.campaign.isSearching,
    }),
    formTitle() {
      if (this.editedIndex === -1) {
        this.mediaDataListCopy = JSON.parse(JSON.stringify(this.mediaDataList));
      }
      return this.editedIndex === -1 ? "Add New" : "Edit";
    },
    computedStartDateFormatted() {
      return this.formatDate(this.startDate);
    },
    computedEndDateFormatted() {
      return this.formatDate(this.endDate);
    },
    getHeaders() {
      if (
        this.userPrivileges[this.$route.name] &&
        (this.userPrivileges[this.$route.name].includes("update") ||
          this.userPrivileges[this.$route.name].includes("delete"))
      ) {
        return this.headers;
      } else {
        let trimmedHeaders = [...this.headers];
        trimmedHeaders.splice(0, 1);
        return trimmedHeaders;
      }
    },
  },
  mounted() {
    let self = this;
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    startDate(val) {
      console.log("date", val);
      this.startDate = new Date(val).toISOString().substring(0, 10);
    },
    endDate(val) {
      this.endDate = new Date(val).toISOString().substring(0, 10);
    },
    options: {
      handler() {
        this.dispatchOrgFilter();
      },
    },
    deep: true,
    getCampaignData(val) {
      if (val && val.length) {
        this.loading = false;
        this.campaignData = val;
      } else {
        this.loading = false;
        this.campaignData = [];
      }
    },
    getCampaignStats(val) {
      if (val) {
        this.totalCampaignList = val.total_record || 0;
      } else {
        this.totalCampaignList = 0;
      }
    },
    mediaDataList(val) {
      if (val) {
        this.mediaDataListCopy = JSON.parse(JSON.stringify(val));
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
        console.log("fecthing orgs if no filter");
        this.$store.dispatch("campaign/fetchCampaignWithFilter");
      }
    },
  },
  methods: {
    addCamp() {
      this.dialog = true;
      this.$store.dispatch("media/anotherMedia");
    },
    async fetchData() {
      const response = await this.$store.dispatch("campaign/exportCampaign");
      if (response && response.length) {
        response.forEach((item) => {
          if (item.startDate) {
            let newDate = new Date(item.startDate)
              .toISOString()
              .substring(0, 10);

            item.startDate = this.formatDate(newDate);
          }
          if (item.endDate) {
            let newDate = new Date(item.endDate).toISOString().substring(0, 10);

            item.endDate = this.formatDate(newDate);
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
      return "Campaign-Data-" + new Date().getTime() + "." + ext;
    },
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${day}-${month}-${year}`;
    },
    editItem(item) {
      this.mediaDataListCopy = JSON.parse(JSON.stringify(this.mediaDataList));
      const newItem = { ...item };
      this.dialog = true;
      newItem.organization = item.organization;
      newItem.agency = item.agency;
      newItem.brand = item.brand;
      newItem.ownedAsset = item.ownedAsset;

      this.mediaDataListCopy = this.mediaDataListCopy.filter((element) => {
        if (!item.mediasite) {
          return true;
        }

        var i = 0;
        for (i = 0; i < item.mediasite.length; i++) {
          if (item.mediasite[i].id == element.id) {
            return false;
          }
        }
        if (i >= item.mediasite.length) {
          return true;
        }
      });
      newItem.mediasite = JSON.parse(JSON.stringify(item.mediasite));

      newItem.startDate = new Date(item.startDate)
        .toISOString()
        .substring(0, 10);
      newItem.endDate = new Date(item.endDate).toISOString().substring(0, 10);
      this.editedIndex = this.campaignData.indexOf(item);
      this.editedItem = Object.assign({}, newItem);
    },

    deleteItem(item) {
      this.editedIndex = this.campaignData.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.$store
        .dispatch("campaign/deleteCampaign", {
          id: this.editedItem.id,
        })
        .then(() => {
          this.$showSuccessToast(this, " Deleted Successfully");
        })
        .catch(() => {
          this.$showErrorToast(this, "Parameter Error");
        });
      this.closeDelete();
    },

    close() {
      this.$refs.form.resetValidation();
      this.dialog = false;
      this.$nextTick(() => {
        this.mediaDataListCopy = JSON.parse(JSON.stringify(this.mediaDataList));
        this.editedItem = JSON.parse(JSON.stringify(this.defaultItem));
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.mediaDataListCopy = JSON.parse(JSON.stringify(this.mediaDataList));
        this.editedItem = JSON.parse(JSON.stringify(this.defaultItem));
        this.editedIndex = -1;
      });
    },

    save() {
      this.$refs.form.validate();

      if (
        this.editedIndex === -1 &&
        this.$refs.startDate.value &&
        this.$refs.endDate.value
      ) {
        this.$store
          .dispatch("campaign/addCampaign", this.editedItem)
          .then(() => {
            this.close();
            this.$showSuccessToast(this, "Campaign Added Successfully");
            this.dispatchOrgFilter();
          })
          .catch((e) => {
            console.error("error", e);
            if (e.response && e.response.data && e.response.data.data) {
              this.$showErrorToast(this, e.response.data.msg);
            } else this.$showErrorToast(this, "Field Required");
          });
      } else {
        this.$store
          .dispatch("campaign/updateCampaign", this.editedItem)
          .then(() => {
            this.close();
            this.$showSuccessToast(this, "Campaign Updated Successfully");
            this.dispatchOrgFilter();
          })
          .catch((e) => {
            console.error(e.response);
            if (e.response && e.response.data && e.response.data.data)
              this.$showErrorToast(this, e.response.data.msg);
            else this.$showErrorToast(this, "Fill the Details");
          });
      }
    },
    searchRecord() {
      this.setTableParams();
      const searchObj = {
        pageNo: this.pageNumber,
        pageSize: this.itemsPerPage,
        orgId: this.orgId,
      };
      if (this.sort) searchObj.sortField = this.sort;
      if (this.sortDirection) {
        searchObj.sortOrder = this.sortDirection;
      }

      if (this.search && this.search !== "") {
        let tempSearchArr1 = this.search.split(",");
        let tempSearchArr2 = tempSearchArr1.filter(function (e) {
          return e != null && e.trim().length > 0;
        });
        tempSearchArr1 = tempSearchArr2.map((s) => s.trim());

        searchObj.searchData = { name: tempSearchArr1 };
        this.$store.dispatch("campaign/fetchCampaign", searchObj);
      } else {
        this.search = "";
        searchObj.searchData = {};
        this.$store.dispatch("campaign/fetchCampaign", searchObj);
      }
    },

    clearRecord() {
      this.search = "";
      this.dispatchOrgFilter();
    },
    setTableParams() {
      const { sortBy, sortDesc, page, itemsPerPage } = this.options;
      this.pageNumber = page;
      this.sort = sortBy[0];
      this.sortDirection = sortDesc[0] ? "dec" : "asc";
      this.itemsPerPage = itemsPerPage;
    },
    async dispatchOrgFilter() {
      this.loading = true;
      this.setTableParams();
      const obj = {
        searchData: this.searchData,
        pageNo: this.pageNumber,
        pageSize: this.itemsPerPage,
        orgId: this.orgId,
      };
      if (this.sort) obj.sortField = this.sort;
      if (this.sortDirection) {
        obj.sortOrder = this.sortDirection;
      }
      await this.grabChipFilter();
      if (this.chipFilterObj && Object.keys(this.chipFilterObj).length) {
        obj.searchData = { ...obj["searchData"], ...this.chipFilterObj };
      }
      this.$store
        .dispatch("campaign/fetchCampaign", obj)
        .then(() => {
          this.loading = false;
        })
        .catch((err) => {
          console.error("errors", err);
          this.loading = false;
        });
    },
    generatePDF() {
      let pdfName = "Campaign Report";
      let heading = "Campaign Report";
      const columns = [
        { header: "ID", dataKey: "id" },
        { header: "Name", dataKey: "name" },
        { header: "Agency", dataKey: "agency" },
        { header: "Brand", dataKey: "brand" },
        { header: "Start Date", dataKey: "startDate" },
        { header: "End Date", dataKey: "endDate" },
        { header: "Owwned Asset", dataKey: "ownedAsset" },
        { header: "Media Site List", dataKey: "mediasite" },
      ];
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "in",
        format: "letter",
      });
      doc.setFontSize(16).text(heading, 0.5, 1.0);
      doc.setLineWidth(0.01).line(0.5, 1.1, 8.0, 1.1);
      doc.autoTable({
        columns,
        body: this.campaignData,
        margin: { left: 0.5, top: 1.25 },
      });
      doc.save(pdfName + ".pdf");
    },
    setTableFields() {
      if (this.headers && this.headers.length) {
        this.headers.forEach((item) => {
          if (item.value != "actions") {
            this.tableFields.push({ field: item.value, searchKey: "" });
          }
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
      let isValidated = true;
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
      if (isValidated) {
        this.$store.dispatch("campaign/fetchCampaignWithFilter", obj);
      }
    }, 1500),
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
};
</script>
<style>
.list-group-item {
  cursor: move !important;
}
#media-list-right,
#media-list-left {
  position: relative;
  height: 100%;
  background: #efefef;
}

.moving-card {
  opacity: 0.5;
  background: #f7fafc;
  border: 1px solid #4299e1;
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
.rightRow {
  height: 300px !important;
  overflow-y: scroll !important;
}
.v-sheet.v-card:not(.v-sheet--outlined) {
  box-shadow: none;
}
</style>
