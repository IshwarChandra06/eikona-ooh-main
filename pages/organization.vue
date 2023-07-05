<template>
  <div>
    <v-data-table
      :headers="getHeaders"
      :items="organizationsData"
      :options.sync="options"
      :search="search"
      :server-items-length="totalOrgList"
      :footer-props="{ 'items-per-page-options': [5, 10, 30, 50, 100] }"
      :loading="loading"
      loading-text="Loading... Please wait"
      sort-by="id"
      class="elevation-1 orgTable"
      fixed-header
      :height="tableHeight"
    >
      <template v-slot:top>
        <v-toolbar flat color="primary">
          <v-toolbar-title class="white--text">Organization</v-toolbar-title>
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
            @click="dialog = true"
          >
            Add New
          </v-btn>
          <v-dialog max-width="600px" v-model="dialog" hide-overlay>
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
                        sm="12"
                        v-if="editedItem.name !== undefined"
                      >
                        <v-text-field
                          v-model="editedItem.name"
                          label="Name*"
                          required
                          :error-messages="nameErrors"
                          :counter="100"
                          @input="$v.editedItem.name.$touch()"
                          @blur="$v.editedItem.name.$touch()"
                        ></v-text-field>
                      </v-col>
                      <v-col
                        cols="12"
                        sm="12"
                        v-if="editedItem.address !== undefined"
                      >
                        <v-text-field
                          v-model="editedItem.address"
                          label="Address"
                          :error-messages="addressErrors"
                          :counter="200"
                          @input="$v.editedItem.address.$touch()"
                          @blur="$v.editedItem.address.$touch()"
                        ></v-text-field>
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        v-if="editedItem.city !== undefined"
                      >
                        <v-text-field
                          v-model="editedItem.city"
                          label="City*"
                          required
                          ref="city"
                          :error-messages="cityErrors"
                          :counter="100"
                          @input="$v.editedItem.city.$touch()"
                          @blur="$v.editedItem.city.$touch()"
                        ></v-text-field>
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        v-if="editedItem.state !== undefined"
                      >
                        <v-text-field
                          v-model="editedItem.state"
                          label="State"
                          :error-messages="stateErrors"
                          :counter="100"
                          @input="$v.editedItem.state.$touch()"
                          @blur="$v.editedItem.state.$touch()"
                        ></v-text-field>
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        v-if="editedItem.country !== undefined"
                      >
                        <v-text-field
                          v-model="editedItem.country"
                          label="Country"
                          :error-messages="countryErrors"
                          :counter="100"
                          @input="$v.editedItem.country.$touch()"
                          @blur="$v.editedItem.country.$touch()"
                        ></v-text-field>
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        v-if="editedItem.pinCode !== undefined"
                      >
                        <v-text-field
                          v-model="editedItem.pinCode"
                          required
                          type="number"
                          label="Pincode*"
                          ref="pincode"
                          :error-messages="pinErrors"
                          :counter="6"
                          @input="$v.editedItem.pinCode.$touch()"
                          @blur="$v.editedItem.pinCode.$touch()"
                          :rules="pinRule"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-divider class="my-3 div-dark"></v-divider>
                    <h3 class="my-3 black--text">Point of Contact</h3>
                    <v-row>
                      <v-col
                        cols="12"
                        sm="6"
                        v-if="editedItem.pointOfContact !== undefined"
                      >
                        <v-text-field
                          v-model="editedItem.pointOfContact"
                          type="text"
                          label="Name"
                          :error-messages="pocnameErrors"
                          :counter="100"
                          @input="$v.editedItem.pointOfContact.$touch()"
                          @blur="$v.editedItem.pointOfContact.$touch()"
                        ></v-text-field>
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        v-if="editedItem.pocPhone !== undefined"
                      >
                        <v-text-field
                          v-model="editedItem.pocPhone"
                          type="number"
                          label="Phone"
                          :error-messages="pocphoneErrors"
                          :counter="10"
                          @input="$v.editedItem.pocPhone.$touch()"
                          @blur="$v.editedItem.pocPhone.$touch()"
                          :rules="phoneRules"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col
                        v-if="editedItem.pocEmail !== undefined"
                        cols="12"
                        sm="6"
                        class="d-flex"
                      >
                        <v-text-field
                          v-model="editedItem.pocEmail"
                          type="email"
                          label="Email"
                          :error-messages="pocemailErrors"
                          :counter="100"
                          @input="$v.editedItem.pocEmail.$touch()"
                          @blur="$v.editedItem.pocEmail.$touch()"
                        ></v-text-field>
                      </v-col>

                      <v-col
                        cols="12"
                        sm="6"
                        v-if="editedItem.roles !== undefined"
                      >
                        <v-autocomplete
                          v-model="editedItem.roles"
                          label="Role*"
                          :items="roleLists"
                          item-value="id"
                          item-text="name"
                          required
                          :rules="roleRule"
                          multiple
                        ></v-autocomplete>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn 
                  color="primary darken-1" 
                  @click="close"> Cancel 
                </v-btn>
                <v-btn
                  color="primary darken-1"
                  @click="save"
                  :disabled="!valid"> Save 
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-btn
            v-if="
              userPrivileges[$route.name] &&
              userPrivileges[$route.name].includes('add')
            "
            class="mr-2"
            @click="showImportModal = true"
          > 
          Import
          </v-btn>
          <v-btn class="mr-2">
            <download-excel
              :fields="json_fields"
              :fetch="fetchData"
              worksheet="Organization Data"
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
              worksheet="Organization Data"
              :name="getFileName('xls')"
            >
              Excel
              <v-icon right dark> mdi-download </v-icon>
            </download-excel>
          </v-btn>
          <v-btn class="mr-2" @click="generatePDF">
            PDF <v-icon right dark> mdi-download </v-icon>
          </v-btn>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="headline justify-center"
                >Are you sure you want to delete?</v-card-title
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
        <div class="d-flex">
          <v-icon
            v-if="
              userPrivileges[$route.name] &&
              userPrivileges[$route.name].includes('update')
            "
            small
            class="mr-2"
            @click="editItem(item)"
            :loading="editingLoader"
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

      <template v-slot:item.roles="{ item }">
        <span v-for="(role, index) in item.roles" :key="index"
          >{{ role.name
          }}{{
            role.name ? (item.roles.length - 1 <= index ? "" : ",") : "-"
          }}</span
        >
      </template>
    </v-data-table>
    <v-dialog
      v-model="showImportModal"
      transition="dialog-bottom-transition"
      max-width="600"
    >
      <v-card>
        <v-toolbar color="primary" dark
          >Import Organization<v-spacer></v-spacer>
          <v-btn
            href="/excel-templates/Organization-Data.xlsx"
            download="Organization-Data.xlsx"
            target="_blank"
            class="mt-2 mr-2"
            light
          >
            <v-icon left dark> mdi-download </v-icon> Template
          </v-btn></v-toolbar
        >
        <v-card-text>
          <v-file-input
            v-model="uploadOrgCSV"
            accept=".xls, .xlsx"
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
  </div>
