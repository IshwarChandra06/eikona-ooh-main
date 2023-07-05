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
            <v-icon dark> mdi-pencil </v-icon>
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
            <v-icon dark> mdi-floppy </v-icon>
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
            <v-icon dark> mdi-close </v-icon>
          </v-btn>
        </div>
        <v-row align="center">
          <v-col class="d-flex" cols="12" sm="6">
            <v-select
              :readonly="isReadOnly"
              v-model="viewingDistanceList"
              :items="viewingDistance"
              label="Viewing Distance"
              required
            ></v-select>
          </v-col>
          <v-col class="d-flex" cols="12" sm="6">
            <v-text-field
              ref="viewingTime"
              :readonly="isReadOnly"
              v-model="viewingTime"
              label="Viewing Time"
              required
            ></v-text-field>
          </v-col>
          <v-col class="d-flex" cols="12" sm="6">
            <v-select
              :readonly="isReadOnly"
              v-model="quality"
              :items="qualityList"
              label="Quality"
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
      viewingDistance: "",
      viewingDistanceList: [],
      viewingTime: "",
      quality: "Quality 1",
      qualityList: ["Quality 1", "Quality 2"],
      isReadOnly: true,
      editButton: true,
      saveButton: false,
      closeButton: false,
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
    },
  },
};
</script>
