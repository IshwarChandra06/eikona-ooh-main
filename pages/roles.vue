<template>
  <v-data-table
    :headers="getHeaders"
    :items="roleData"
    :search="search"
    :options.sync="options"
    :server-items-length="totalRolesList"
    :footer-props="{ 'items-per-page-options': [5, 10, 30, 50, 100] }"
    :loading="loading"
    loading-text="Loading... Please wait"
    sort-by="id"
    class="elevation-1"
    :expanded.sync="expanded"
    show-expand
    :single-expand="singleExpand"
    :height="tableHeight"
  >
    <template v-slot:top>
      <v-toolbar flat color="primary">
        <v-toolbar-title class="white--text">Roles</v-toolbar-title>
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
                      v-if="editedItem.name !== undefined"
                    >
                      <v-text-field
                        v-model="editedItem.name"
                        type="text"
                        label="Name"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      v-if="editedItem.privileges !== undefined"
                    >
                      <v-autocomplete
                        v-model="editedItem.privileges"
                        :items="getMasterPrivileges"
                        item-text="name"
                        item-value="id"
                        return-object
                        required
                        multiple
                        label="Privileges"
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
              >Are you sure you want to delete this Role?</v-card-title
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
    <template v-slot:expanded-item="{ headers, item }">
      <td class="px-0 py-2" :colspan="headers.length">
        <v-data-table
          :headers="headersPriv"
          :items="item.privilegesSplit"
          item-key="name"
          elevation="0"
          :items-per-page="itemsPerPageInExpanded"
          hide-default-footer
        >
        </v-data-table>
      </td>
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
    totalRolesList: null,
    sortDirection: "asc",
    roleData: [],
    expanded: [],
    singleExpand: true,
    itemsPerPageInExpanded: 1000,
    options: { pageNumber: null, page: 1, itemsPerPage: 10 },
    headers: [
      { text: "Actions", value: "actions", sortable: false },
      { text: "ID", value: "id", align: "start", sortable: true },
      { text: "Name", value: "name" },
    ],
    headersPriv: [
      { text: "Page", value: "page" },
      { text: "Actions", value: "actions" },
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
    editedIndex: -1,
    selectedOrg: {},
    editedItem: {
      id: "",
      action: "",
      name: "",
      privileges: "",
    },
    defaultItem: {
      id: "",
      action: "",
      name: "",
      privileges: "",
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
    this.$store.dispatch("roles/fetchRoles");
    this.$store.dispatch("organizations/fetchOrganizations");
  },
  computed: {
    ...mapState({
      userPrivileges: (state) => state.userPrivileges,
      getMasterPrivileges: (state) => state.privileges.masterPrivileges,
      getAllRoles: (state) => state.roles.roles,
      getRoleStats: (state) => state.roles.roleStats,
      organizationsList: (state) => state.organizations.organizations,
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
    getAllRoles(val) {
      if (val && val.length) {
        this.loading = false;
        this.roleData = JSON.parse(JSON.stringify(val));

        for (let i = 0; i < this.roleData.length; i++) {
          if (this.roleData[i]) {
            let privilegesSplitTemp = {};

            // Separate out page and action
            for (let j = 0; j < this.roleData[i].privileges.length; j++) {
              let page = this.roleData[i].privileges[j].name.split("_")[0];
              let action = this.roleData[i].privileges[j].name.split("_")[1];

              if (!privilegesSplitTemp[page]) {
                privilegesSplitTemp[page] = [];
              }

              privilegesSplitTemp[page].push(action);
            }

            // Convert 'privilegesSplit' object to array
            this.roleData[i].privilegesSplit = [];
            for (var j in privilegesSplitTemp) {
              this.roleData[i].privilegesSplit.push({
                page: j,
                actions: privilegesSplitTemp[j],
              });
            }
          }
        }
      } else {
        this.loading = false;
        this.roleData = [];
      }
    },
    getRoleStats(val) {
      if (val) {
        this.totalRolesList = val.total_record || 0;
      } else {
        this.totalRolesList = 0;
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
      this.editedIndex = this.roleData.indexOf(item);
      delete item.password;
      this.selectedOrg = item.organization;
      this.editedItem = Object.assign({}, item);
    },
    deleteItem(item) {
      this.editedIndex = this.roleData.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.$store
        .dispatch("roles/deleteRole", {
          id: this.editedItem.id,
        })
        .then(() => {
          this.$showSuccessToast(this, "Role Deleted");
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
        this.$store
          .dispatch("roles/addRole", this.editedItem)
          .then(() => {
            this.close();
            this.$showSuccessToast(this, "Role Added Successfully");
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
        this.$store
          .dispatch("roles/updateRole", this.editedItem)
          .then(() => {
            this.close();
            this.$showSuccessToast(this, "Role Updated Successfully");
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
        this.$store.dispatch("roles/fetchRoles", searchObj);
      } else {
        this.search = "";
        searchObj.searchData = {};
        this.$store.dispatch("roles/fetchRoles", searchObj);
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
      //this.sortDirection = sortDesc[0] ? "asc" : "dec";
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
      this.$store.dispatch("roles/fetchRoles", obj).catch((err) => {
        console.error("errors", err);
      });
    },
  },
};
</script>
