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
              v-model="mediaClass"
              :items="mediaClassList"
              label="Media Class"
            ></v-select>
          </v-col>
          <v-col class="d-flex" cols="12" sm="4">
            <v-select
              :readonly="isReadOnly"
              v-model="structureType"
              :items="structureTypeList"
              label="Structure Type"
            ></v-select>
          </v-col>
          <v-col class="d-flex" cols="12" sm="4">
            <v-select
              :readonly="isReadOnly"
              v-model="mediaType"
              :items="mediaTypeList"
              label="Media Type"
            ></v-select>
          </v-col>
          <v-col class="d-flex" cols="12" sm="4">
            <v-select
              :readonly="isReadOnly"
              v-model="placeType"
              :items="placeTypeList"
              label="Place Type"
            ></v-select>
          </v-col>
          <v-col class="d-flex" cols="12" sm="4">
            <v-select
              :readonly="isReadOnly"
              v-model="material"
              :items="materialList"
              label="Material"
            ></v-select>
          </v-col>
          <v-col class="d-flex" cols="12" sm="4">
            <v-select
              :readonly="isReadOnly"
              v-model="placementType"
              :items="placementTypeList"
              label="Placement Type"
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
      mediaClass: "Media 1",
      mediaClassList: ["Media 1", "Media 2"],
      structureType: "Structure 1",
      structureTypeList: ["Structure 1", "Structure 2"],
      mediaType: "Media 1",
      mediaTypeList: ["Media 1", "Media 2"],
      placeType: "Place 1",
      placeTypeList: ["Place 1", "Place 2"],
      material: "Material 1",
      materialList: ["Material 1", "Material 2"],
      placementType: "Placement 1",
      placementTypeList: ["Placement 1", "Placement 2"],
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