</template>
<script>
import { mapState } from "vuex";
import Vue from "vue";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { validationMixin } from "vuelidate";
import {
  required,
  maxLength,
  email,
  minLength,
} from "vuelidate/lib/validators";
import JsonExcel from "vue-json-excel";
import axios from "axios";
import SearchBar from "@/components/SearchBar";
import SearchBar2 from "@/components/SearchBar2";

import * as _ from "lodash";
import XLSX from "xlsx";

Vue.component("downloadExcel", JsonExcel);
export default {
  mixins: [validationMixin],
  validations: {
    editedItem: {
      name: { required, maxLength: maxLength(100) },
      address: { maxLength: maxLength(200) },
      city: { required, maxLength: maxLength(100) },
      state: { maxLength: maxLength(100) },
      country: { maxLength: maxLength(100) },
      pinCode: { required, maxLength: maxLength(6), minLength: minLength(6) },
      pocEmail: { maxLength: maxLength(100), email },
      pocPhone: { maxLength: maxLength(10) },
      pointOfContact: { maxLength: maxLength(100) },
    },
  },

  data: () => ({
    items: ["Superadmin", "admin", "Vendor", "advert"],

    pinRule: [
      (v) => !!v || "enter the value",
      (v) => !v || v.length > 5 || "too short",
    ],

    phoneRules: [
      (v) =>
        !v || v.length === 0 || v.length >= 10 || "Enter Valid Contact Number",
    ],
    roleRule: [(v) => !!v || "enter the value"],
    showImportModal: false,
    loading: true,
    search: "",
    searchData: {},
    uploadOrgCSV: [],
    totalOrgList: null,
    page: null,
    numberOfPages: null,
    pageNumber: null,
    sort: null,
    sortDirection: "dec",
    editingLoader: false,

    itemsPerPage: null,
    options: { pageNumber: null, page: 1, itemsPerPage: 10 },
    valid: true,
    dialog: false,
    dialogDelete: false,
    cityList: [],
    stateList: [],
    countryList: [],
    organizationsData: [],
    editedIndex: -1,
    searchFields: {
      id: "",
      name: "",
      address: "",
      city: "",
      state: "",
      country: "",
      pinCode: "",
      pointOfContact: "",
      pocPhone: "",
      pocEmail: "",
      roles: [],
    },
    editedItem: {
      name: "",
      address: "",
      city: "",
      state: "",
      country: "",
      pinCode: "",
      pointOfContact: "",
      pocPhone: "",
      pocEmail: "",
      sortField: "",
      sortOrder: "",
      roles: [],
      pageNo: 1,
      pageSize: 0,
      orgId: 0,
    },
    defaultItem: {
      name: "",
      address: "",
      city: "",
      state: "",
      country: "",
      pinCode: "",
      pointOfContact: "",
      pocPhone: "",
      pocEmail: "",
      roles: [],
    },
    json_fields: {
      id: "id",
      name: "name",
      city: "city",
      state: "state",
      country: "country",
      pinCode: "pinCode",
      pointOfContact: "pointOfContact",
      pocPhone: "pocPhone",
      pocEmail: "pocEmail",
      address: "address",
      roles: "roles",
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
    tableHeight: "450px",
    tableFields: [],
    selectedFields: [],
    chipFields: [],
    chipFilterObj: {},
  }),

  computed: {
    headers() {
      return [
        { text: "Actions", value: "actions", sortable: false },
        { text: "Id", align: "start", value: "id" },
        {
          text: "Name",
          value: "name",
          filter: (f) => {
            return (f + "")
              .toLowerCase()
              .includes(this.editedItem["name"].toLowerCase());
          },
        },
        {
          text: "City",
          value: "city",
          filter: (f) => {
            return (f + "")
              .toLowerCase()
              .includes(this.editedItem["city"].toLowerCase());
          },
        },
        {
          text: "State",
          value: "state",
          filter: (f) => {
            return (f + "")
              .toLowerCase()
              .includes(this.editedItem["state"].toLowerCase());
          },
        },
        {
          text: "Country",
          value: "country",
          filter: (f) => {
            return (f + "")
              .toLowerCase()
              .includes(this.editedItem["country"].toLowerCase());
          },
        },
        {
          text: "Pincode",
          value: "pinCode",
          filter: (f) => {
            return (f + "")
              .toLowerCase()
              .includes(this.editedItem["pinCode"].toLowerCase());
          },
        },
        {
          text: "Point of Contact",
          value: "pointOfContact",
          filter: (f) => {
            return (f + "")
              .toLowerCase()
              .includes(this.editedItem["pointOfContact"].toLowerCase());
          },
        },
        {
          text: "Phone",
          value: "pocPhone",
          filter: (f) => {
            return (f + "")
              .toLowerCase()
              .includes(this.editedItem["pocPhone"].toLowerCase());
          },
        },
        {
          text: "Email",
          value: "pocEmail",
          filter: (f) => {
            return (f + "")
              .toLowerCase()
              .includes(this.editedItem["pocEmail"].toLowerCase());
          },
        },
        {
          text: "Address",
          value: "address",
          filter: (f) => {
            return (f + "")
              .toLowerCase()
              .includes(this.editedItem["address"].toLowerCase());
          },
        },
        {
          text: "Roles",
          value: "roles",
        },
      ];
    },
    ...mapState({
      getOrganizationsData: (state) => state.organizations.organizations,
      getOrganizationStats: (state) => state.organizations.organizationStats,
      userPrivileges: (state) => state.userPrivileges,
      roleLists: (state) => state.organizations.orgroles,
      isSerching: (state) => state.organizations.isSearching,
    }),
    formTitle() {
      console.log("calling");

      return this.editedIndex === -1 ? "Add New" : "Edit";
    },
    // vuelidate validation
    nameErrors() {
      const errors = [];
      if (!this.$v.editedItem.name.$dirty) return errors;
      !this.$v.editedItem.name.maxLength &&
        errors.push("Name not more than 100 Characters");
      !this.$v.editedItem.name.required && errors.push("Name is required.");
      return errors;
    },
    cityErrors() {
      const errors = [];
      if (!this.$v.editedItem.city.$dirty) return errors;
      !this.$v.editedItem.city.maxLength &&
        errors.push("City Name not more than 100 Characters");
      !this.$v.editedItem.city.required &&
        errors.push("City Name is required.");
      return errors;
    },
    addressErrors() {
      const errors = [];
      if (!this.$v.editedItem.address.$dirty) return errors;
      !this.$v.editedItem.address.maxLength &&
        errors.push("Address not more than 200 Characters");
      return errors;
    },
    stateErrors() {
      const errors = [];
      if (!this.$v.editedItem.state.$dirty) return errors;
      !this.$v.editedItem.state.maxLength &&
        errors.push("State Name not more than 100 Characters");
      return errors;
    },
    countryErrors() {
      const errors = [];
      if (!this.$v.editedItem.country.$dirty) return errors;
      !this.$v.editedItem.country.maxLength &&
        errors.push("Country Name not more than 100 Characters");
      return errors;
    },
    pinErrors() {
      const errors = [];
      if (!this.$v.editedItem.pinCode.$dirty) return errors;
      !this.$v.editedItem.pinCode.maxLength && errors.push("Invalid PinCode");
      !this.$v.editedItem.pinCode.minLength && errors.push("Invalid PinCode");
      !this.$v.editedItem.pinCode.required &&
        errors.push("Pin Code is required.");
      return errors;
    },

    // poc rules
    pocnameErrors() {
      const errors = [];
      if (!this.$v.editedItem.pointOfContact.$dirty) return errors;
      !this.$v.editedItem.pointOfContact.maxLength &&
        errors.push("Name not more than 100 Characters");
      return errors;
    },
    pocphoneErrors() {
      const errors = [];
      if (!this.$v.editedItem.pocPhone.$dirty) return errors;
      !this.$v.editedItem.pocPhone.maxLength &&
        errors.push("Phone not more than 10 Characters");

      return errors;
    },
    pocemailErrors() {
      const errors = [];
      if (!this.$v.editedItem.pocEmail.$dirty) return errors;
      !this.$v.editedItem.pocEmail.maxLength &&
        errors.push("Email not more than 100 Characters");
      !this.$v.editedItem.pocEmail.email && errors.push("Must be valid e-mail");
      return errors;
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

  watch: {
    roles(val) {
      console.log("val;", val);
    },
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    options: {
      handler() {
        this.dispatchOrgFilter();
      },
    },
    deep: true,
    getOrganizationsData(val) {
      if (val && val.length) {
        this.loading = false;
        this.organizationsData = val;
      } else {
        this.loading = false;
        this.organizationsData = [];
      }
    },
    getOrganizationStats(val) {
      if (val) {
        this.totalOrgList = val.total_record || 0;
      } else {
        this.totalOrgList = 0;
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
        this.$store.dispatch("organizations/fetchOrganizationsWithFilter");
      }
    },
  },
  created() {
    this.$store.dispatch("organizations/orgRoles");
    this.$store.dispatch("organizations/clearIsSearching");
    this.setTableFields();
  },
  mounted() {
    let self = this;

    this.tableHeight = window.innerHeight - 250;
  },
  methods: {
    readExcelFile(file) {
      try {
        if (!this.uploadOrgCSV) {
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
            // console.log("excel", data);

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
                        : value &&
                          value.length > 0 &&
                          value.toLowerCase() == "false"
                        ? false
                        : value || "";
                  } else {
                    obj[head] =
                      value && value.toLowerCase() == "true"
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
              .dispatch("organizations/importMedia", result)
              .then(() => {
                this.$showSuccessToast(this, "Excel Imported");
                this.showImportModal = false;
                this.clear();
                this.uploadOrgCSV = null;
                this.$store.dispatch("organizations/fetchOrganizations");
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
      var response = await this.$store.dispatch(
        "organizations/exportOrganizations"
      );
      if (response && response.length) {
        response.forEach((item) => {
          if (item && item.roles && item.roles.length) {
            let newRoles = "";
            item.roles.forEach((role) => {
              if (newRoles.length) {
                newRoles = newRoles + "," + role.name;
              } else {
                newRoles = role.name;
              }
              item.roles = newRoles;
            });
          }
        });
      }

      console.log("resr", response);
      return response;
    },
    getFileName(ext) {
      return "Organization-Data-" + new Date().getTime() + "." + ext;
    },
    // vuelidate methods
    submit() {
      this.$v.$touch();
    },
    clear() {
      this.$v.$reset();
      this.editedItem.name = "";
      this.editedItem.pocEmail = "";
      this.editedItem.city = "";
      this.editedItem.address = "";
      this.editItem.state = "";
      this.editItem.country = "";
      this.editedItem.pointOfContact = "";
      this.editedItem.pocPhone = "";
      this.editedItem.pocEmail = "";
      this.uploadOrgCSV = [];
    },
    async editItem(item) {
      this.editingLoader = true;
      try {
        const response = await this.$axios.$get(
          `/api/organization/id/${item.id}`
        );
        if (response && response.id) {
          this.editingLoader = false;
          const newItem = { ...response };
          let tempRoles = [];
          if (newItem.roles && newItem.roles.length) {
            newItem.roles.forEach((item) => {
              if (item.id) {
                tempRoles.push(item.id);
              }
            });
          }
          newItem.roles = [...tempRoles];
          console.log("new item", newItem);
          this.dialog = true;
          this.editedIndex = this.organizationsData.indexOf(item);
          this.editedItem = Object.assign({}, newItem);
        } else {
          this.editingLoader = false;
          this.$showErrorToast(this, "Server error");
        }
      } catch (error) {
        console.error("catch err", error);
        this.editingLoader = false;
        this.$showErrorToast(this, "Server error");
      }
    },

    deleteItem(item) {
      this.editedIndex = this.organizationsData.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.$store
        .dispatch("organizations/deleteOrganizations", {
          id: this.editedItem.id,
        })
        .then(() => {
          this.$showSuccessToast(this, "Deleted Successfully");
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
      if (
        this.editedIndex === -1 &&
        this.$refs.city.value &&
        this.$refs.pincode.value.length === 6
      ) {
        if (
          this.editedItem &&
          this.editedItem.roles &&
          this.editedItem.roles.length
        ) {
          const payload = this.editedItem;
          const incomingRoles = [];
          payload.roles.forEach((role) => {
            incomingRoles.push({ id: role });
          });
          payload.roles = incomingRoles;
          console.log("details", payload);
          this.$store
            .dispatch("organizations/addOrganizations", payload)
            .then(() => {
              this.close();
              this.$showSuccessToast(this, "Organization Added Successfully");
              this.dispatchOrgFilter();
            })

            .catch((e) => {
              console.error(e.response);

              if (e.response && e.response.data && e.response.data.data)
                this.$showErrorToast(this, e.response.data.msg);
              else this.$showErrorToast(this, "Update Failed");
            });
        } else {
          this.$showErrorToast(this, "Role is required");
        }
      } else {
        if (
          this.editedItem &&
          this.editedItem.roles &&
          this.editedItem.roles.length
        ) {
          const payload = this.editedItem;
          const incomingRoles = [];
          payload.roles.forEach((role) => {
            incomingRoles.push({ id: role });
          });
          payload.roles = incomingRoles;
          this.$store
            .dispatch("organizations/updateOrganizations", this.editedItem)
            .then(() => {
              this.close();
              this.$showSuccessToast(this, "Organization Updated Successfully");
              this.dispatchOrgFilter();
            })
            .catch((e) => {
              console.error(e.response);
              if (e.response && e.response.data && e.response.data.data)
                this.$showErrorToast(this, e.response.data.msg);
              else this.$showErrorToast(this, "Fill the Details");
            });
        } else {
          this.$showErrorToast(this, "Fill the req Details");
        }
      }
    },
    // Search Filter
    searchRecord() {
      this.setTableParams();
      const searchObj = {
        pageNo: this.pageNumber,
        pageSize: this.itemsPerPage,
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
        this.$store.dispatch("organizations/fetchOrganizations", searchObj);
      } else {
        this.search = "";
        searchObj.searchData = {};
        this.$store.dispatch("organizations/fetchOrganizations", searchObj);
      }
    },

    clearRecord() {
      this.search = "";
      this.dispatchOrgFilter();
    },
    // Set Datatable options
    setTableParams() {
      const { sortBy, sortDesc, page, itemsPerPage } = this.options;
      this.pageNumber = page;
      this.sort = sortBy[0];
      // this.sortDirection = sortDesc[0] ? "asc" : "dec";
      this.sortDirection = sortDesc[0] ? "dec" : "asc";
      this.itemsPerPage = itemsPerPage;
    },
    // Dispatch Filter
    async dispatchOrgFilter() {
      this.loading = true;
      this.setTableParams();
      const obj = {
        searchData: this.searchData,
        pageNo: this.pageNumber,
        pageSize: this.itemsPerPage,
        orgId: 0,
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
        .dispatch("organizations/fetchOrganizations", obj)
        .then(() => {
          this.loading = false;
        })
        .catch((err) => {
          console.error("errors", err);
          this.loading = false;
        });
    },
    // PDF Generate
    async generatePDF() {
      let pdfName = this.getFileName("pdf");
      let heading = "Organization Report";
      let getData = await this.fetchData();
      const columns = [
        { header: "Id", dataKey: "id" },
        { header: "Name", dataKey: "name" },
        { header: "City", dataKey: "city" },
        { header: "State", dataKey: "state" },
        { header: "Country", dataKey: "country" },
        { header: "Pincode", dataKey: "pinCode" },
        { header: "Point of Contact", dataKey: "pointOfContact" },
        { header: "Phone", dataKey: "pocPhone" },
        { header: "Email", dataKey: "pocEmail" },
        { header: "Address", dataKey: "address" },
      ];
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "in",
        format: "letter",
      });
      // text is placed using x, y coordinates
      doc.setFontSize(16).text(heading, 0.5, 1.0);
      // create a line under heading
      doc.setLineWidth(0.01).line(0.5, 1.1, 8.0, 1.1);
      // Using autoTable plugin
      doc.autoTable({
        columns,
        body: getData,
        margin: { left: 0.5, top: 1.25 },
      });
      doc.save(pdfName);
    },
    setTableFields() {
      if (this.headers && this.headers.length) {
        // const fieldsArray = [];
        this.headers.forEach((item) => {
          // fieldsArray.push({field:item.value, searchKey:""})
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
        this.$store.dispatch("organizations/fetchOrganizationsWithFilter", obj);
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
      this.$store.dispatch("organizations/fetchOrganizationsWithFilter", obj);
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
.orgTable > .v-data-table__wrapper > table > tbody > tr > td,
.v-data-table > .v-data-table__wrapper > table > thead > tr:last-child > th {
  white-space: pre !important;
}
.v-data-table__wrapper {
  max-height: 100%;
}
.div-dark {
  border-color: #000 !important;
}
.chip-width {
  width: 100px;
}
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
