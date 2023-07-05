<template>
  <v-tab-item>
    <v-card flat>
      <v-card-text>
        <div class="d-flex justify-end">
          <v-btn
            v-if="editButton"
            class="mx-2"
            fab
            dark
            small
            color="primary"
            @click="editValues"
          >
            <v-icon dark>
              mdi-pencil
            </v-icon>
          </v-btn>
          <v-btn
            v-if="saveButton"
            class="mx-2"
            fab
            dark
            small
            color="primary"
            @click="saveValues"
          >
            <v-icon dark>
              mdi-floppy
            </v-icon>
          </v-btn>
          <v-btn
            v-if="closeButton"
            class="mx-2"
            fab
            dark
            small
            color="primary"
            @click="closeValues"
          >
            <v-icon dark>
              mdi-close
            </v-icon>
          </v-btn>
        </div>
        <v-row align="center">
          <v-col class="d-flex" cols="12" sm="6">
            <v-select
              :readonly="isReadOnly"
              v-model="managedByOrgId"
              :items="managedByOrgIdList"
              label="Managed By Org Id"
            ></v-select>
          </v-col>
          <v-col class="d-flex" cols="12" sm="6">
            <v-menu
              v-model="fromDatePicker"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="fromDate"
                  label="From Date"
                  prepend-icon="mdi-calendar"
                  :readonly="isReadOnly"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="fromDate"
                @input="menu2 = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col class="d-flex" cols="12" sm="6">
            <v-menu
              v-model="toDatePicker"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="toDate"
                  label="To Date"
                  prepend-icon="mdi-calendar"
                  :readonly="isReadOnly"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="toDate"
                @input="menu2 = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-tab-item>
</template>
<script>
export default {
  data() {
    return {
      managedByOrgId: "Org 1",
      managedByOrgIdList: ["Org 1", "Org 2"],
      fromDate: "",
      toDate: "",
      fromDatePicker: false,
      toDatePicker: false,
      isReadOnly: true,
      editButton: true,
      saveButton: false,
      closeButton: false
    };
  },
  methods: {
    editValues() {
      this.isReadOnly = false;
      this.editButton = false;
      this.saveButton = true;
      this.closeButton = true;
    },
    saveValues() {
      this.isReadOnly = true;
      this.editButton = true;
      this.saveButton = false;
      this.closeButton = false;
    },
    closeValues() {
      this.isReadOnly = true;
      this.editButton = true;
      this.saveButton = false;
      this.closeButton = false;
    }
  }
};
</script>
