<template>
  <v-data-table
    :headers="getHeaders"
    :items="privilegesData"
    :search="search"
    :options.sync="options"
    :server-items-length="totalPrivilegesList"
    :footer-props="{ 'items-per-page-options': [5, 10, 30, 50, 100] }"
    :loading="loading"
    loading-text="Loading... Please wait"
    sort-by="id"
    class="elevation-1"
    :height="tableHeight"
  >
    <template v-slot:top>
      <v-toolbar flat color="primary">
        <v-toolbar-title class="white--text">Privileges</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          dark
          color="white"
          single-line
          hide-details
          clearable
          @click:clear="clearRecord"
          @click:append="searchRecord"
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-btn
          v-if="
            userPrivileges[$route.name] &&
            userPrivileges[$route.name].includes('add')
          "
          class="my-2"
          @click="dialog = true"
        >
          Add New
        </v-btn>
        <v-dialog v-model="dialog" max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-row>
                    <v-col
                      cols="12"
                      sm="6"
                      v-if="editedItem.pageName !== undefined"
                    >
                      <v-autocomplete
                        v-model="editedItem.pageName"
                        :rules="pageNameRules"
                        :items="getAllPageNames"
                        required
                        label="Page"
                      ></v-autocomplete>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      v-if="editedItem.action !== undefined"
                    >
                      <v-autocomplete
                        v-model="editedItem.action"
                        :rules="actionRules"
                        :items="pageActions"
                        required
                        label="Action"
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                </v-form>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary darken-1" @click="close"> Cancel </v-btn>
              <v-btn color="primary darken-1" @click="save" :disabled="!valid">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="550px">
          <v-card>
            <v-card-title class="headline"
              >Are you sure you want to delete this Privilege?</v-card-title
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
    </template>
    <template v-slot:item.actions="{ item }">
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
    </template>
  </v-data-table>
