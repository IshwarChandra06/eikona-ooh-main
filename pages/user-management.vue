<template>
  <v-data-table
    :headers="getHeaders"
    :items="usersData"
    :search="search"
    :options.sync="options"
    :server-items-length="totalUsersList"
    :footer-props="{ 'items-per-page-options': [5, 10, 30, 50, 100] }"
    :loading="loading"
    loading-text="Loading... Please wait"
    sort-by="id"
    class="elevation-1"
    :height="tableHeight"
  >
    <template v-slot:top>
      <v-toolbar flat color="primary">
        <v-toolbar-title class="white--text">User Management</v-toolbar-title>
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
                      v-if="editedItem.userName !== undefined"
                    >
                      <v-text-field
                        v-model="editedItem.userName"
                        label="Username*"
                        counter="100"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      v-if="editedItem.password !== undefined"
                    >
                      <v-text-field
                        v-model="editedItem.password"
                        :rules="[passwordRules.min]"
                        :type="show1 ? 'text' : 'password'"
                        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append="show1 = !show1"
                        label="Password*"
                        minlength="8"
                        maxlength="25"
                      ></v-text-field>
                    </v-col>

                    <v-col
                      cols="12"
                      sm="6"
                      v-if="editedItem.phone !== undefined"
                    >
                      <v-text-field
                        v-model="editedItem.phone"
                        label="Phone"
                        type="text"
                        minlength="10"
                        maxlength="10"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-select
                        return-object
                        v-model="selectedOrg"
                        label="Organization*"
                        :items="organizationsList"
                        item-value="id"
                        item-text="name"
                        @change="onSelectOrg"
                        required
                      ></v-select>
                    </v-col>

                    <v-col
                      v-if="editedItem.role.id !== undefined"
                      cols="12"
                      sm="6"
                    >
                      <v-select
                        v-model="editedItem.role.id"
                        :items="rolesList"
                        label="Roles*"
                        item-text="name"
                        item-value="id"
                      ></v-select>
                    </v-col>
                    <v-col
                      v-if="editedItem.active !== undefined"
                      cols="12"
                      sm="6"
                    >
                      <label class="">Active</label>
                      <v-radio-group v-model="editedItem.active" row>
                        <v-radio
                          v-for="item in statusList"
                          :key="item.value"
                          :label="item.text"
                          :value="item.value"
                          required
                        ></v-radio>
                      </v-radio-group>
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
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline"
              >Are you sure you want to delete this User?</v-card-title
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
import * as _ from "lodash";
export default {
  data: () => ({
    show1: false,
    loading: false,
    search: "",
    valid: true,
    dialog: false,
    dialogDelete: false,
    totalUsersList: null,
    options: { pageNumber: null, page: 1, itemsPerPage: 10 },
    headers: [
      { text: "Actions", value: "actions", sortable: false },
      { text: "ID", value: "id", align: "start", sortable: true },
      { text: "Username", value: "userName" },
      { text: "Phone", value: "phone" },
      { text: "Role", value: "role.name" },
      { text: "Organization", value: "organization.name" },
      { text: "Active", value: "active" },
    ],
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
    usersData: [],
    editedIndex: -1,
    selectedOrg: {},
    editedItem: {
      id: "",
      userName: "",
      password: "",
      phone: "",
      role: {
        id: "",
      },
      organization: {
        id: "",
      },
      active: "",
    },
    defaultItem: {
      id: "",
      userName: "",
      password: "",
      phone: "",
      role: {
        id: "",
      },
      organization: {
        id: "",
      },
      active: "",
    },
    tableHeight: "450px",
    nameRules: [
      (v) => !!v || "",
      (v) => (v && v.length <= 100) || "Text not more than 100 characters",
    ],
    roleRules: [(v) => !!v || "Role ID is required"],

    passwordRules: {
      required: (value) => !!value || "",
      min: (v) => (v && v.length >= 8) || "Min 8 characters",
    },

    tableFields: [],
    selectedFields: [],
    chipFields: [],
    userSchema: {
      id: "",
      userName: "",
      phone: "",
      organization: "",
      role: "",
    },
    chipFilterObj: {},
  }),
  created() {
    this.$store.dispatch("organizations/fetchOrganizations");
    this.setTableFields();
  },
  computed: {
    ...mapState({
      getUsersData: (state) => state.userManagement.users,
      getUsersStats: (state) => state.userManagement.usersStats,
      userPrivileges: (state) => state.userPrivileges,
      organizationsList: (state) => state.organizations.organizations,
      organizationDetails: (state) => state.organizations.organizationDetails,
      isSerching: (state) => state.userManagement.isSearching,
    }),
    ...mapGetters({
      getOrganizationId: "getOrgId",
    }),
    formTitle() {
      return this.editedIndex === -1 ? "Add New" : "Edit User";
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
    getUsersData(val) {
      if (val && val.length) {
        this.loading = false;
        this.usersData = JSON.parse(JSON.stringify(val));
      } else {
        this.loading = false;
        this.usersData = [];
      }
    },
    getUsersStats(val) {
      if (val) {
        this.totalUsersList = val.total_record || 0;
      } else {
        this.totalUsersList = 0;
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
      this.loading = val;
    },
    chipFields(val) {
      if (val && !val.length) {
        this.$store.dispatch("userManagement/fetchUsersWithFilter");
      }
    },
  },

  methods: {
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
    onSelectOrg() {
      if (this.selectedOrg && this.selectedOrg.id) {
        this.editedItem.organization = this.selectedOrg;
        this.editedItem.role.id = "";
        this.$store.dispatch(
          "organizations/fetchOrganizationById",
          this.selectedOrg.id
        );
      }
    },

    editItem(item) {
      const newItem = { ...item };
      console.log("item,", item);
      this.dialog = true;
      this.editedIndex = this.usersData.indexOf(item);
      delete newItem.password;
      this.selectedOrg = item.organization;
      this.editedItem.role.id = item.role.id;
      this.$store.dispatch(
        "organizations/fetchOrganizationById",
        this.selectedOrg.id
      );
      this.editedItem = Object.assign({}, newItem);
    },
    deleteItem(item) {
      this.editedIndex = this.usersData.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.$store
        .dispatch("userManagement/deleteUser", {
          id: this.editedItem.id,
        })
        .then(() => {
          this.$showSuccessToast(this, "User Deleted Successfully");
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
        this.editedItem = Object.assign({}, this.defaultItem);
        this.selectedOrg = {};
        this.rolesList = [];
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    save() {
      this.$refs.form.validate();
      console.log("edt", this.editedItem);
      if (
        !this.editedItem.role ||
        !this.editedItem.role.id ||
        !this.editedItem.userName ||
        !this.editedItem.organization.id
      ) {
        this.$showErrorToast(this, "Please fill all mandatory fields!");
        return;
      }

      if (this.editedIndex === -1) {
        if (!this.editedItem.password) {
          this.$showErrorToast(this, "Please fill all mandatory fields!");
          return;
        }
        this.$store
          .dispatch("userManagement/addUser", this.editedItem)
          .then(() => {
            this.close();
            this.$showSuccessToast(this, "User Added Successfully");
            this.dispatchUsersFilter();
          })
          .catch((e) => {
            console.error(e.response);
            if (e.response && e.response.data && e.response.data.data)
              this.$showErrorToast(this, e.response.data.msg);
            else this.$showErrorToast(this, "Update Failed");
          });
      } else {
        console.log("role", this.editedItem.role.id);
        this.$store
          .dispatch("userManagement/updateUser", this.editedItem)
          .then(() => {
            this.close();
            this.$showSuccessToast(this, "User Updated Successfully");
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

        searchObj.searchData = { userName: tempSearchArr1 };
        this.$store.dispatch("userManagement/fetchUsers", searchObj);
      } else {
        this.search = "";
        searchObj.searchData = {};
        this.$store.dispatch("userManagement/fetchUsers", searchObj);
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
      this.sortDirection = sortDesc[0] ? "asc" : "dec";
      this.itemsPerPage = itemsPerPage;
    },
    async dispatchUsersFilter() {
      this.loading = true;
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
      await this.grabChipFilter();
      if (this.chipFilterObj && Object.keys(this.chipFilterObj).length) {
        obj.searchData = { ...obj["searchData"], ...this.chipFilterObj };
      }
      this.$store
        .dispatch("userManagement/fetchUsers", obj)
        .then(() => {
          this.loading = false;
        })
        .catch((err) => {
          console.error("errors", err);
        });
    },

    setTableFields() {
      if (this.headers && this.headers.length) {
        const keysArray = Object.keys(this.userSchema);
        keysArray.forEach((item) => {
          this.tableFields.push({ field: item, searchKey: "" });
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
        this.$store.dispatch("userManagement/fetchUsersWithFilter", obj);
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
      this.$store.dispatch("userManagement/fetchUsersWithFilter", obj);
    }, 1500),
  },
};
</script>

<style>
.v-label {
  margin-top: 0.1rem;
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
