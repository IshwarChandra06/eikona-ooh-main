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
          <v-col class="d-flex" cols="12" sm="4">
            <v-text-field
              ref="latitude"
              :readonly="isReadOnly"
              v-model="latitude"
              label="Latitude"
              required
            ></v-text-field>
          </v-col>
          <v-col class="d-flex" cols="12" sm="4">
            <v-text-field
              ref="longitude"
              :readonly="isReadOnly"
              v-model="longitude"
              label="Longitude"
              required
            ></v-text-field>
          </v-col>
          <v-col class="d-flex" cols="12" sm="4">
            <v-text-field
              ref="road"
              :readonly="isReadOnly"
              v-model="road"
              label="Road"
              required
            ></v-text-field>
          </v-col>
          <v-col class="d-flex" cols="12" sm="4">
            <v-text-field
              ref="locality"
              :readonly="isReadOnly"
              v-model="locality"
              label="Locality"
              required
            ></v-text-field>
          </v-col>
          <v-col class="d-flex" cols="12" sm="4">
            <v-text-field
              ref="city"
              :readonly="isReadOnly"
              v-model="city"
              label="City"
              required
            ></v-text-field>
          </v-col>
          <v-col class="d-flex" cols="12" sm="4">
            <v-text-field
              ref="district"
              :readonly="isReadOnly"
              v-model="district"
              label="District"
              required
            ></v-text-field>
          </v-col>
          <v-col class="d-flex" cols="12" sm="4">
            <v-text-field
              ref="state"
              :readonly="isReadOnly"
              v-model="state"
              label="State"
              required
            ></v-text-field>
          </v-col>
          <v-col class="d-flex" cols="12" sm="4">
            <v-text-field
              ref="pincode"
              :readonly="isReadOnly"
              v-model="pincode"
              label="Pincode"
              required
            ></v-text-field>
          </v-col>
          <v-col class="d-flex" cols="12" sm="4">
            <v-select
              :readonly="isReadOnly"
              v-model="locationType"
              :items="locationTypeList"
              label="locationType"
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
      latitude: "",
      longitude: "",
      road: "",
      locality: "",
      city: "",
      district: "",
      state: "",
      pincode: "",
      locationType: "Type 1",
      locationTypeList: ["Type 1", "Type 2"],
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
