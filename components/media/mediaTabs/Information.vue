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
            <v-text-field
              ref="assetCode"
              :readonly="isReadOnly"
              v-model="assetCode"
              label="Asset Code"
              required
            ></v-text-field>
          </v-col>
          <v-col class="d-flex" cols="12" sm="6">
            <v-text-field
              v-model="vendorAssetCode"
              ref="vendorAssetCode"
              :readonly="isReadOnly"
              label="Vendor Asset Code"
              required
            ></v-text-field>
          </v-col>
          <v-col class="d-flex" cols="12" sm="6">
            <v-select
              :readonly="isReadOnly"
              v-model="ownedByOrgID"
              :items="ownedByOrgIDList"
              label="Owned By Org ID"
            ></v-select>
          </v-col>
          <v-col class="d-flex" cols="12" sm="6">
            <v-select
              :readonly="isReadOnly"
              v-model="status"
              :items="statusList"
              label="Status"
            ></v-select>
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
      assetCode: "",
      vendorAssetCode: "",
      ownedByOrgID: "101",
      status: "Active",
      ownedByOrgIDList: ["101", "102"],
      statusList: ["Active", "Disable"],
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
