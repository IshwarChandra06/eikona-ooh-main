<template>
  <div>
    <v-card color="primary" class="mb-2">
      <div class="d-flex flex-wrap">
        <v-card-title class="justify-start mb-2 py-2" style="color: white"
          >Campaign List</v-card-title
        ><v-spacer></v-spacer>
        <div class="d-flex justify-space-between flex-nowrap">
          <v-text-field
            label="Search"
            v-model="searchCampaign"
            single-line
            dark
            hide-details
            color="#000"
          ></v-text-field>
          <v-btn
            fab
            small
            class="mr-2 mt-2"
            :loading="loading"
            :disabled="loading"
            color="white darken-4"
            @click="searchFilter"
          >
            <v-icon color="primary"> mdi-magnify </v-icon>
          </v-btn>
          <v-btn
            fab
            small
            class="mr-2 mt-2"
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
    </v-card>

    <CampaignList  :campaignData="campaignData" />
   <h3 v-show="noData" class="py-5 text-center font-weight-bold primary--text">
      No data available
    </h3>
  </div>
</template>

<script>
import { mapState } from "vuex";
import CampaignList from "@/components/campaign/CampaignList";
export default {
  components: {
    CampaignList,
  },
  data() {
    return {
      searchCampaign: "",
      loading: false,
      pageNumber: 1,
      itemsPerPage: 10,
      sortField: "",
      sortOrder: "asc",
      orgId: 0,
      searchData: {},
      noData:false
    };
  },
  created() {
    this.$store.dispatch("campaign/fetchCampaign");
  },
  computed: {
    ...mapState({
      campaignData: (state) => state.campaign.campaignData,
    }),
  },
  methods: {
    searchFilter() {
      this.loading = true;
      const payload = {
        pageNo: this.pageNumber,
        pageSize: this.itemsPerPage,
        sortField: this.sortField,
        sortOrder: this.sortOrder,
        orgId: this.orgId,
      };
      if (this.searchCampaign) {
        let tempSearchArr1 = this.searchCampaign.split(",");
        let tempSearchArr2 = tempSearchArr1.filter(function (e) {
          return e != null && e.trim().length > 0;
        });
        tempSearchArr1 = tempSearchArr2.map((s) => s.trim());

        payload.searchData = { assetCode: tempSearchArr1 };
        this.loading = false;
        this.$store.dispatch("campaign/fetchMedia", payload);
         this.noData = false;
        // this.$emit('emitAlaramDataPayload', payload)
      } else {
        payload.searchCampaign = {};
        this.$store.dispatch("campaign/fetchMedia", payload);
        this.loading = false;
        this.noData = true;
      }
    },
    sortOrderAction() {
      this.loading = true;
      this.noData = false;
      this.sortOrder = this.sortOrder !== 'asc' ? 'asc' : 'dec'
      const obj = {
        searchData: this.searchData,
        pageNo: this.pageNumber,
        pageSize: this.itemsPerPage,
        sortField : this.sortField,
        sortOrder : this.sortOrder,
        orgId: this.orgId,
      };
      this.$store.dispatch("campaign/fetchMedia", obj).catch((err) => {
        console.error("errors", err);
      });
      this.loading = false;
    },
  },
};
</script>
<style>
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
</style>
