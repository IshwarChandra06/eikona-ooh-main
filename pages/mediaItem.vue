<template>
  <v-card color="primary">
    <v-tabs   show-arrows
      v-model="tab"
      background-color="transparent"
      color="white"
      grow>
      <v-tab v-for="item in items" :key="item">
        {{ item }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <!-- Information Tab -->
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <div class="d-flex justify-end">
              <v-btn class="mx-2" fab dark small color="primary">
                <v-icon dark>
                  mdi-pencil
                </v-icon>
              </v-btn>
              <v-btn class="mx-2" fab dark small color="primary">
                <v-icon dark>
                  mdi-floppy
                </v-icon>
              </v-btn>
              <v-btn class="mx-2" fab dark small color="primary">
                <v-icon dark>
                  mdi-close
                </v-icon>
              </v-btn>
            </div>
            <v-row align="center">
              <v-col class="d-flex" cols="12" sm="6">
                <v-text-field
                  ref="assetCode"
                  readonly
                  v-model="assetCode"
                  label="Asset Code"
                  required
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="12" sm="6">
                <v-text-field
                  ref="vendorAssetCode"
                  readonly
                  v-model="vendorAssetCode"
                  label="Vendor Asset Code"
                  required
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="12" sm="6">
                <v-select
                  readonly
                  v-model="ownedByOrgID"
                  :items="ownedByOrgIDList"
                  label="Owned By Org ID"
                ></v-select>
              </v-col>
              <v-col class="d-flex" cols="12" sm="6">
                <v-select
                  readonly
                  v-model="status"
                  :items="statusList"
                  label="Status"
                ></v-select>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <!-- Attributes Tab -->
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <div class="d-flex justify-end">
              <v-btn class="mx-2" fab dark small color="primary">
                <v-icon dark>
                  mdi-pencil
                </v-icon>
              </v-btn>
              <v-btn class="mx-2" fab dark small color="primary">
                <v-icon dark>
                  mdi-floppy
                </v-icon>
              </v-btn>
              <v-btn class="mx-2" fab dark small color="primary">
                <v-icon dark>
                  mdi-close
                </v-icon>
              </v-btn>
            </div>
            <v-row align="center">
              <v-col class="d-flex" cols="12" sm="4">
                <v-text-field
                  ref="length"
                  readonly
                  v-model="length"
                  label="Length"
                  required
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="12" sm="4">
                <v-text-field
                  ref="width"
                  readonly
                  v-model="width"
                  label="Width"
                  required
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="12" sm="4">
                <v-text-field
                  ref="height"
                  readonly
                  v-model="height"
                  label="Height"
                  required
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="12" sm="4">
                <v-select
                  readonly
                  v-model="orientation"
                  :items="orientationList"
                  label="Orientation"
                ></v-select>
              </v-col>
              <v-col class="d-flex" cols="12" sm="4">
                <v-select
                  readonly
                  v-model="captureFrequency"
                  :items="captureFrequencyList"
                  label="Capture Frequency"
                ></v-select>
              </v-col>
              <v-col class="d-flex" cols="12" sm="4">
                <v-select
                  readonly
                  v-model="illumination"
                  :items="illuminationList"
                  label="Illumination"
                ></v-select>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <!-- Location Tab -->
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <div class="d-flex justify-end">
              <v-btn class="mx-2" fab dark small color="primary">
                <v-icon dark>
                  mdi-pencil
                </v-icon>
              </v-btn>
              <v-btn class="mx-2" fab dark small color="primary">
                <v-icon dark>
                  mdi-floppy
                </v-icon>
              </v-btn>
              <v-btn class="mx-2" fab dark small color="primary">
                <v-icon dark>
                  mdi-close
                </v-icon>
              </v-btn>
            </div>
            <v-row align="center">
              <v-col class="d-flex" cols="12" sm="4">
                <v-text-field
                  ref="latitude"
                  readonly
                  v-model="latitude"
                  label="Latitude"
                  required
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="12" sm="4">
                <v-text-field
                  ref="longitude"
                  readonly
                  v-model="longitude"
                  label="Longitude"
                  required
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="12" sm="4">
                <v-text-field
                  ref="road"
                  readonly
                  v-model="road"
                  label="Road"
                  required
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="12" sm="4">
                <v-text-field
                  ref="locality"
                  readonly
                  v-model="locality"
                  label="Locality"
                  required
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="12" sm="4">
                <v-text-field
                  ref="city"
                  readonly
                  v-model="city"
                  label="City"
                  required
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="12" sm="4">
                <v-text-field
                  ref="district"
                  readonly
                  v-model="district"
                  label="District"
                  required
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="12" sm="4">
                <v-text-field
                  ref="state"
                  readonly
                  v-model="state"
                  label="State"
                  required
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="12" sm="4">
                <v-text-field
                  ref="pincode"
                  readonly
                  v-model="pincode"
                  label="Pincode"
                  required
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="12" sm="4">
                <v-select
                  readonly
                  v-model="locationType"
                  :items="locationTypeList"
                  label="locationType"
                ></v-select>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <!-- Media & Placement Tab -->
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <div class="d-flex justify-end">
              <v-btn class="mx-2" fab dark small color="primary">
                <v-icon dark>
                  mdi-pencil
                </v-icon>
              </v-btn>
              <v-btn class="mx-2" fab dark small color="primary">
                <v-icon dark>
                  mdi-floppy
                </v-icon>
              </v-btn>
              <v-btn class="mx-2" fab dark small color="primary">
                <v-icon dark>
                  mdi-close
                </v-icon>
              </v-btn>
            </div>
            <v-row align="center">
              <v-col class="d-flex" cols="12" sm="4">
                <v-select
                  readonly
                  v-model="mediaClass"
                  :items="mediaClassList"
                  label="Media Class"
                ></v-select>
              </v-col>
              <v-col class="d-flex" cols="12" sm="4">
                <v-select
                  readonly
                  v-model="structureType"
                  :items="structureTypeList"
                  label="Structure Type"
                ></v-select>
              </v-col>
              <v-col class="d-flex" cols="12" sm="4">
                <v-select
                  readonly
                  v-model="mediaType"
                  :items="mediaTypeList"
                  label="Media Type"
                ></v-select>
              </v-col>
              <v-col class="d-flex" cols="12" sm="4">
                <v-select
                  readonly
                  v-model="placeType"
                  :items="placeTypeList"
                  label="Place Type"
                ></v-select>
              </v-col>
              <v-col class="d-flex" cols="12" sm="4">
                <v-select
                  readonly
                  v-model="material"
                  :items="materialList"
                  label="Material"
                ></v-select>
              </v-col>
              <v-col class="d-flex" cols="12" sm="4">
                <v-select
                  readonly
                  v-model="placementType"
                  :items="placementTypeList"
                  label="Placement Type"
                ></v-select>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <!-- Demography Tab -->
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <div class="d-flex justify-end">
              <v-btn class="mx-2" fab dark small color="primary">
                <v-icon dark>
                  mdi-pencil
                </v-icon>
              </v-btn>
              <v-btn class="mx-2" fab dark small color="primary">
                <v-icon dark>
                  mdi-floppy
                </v-icon>
              </v-btn>
              <v-btn class="mx-2" fab dark small color="primary">
                <v-icon dark>
                  mdi-close
                </v-icon>
              </v-btn>
            </div>
            <v-row align="center">
              <v-col class="d-flex" cols="12" sm="4">
                <v-select
                  readonly
                  v-model="catcnmentStrata"
                  :items="catcnmentStrataList"
                  label="Catcnment Strata"
                ></v-select>
              </v-col>
              <v-col class="d-flex" cols="12" sm="4">
                <v-select
                  readonly
                  v-model="demographyLocationType"
                  :items="demographyLocationTypeList"
                  label="Location Type"
                ></v-select>
              </v-col>
              <v-col class="d-flex" cols="12" sm="4">
                <v-select
                  readonly
                  v-model="trafficType"
                  :items="trafficTypeList"
                  label="Traffic Type"
                ></v-select>
              </v-col>
              <v-col class="d-flex" cols="12" sm="4">
                <v-select
                  readonly
                  v-model="trafficDensity"
                  :items="trafficDensityList"
                  label="Traffic Density"
                ></v-select>
              </v-col>
              <v-col class="d-flex" cols="12" sm="4">
                <v-select
                  readonly
                  v-model="trafficSignal"
                  :items="trafficSignalList"
                  label="Traffic Signal"
                ></v-select>
              </v-col>
              <v-col class="d-flex" cols="12" sm="4">
                <v-select
                  readonly
                  v-model="ageGroup"
                  :items="ageGroupList"
                  label="Age Group"
                ></v-select>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <!-- Rating Tab -->
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <div class="d-flex justify-end">
              <v-btn class="mx-2" fab dark small color="primary">
                <v-icon dark>
                  mdi-pencil
                </v-icon>
              </v-btn>
              <v-btn class="mx-2" fab dark small color="primary">
                <v-icon dark>
                  mdi-floppy
                </v-icon>
              </v-btn>
              <v-btn class="mx-2" fab dark small color="primary">
                <v-icon dark>
                  mdi-close
                </v-icon>
              </v-btn>
            </div>
            <v-row align="center">
              <v-col class="d-flex" cols="12" sm="6">
                <v-select
                  readonly
                  v-model="viewingDistance"
                  :items="viewingDistanceList"
                  label="Viewing Distance"
                  required
                ></v-select>
              </v-col>
              <v-col class="d-flex" cols="12" sm="6">
                <v-text-field
                  ref="viewingTime"
                  readonly
                  v-model="viewingTime"
                  label="Viewing Time"
                  required
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="12" sm="6">
                <v-select
                  readonly
                  v-model="quality"
                  :items="qualityList"
                  label="Quality"
                ></v-select>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <!-- Managed By Tab -->
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <div class="d-flex justify-end">
              <v-btn class="mx-2" fab dark small color="primary">
                <v-icon dark>
                  mdi-pencil
                </v-icon>
              </v-btn>
              <v-btn class="mx-2" fab dark small color="primary">
                <v-icon dark>
                  mdi-floppy
                </v-icon>
              </v-btn>
              <v-btn class="mx-2" fab dark small color="primary">
                <v-icon dark>
                  mdi-close
                </v-icon>
              </v-btn>
            </div>
            <v-row align="center">
              <v-col class="d-flex" cols="12" sm="6">
                <v-select
                  readonly
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
                      readonly
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
                      readonly
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
    </v-tabs-items>
  </v-card>
</template>
<script>
export default {
  data() {
    return {
      tab: null,
      items: [
        "Information",
        "Attributes",
        "Location",
        "Media & Placement",
        "Demography",
        "Rating",
        "Managed by"
      ],
      assetCode: "",
      vendorAssetCode: "",
      ownedByOrgID: "101",
      status: "Active",
      ownedByOrgIDList: ["101", "102"],
      statusList: ["Active", "Disable"],
      length: "",
      width: "",
      height: "",
      orientation: "Value1",
      orientationList: ["Value 1", "Value 2"],
      captureFrequency: "Value 1",
      captureFrequencyList: ["Value 1", "Value 2"],
      illumination: "Value 1",
      illuminationList: ["Value 1", "Value 2"],
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
      viewingDistance: "",
      viewingDistanceList: [],
      viewingTime: "",
      quality: "Quality 1",
      qualityList: ["Quality 1", "Quality 2"],
      managedByOrgId: "Org 1",
      managedByOrgIdList: ["Org 1", "Org 2"],
      fromDate: "",
      toDate: "",
      fromDatePicker: false,
      toDatePicker: false
    };
  }
};
</script>
