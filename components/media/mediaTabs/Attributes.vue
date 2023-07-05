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
              ref="length"
              :readonly="isReadOnly"
              v-model="length"
              label="Length"
              required
            ></v-text-field>
          </v-col>
          <v-col class="d-flex" cols="12" sm="4">
            <v-text-field
              ref="width"
              :readonly="isReadOnly"
              v-model="width"
              label="Width"
              required
            ></v-text-field>
          </v-col>
          <v-col class="d-flex" cols="12" sm="4">
            <v-text-field
              ref="height"
              :readonly="isReadOnly"
              v-model="height"
              label="Height"
              required
            ></v-text-field>
          </v-col>
          <v-col class="d-flex" cols="12" sm="4">
            <v-select
              :readonly="isReadOnly"
              v-model="orientation"
              :items="orientationList"
              label="Orientation"
            ></v-select>
          </v-col>
          <v-col class="d-flex" cols="12" sm="4">
            <v-select
              :readonly="isReadOnly"
              v-model="captureFrequency"
              :items="captureFrequencyList"
              label="Capture Frequency"
            ></v-select>
          </v-col>
          <v-col class="d-flex" cols="12" sm="4">
            <v-select
              :readonly="isReadOnly"
              v-model="illumination"
              :items="illuminationList"
              label="Illumination"
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
      length: "",
      width: "",
      height: "",
      orientation: "Value1",
      orientationList: ["Value 1", "Value 2"],
      captureFrequency: "Value 1",
      captureFrequencyList: ["Value 1", "Value 2"],
      illumination: "Value 1",
      illuminationList: ["Value 1", "Value 2"],
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