</template>
<script>
import { mapState, mapGetters } from "vuex";
export default {
  //middleware: 'isadmin',
  data: () => ({
    loading: false,
    search: "",
    valid: false,
    dialog: false,
    dialogDelete: false,
    totalPrivilegesList: null,
    sortDirection: "asc",
    privilegesData: [],
    options: { pageNumber: null, page: 1, itemsPerPage: 10 },
    headers: [
      { text: "Actions", value: "actions", sortable: false },
      { text: "ID", value: "id", align: "start", sortable: true },
      { text: "Name", value: "name" },
    ],
    pageActions: ["add", "update", "view", "delete"],
    statusList: [
      {
        text: "true",
        value: true,
      },
      {
        text: "false",
        value: false,
      },
    ],
    rolesList: [],
    editedIndex: -1,
    selectedOrg: {},
    editedItem: {
      id: "",
      pageName: "",
      action: "",
    },
    defaultItem: {
      id: "",
      pageName: "",
      action: "",
      organization: {
        id: "",
      },
    },
    tableHeight: "450px",
    pageNameRules: [(v) => !!v || "Page is required"],
    actionRules: [(v) => !!v || "Action is required"],
  }),
  created() {
    this.$store.dispatch("privileges/fetchMasterPrivileges");
    this.$store.dispatch("organizations/fetchOrganizations");
  },
  computed: {
    ...mapState({
      userPrivileges: (state) => state.userPrivileges,
      getMasterPrivileges: (state) => state.privileges.masterPrivileges,
      getAllPageNames: (state) => state.privileges.pages,
      getPrivilegeStats: (state) => state.privileges.privilegeStats,
      organizationsList: (state) => state.organizations.organizations,
      organizationDetails: (state) => state.organizations.organizationDetails,
    }),
    ...mapGetters({
      getOrganizationId: "getOrgId",
    }),
    formTitle() {
      return this.editedIndex === -1 ? "Add New" : "Edit Privilege";
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
    window.addEventListener("keyup", function (event) {
      if (event.keyCode === 13) {
        self.searchRecord();
      }
    });
    this.tableHeight = window.innerHeight - 250;
  },
  watch: {
    selectedOrg(val) {},
    organizationDetails(val) {
      if (val && val.id) {
        this.rolesList = val.roles;
      }
    },
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    options: {
      handler() {
        this.dispatchUsersFilter();
      },
    },
    deep: true,
    getMasterPrivileges(val) {
      if (val && val.length) {
        this.loading = false;
        this.privilegesData = JSON.parse(JSON.stringify(val));
      } else {
        this.loading = false;
        this.privilegesData = [];
      }
    },
    getPrivilegeStats(val) {
      if (val) {
        this.totalPrivilegesList = val.total_record || 0;
      } else {
        this.totalPrivilegesList = 0;
      }
    },
  },

  methods: {
    onSelectOrg() {
      if (this.selectedOrg && this.selectedOrg.id) {
        this.editedItem.organization = this.selectedOrg;
        this.$store.dispatch(
          "organizations/fetchOrganizationById",
          this.selectedOrg.id
        );
      }
    },

    editItem(item) {
      this.dialog = true;
      this.editedIndex = this.privilegesData.indexOf(item);
      delete item.password;
      this.selectedOrg = item.organization;
      console.log(item);
      let itemNameSplit = item.name.split("_");
      let payload = {};
      payload.id = item.id;
      payload.pageName = itemNameSplit[0] || "";
      payload.action = itemNameSplit[1] || "";
      this.editedItem = Object.assign({}, payload);
    },
    deleteItem(item) {
      this.editedIndex = this.privilegesData.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.$store
        .dispatch("privileges/deletePrivilege", {
          id: this.editedItem.id,
        })
        .then(() => {
          this.$showSuccessToast(this, "Privilege Deleted");
        })
        .catch(() => {
          this.$showErrorToast(this, "Parameter Error");
        });
      this.closeDelete();
    },

    close() {
      this.$refs.form.resetValidation();
      this.dialog = false;
      this.valid = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.selectedOrg = {};
        this.rolesList = [];
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.valid = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      this.$refs.form.validate();
      if (this.editedIndex === -1) {
        let payload = {};
        payload.name = this.editedItem.pageName + "_" + this.editedItem.action;
        this.$store
          .dispatch("privileges/addPrivilege", payload)
          .then(() => {
            this.close();
            this.$showSuccessToast(this, "Privilege Added Successfully");
            this.dispatchUsersFilter();
          })
          .catch((e) => {
            console.error(e.response);
            if (e.response && e.response.data && e.response.data.data)
              this.$showErrorToast(this, e.response.data.msg);
            else this.$showErrorToast(this, "Update Failed");
          });
      } else {
        console.log(this.editedItem);
        let payload = {};
        payload.id = this.editedItem.id;
        payload.name = this.editedItem.pageName + "_" + this.editedItem.action;
        payload.organization = {};
        payload.organization.id = this.getOrganizationId;
        this.$store
          .dispatch("privileges/updatePrivilege", payload)
          .then(() => {
            this.close();
            this.$showSuccessToast(this, "Privilege Updated Successfully");
            this.dispatchUsersFilter();
          })
          .catch((e) => {
            console.error(e.response);
            if (e.response && e.response.data && e.response.data.data)
              this.$showErrorToast(this, e.response.data.msg);
            else this.$showErrorToast(this, "Update Failed");
          });
      }
    },
    searchRecord() {
      this.setTableParams();
      const searchObj = {
        pageNo: this.pageNumber,
        pageSize: this.itemsPerPage,
        orgId: this.getOrganizationId,
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
        this.$store.dispatch("privileges/fetchMasterPrivileges", searchObj);
      } else {
        this.search = "";
        searchObj.searchData = {};
        this.$store.dispatch("privileges/fetchMasterPrivilege", searchObj);
      }
    },
    clearRecord() {
      this.search = "";
      this.dispatchUsersFilter();
    },
    setTableParams() {
      const { sortBy, sortDesc, page, itemsPerPage } = this.options;
      this.pageNumber = page;
      this.sort = sortBy[0];
      this.sortDirection = "asc";
      this.itemsPerPage = itemsPerPage;
    },
    dispatchUsersFilter() {
      this.setTableParams();
      const obj = {
        searchData: this.searchData || {},
        pageNo: this.pageNumber,
        pageSize: this.itemsPerPage,
        orgId: this.orgId,
      };
      if (this.sort) obj.sortField = this.sort;
      if (this.sortDirection) {
        obj.sortOrder = this.sortDirection;
      }
      this.$store
        .dispatch("privileges/fetchMasterPrivileges", obj)
        .catch((err) => {
          console.error("errors", err);
        });
    },
  },
};
</script>
