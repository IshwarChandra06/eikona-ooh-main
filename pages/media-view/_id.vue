<template>
  <div>
    <div class="d-flex flex-wrap mb-3">
      <v-btn color="primary" @click="goBack">
        <v-icon color="white"> mdi-arrow-left </v-icon> Back</v-btn
      >
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="submit">
        <v-icon color="white"> mdi-floppy </v-icon> Save
      </v-btn>
    </div>
    <v-stepper v-model="e1">
      <v-stepper-header>
        <template v-for="n in steps">
          <v-stepper-step
            :key="`${n.count}-step`"
            :complete="e1 > n.count"
            :step="n.count"
            editable
          >
            {{ n.name }}
          </v-stepper-step>

          <v-divider v-if="n.count !== steps" :key="n.count"></v-divider>
        </template>
      </v-stepper-header>

      <v-stepper-items>
        <!-- Information Tab -->
        <v-stepper-content step="1">
          <v-card flat class="mb-12">
            <v-card-text>
              <v-row align="center">
                <v-col class="d-flex" cols="12" sm="6">
                  <v-text-field
                    ref="assetCode"
                    :readonly="isReadOnly"
                    v-model="assetCode"
                    label="Asset Code*"
                    required
                    :rules="textRule"
                    maxlength="100"
                    counter="100"
                  ></v-text-field>
                </v-col>
                <v-col class="d-flex" cols="12" sm="6">
                  <v-text-field
                    ref="vendorAssetCode"
                    :readonly="isReadOnly"
                    v-model="vendorAssetCode"
                    label="Vendor Asset Code"
                    required
                    :rules="textRule"
                    maxlength="100"
                    counter="100"
                  ></v-text-field>
                </v-col>
                <v-col class="d-flex" cols="12" sm="6">
                  <v-autocomplete
                    return-object
                    :readonly="isReadOnly"
                    v-model="ownedByOrgId"
                    :items="organizationsList"
                    label="Owned By*"
                    item-text="name"
                  ></v-autocomplete>
                </v-col>
                <v-col class="d-flex" cols="12" sm="6">
                  <v-autocomplete
                    return-object
                    :readonly="isReadOnly"
                    v-model="status"
                    :items="statusList"
                    item-text="value"
                    label="Status"
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <v-btn color="primary" @click="goBack" class="mr-2"> Cancel </v-btn>

          <v-btn color="primary" @click="e1 = 2"> Continue </v-btn>
        </v-stepper-content>
        <!-- Attributes Tab -->
        <v-stepper-content step="2">
          <v-card flat class="mb-12">
            <v-card-text>
              <v-row align="center">
                <v-col class="d-flex" cols="12" sm="4">
                  <v-text-field
                    ref="length"
                    :readonly="isReadOnly"
                    v-model="length"
                    label="Length (in ft)"
                    required
                    :rules="textRule"
                    maxlength="100"
                    counter="100"
                  ></v-text-field>
                </v-col>
                <v-col class="d-flex" cols="12" sm="4">
                  <v-text-field
                    ref="width"
                    :readonly="isReadOnly"
                    v-model="width"
                    label="Width (in ft)*"
                    required
                    :rules="textRule"
                    maxlength="100"
                    counter="100"
                  ></v-text-field>
                </v-col>
                <v-col class="d-flex" cols="12" sm="4">
                  <v-text-field
                    ref="height"
                    :readonly="isReadOnly"
                    v-model="height"
                    label="Base Height (in ft)*"
                    required
                    :rules="textRule"
                    maxlength="100"
                    counter="100"
                  ></v-text-field>
                </v-col>
                <v-col class="d-flex" cols="12" sm="4">
                  <v-autocomplete
                    return-object
                    :readonly="isReadOnly"
                    v-model="orientation"
                    :items="orientationList"
                    item-text="value"
                    label="Orientation"
                  ></v-autocomplete>
                </v-col>
                <v-col class="d-flex" cols="12" sm="4">
                  <v-autocomplete
                    return-object
                    :readonly="isReadOnly"
                    v-model="captureFrequency"
                    :items="captureFrequencyList"
                    item-text="value"
                    label="Capture Frequency"
                  ></v-autocomplete>
                </v-col>
                <v-col class="d-flex" cols="12" sm="4">
                  <v-autocomplete
                    return-object
                    :readonly="isReadOnly"
                    v-model="illumination"
                    :items="illuminationList"
                    item-text="value"
                    label="Illumination"
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <v-btn color="primary" @click="goBack" class="mr-2"> Cancel </v-btn>

          <v-btn color="primary" @click="e1 = 3"> Continue </v-btn>

          <v-btn text @click="e1 = 1"> Back </v-btn>
        </v-stepper-content>
        <!-- Location Tab -->
        <v-stepper-content step="3">
          <v-card flat class="mb-12">
            <v-card-text>
              <v-row align="center">
                <v-col class="d-flex" cols="12" sm="4">
                  <v-text-field
                    ref="latitude"
                    :readonly="isReadOnly"
                    v-model="latitude"
                    label="Latitude"
                    required
                    :rules="textRule"
                    maxlength="100"
                    counter="100"
                  ></v-text-field>
                </v-col>
                <v-col class="d-flex" cols="12" sm="4">
                  <v-text-field
                    ref="longitude"
                    :readonly="isReadOnly"
                    v-model="longitude"
                    label="Longitude"
                    required
                    :rules="textRule"
                    maxlength="100"
                    counter="100"
                  ></v-text-field>
                </v-col>
                <v-col class="d-flex" cols="12" sm="4">
                  <v-text-field
                    ref="road"
                    :readonly="isReadOnly"
                    v-model="road"
                    label="Road"
                    required
                    :rules="textRule"
                    maxlength="100"
                    counter="100"
                  ></v-text-field>
                </v-col>
                <v-col class="d-flex" cols="12" sm="4">
                  <v-text-field
                    ref="locality"
                    :readonly="isReadOnly"
                    v-model="locality"
                    label="Locality*"
                    required
                    :rules="textRule"
                    maxlength="100"
                    counter="100"
                  ></v-text-field>
                </v-col>
                <v-col class="d-flex" cols="12" sm="4">
                  <v-text-field
                    ref="city"
                    :readonly="isReadOnly"
                    v-model="city"
                    label="City*"
                    required
                    :rules="textRule"
                    maxlength="100"
                    counter="100"
                  ></v-text-field>
                </v-col>
                <v-col class="d-flex" cols="12" sm="4">
                  <v-text-field
                    ref="district"
                    :readonly="isReadOnly"
                    v-model="district"
                    label="District"
                    required
                    :rules="textRule"
                    maxlength="100"
                    counter="100"
                  ></v-text-field>
                </v-col>
                <v-col class="d-flex" cols="12" sm="4">
                  <v-text-field
                    ref="state"
                    :readonly="isReadOnly"
                    v-model="state"
                    label="State"
                    required
                    :rules="textRule"
                    maxlength="100"
                    counter="100"
                  ></v-text-field>
                </v-col>
                <v-col class="d-flex" cols="12" sm="4">
                  <v-text-field
                    ref="pincode"
                    :readonly="isReadOnly"
                    v-model="pincode"
                    label="Pincode*"
                    required
                    :rules="pinRule"
                    maxlength="6"
                    counter="6"
                  ></v-text-field>
                </v-col>
                <v-col class="d-flex" cols="12" sm="4">
                  <v-autocomplete
                    return-object
                    :readonly="isReadOnly"
                    v-model="cityTier"
                    :items="cityTierList"
                    item-text="value"
                    label="City Tier"
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <v-btn color="primary" @click="goBack" class="mr-2"> Cancel </v-btn>

          <v-btn color="primary" @click="e1 = 4"> Continue </v-btn>

          <v-btn text @click="e1 = 2"> Back </v-btn>
        </v-stepper-content>
        <!-- Media & Placement Tab -->
        <v-stepper-content step="4">
          <v-card flat class="mb-12">
            <v-card-text>
              <v-row align="center">
                <v-col class="d-flex" cols="12" sm="4">
                  <v-autocomplete
                    return-object
                    :readonly="isReadOnly"
                    v-model="mediaClass"
                    :items="mediaClassList"
                    item-text="value"
                    label="Media Class"
                  ></v-autocomplete>
                </v-col>
                <v-col class="d-flex" cols="12" sm="4">
                  <v-autocomplete
                    return-object
                    :readonly="isReadOnly"
                    v-model="structureType"
                    :items="structureTypeList"
                    item-text="value"
                    label="Structure Type"
                  ></v-autocomplete>
                </v-col>
                <v-col class="d-flex" cols="12" sm="4">
                  <v-autocomplete
                    return-object
                    :readonly="isReadOnly"
                    v-model="mediaType"
                    :items="mediaTypeList"
                    item-text="value"
                    label="Media Type*"
                  ></v-autocomplete>
                </v-col>
                <v-col class="d-flex" cols="12" sm="4">
                  <v-autocomplete
                    return-object
                    :readonly="isReadOnly"
                    v-model="placeType"
                    :items="placeTypeList"
                    item-text="value"
                    label="Place Type"
                  ></v-autocomplete>
                </v-col>
                <v-col class="d-flex" cols="12" sm="4">
                  <v-autocomplete
                    return-object
                    :readonly="isReadOnly"
                    v-model="material"
                    :items="materialList"
                    item-text="value"
                    label="Material*"
                  ></v-autocomplete>
                </v-col>
                <v-col class="d-flex" cols="12" sm="4">
                  <v-autocomplete
                    return-object
                    :readonly="isReadOnly"
                    v-model="placementType"
                    :items="placementTypeList"
                    item-text="value"
                    label="Placement Type"
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <v-btn color="primary" @click="goBack" class="mr-2"> Cancel </v-btn>

          <v-btn color="primary" @click="e1 = 5"> Continue </v-btn>

          <v-btn text @click="e1 = 3"> Back </v-btn>
        </v-stepper-content>
        <!-- Demography Tab -->
        <v-stepper-content step="5">
          <v-card flat class="mb-12">
            <v-card-text>
              <v-row align="center">
                <v-col class="d-flex" cols="12" sm="4">
                  <v-autocomplete
                    return-object
                    :readonly="isReadOnly"
                    v-model="catchmentStrata"
                    :items="catchmentStrataList"
                    item-text="value"
                    label="Catchment Strata"
                  ></v-autocomplete>
                </v-col>
                <v-col class="d-flex" cols="12" sm="4">
                  <v-autocomplete
                    return-object
                    :readonly="isReadOnly"
                    v-model="locationType"
                    :items="locationTypeList"
                    item-text="value"
                    label="Location Type"
                  ></v-autocomplete>
                </v-col>
                <v-col class="d-flex" cols="12" sm="4">
                  <v-autocomplete
                    return-object
                    :readonly="isReadOnly"
                    v-model="trafficType"
                    :items="trafficTypeList"
                    item-text="value"
                    label="Traffic Type"
                  ></v-autocomplete>
                </v-col>
                <v-col class="d-flex" cols="12" sm="4">
                  <v-autocomplete
                    return-object
                    :readonly="isReadOnly"
                    v-model="trafficDensity"
                    :items="trafficDensityList"
                    item-text="value"
                    item-value="id"
                    label="Traffic Density"
                  ></v-autocomplete>
                </v-col>
                <v-col class="d-flex" cols="12" sm="4">
                  <v-autocomplete
                    :readonly="isReadOnly"
                    v-model="trafficSignal"
                    :items="trafficSignalList"
                    item-text="value"
                    label="Traffic Signal"
                  ></v-autocomplete>
                </v-col>
                <v-col class="d-flex" cols="12" sm="4">
                  <v-autocomplete
                    return-object
                    :readonly="isReadOnly"
                    v-model="ageGroup"
                    :items="ageGroupList"
                    item-text="value"
                    label="Age Group"
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <v-btn color="primary" @click="goBack" class="mr-2"> Cancel </v-btn>

          <v-btn color="primary" @click="e1 = 6"> Continue </v-btn>

          <v-btn text @click="e1 = 4"> Back </v-btn>
        </v-stepper-content>
        <!-- Rating Tab -->
        <v-stepper-content step="6">
          <v-card flat class="mb-12">
            <v-card-text>
              <v-row align="center">
                <v-col class="d-flex" cols="12" sm="6">
                  <v-autocomplete
                    return-object
                    :readonly="isReadOnly"
                    v-model="viewingDistance"
                    :items="viewingDistanceList"
                    item-text="value"
                    item-value="id"
                    label="Viewing Distance (in ft)"
                    required
                  ></v-autocomplete>
                </v-col>
                <v-col class="d-flex" cols="12" sm="6">
                  <v-text-field
                    ref="viewingTime"
                    :readonly="isReadOnly"
                    v-model="viewingTime"
                    label="Viewing Time"
                    required
                    :rules="textRule"
                    maxlength="100"
                    counter="100"
                  ></v-text-field>
                </v-col>
                <v-col class="d-flex" cols="12" sm="6">
                  <v-autocomplete
                    return-object
                    :readonly="isReadOnly"
                    v-model="quality"
                    :items="qualityList"
                    item-text="value"
                    item-value="id"
                    label="Class"
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <v-btn color="primary" @click="goBack" class="mr-2"> Cancel </v-btn>

          <v-btn color="primary" @click="e1 = 7"> Continue </v-btn>

          <v-btn text @click="e1 = 5"> Back </v-btn>
        </v-stepper-content>
        <!-- Managed By Tab -->
        <v-stepper-content step="7">
          <v-card flat class="mb-12">
            <v-card-text>
              <v-row align="center">
                <v-col class="d-flex" cols="12" sm="6">
                  <v-autocomplete
                    return-object
                    :readonly="isReadOnly"
                    v-model="managedByOrgId"
                    :items="organizationsList"
                    item-text="name"
                    label="Managed By*"
                  ></v-autocomplete>
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
                        v-model="computedStartDateFormatted"
                        label="From Date"
                        prepend-icon="mdi-calendar"
                        :readonly="isReadOnly"
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="managedByStartDate"
                      :readonly="isReadOnly"
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
                        v-model="computedEndDateFormatted"
                        label="To Date"
                        prepend-icon="mdi-calendar"
                        :readonly="isReadOnly"
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="managedByEndDate"
                      :readonly="isReadOnly"
                      @input="menu2 = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-btn color="primary" @click="goBack" class="mr-2"> Cancel </v-btn>

          <v-btn text @click="e1 = 6"> Back </v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>

    <v-btn icon dark @click="$emit('close')">
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      textRule: [(v) => v.length < 100 || "Text not more than 100 Characters"],
      pinRule: [
        (v) => v.length > 5 || "too short",
        (v) => v.length < 7 || "invalid",
      ],

      e1: 1,
      steps: [
        { count: 1, name: "Information" },
        { count: 2, name: "Attributes" },
        { count: 3, name: "Location" },
        { count: 4, name: "Media & Placement" },
        { count: 5, name: "Demography" },
        { count: 6, name: "Rating" },
        { count: 7, name: "Managed By" },
      ],
      activeEdit: true,
      direction: "top",
      editSensors: false,
      fling: false,
      hover: false,
      tabs: null,
      top: false,
      right: true,
      bottom: true,
      left: false,
      transition: "slide-y-reverse-transition",
      offsetValue: "",
      scallingValue: "",
      isReadOnly: false,
      editButton: true,
      saveButton: false,
      closeButton: false,
      assetCode: "",
      vendorAssetCode: "",
      ownedByOrgId: {},
      status: {},
      length: "",
      width: "",
      height: "",
      orientation: "",
      captureFrequency: "",
      illumination: "",
      latitude: "",
      longitude: "",
      road: "",
      locality: "",
      city: "",
      district: "",
      state: "",
      pincode: "",
      cityTier: {},
      mediaClass: "",
      structureType: "",
      mediaType: "",
      placeType: "",
      material: "",
      placementType: "",
      catchmentStrata: "",
      locationType: "",
      trafficType: "",
      trafficDensity: "",
      trafficSignal: "",
      trafficSignalList: [
        {
          text: "true",
          value: true,
        },
        {
          text: "false",
          value: false,
        },
      ],
      ageGroup: "",
      viewingDistance: "",
      viewingTime: "",
      quality: "",
      managedByOrgId: {},
      managedByStartDate: "",
      managedByEndDate: "",
      fromDatePicker: false,
      toDatePicker: false,

      orientationList: [
        { id: 1, type: "orientation", value: "North" },
        { id: 2, type: "orientation", value: "South" },
        { id: 3, type: "orientation", value: "East" },
        { id: 4, type: "orientation", value: "West" },
        { id: 5, type: "orientation", value: "North East" },
        { id: 6, type: "orientation", value: "North West" },
        { id: 7, type: "orientation", value: "South West" },
        { id: 8, type: "orientation", value: "South East" },
      ],
      catchmentStrataList: [
        { id: 11, type: "catchmentStrata", value: "High Income Group" },
        { id: 12, type: "catchmentStrata", value: "Low Income Group" },
        { id: 13, type: "catchmentStrata", value: "Medium Income Group" },
      ],
      trafficDensityList: [
        { id: 21, type: "trafficDensity", value: "High" },
        { id: 22, type: "trafficDensity", value: "Medium" },
        { id: 23, type: "trafficDensity", value: "Low" },
      ],
      trafficTypeList: [
        { id: 31, type: "trafficType", value: "Pedestrian" },
        { id: 32, type: "trafficType", value: "Private Vehicles" },
        { id: 33, type: "trafficType", value: "Public Transport" },
      ],
      locationTypeList: [
        { id: 41, type: "locationType", value: "Residential" },
        { id: 42, type: "locationType", value: "Commercial" },
        { id: 43, type: "locationType", value: "Mixed" },
      ],
      qualityList: [
        { id: 51, type: "quality", value: "1" },
        { id: 52, type: "quality", value: "2" },
        { id: 53, type: "quality", value: "3" },
        { id: 54, type: "quality", value: "4" },
        { id: 55, type: "quality", value: "5" },
      ],
      illuminationList: [
        { id: 61, type: "illumination", value: "Frontlit" },
        { id: 62, type: "illumination", value: "Backlit" },
        { id: 63, type: "illumination", value: "Unlit" },
      ],
      cityTierList: [
        { id: 71, type: "cityTier", value: "Metro" },
        { id: 72, type: "cityTier", value: "T1" },
        { id: 73, type: "cityTier", value: "T2" },
        { id: 74, type: "cityTier", value: "T3" },
        { id: 75, type: "cityTier", value: "T4" },
      ],
      mediaClassList: [
        { id: 81, type: "mediaClass", value: "Roadside" },
        { id: 82, type: "mediaClass", value: "Place Based" },
        { id: 83, type: "mediaClass", value: "Fleet Exterior" },
      ],
      captureFrequencyList: [
        { id: 91, type: "captureFrequency", value: "Once a day" },
        { id: 92, type: "captureFrequency", value: "Twice a day" },
        { id: 93, type: "captureFrequency", value: "Once in a week" },
        { id: 94, type: "captureFrequency", value: "Once in two weeks" },
        { id: 95, type: "captureFrequency", value: "Once in a month" },
      ],
      materialList: [
        { id: 111, type: "material", value: "Digital" },
        { id: 112, type: "material", value: "Printed" },
        { id: 113, type: "material", value: "Mesh" },
        { id: 114, type: "material", value: "Paint" },
      ],
      mediaTypeList: [
        { id: 151, type: "mediaType", value: "Hoarding" },
        { id: 152, type: "mediaType", value: "Unipole" },
        { id: 153, type: "mediaType", value: "Pillar Wrap" },
        { id: 154, type: "mediaType", value: "Pole Wrap" },
        { id: 155, type: "mediaType", value: "Metro Pillar" },
        { id: 156, type: "mediaType", value: "LED Board" },
        { id: 157, type: "mediaType", value: "Trivison" },
        { id: 158, type: "mediaType", value: "Mobile Charging Unit" },
        { id: 159, type: "mediaType", value: "Center Median" },
        { id: 160, type: "mediaType", value: "Balloon and Floatable" },
        { id: 161, type: "mediaType", value: "Wall Painting" },
        { id: 162, type: "mediaType", value: "Bus Shelter" },
        { id: 163, type: "mediaType", value: "Bus Back Panel" },
      ],
      placementTypeList: [
        { id: 201, type: "placementType", value: "Entrance" },
        { id: 202, type: "placementType", value: "Bathroom" },
        { id: 203, type: "placementType", value: "Baggage" },
        { id: 204, type: "placementType", value: "Concourse" },
        { id: 205, type: "placementType", value: "Dining" },
        { id: 206, type: "placementType", value: "Curbside" },
      ],
      structureTypeList: [
        { id: 251, type: "structureType", value: "Free Standing" },
        { id: 252, type: "structureType", value: "Furniture" },
        { id: 253, type: "structureType", value: "Interior Wall" },
        { id: 254, type: "structureType", value: "Tablet" },
        { id: 255, type: "structureType", value: "Column" },
        { id: 256, type: "structureType", value: "Ceiling" },
        { id: 257, type: "structureType", value: "Exterior Wall" },
        { id: 258, type: "structureType", value: "Exterior Vehicle" },
        { id: 259, type: "structureType", value: "Floor" },
        { id: 260, type: "structureType", value: "Stairs" },
        { id: 261, type: "structureType", value: "Elevator" },
        { id: 262, type: "structureType", value: "Interior Vehicle" },
        { id: 263, type: "structureType", value: "Rooftop" },
      ],
      placeTypeList: [
        { id: 301, type: "placeType", value: "Airport" },
        { id: 302, type: "placeType", value: "Metro Station" },
        { id: 303, type: "placeType", value: "Suburban Station" },
        { id: 304, type: "placeType", value: "Mofussil Train Station" },
        { id: 305, type: "placeType", value: "Bus Depot" },
        { id: 306, type: "placeType", value: "Mofussil Bus Depot" },
        { id: 307, type: "placeType", value: "Petrol Station" },
        { id: 308, type: "placeType", value: "Commerical Building" },
        { id: 309, type: "placeType", value: "Residential Building" },
        { id: 310, type: "placeType", value: "Skywalks" },
        { id: 311, type: "placeType", value: "ROB and Underpasses" },
        { id: 312, type: "placeType", value: "Road and Rail Arches" },
        { id: 313, type: "placeType", value: "Middle of the Road" },
        { id: 314, type: "placeType", value: "Side of the Road" },
        { id: 315, type: "placeType", value: "Malls" },
        { id: 316, type: "placeType", value: "Theater" },
        { id: 317, type: "placeType", value: "Road Facing" },
        { id: 318, type: "placeType", value: "Inside the mall" },
        { id: 319, type: "placeType", value: "Inside the Theaters" },
      ],
      statusList: [
        { id: 401, type: "status", value: "Active" },
        { id: 402, type: "status", value: "Inactive" },
        { id: 403, type: "status", value: "Under  Maintainance" },
      ],
      ageGroupList: [
        { id: 421, type: "ageGroup", value: "< 18" },
        { id: 422, type: "ageGroup", value: "18-34" },
        { id: 423, type: "ageGroup", value: "35-50" },
        { id: 424, type: "ageGroup", value: "51-69" },
        { id: 425, type: "ageGroup", value: "> 70" },
      ],
      viewingDistanceList: [
        { id: 431, type: "viewingDistance", value: "< 50m" },
        { id: 432, type: "viewingDistance", value: "upto 100m" },
        { id: 433, type: "viewingDistance", value: "upto 200m" },
        { id: 434, type: "viewingDistance", value: "upto 300m" },
        { id: 435, type: "viewingDistance", value: "upto 400m" },
        { id: 436, type: "viewingDistance", value: "upto 500m" },
      ],
    };
  },
  created() {
    this.$store.dispatch("media/fetchMediaListData", this.$route.params.id);
    this.$store.dispatch("media/fetchOrganizations");
  },
  computed: {
    ...mapState({
      mediaListData: (state) => state.media.mediaDataList,
      organizationsList: (state) => state.media.organizationsList,
    }),
    computedStartDateFormatted() {
      return this.formatDate(this.managedByStartDate);
    },
    computedEndDateFormatted() {
      return this.formatDate(this.managedByEndDate);
    },
  },
  watch: {
    steps(val) {
      if (this.e1 > val.count) {
        this.e1 = val.count;
      }
    },
    managedByStartDate(val) {
      this.managedByStartDate = new Date(val).toISOString().substring(0, 10);
    },
    managedByEndDate(val) {
      this.managedByEndDate = new Date(val).toISOString().substring(0, 10);
    },
    mediaListData(val) {
      //information'
      this.assetCode = val.assetCode;
      this.vendorAssetCode = val.vendorAssetCode;
      this.ownedByOrgId = val.ownedByOrgId;
      this.status = val.status;

      //Attributes
      this.length = val.length;
      this.width = val.width;
      this.height = val.height;
      this.orientation = val.orientation;
      this.captureFrequency = val.captureFrequency;
      this.illumination = val.illumination;

      //Location
      this.latitude = val.latitude;
      this.longitude = val.longitude;
      this.road = val.road;
      this.locality = val.locality;
      this.city = val.city;
      this.district = val.district;
      this.state = val.state;
      this.pincode = val.pincode;
      this.cityTier = val.cityTier;

      //Media & Placement
      this.mediaClass = val.mediaClass;
      this.structureType = val.structureType;
      this.mediaType = val.mediaType;
      this.placeType = val.placeType;
      this.material = val.material;
      this.placementType = val.placementType;

      //Demography

      this.catchmentStrata = val.catchmentStrata;
      this.locationType = val.locationType;
      this.trafficType = val.trafficType;
      this.trafficDensity = val.trafficDensity;
      this.trafficSignal = val.trafficSignal;
      this.ageGroup = val.ageGroup;

      //Rating
      this.viewingDistance = val.viewingDistance;
      this.viewingTime = val.viewingTime;
      this.quality = val.quality;

      //Managed By
      this.managedByOrgId = val.managedByOrgId;
      this.managedByStartDate = val.managedByStartDate || "";
      this.managedByEndDate = val.managedByEndDate || "";
    },
  },
  methods: {
    goBack() {
      this.$router.push("/media");
    },
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${year}/${month}/${day}`;
    },
    nextStep(n) {
      if (n === this.steps) {
        this.e1 = 1;
      } else {
        this.e1 = n + 1;
      }
    },
    editValues() {
      this.isReadOnly = false;
      this.activeEdit = false;
      this.editButton = false;
      this.saveButton = true;
      this.closeButton = true;
    },
    saveValues() {
      this.activeEdit = false;
      this.isReadOnly = true;
      this.editButton = true;
      this.saveButton = false;
      this.closeButton = false;
    },
    closeValues() {
      this.activeEdit = true;
      this.isReadOnly = true;
      this.editButton = true;
      this.saveButton = false;
      this.closeButton = false;
    },
    submit() {
      this.loading = true;
      const payload = {};
      if (this.assetCode) {
        payload.id = this.$route.params.id;
        payload.assetCode = this.assetCode;
        payload.vendorAssetCode = this.vendorAssetCode;
        payload.ownedByOrgId = this.ownedByOrgId;
        payload.status = this.status;

        //Attributes
        payload.length = this.length;
        payload.width = this.width;
        payload.height = this.height;
        payload.orientation = this.orientation;
        payload.captureFrequency = this.captureFrequency;
        payload.illumination = this.illumination;

        //Location
        payload.latitude = this.latitude;
        payload.longitude = this.longitude;
        payload.road = this.road;
        payload.locality = this.locality;
        payload.city = this.city;
        payload.district = this.district;
        payload.state = this.state;
        payload.pincode = this.pincode;
        payload.cityTier = this.cityTier;

        //Media & Placement
        payload.mediaClass = this.mediaClass;
        payload.structureType = this.structureType;
        payload.mediaType = this.mediaType;
        payload.placeType = this.placeType;
        payload.material = this.material;
        payload.placementType = this.placementType;

        //Demography
        payload.catchmentStrata = this.catchmentStrata;
        payload.locationType = this.locationType;
        payload.trafficType = this.trafficType;
        payload.trafficDensity = this.trafficDensity;
        payload.trafficSignal = this.trafficSignal;
        payload.ageGroup = this.ageGroup;

        //Rating
        payload.viewingDistance = this.viewingDistance;
        payload.viewingTime = this.viewingTime;
        payload.quality = this.quality;

        //Managed By
        payload.managedByOrgId = this.managedByOrgId;
        payload.managedByStartDate = this.managedByStartDate;
        payload.managedByEndDate = this.managedByEndDate;
        this.$store
          .dispatch("media/updateMediaData", payload)
          .then(() => {
            this.loading = false;
            this.activeEdit = true;
            this.isReadOnly = true;
            this.editButton = true;
            this.saveButton = false;
            this.closeButton = false;
            this.$showSuccessToast(this, "Media page Updated Successfully");
            this.$router.back();
          })
          .catch((err) => {
            console.error("errors", err);
          });
      } else {
        this.$showErrorToast(this, "Please select the required field");
        this.loading = false;
      }
    },
  },
};
</script>
<style>
.v-speed-dial {
  position: absolute;
}

.v-btn--floating {
  position: relative;
}
</style>
