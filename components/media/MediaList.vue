<template>
  <div>
    <v-row justify="start" align="center" v-if="mediaData">
      <v-col
        v-for="item in mediaData"
        :key="item.id"
        col="12"
        xs="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-hover v-slot="{ hover }" open-delay="200">
          <v-card
            height="200px"
            color="item.color"
            :elevation="hover ? 16 : 2"
            :class="{ 'on-hover': hover }"
            class="card-sensor mt-2"
          >
            <div class="d-flex flex-no-wrap justify-space-between">
              <div>
                <v-card-title class="text-h5 text-ellipsis font-weight-bold">
                  {{ item.locality ? item.locality + ", " : "-" }}
                  {{ item.city ? item.city : "" }}
                </v-card-title>

                <v-card-subtitle class="py-1 pb-0 font-weight-bold">
                  {{ item.assetCode ? item.assetCode : "-" }}
                </v-card-subtitle>
                <v-card-subtitle class="py-1">
                  {{ item.mediaType ? item.mediaType.value : "-" }}
                </v-card-subtitle>
                <v-card-subtitle class="py-1">
                  {{ item.material ? item.material.value : "-" }}
                </v-card-subtitle>
                <v-card-subtitle class="py-1">
                  {{ "H: " + (item.height ? item.height : "-") }},
                  {{ "W: " + (item.width ? item.width : "-") }}
                </v-card-subtitle>
                <v-card-subtitle class="py-1">
                  {{ item.ownedByOrgId ? item.ownedByOrgId.name : "-" }}
                </v-card-subtitle>
               
              </div>
            </div>
            <v-icon class="ico-sensor" color="#c72027">mdi-blur</v-icon>
            <div class="ico-actions">
              <v-icon @click="navigate(item)" color="#c72027">mdi-eye</v-icon>
              <v-icon
                v-if="
                  userPrivileges[$route.name] &&
                  userPrivileges[$route.name].includes('update')
                "
                @click="update(item)"
                color="#c72027"
                >mdi-pencil</v-icon
              >
              <v-icon
                v-if="
                  userPrivileges[$route.name] &&
                  userPrivileges[$route.name].includes('delete')
                "
                @click="deleteMediaModal(item)"
                color="#c72027"
                >mdi-delete</v-icon
              >
            </div>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="headline justify-center"
          >Are you sure you want to delete?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary darken-1" @click="dialogDelete = false"
            >Cancel</v-btn
          >
          <v-btn color="primary darken-1" @click="deleteMedia">OK</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  props: ["mediaData"],
  data() {
    return {
      dialogDelete: false,
      mediaDataID: null,
    };
  },
  computed: {
    ...mapState({
      
      userPrivileges: (state) => state.userPrivileges,
    }),
  },
  methods: {
    update(data) {
      this.$router.push({ name: "media-view-id", params: { id: data.id } });
    },
    navigate(data) {
      this.$router.push({
        name: "media-view-block-id",
        params: { id: data.id },
      });
    },
    deleteMediaModal(data) {
      this.dialogDelete = true;
      this.mediaDataID = data.id;
    },
    deleteMedia() {
      if (this.mediaDataID != null) {
        this.$store
          .dispatch("media/deleteMediaData", this.mediaDataID)
          .then(() => {
            this.$showSuccessToast(this, "Deleted Successfully");
          })
          .catch(() => {
            this.$showErrorToast(this, "Error !");
          });
        this.dialogDelete = false;
      }
    },
  },
 
};
</script>
<style scoped>
.text-ellipsis {
  white-space: nowrap;
  word-break: normal;
  overflow: hidden;
  text-overflow: ellipsis;
}
.card-sensor {
  overflow: hidden;
  cursor: pointer;
  position: relative;
}
.ico-sensor {
  position: absolute;
  font-size: 150px;
  top: 6px;
  right: -40px;
  transition: transform 0.5s ease;
}
.ico-actions {
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 8;
}
.ico-actions i {
}
.v-card:hover .ico-sensor {
  transform: scale(1.5);
}
.v-card:hover .v-btn {
  background-color: #000 !important;
}


</style>
