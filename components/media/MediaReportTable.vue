<template>
  <div>
    <v-card color="primary" class="mb-2">
      <div class="d-flex flex-wrap">
        <v-card-title class="justify-start my-2" style="color: white"
          >Media Monthly Report</v-card-title
        ><v-spacer></v-spacer>
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
            z-index=10
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
              class="my-2 mr-4"
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
          <v-text-field
            label="Enter Asset Code"
            v-model="searchMedia"
            clearable
            single-line
            dark
            hide-details
           color="white"
           class="my-2 mr-2"
          ></v-text-field>
          <v-btn
            fab
            small
            class="mr-2 my-4"
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
            class="mr-4 my-4"
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
    <AssetReportList :selectedMonth="selectedMonth"  :mediaData="mediaData" class="mt-2"/>
   <h3 v-show="noData" class="py-5 text-center font-weight-bold primary--text">
      No data available
    </h3>
  </div>
</template>

<script>
import { mapState } from "vuex";
import AssetReportList from "@/components/reports/AssetReportList";
import AddMedia from "@/components/media/AddMedia";
export default {
  components: {
    AssetReportList,
    AddMedia
  },
  data() {
    return {
      searchMedia: "",
      loading: false,
      pageNumber: 1,
      itemsPerPage: 10,
      sortField: "",
      sortOrder: "asc",
      orgId: 0,
      searchData: {},
      noData:false,
      showModal:false,
       selectedMonth: "",
    menu: false,
    modal: null,
    };
  },
  created() {
    this.$store.dispatch("media/fetchMedia");
  },
  computed: {
    ...mapState({
      mediaData: (state) => state.media.mediaData,
    }),
  },
    mounted () {
    let self = this
    window.addEventListener('keyup', function (event) {
      if (event.keyCode === 13) {
        self.searchFilter()
      }
    })
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
        // this.$emit('emitAlaramDataPayload', payload)
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
      this.sortOrder = this.sortOrder !== 'asc' ? 'asc' : 'dec'
      const obj = {
        searchData: this.searchData,
        pageNo: this.pageNumber,
        pageSize: this.itemsPerPage,
        sortField : this.sortField,
        sortOrder : this.sortOrder,
        orgId: this.orgId,
      };
      this.$store.dispatch("media/fetchMedia", obj).catch((err) => {
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
