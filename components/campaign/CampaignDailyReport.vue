<template>
  <div>
    <v-card color="primary" flat dark v-if="checkIsPopup">
      <v-card-title>
        <v-btn class="mr-2" icon dark @click="closePopup">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        Campaign
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
        ></v-autocomplete>

        <v-spacer></v-spacer>

        <v-btn color="white" class="black--text px-6" @click="addCampaign"
          >SELECT</v-btn
        >
       
      </v-card-title>
    </v-card>
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

  
    <v-data-table
      :headers="headers"
      :items="campaignData"
      :options.sync="options"
      item-key="name"
      class="elevation-1"
      :footer-props="{ 'items-per-page-options': [5, 10, 30, 50, 100] }"
      :loading="loading"
      loading-text="Loading... Please wait"
      sort-by="id"
    >
      <template v-slot:body="{ items }">
        <tbody>
          <tr
            :class="key === selectedRow ? 'highlight-row' : ''"
            @click="rowSelect(item, key)"
            v-for="(item, key) in items"
            :key="item.name"
          >
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.agency.name }}</td>
            <td>{{ item.brand.name }}</td>
            <td>{{ item.startDate }}</td>
            <td>{{ item.endDate }}</td>
            <td>{{ item.ownedAsset }}</td>
          </tr>
        </tbody>
      </template>
    </v-data-table>
  </div>
</template>
<script>
import { mapState } from "vuex";
import * as _ from "lodash";
export default {
  props: ["isPopUP", "chipFieldsFromDailyReportPage", "isPage"],
  data: () => ({
    selectedRow: null,
    selectedData: {},
    true: true,
    loading: false,
    campaignData: [],
    options: { pageNumber: null, page: 1, itemsPerPage: 10 },
    agencyOrg: [],
    brandOrg: [],
    singleSelect: false,
    selectedItem: [],
    searchData: {},
    headers: [
      { text: "Id", align: "start", value: "id" },
      { text: "Name", value: "name" },
      { text: "Agency", value: "agency" },
      { text: "Brand", value: "brand" },
      { text: "Start Date", value: "startDate" },
      { text: "End Date", value: "endDate" },
      { text: "Owned Asset", value: "ownedAsset" },
    ],
    startDate: "",
    tableFields: [],
    selectedFields: [],
    chipFields: [],
    chipFilterObj: {},
  }),
  computed: {
    ...mapState({
      getCampaignData: (state) => state.campaign.campaign,
      agencyOrgList: (state) => state.organizations.agencyOrgList,
      brandOrgList: (state) => state.organizations.brandOrgList,
      isSerching: (state) => state.campaign.isSearching,
    }),
    checkIsPopup() {
      if (this.isPopUP) {
        return true;
      } else {
        return false;
      }
    },
    isPageLoading(){
      console.log("isPage", this.isPage);
      if(this.isPage) return true
    }
  },
  watch: {
    options: {
      handler() {
        this.dispatchCampaignFilter();
      },
    },
    getCampaignData(val) {
      console.log("changes", val);
      if (val && val.length) {
        this.loading = false;
        this.campaignData = JSON.parse(JSON.stringify(val));

        for (let i = 0; i < this.campaignData.length; i++) {
          if (this.campaignData[i].startDate) {
            console.log(this.campaignData[i].startDate);
            this.campaignData[i].startDate = new Date(
              this.campaignData[i].startDate
            )
              .toISOString()
              .substring(0, 10);
          }
          if (this.campaignData[i].endDate) {
            console.log(this.campaignData[i].endDate);
            this.campaignData[i].endDate = new Date(
              this.campaignData[i].endDate
            )
              .toISOString()
              .substring(0, 10);
          }
        }
      } else {
        this.loading = false;
        this.campaignData = [];
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
    startDate(val) {
      console.log("date", val);

      this.startDate = new Date(val).toISOString();
      console.log("date", val);
    },
    endDate(val) {
      this.endDate = new Date(val).toISOString().substring(0, 10);
    },
    selectedItem(val) {
      console.log("selectedItem", val);
      if (val) {
      
        const selectedCamp = val ? val : null;

        console.log("selected item", val);
        if (!this.checkIsPopup) {
          this.$emit("getCompId", selectedCamp);
        }
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
     // Set Datatable options
    setTableParams() {
      const { sortBy, sortDesc, page, itemsPerPage } = this.options;
      this.pageNumber = page;
      this.sort = sortBy[0];
      this.sortDirection = sortDesc[0] ? "asc" : "dec";
      this.itemsPerPage = itemsPerPage;
    },
    async dispatchCampaignFilter() {
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
      console.log("dispatchCampaignFilter", obj);
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
    grabChipFilter() {
      if (this.isPopUP) {
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
      }else {
        if (this.chipFieldsFromDailyReportPage && this.chipFieldsFromDailyReportPage.length) {
        const searchObj = {};
        this.chipFieldsFromDailyReportPage.forEach((item) => {
          item = JSON.parse(JSON.stringify(item));
          searchObj[item.field] = item.searchKey;
        });
        this.chipFilterObj = searchObj;
      } else {
        this.chipFilterObj = {};
      }
      }
    },
    addCampaign() {
      console.log("selecteddARA", this.selectedData);
      if (this.checkIsPopup) {
        var selectedCampaign = null;

        if (this.selectedData && this.selectedData.id) {
          selectedCampaign = this.selectedData;
          console.log("selectcamp", selectedCampaign);
          this.$emit("getCompId", selectedCampaign);
        } else {
          this.$showErrorToast(this, "Please select Campaign");
        }
      }
    },
    closePopup() {
      console.log("i m here");
      this.$emit("closeCampPopup");
    },
    rowSelect(item, key) {
      console.log("log");
      this.selectedRow = key;
      this.selectedData = item;
      console.log("all data", this.selectedData);
      if (!this.checkIsPopup) {
        console.log("inside");
        this.$emit("getCompId", item);
      }
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
      this.$store.dispatch("campaign/fetchCampaignWithFilter", obj);
    }, 1500),
  },
  created() {
    this.$store.dispatch("campaign/fetchCampaign");
    this.$store.dispatch("organizations/fetchOrgListByAgency");
    this.$store.dispatch("organizations/fetchOrgListByBrand");
    this.setTableFields();
  },
};
</script>
<style lang="scss" scoped>
.highlight-row {
  background-color: pink;
}

.v-card__subtitle,
.v-card__text,
.v-card__title {
  padding: 0 1rem;
}
</style>
