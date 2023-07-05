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
            <v-select
              :readonly="isReadOnly"
              v-model="catcnmentStrata"
              :items="catcnmentStrataList"
              label="Catcnment Strata"
            ></v-select>
          </v-col>
          <v-col class="d-flex" cols="12" sm="4">
            <v-select
              :readonly="isReadOnly"
              v-model="demographyLocationType"
              :items="demographyLocationTypeList"
              label="Location Type"
            ></v-select>
          </v-col>
          <v-col class="d-flex" cols="12" sm="4">
            <v-select
              :readonly="isReadOnly"
              v-model="trafficType"
              :items="trafficTypeList"
              label="Traffic Type"
            ></v-select>
          </v-col>
          <v-col class="d-flex" cols="12" sm="4">
            <v-select
              :readonly="isReadOnly"
              v-model="trafficDensity"
              :items="trafficDensityList"
              label="Traffic Density"
            ></v-select>
          </v-col>
          <v-col class="d-flex" cols="12" sm="4">
            <v-select
              :readonly="isReadOnly"
              v-model="trafficSignal"
              :items="trafficSignalList"
              label="Traffic Signal"
            ></v-select>
          </v-col>
          <v-col class="d-flex" cols="12" sm="4">
            <v-select
              :readonly="isReadOnly"
              v-model="ageGroup"
              :items="ageGroupList"
              label="Age Group"
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
      catcnmentStrata: "Value 1",
      catcnmentStrataList: ["Value 1", "Value 2"],
      demographyLocationType: "Location 1",
      demographyLocationTypeList: ["Location 1", "Location 2"],
      trafficType: "Traffic 1",
      trafficTypeList: ["Traffic 1", "Traffic 2"],
      trafficDensity: "Traffic 1",
      trafficDensityList: ["Traffic 1", "Traffic 2"],
      trafficSignal: "Traffic 1",
      trafficSignalList: ["Traffic 1", "Traffic 2"],
      ageGroup: "Age 1",
      ageGroupList: ["Age 1", "Age 2"],
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
